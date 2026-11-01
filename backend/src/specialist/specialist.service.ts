import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Specialist, SpecialistStatus } from './entities/specialist.entity';
import { WorkingHours } from './entities/workingHours.entity';
import { Service } from '../services/entities/service.entity';
import {
  Appointment,
  AppointmentStatus,
} from '../appointments/entities/appointment.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistProfileDto } from './dto/update-specialist-profile.dto';

const TTL_LIST = 10 * 60 * 1000;
const TTL_ONE = 15 * 60 * 1000;
const KEY_LIST = 'specialist:all';
const keyOne = (id: number) => `specialist:${id}`;
const keyByUser = (userId: number) => `specialist:user:${userId}`;

// ⬇️ helper: تبدیل day_of_week (0=یکشنبه) به ترتیب شنبه‌محور (0=شنبه)
const toSaturdayOrder = (day: number): number => (day + 1) % 7;

// ⬇️ helper: مرتب‌سازی working_hours (شنبه اول)
const sortWorkingHours = (specialist: Specialist): Specialist => {
  if (specialist.working_hours) {
    specialist.working_hours.sort(
      (a, b) => toSaturdayOrder(a.day_of_week) - toSaturdayOrder(b.day_of_week),
    );
  }
  return specialist;
};

@Injectable()
export class SpecialistService {
  constructor(
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(WorkingHours)
    private readonly workingHoursRepository: Repository<WorkingHours>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  // ═══════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════
  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private toISODate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // ═══════════════════════════════════════
  // FIND ALL (with sorted working_hours)
  // ═══════════════════════════════════════
  async findAll(): Promise<Specialist[]> {
    const cached = await this.cache.get<Specialist[]>(KEY_LIST);
    if (cached) return cached;

    const specialists = await this.specialistRepository.find({
      where: { is_active: true, status: SpecialistStatus.Approved },
      relations: {
        user: true,
        services: true,
        working_hours: true,
      },
      order: { created_at: 'DESC' },
    });

    specialists.forEach(sortWorkingHours);

    await this.cache.set(KEY_LIST, specialists, TTL_LIST);
    return specialists;
  }

  // ═══════════════════════════════════════
  // FIND BY ID
  // ═══════════════════════════════════════
  async findById(id: number): Promise<Specialist | null> {
    const key = keyOne(id);
    const cached = await this.cache.get<Specialist>(key);
    if (cached) return cached;

    const specialist = await this.specialistRepository.findOne({
      where: { id, is_active: true, status: SpecialistStatus.Approved },
      relations: {
        user: true,
        services: true,
        working_hours: true,
      },
    });

    if (!specialist) {
      throw new NotFoundException('متخصص مورد نظر پیدا نشد.');
    }

    sortWorkingHours(specialist);

    await this.cache.set(key, specialist, TTL_ONE);
    return specialist;
  }

  // ═══════════════════════════════════════
  // FIND BY USER ID
  // ═══════════════════════════════════════
  async findByUserId(userId: number): Promise<Specialist | null> {
    const key = keyByUser(userId);
    const cached = await this.cache.get<Specialist>(key);
    if (cached) return cached;

    const specialist = await this.specialistRepository.findOne({
      where: { user_id: userId },
      relations: {
        user: true,
        services: true,
        working_hours: true,
      },
    });

    if (!specialist) return null;

    sortWorkingHours(specialist);

    await this.cache.set(key, specialist, TTL_ONE);
    return specialist;
  }

  // ═══════════════════════════════════════
  // CREATE (ادمین)
  // ═══════════════════════════════════════
  async create(dto: CreateSpecialistDto): Promise<Specialist> {
    const user = await this.usersService.findById(dto.user_id);
    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }

    const existingSpecialist = await this.specialistRepository.findOne({
      where: { user_id: dto.user_id },
    });
    if (existingSpecialist) {
      throw new ConflictException('این کاربر از قبل متخصص است.');
    }

    const specialist = this.specialistRepository.create({
      user_id: dto.user_id,
      bio: dto.bio,
      status: SpecialistStatus.Approved,
    });

    const saved = await this.specialistRepository.save(specialist);
    await this.usersService.updateRole(dto.user_id, UserRole.Specialist);
    await this.cache.del(KEY_LIST);

    return saved;
  }

