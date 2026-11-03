import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Appointment,
  AppointmentStatus,
} from '../appointments/entities/appointment.entity';

import { ListAppointmentsDto } from './dto/list-appointments.dto';

@Injectable()
export class AdminAppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async list(dto: ListAppointmentsDto) {
    const page = Math.max(1, Number(dto.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(dto.limit) || 15));
    const skip = (page - 1) * limit;

    const qb = this.appointmentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.customer', 'customer')
      .leftJoinAndSelect('a.specialist', 'specialist')
      .leftJoinAndSelect('specialist.user', 'specialistUser')
      .leftJoinAndSelect('a.service', 'service')
      .orderBy('a.date', 'DESC')
      .addOrderBy('a.start_time', 'DESC')
      .skip(skip)
      .take(limit);

    if (dto.status) {
      qb.andWhere('a.status = :status', { status: dto.status });
    }

    if (dto.today === 'true') {
      const today = new Date().toISOString().split('T')[0];
      qb.andWhere('a.date = :today', { today });
    }

    if (dto.search) {
      qb.andWhere(
        `(
          customer.first_name ILIKE :q OR
          customer.last_name ILIKE :q OR
          customer.phone ILIKE :q OR
          specialistUser.first_name ILIKE :q OR
          specialistUser.last_name ILIKE :q
        )`,
        { q: `%${dto.search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}