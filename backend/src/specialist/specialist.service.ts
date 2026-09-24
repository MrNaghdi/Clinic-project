import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Specialist, SpecialistStatus } from './entities/specialist.entity';
import { WorkingHours } from './entities/workingHours.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';

const TTL_LIST = 10 * 60 * 1000;
const TTL_ONE = 15 * 60 * 1000;
const KEY_LIST = 'specialist:all';
const keyOne = (id: number) => `specialist:${id}`;

@Injectable()
export class SpecialistService {
  constructor(
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(WorkingHours)
    private readonly workingHoursRepository: Repository<WorkingHours>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly usersService: UsersService,
  ) { }

  //find all specialist
  async findAll(): Promise<Specialist[]> {
    const cached = await this.cache.get<Specialist[]>(KEY_LIST);
    if (cached) {
      console.log('🎯 [cache HIT] specialist:all');
      return cached;
    }

    console.log('💾 [cache MISS] specialist:all → DB');
    const specialists = await this.specialistRepository.find({
      where: { is_active: true, status: SpecialistStatus.Approved },
    });

    await this.cache.set(KEY_LIST, specialists, TTL_LIST);
    return specialists;
  }

  //find specialist
  async findById(id: number): Promise<Specialist | null> {
    const key = keyOne(id);
    const cached = await this.cache.get<Specialist>(key);
    if (cached) return cached;

    const specialist = await this.specialistRepository.findOne({
      where: { id, is_active: true, status: SpecialistStatus.Approved },
    });
    if (!specialist) {
      throw new NotFoundException('متخصص مورد نظر پیدا نشد.');
    }

    await this.cache.set(key, specialist, TTL_ONE);
    return specialist;
  }

  //Create specialist by admin
  async create(dto: CreateSpecialistDto): Promise<Specialist> {
    const user = await this.usersService.findById(dto.user_id);
    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }
    const existingSpecialist = await this.specialistRepository.findOne({
      where: { user: { id: dto.user_id } },
    });
    if (existingSpecialist) {
      throw new ConflictException('این کاربر از قبل متخصص است.');
    }
    const specialist = this.specialistRepository.create({
      user,
      bio: dto.bio,
      status: SpecialistStatus.Approved,
    });
    const saved = await this.specialistRepository.save(specialist);
    await this.usersService.updateRole(dto.user_id, UserRole.Specialist);
    await this.cache.del(KEY_LIST);
    console.log('🗑️  [cache CLEAR] specialist:all');

    return saved;
  }
}