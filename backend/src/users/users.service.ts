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
}
