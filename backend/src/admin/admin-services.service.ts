import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { Service } from '../services/entities/service.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import {
  Appointment,
  AppointmentStatus,
} from '../appointments/entities/appointment.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

const KEY_SERVICES_LIST = 'services:all';
const keyService = (id: number) => `services:${id}`;

@Injectable()
export class AdminServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Specialist)
    private readonly specialistRepo: Repository<Specialist>,

    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  private async invalidateService(id?: number): Promise<void> {
    await this.cache.del(KEY_SERVICES_LIST);
    if (id !== undefined) {
      await this.cache.del(keyService(id));
    }
  }

  async list(opts: { search?: string; includeInactive?: boolean }) {
    const qb = this.serviceRepo.createQueryBuilder('service');

    if (!opts.includeInactive) {
      qb.andWhere('service.is_active = :active', { active: true });
    }

    if (opts.search) {
      qb.andWhere(
        '(service.name ILIKE :q OR service.description ILIKE :q)',
        { q: `%${opts.search}%` },
      );
    }

    qb.orderBy('service.created_at', 'DESC');

    const items = await qb.getMany();

    const ids = items.map((s) => s.id);
    const usageRaw = ids.length
      ? await this.specialistRepo
          .createQueryBuilder('sp')
          .innerJoin('sp.services', 'svc')
          .select('svc.id', 'service_id')
          .addSelect('COUNT(DISTINCT sp.id)', 'count')
          .where('svc.id IN (:...ids)', { ids })
          .groupBy('svc.id')
          .getRawMany()
      : [];

    const usageMap = new Map(
      usageRaw.map((r) => [Number(r.service_id), Number(r.count)]),
    );

    return items.map((s) => ({
      ...s,
      specialists_count: usageMap.get(s.id) ?? 0,
    }));
  }

  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('خدمت یافت نشد');

    const specialists = await this.specialistRepo.find({
      where: { is_active: true },
      relations: { user: true, services: true },
    });

    const relatedSpecialists = specialists
      .filter((sp) => sp.services?.some((s) => s.id === id))
      .map((sp) => ({
        id: sp.id,
        user_id: sp.user_id,
        name: sp.user
          ? `${sp.user.first_name ?? ''} ${sp.user.last_name ?? ''}`.trim()
          : '',
      }));

    return {
      ...service,
      specialists: relatedSpecialists,
      specialists_count: relatedSpecialists.length,
    };
  }

  async create(dto: CreateServiceDto) {
    const exists = await this.serviceRepo.findOne({
      where: { name: dto.name },
    });
    if (exists) {
      throw new ConflictException('خدمتی با این نام از قبل وجود دارد');
    }

    const service = this.serviceRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      image: dto.image ?? null,
      duration_minutes: dto.duration_minutes,
      price: dto.price,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.serviceRepo.save(service);

    await this.invalidateService();

    return saved;
  }

  async update(id: number, dto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('خدمت یافت نشد');

    if (dto.name && dto.name !== service.name) {
      const dup = await this.serviceRepo.findOne({
        where: { name: dto.name },
      });
      if (dup) {
        throw new ConflictException('خدمتی با این نام از قبل وجود دارد');
      }
      service.name = dto.name;
    }

    if (dto.description !== undefined) {
      service.description = dto.description;
    }
    if (dto.image !== undefined) {
      service.image = dto.image;
    }
    if (dto.duration_minutes !== undefined) {
      service.duration_minutes = dto.duration_minutes;
    }
    if (dto.price !== undefined) service.price = dto.price;
    if (dto.is_active !== undefined) service.is_active = dto.is_active;

    const saved = await this.serviceRepo.save(service);

    await this.invalidateService(id);

    return saved;
  }

  async remove(id: number, force = false) {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('خدمت یافت نشد');

    const specialistsUsing = await this.specialistRepo
      .createQueryBuilder('sp')
      .innerJoin('sp.services', 'svc', 'svc.id = :id', { id })
      .getCount();

    if (specialistsUsing > 0 && !force) {
      throw new BadRequestException(
        `${specialistsUsing} متخصص این خدمت را ارائه می‌دهند. ابتدا آن‌ها را جدا کنید یا از حذف اجباری استفاده کنید.`,
      );
    }

    const appointmentsUsing = await this.appointmentRepo
      .createQueryBuilder('a')
      .where('a.service_id = :id', { id })
      .andWhere('a.status IN (:...st)', {
        st: [AppointmentStatus.Pending, AppointmentStatus.Confirmed],
      })
      .getCount();

    if (appointmentsUsing > 0) {
      throw new BadRequestException(
        `${appointmentsUsing} نوبت فعال برای این خدمت وجود دارد. ابتدا آن‌ها را لغو یا تکمیل کنید.`,
      );
    }

    if (force) {
      await this.specialistRepo
        .createQueryBuilder()
        .delete()
        .from('specialist_services')
        .where('service_id = :id', { id })
        .execute();
    }

    await this.serviceRepo.delete(id);

    await this.invalidateService(id);
    if (force) {
      await this.cache.del('specialist:all');
    }

    return { message: 'خدمت حذف شد', id };
  }

  async toggleActive(id: number) {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('خدمت یافت نشد');

    service.is_active = !service.is_active;
    const saved = await this.serviceRepo.save(service);

    await this.invalidateService(id);

    return saved;
  }

  async listForSelect() {
    return this.serviceRepo.find({
      where: { is_active: true },
      select: { id: true, name: true, price: true, duration_minutes: true },
      order: { name: 'ASC' },
    });
  }
}