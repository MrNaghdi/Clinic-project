import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  // find user by id
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // find user by phone
  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  // create new user and save to database
  async create(phone: string) {
    const user = this.userRepository.create({
      phone,
    });
    return this.userRepository.save(user);
  }
  // increase token version
  async incrementTokenVersion(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }
    user.token_version += 1;
    await this.userRepository.save(user);
    return user.token_version;
  }
  // complete user register
  async completeRegister(
    userId: number,
    first_name: string,
    last_name: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }
    user.first_name = first_name;
    user.last_name = last_name;
    return this.userRepository.save(user);
  }
  // upload avatar
  async updateProfileImage(userId: number, imagePath: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }
    user.profile_image = imagePath;
    return this.userRepository.save(user);
  }
  async updateRole(userId: number, role: UserRole): Promise<User> {
    const result = await this.userRepository.update(userId, { role });
    if (result.affected === 0) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }
    return this.findById(userId) as Promise<User>;
  }

  async list(opts: {
    search?: string;
    role?: UserRole;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 20));
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC');

    if (opts.role) {
      qb.andWhere('user.role = :role', { role: opts.role });
    }

    if (opts.search) {
      qb.andWhere(
        '(user.first_name ILIKE :q OR user.last_name ILIKE :q OR user.phone ILIKE :q)',
        { q: `%${opts.search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.userRepository.count({ where: { role } });
  }
}