  // ═══════════════════════════════════════
  // UPDATE BY USER ID
  // ═══════════════════════════════════════
  async updateByUserId(
    userId: number,
    dto: UpdateSpecialistProfileDto,
  ): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({
      where: { user_id: userId },
    });
    if (!specialist) {
      throw new NotFoundException('پروفایل متخصص یافت نشد.');
    }

    if (dto.bio !== undefined) {
      specialist.bio = dto.bio;
    }

    const saved = await this.specialistRepository.save(specialist);

    await this.cache.del(`specialist:${specialist.id}`);
    await this.cache.del(keyByUser(userId));
    await this.cache.del(KEY_LIST);

    return saved;
  }

  // ═══════════════════════════════════════
  // UPDATE SERVICES
  // ═══════════════════════════════════════
  async updateServicesByUserId(
    userId: number,
    serviceIds: number[],
  ): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({
      where: { user_id: userId },
      relations: { services: true },
    });
    if (!specialist) {
      throw new NotFoundException('پروفایل متخصص یافت نشد.');
    }

    const services = await this.serviceRepository.find({
      where: { id: In(serviceIds), is_active: true },
    });

    specialist.services = services;
    const saved = await this.specialistRepository.save(specialist);

    await this.cache.del(`specialist:${specialist.id}`);
    await this.cache.del(keyByUser(userId));
    await this.cache.del(KEY_LIST);

    return saved;
  }

  // ═══════════════════════════════════════
  // UPDATE WORKING HOURS
  // ═══════════════════════════════════════
  async updateWorkingHoursByUserId(
    userId: number,
    workingHours: Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
    }>,
  ): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({
      where: { user_id: userId },
    });
    if (!specialist) {
      throw new NotFoundException('پروفایل متخصص یافت نشد.');
    }

    const todayISO = this.toISODate(new Date());

    const futureAppointments = await this.dataSource
      .getRepository(Appointment)
      .createQueryBuilder('a')
      .where('a.specialist_id = :sid', { sid: specialist.id })
      .andWhere('a.date >= :today', { today: todayISO })
      .andWhere('a.status IN (:...statuses)', {
        statuses: [AppointmentStatus.Pending, AppointmentStatus.Confirmed],
      })
      .getMany();

    const conflicts: string[] = [];

    for (const apt of futureAppointments) {
      const dayOfWeek = new Date(apt.date).getDay();
      const matchingHours = workingHours.filter(
        (wh) => wh.day_of_week === dayOfWeek,
      );

      if (matchingHours.length === 0) {
        conflicts.push(
          `${apt.date} ساعت ${apt.start_time.slice(0, 5)} (روز غیرکاری)`,
        );
        continue;
      }

      const aptStart = this.toMinutes(apt.start_time);
      const aptEnd = this.toMinutes(apt.end_time);

      const isWithin = matchingHours.some((wh) => {
        const whStart = this.toMinutes(wh.start_time);
        const whEnd = this.toMinutes(wh.end_time);
        return whStart <= aptStart && whEnd >= aptEnd;
      });

      if (!isWithin) {
        conflicts.push(`${apt.date} ساعت ${apt.start_time.slice(0, 5)}`);
      }
    }

    if (conflicts.length > 0) {
      throw new BadRequestException(
        `ساعت‌های جدید با ${conflicts.length} نوبت آینده تداخل دارند: ${conflicts.slice(0, 3).join('، ')}${conflicts.length > 3 ? ' و ...' : ''}. ابتدا نوبت‌های متداخل را لغو یا جابه‌جا کنید.`,
      );
    }

    await this.workingHoursRepository.delete({
      specialist_id: specialist.id,
    });

    const newHours = workingHours.map((wh) =>
      this.workingHoursRepository.create({
        specialist_id: specialist.id,
        day_of_week: wh.day_of_week,
        start_time: wh.start_time,
        end_time: wh.end_time,
      }),
    );

    await this.workingHoursRepository.save(newHours);

    await this.cache.del(`specialist:${specialist.id}`);
    await this.cache.del(keyByUser(userId));
    await this.cache.del(KEY_LIST);
    for (let day = 0; day <= 6; day++) {
      await this.cache.del(`working_hours:${specialist.id}:${day}`);
    }
    await this.cache.del(`working_hours:${specialist.id}:all`);

    const result = await this.findByUserId(userId);
    return result as Specialist;
  }
}