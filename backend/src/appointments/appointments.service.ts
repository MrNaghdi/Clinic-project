import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, MoreThanOrEqual, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { AvailableSlotsDto } from './dto/available-slots.dto';
import { WeekAvailabilityDto } from './dto/week-availability.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';

import { User, UserRole } from '../users/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { SpecialistService } from '../specialist/specialist.service';
import { WorkingHoursService } from '../specialist/working-hours.service';
import { ServicesService } from '../services/services.service';
import { WorkingHours } from '../specialist/entities/workingHours.entity';

const CACHE_APPOINTMENTS = 'appointments:list';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly specialistService: SpecialistService,
    private readonly servicesService: ServicesService,
    private readonly workingHoursService: WorkingHoursService,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private formatTime(h: number, m: number): string {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }

  private toISODate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private sortByStatusAndDate(appointments: Appointment[]): Appointment[] {
    const statusPriority: Record<string, number> = {
      [AppointmentStatus.Pending]: 0,
      [AppointmentStatus.Confirmed]: 1,
      [AppointmentStatus.Completed]: 2,
      [AppointmentStatus.Cancelled]: 3,
      [AppointmentStatus.NoShow]: 4,
    };

    return [...appointments].sort((a, b) => {
      const pa = statusPriority[a.status] ?? 99;
      const pb = statusPriority[b.status] ?? 99;
      if (pa !== pb) return pa - pb;

      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.start_time.localeCompare(b.start_time);
    });
  }

  async create(
    user: User,
    dto: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const specialist = await this.specialistService.findById(dto.specialist_id);
    if (!specialist) throw new NotFoundException('متخصص یافت نشد.');

    const service = await this.servicesService.findById(dto.service_id);
    if (!service) throw new NotFoundException('خدمت یافت نشد.');

    const appointmentStart = new Date(`${dto.date}T${dto.start_time}`);
    if (appointmentStart < new Date()) {
      throw new BadRequestException('تاریخ نوبت نمی‌تواند در گذشته باشد.');
    }

    const [h, m] = dto.start_time.split(':').map(Number);
    const start_time = this.formatTime(h, m);
    const endTotal = h * 60 + m + service.duration_minutes;
    const end_time = this.formatTime(Math.floor(endTotal / 60), endTotal % 60);

    const dayOfWeek = new Date(dto.date).getDay();
    const workingHours = await this.workingHoursService.findBySpecialistAndDay(
      dto.specialist_id,
      dayOfWeek,
    );

    if (workingHours.length === 0) {
      throw new BadRequestException('متخصص در این روز فعالیتی ندارد.');
    }

    const slotStartMin = this.toMinutes(start_time);
    const slotEndMin = this.toMinutes(end_time);

    const isWithinWorkingHours = workingHours.some(
      (wh) =>
        this.toMinutes(wh.start_time) <= slotStartMin &&
        this.toMinutes(wh.end_time) >= slotEndMin,
    );

    if (!isWithinWorkingHours) {
      throw new BadRequestException('این زمان خارج از ساعات کاری است.');
    }

    const saved = await this.dataSource.transaction(async (manager) => {
      const overlap = await manager
        .createQueryBuilder(Appointment, 'a')
        .setLock('pessimistic_write')
        .where('a.specialist_id = :sid', { sid: dto.specialist_id })
        .andWhere('a.date = :date', { date: dto.date })
        .andWhere('a.status IN (:...statuses)', {
          statuses: [AppointmentStatus.Pending, AppointmentStatus.Confirmed],
        })
        .andWhere('(a.start_time < :end_time AND a.end_time > :start_time)', {
          start_time,
          end_time,
        })
        .getOne();

      if (overlap) {
        throw new ConflictException('این زمان قبلاً رزرو شده است.');
      }

      const duplicate = await manager.findOne(Appointment, {
        where: {
          customer_id: user.id,
          specialist_id: dto.specialist_id,
          date: dto.date,
          start_time,
          status: In([AppointmentStatus.Pending, AppointmentStatus.Confirmed]),
        },
      });

      if (duplicate) {
        throw new ConflictException('شما قبلاً این نوبت را رزرو کرده‌اید.');
      }

      const appointment = manager.create(Appointment, {
        customer_id: user.id,
        specialist_id: dto.specialist_id,
        service_id: dto.service_id,
        date: dto.date,
        start_time,
        end_time,
        price: service.price,
        duration_minutes: service.duration_minutes,
        notes: dto.notes ?? null,
        status: AppointmentStatus.Pending,
      });

      return manager.save(appointment);
    });

    await this.cache.del(CACHE_APPOINTMENTS);

    const full = await this.appointmentRepository.findOne({
      where: { id: saved.id },
      relations: {
        customer: true,
        specialist: { user: true },
        service: true,
      },
    });

    return AppointmentResponseDto.fromEntity(full!);
  }

  async getWeekAvailability(dto: WeekAvailabilityDto) {
    const specialist = await this.specialistService.findById(dto.specialist_id);
    if (!specialist) throw new NotFoundException('متخصص یافت نشد.');

    const service = await this.servicesService.findById(dto.service_id);
    if (!service) throw new NotFoundException('خدمت یافت نشد.');

    const startDate = new Date(dto.start_date);
    const now = new Date();
    const days: Array<{
      date: string;
      day_of_week: number;
      slots: string[];
      available_count: number;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isoDate = this.toISODate(date);
      const dayOfWeek = date.getDay();

      const workingHours =
        await this.workingHoursService.findBySpecialistAndDay(
          dto.specialist_id,
          dayOfWeek,
        );

      if (workingHours.length === 0) continue;

      const slots = await this.computeSlotsForDay(
        dto.specialist_id,
        isoDate,
        service.duration_minutes,
        workingHours,
        now,
      );

      days.push({
        date: isoDate,
        day_of_week: dayOfWeek,
        slots,
        available_count: slots.length,
      });
    }

    days.sort((a, b) => {
      const toSat = (jsDay: number) => (jsDay + 1) % 7;
      return toSat(a.day_of_week) - toSat(b.day_of_week);
    });

    return { days };
  }

  private async computeSlotsForDay(
    specialistId: number,
    date: string,
    duration: number,
    workingHours: WorkingHours[],
    now: Date,
  ): Promise<string[]> {
    const existing = await this.appointmentRepository.find({
      where: {
        specialist_id: specialistId,
        date,
        status: In([AppointmentStatus.Pending, AppointmentStatus.Confirmed]),
      },
    });

    const slots: string[] = [];

    for (const wh of workingHours) {
      const startTotal = this.toMinutes(wh.start_time);
      const endTotal = this.toMinutes(wh.end_time);

      for (let t = startTotal; t + duration <= endTotal; t += duration) {
        const slotStart = this.formatTime(Math.floor(t / 60), t % 60);
        const slotEnd = this.formatTime(
          Math.floor((t + duration) / 60),
          (t + duration) % 60,
        );

        const hasOverlap = existing.some(
          (a) => a.start_time < slotEnd && a.end_time > slotStart,
        );
        if (hasOverlap) continue;

        const slotDate = new Date(`${date}T${slotStart}`);
        if (slotDate <= now) continue;

        slots.push(slotStart.substring(0, 5));
      }
    }

    return slots;
  }

  async getAvailableSlots(dto: AvailableSlotsDto): Promise<string[]> {
    const specialist = await this.specialistService.findById(dto.specialist_id);
    if (!specialist) throw new NotFoundException('متخصص یافت نشد.');

    const service = await this.servicesService.findById(dto.service_id);
    if (!service) throw new NotFoundException('خدمت یافت نشد.');

    const dayOfWeek = new Date(dto.date).getDay();
    const workingHours = await this.workingHoursService.findBySpecialistAndDay(
      dto.specialist_id,
      dayOfWeek,
    );

    if (workingHours.length === 0) return [];

    return this.computeSlotsForDay(
      dto.specialist_id,
      dto.date,
      service.duration_minutes,
      workingHours,
      new Date(),
    );
  }

  async findMyAppointments(
    user: User,
    status?: AppointmentStatus,
  ): Promise<AppointmentResponseDto[]> {
    const where: any = { customer_id: user.id };
    if (status) where.status = status;

    const appointments = await this.appointmentRepository.find({
      where,
      relations: { specialist: { user: true }, service: true },
      order: { date: 'DESC', start_time: 'DESC' },
    });

    const sorted = this.sortByStatusAndDate(appointments);

    return sorted.map(AppointmentResponseDto.fromEntity);
  }

  async findForSpecialist(
    user: User,
    status?: AppointmentStatus,
  ): Promise<AppointmentResponseDto[]> {
    const specialist = await this.specialistService.findByUserId(user.id);
    if (!specialist) throw new NotFoundException('پروفایل متخصص یافت نشد.');

    const where: any = { specialist_id: specialist.id };
    if (status) where.status = status;

    const appointments = await this.appointmentRepository.find({
      where,
      relations: { customer: true, service: true },
      order: { date: 'DESC', start_time: 'DESC' },
    });

    const sorted = this.sortByStatusAndDate(appointments);

    return sorted.map(AppointmentResponseDto.fromEntity);
  }

  async findAll(status?: AppointmentStatus): Promise<AppointmentResponseDto[]> {
    const where: any = {};
    if (status) where.status = status;

    const appointments = await this.appointmentRepository.find({
      where,
      relations: { customer: true, specialist: { user: true }, service: true },
      order: { date: 'DESC', start_time: 'DESC' },
    });

    return appointments.map(AppointmentResponseDto.fromEntity);
  }

  async findById(id: number, user: User): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { customer: true, specialist: { user: true }, service: true },
    });

    if (!appointment) throw new NotFoundException('نوبت یافت نشد.');

    const isCustomer = appointment.customer_id === user.id;
    const isAdmin =
      user.role === UserRole.Admin || user.role === UserRole.SuperAdmin;

    let isSpecialist = false;
    if (user.role === UserRole.Specialist) {
      const spec = await this.appointmentRepository.manager.findOne(
        Specialist,
        { where: { user_id: user.id } },
      );
      isSpecialist = !!spec && appointment.specialist_id === spec.id;
    }

    if (!isCustomer && !isSpecialist && !isAdmin) {
      throw new ForbiddenException('شما به این نوبت دسترسی ندارید.');
    }

    return AppointmentResponseDto.fromEntity(appointment);
  }

  async findByIdInternal(id: number): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        specialist: { user: true },
        service: true,
      },
    });
  }

  async findReviewable(userId: number): Promise<AppointmentResponseDto[]> {
    const completed = await this.appointmentRepository.find({
      where: {
        customer_id: userId,
        status: AppointmentStatus.Completed,
      },
      relations: {
        specialist: { user: true },
        service: true,
      },
      order: { date: 'DESC', start_time: 'DESC' },
    });

    if (completed.length === 0) return [];

    const reviewedRaw = await this.appointmentRepository.manager
      .createQueryBuilder('reviews', 'r')
      .select('r.appointment_id', 'appointment_id')
      .where('r.appointment_id IN (:...ids)', {
        ids: completed.map((a) => a.id),
      })
      .getRawMany();

    const reviewedSet = new Set(
      reviewedRaw.map((r) => Number(r.appointment_id)),
    );

    return completed
      .filter((a) => !reviewedSet.has(a.id))
      .map(AppointmentResponseDto.fromEntity);
  }

  async cancel(
    id: number,
    user: User,
    dto: CancelAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const result = await this.dataSource.transaction(async (manager) => {
      const appointment = await manager
        .createQueryBuilder(Appointment, 'a')
        .setLock('pessimistic_write')
        .where('a.id = :id', { id })
        .getOne();

      if (!appointment) throw new NotFoundException('نوبت یافت نشد.');

      const isCustomer = appointment.customer_id === user.id;
      const isAdmin =
        user.role === UserRole.Admin || user.role === UserRole.SuperAdmin;

      let isSpecialist = false;
      if (user.role === UserRole.Specialist) {
        const spec = await manager.findOne(Specialist, {
          where: { user_id: user.id },
        });
        isSpecialist = !!spec && appointment.specialist_id === spec.id;
      }

      if (!isCustomer && !isSpecialist && !isAdmin) {
        throw new ForbiddenException('شما نمی‌توانید این نوبت را لغو کنید.');
      }

      if (appointment.status === AppointmentStatus.Cancelled) {
        throw new BadRequestException('این نوبت قبلاً لغو شده است.');
      }
      if (appointment.status === AppointmentStatus.Completed) {
        throw new BadRequestException('نوبت انجام‌شده قابل لغو نیست.');
      }

      appointment.status = AppointmentStatus.Cancelled;
      appointment.cancel_reason = dto.reason ?? null;
      appointment.cancelled_at = new Date();

      return manager.save(appointment);
    });

    await this.cache.del(CACHE_APPOINTMENTS);

    const full = await this.appointmentRepository.findOne({
      where: { id: result.id },
      relations: {
        customer: true,
        specialist: { user: true },
        service: true,
      },
    });

    return AppointmentResponseDto.fromEntity(full!);
  }

  async confirm(id: number, user: User): Promise<AppointmentResponseDto> {
    const result = await this.dataSource.transaction(async (manager) => {
      const spec = await manager.findOne(Specialist, {
        where: { user_id: user.id },
      });
      if (!spec) throw new NotFoundException('پروفایل متخصص یافت نشد.');

      const appointment = await manager
        .createQueryBuilder(Appointment, 'a')
        .setLock('pessimistic_write')
        .where('a.id = :id', { id })
        .getOne();

      if (!appointment) throw new NotFoundException('نوبت یافت نشد.');

      if (appointment.specialist_id !== spec.id) {
        throw new ForbiddenException('شما دسترسی به این نوبت ندارید.');
      }

      if (appointment.status !== AppointmentStatus.Pending) {
        throw new BadRequestException(
          'فقط نوبت‌های در انتظار قابل تایید هستند.',
        );
      }

      appointment.status = AppointmentStatus.Confirmed;
      return manager.save(appointment);
    });

    await this.cache.del(CACHE_APPOINTMENTS);

    const full = await this.appointmentRepository.findOne({
      where: { id: result.id },
      relations: {
        customer: true,
        specialist: { user: true },
        service: true,
      },
    });

    return AppointmentResponseDto.fromEntity(full!);
  }

  async complete(id: number, user: User): Promise<AppointmentResponseDto> {
    const result = await this.dataSource.transaction(async (manager) => {
      const spec = await manager.findOne(Specialist, {
        where: { user_id: user.id },
      });
      if (!spec) throw new NotFoundException('پروفایل متخصص یافت نشد.');

      const appointment = await manager
        .createQueryBuilder(Appointment, 'a')
        .setLock('pessimistic_write')
        .where('a.id = :id', { id })
        .getOne();

      if (!appointment) throw new NotFoundException('نوبت یافت نشد.');

      if (appointment.specialist_id !== spec.id) {
        throw new ForbiddenException('شما دسترسی به این نوبت ندارید.');
      }

      if (appointment.status !== AppointmentStatus.Confirmed) {
        throw new BadRequestException(
          'فقط نوبت‌های تاییدشده قابل تکمیل هستند.',
        );
      }

      appointment.status = AppointmentStatus.Completed;
      return manager.save(appointment);
    });

    await this.cache.del(CACHE_APPOINTMENTS);

    const full = await this.appointmentRepository.findOne({
      where: { id: result.id },
      relations: {
        customer: true,
        specialist: { user: true },
        service: true,
      },
    });

    return AppointmentResponseDto.fromEntity(full!);
  }

  async getUserStats(user: User) {
    const todayISO = this.toISODate(new Date());

    const [upcoming, completed, cancelled, total] = await Promise.all([
      this.appointmentRepository.count({
        where: {
          customer_id: user.id,
          status: In([AppointmentStatus.Pending, AppointmentStatus.Confirmed]),
        },
      }),
      this.appointmentRepository.count({
        where: {
          customer_id: user.id,
          status: AppointmentStatus.Completed,
        },
      }),
      this.appointmentRepository.count({
        where: {
          customer_id: user.id,
          status: AppointmentStatus.Cancelled,
        },
      }),
      this.appointmentRepository.count({
        where: { customer_id: user.id },
      }),
    ]);

    const completedAppointments = await this.appointmentRepository.find({
      where: {
        customer_id: user.id,
        status: AppointmentStatus.Completed,
      },
    });

    const totalSpent = completedAppointments.reduce(
      (sum, a) => sum + a.price,
      0,
    );

    const nextAppointment = await this.appointmentRepository.findOne({
      where: {
        customer_id: user.id,
        status: In([AppointmentStatus.Pending, AppointmentStatus.Confirmed]),
        date: MoreThanOrEqual(todayISO),
      },
      relations: { specialist: { user: true }, service: true },
      order: { date: 'ASC', start_time: 'ASC' },
    });

    return {
      upcoming_count: upcoming,
      completed_count: completed,
      cancelled_count: cancelled,
      total_count: total,
      total_spent: totalSpent,
      next_appointment: nextAppointment
        ? {
            id: nextAppointment.id,
            date: nextAppointment.date,
            start_time: nextAppointment.start_time,
            service_name: nextAppointment.service?.name ?? '',
            specialist_name: `${nextAppointment.specialist?.user?.first_name ?? ''} ${nextAppointment.specialist?.user?.last_name ?? ''}`.trim(),
          }
        : null,
    };
  }

  async getSpecialistStats(user: User) {
    const specialist = await this.specialistService.findByUserId(user.id);
    if (!specialist) {
      throw new NotFoundException('پروفایل متخصص یافت نشد.');
    }

    const todayISO = this.toISODate(new Date());

    const [todayCount, upcoming, completed, cancelled, total] =
      await Promise.all([
        this.appointmentRepository.count({
          where: {
            specialist_id: specialist.id,
            date: todayISO,
            status: In([
              AppointmentStatus.Pending,
              AppointmentStatus.Confirmed,
            ]),
          },
        }),
        this.appointmentRepository.count({
          where: {
            specialist_id: specialist.id,
            status: In([
              AppointmentStatus.Pending,
              AppointmentStatus.Confirmed,
            ]),
            date: MoreThanOrEqual(todayISO),
          },
        }),
        this.appointmentRepository.count({
          where: {
            specialist_id: specialist.id,
            status: AppointmentStatus.Completed,
          },
        }),
        this.appointmentRepository.count({
          where: {
            specialist_id: specialist.id,
            status: AppointmentStatus.Cancelled,
          },
        }),
        this.appointmentRepository.count({
          where: { specialist_id: specialist.id },
        }),
      ]);

    const completedAppointments = await this.appointmentRepository.find({
      where: {
        specialist_id: specialist.id,
        status: AppointmentStatus.Completed,
      },
    });

    const totalEarned = completedAppointments.reduce(
      (sum, a) => sum + a.price,
      0,
    );

    const nextAppointment = await this.appointmentRepository.findOne({
      where: {
        specialist_id: specialist.id,
        status: In([AppointmentStatus.Pending, AppointmentStatus.Confirmed]),
        date: MoreThanOrEqual(todayISO),
      },
      relations: { customer: true, service: true },
      order: { date: 'ASC', start_time: 'ASC' },
    });

    return {
      today_count: todayCount,
      upcoming_count: upcoming,
      completed_count: completed,
      cancelled_count: cancelled,
      total_count: total,
      total_earned: totalEarned,
      rating: null,
      next_appointment: nextAppointment
        ? {
            id: nextAppointment.id,
            date: nextAppointment.date,
            start_time: nextAppointment.start_time,
            service_name: nextAppointment.service?.name ?? '',
            customer_name: `${nextAppointment.customer?.first_name ?? ''} ${nextAppointment.customer?.last_name ?? ''}`.trim(),
            customer_phone: nextAppointment.customer?.phone ?? '',
          }
        : null,
    };
  }
}