import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  Specialist,
  SpecialistStatus,
} from '../specialist/entities/specialist.entity';
import { Service } from '../services/entities/service.entity';
import {
  Appointment,
  AppointmentStatus,
} from '../appointments/entities/appointment.entity';

import { ListUsersDto } from './dto/list-users.dto';
import { PromoteSpecialistDto } from './dto/promote-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { AssignServicesDto } from './dto/assign-services.dto';


const KEY_SPECIALIST_LIST = 'specialist:all';
const keySpecialist = (id: number) => `specialist:${id}`;
const keySpecialistByUser = (userId: number) => `specialist:user:${userId}`;
const KEY_SERVICES_LIST = 'services:all';
const keyService = (id: number) => `services:${id}`;

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Specialist)
    private readonly specialistRepo: Repository<Specialist>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private async invalidateSpecialist(
    specialistId: number,
    userId: number,
  ): Promise<void> {
    await Promise.all([
      this.cache.del(KEY_SPECIALIST_LIST),
      this.cache.del(keySpecialist(specialistId)),
      this.cache.del(keySpecialistByUser(userId)),
      this.cache.del(`working_hours:${specialistId}:all`),
    ]);
    for (let day = 0; day <= 6; day++) {
      await this.cache.del(`working_hours:${specialistId}:${day}`);
    }
  }

  async listUsers(dto: ListUsersDto) {
    const result = await this.usersService.list({
      search: dto.search,
      role: dto.role,
      page: Number(dto.page) || 1,
      limit: Number(dto.limit) || 20,
    });

    const userIds = result.items.map((u) => u.id);
    const specialists = userIds.length
      ? await this.specialistRepo.find({
          where: { user_id: In(userIds) },
          relations: { services: true },
        })
      : [];

    const specialistMap = new Map(specialists.map((s) => [s.user_id, s]));

    return {
      ...result,
      items: result.items.map((u) => ({
        ...u,
        specialist: specialistMap.get(u.id) ?? null,
      })),
    };
  }

  async promoteToSpecialist(userId: number, dto: PromoteSpecialistDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد');
  
    const existing = await this.specialistRepo.findOne({
      where: { user_id: userId },
      relations: { services: true },
    });
  
    if (existing && existing.is_active) {
      throw new ConflictException('این کاربر از قبل متخصص است');
    }
  
    let services: Service[] = [];
    if (dto.service_ids?.length) {
      services = await this.serviceRepo.findBy({ id: In(dto.service_ids) });
      if (services.length !== dto.service_ids.length) {
        throw new BadRequestException('برخی از خدمات یافت نشدند');
      }
    }
  
    let specialistId: number;
  
    if (existing && !existing.is_active) {
      existing.bio = dto.bio ?? existing.bio;
      existing.status = SpecialistStatus.Approved;
      existing.is_active = true;
      if (dto.service_ids !== undefined) {
        existing.services = services;
      }
      const saved = await this.specialistRepo.save(existing);
      specialistId = saved.id;
    } else {
      const specialist = this.specialistRepo.create({
        user_id: user.id,
        bio: dto.bio ?? null,
        status: SpecialistStatus.Approved,
        is_active: true,
        services,
      });
      const saved = await this.specialistRepo.save(specialist);
      specialistId = saved.id;
    }
  
    await this.usersService.updateRole(user.id, UserRole.Specialist);
  
    // cache invalidation
    await this.invalidateSpecialist(specialistId, user.id);
  
    return this.specialistRepo.findOne({
      where: { id: specialistId },
      relations: { user: true, services: true },
    });
  }

  async demoteSpecialist(specialistId: number) {
    const specialist = await this.specialistRepo.findOne({
      where: { id: specialistId },
      relations: { user: true, services: true },
    });
    if (!specialist) throw new NotFoundException('متخصص یافت نشد');

    const pending = await this.appointmentRepo.count({
      where: {
        specialist_id: specialist.id,
        status: AppointmentStatus.Pending,
      },
    });

    if (pending > 0) {
      throw new BadRequestException(
        `این متخصص ${pending} نوبت در انتظار دارد. ابتدا آن‌ها را تعیین تکلیف کنید.`,
      );
    }

    specialist.is_active = false;
    await this.specialistRepo.save(specialist);

    await this.usersService.updateRole(specialist.user_id, UserRole.Customer);

    // 🧹 cache invalidation
    await this.invalidateSpecialist(specialist.id, specialist.user_id);

    return {
      message: 'نقش متخصص لغو شد',
      specialist_id: specialist.id,
      user_id: specialist.user_id,
    };
  }

  async assignServices(specialistId: number, dto: AssignServicesDto) {
    const specialist = await this.specialistRepo.findOne({
      where: { id: specialistId },
      relations: { services: true },
    });
    if (!specialist) throw new NotFoundException('متخصص یافت نشد');

    const services = await this.serviceRepo.findBy({ id: In(dto.service_ids) });
    if (services.length !== dto.service_ids.length) {
      throw new BadRequestException('برخی از خدمات یافت نشدند');
    }

    specialist.services = services;
    await this.specialistRepo.save(specialist);

    await this.invalidateSpecialist(specialist.id, specialist.user_id);

    return this.specialistRepo.findOne({
      where: { id: specialist.id },
      relations: { user: true, services: true },
    });
  }

  async updateSpecialist(specialistId: number, dto: UpdateSpecialistDto) {
    const specialist = await this.specialistRepo.findOne({
      where: { id: specialistId },
    });
    if (!specialist) throw new NotFoundException('متخصص یافت نشد');

    if (dto.bio !== undefined) specialist.bio = dto.bio;
    if (dto.is_active !== undefined) specialist.is_active = dto.is_active;

    await this.specialistRepo.save(specialist);

    await this.invalidateSpecialist(specialist.id, specialist.user_id);

    return this.specialistRepo.findOne({
      where: { id: specialist.id },
      relations: { user: true, services: true },
    });
  }

  async stats() {
    const [
      customers,
      admins,
      specialistsActive,
      specialistsTotal,
      services,
      appointments,
    ] = await Promise.all([
      this.usersService.countByRole(UserRole.Customer),
      this.usersService.countByRole(UserRole.Admin),
      this.specialistRepo.count({ where: { is_active: true } }),
      this.specialistRepo.count(),
      this.serviceRepo.count(),
      this.appointmentRepo.count(),
    ]);

    const byStatusRaw = await this.appointmentRepo
      .createQueryBuilder('a')
      .select('a.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('a.status')
      .getRawMany();

    const appointmentsByStatus = byStatusRaw.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      },
      {},
    );

    const today = new Date().toISOString().split('T')[0];

    const [upcoming, todayCount] = await Promise.all([
      this.appointmentRepo
        .createQueryBuilder('a')
        .where('a.date >= :today', { today })
        .andWhere('a.status IN (:...st)', {
          st: [AppointmentStatus.Pending, AppointmentStatus.Confirmed],
        })
        .getCount(),
      this.appointmentRepo.count({ where: { date: today } }),
    ]);

    const revenueRaw = await this.appointmentRepo
      .createQueryBuilder('a')
      .select('SUM(a.price)', 'sum')
      .where('a.status = :st', { st: AppointmentStatus.Completed })
      .getRawOne();

    const topServicesRaw = await this.appointmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.service', 'svc')
      .select('svc.id', 'id')
      .addSelect('svc.name', 'name')
      .addSelect('COUNT(a.id)', 'count')
      .groupBy('svc.id')
      .addGroupBy('svc.name')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    const topServices = topServicesRaw.map((r) => ({
      id: Number(r.id),
      name: r.name,
      appointments: Number(r.count),
    }));

    return {
      counts: {
        customers,
        admins,
        specialists_active: specialistsActive,
        specialists_total: specialistsTotal,
        services,
        appointments,
      },
      appointments_by_status: appointmentsByStatus,
      upcoming_appointments: upcoming,
      today_appointments: todayCount,
      total_revenue: Number(revenueRaw?.sum ?? 0),
      top_services: topServices,
    };
  }
}