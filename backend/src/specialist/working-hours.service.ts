import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { WorkingHours } from './entities/workingHours.entity';

const TTL = 15 * 60 * 1000;

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectRepository(WorkingHours)
    private readonly workingHoursRepository: Repository<WorkingHours>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findBySpecialistAndDay(
    specialistId: number,
    dayOfWeek: number,
  ): Promise<WorkingHours[]> {
    const key = `working_hours:${specialistId}:${dayOfWeek}`;
    const cached = await this.cache.get<WorkingHours[]>(key);
    if (cached) return cached;

    const result = await this.workingHoursRepository.find({
      where: {
        specialist_id: specialistId,
        day_of_week: dayOfWeek,
      },
    });

    await this.cache.set(key, result, TTL);
    return result;
  }

  async findBySpecialist(specialistId: number): Promise<WorkingHours[]> {
    const key = `working_hours:${specialistId}:all`;
    const cached = await this.cache.get<WorkingHours[]>(key);
    if (cached) return cached;

    const result = await this.workingHoursRepository.find({
      where: { specialist_id: specialistId },
    });

    await this.cache.set(key, result, TTL);
    return result;
  }

  async invalidate(specialistId: number): Promise<void> {
    const keys = [`working_hours:${specialistId}:all`];
    for (let day = 0; day <= 6; day++) {
      keys.push(`working_hours:${specialistId}:${day}`);
    }
    await Promise.all(keys.map((k) => this.cache.del(k)));
  }
}