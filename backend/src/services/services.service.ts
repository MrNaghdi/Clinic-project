import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Service } from 'src/services/entities/service.entity';
import { CreateServiceDto } from 'src/services/dto/create-service.dto';
import { UpdateServiceDto } from 'src/services/dto/update-service.dto';

const TTL_LIST = 10 * 60 * 1000; //for services:all
const TTL_ONE = 15 * 60 * 1000; // for services:id
const KEY_LIST = 'services:all';
const keyOne = (id: number) => `services:${id}`;

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) { }

  //read services with catch
  async findAll(): Promise<Service[]> {
    // check catch
    const cached = await this.cache.get<Service[]>(KEY_LIST);
    if (cached) {
      console.log('🎯 [cache HIT] services:all');
      return cached;
    }

    //read in database
    console.log('💾 [cache MISS] services:all → DB');
    const services = await this.serviceRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });

    // save in catch
    await this.cache.set(KEY_LIST, services, TTL_LIST);
    return services;
  }

  async findById(id: number): Promise<Service | null> {
    const key = keyOne(id);
    const cached = await this.cache.get<Service>(key);
    if (cached) return cached;

    const service = await this.serviceRepository.findOne({
      where: { id, is_active: true },
    });
    if (!service) {
      throw new NotFoundException('خدمات مورد نظر پیدا نشد.');
    }

    await this.cache.set(key, service, TTL_ONE);
    return service;
  }

  //create service
  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(dto);
    const saved = await this.serviceRepository.save(service);
    await this.cache.del(KEY_LIST);
    console.log('🗑️  [cache CLEAR] services:all');

    return saved;
  }

  //update servie
  async updateService(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findByIdOrFail(id);
    Object.assign(service, dto);
    const saved = await this.serviceRepository.save(service);
    await this.invalidate(id);
    return saved;
  }

  //deActive service
  async deactivateService(id: number): Promise<Service> {
    const service = await this.findByIdOrFail(id);
    service.is_active = false;
    const saved = await this.serviceRepository.save(service);
    await this.invalidate(id);
    return saved;
  }


  //invalid catch
  private async invalidate(id: number) {
    await this.cache.del(KEY_LIST);
    await this.cache.del(keyOne(id));
    console.log(`🗑️  [cache CLEAR] services:all + services:${id}`);
  }

  private async findByIdOrFail(id: number): Promise<Service> {
    const service = await this.findById(id);
    if (!service) {
      throw new NotFoundException('سرویس پیدا نشد.');
    }
    return service;
  }
}