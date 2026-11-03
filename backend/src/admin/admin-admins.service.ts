import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { User, UserRole } from '../users/entities/user.entity';
  import { UsersService } from '../users/users.service';
  
  @Injectable()
  export class AdminAdminsService {
    constructor(
      private readonly usersService: UsersService,
  
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
    ) {}
  
    // ═══════════════════════════════════════════
    // لیست ادمین‌ها و سوپر ادمین‌ها
    // ═══════════════════════════════════════════
    async list() {
      return this.userRepo.find({
        where: [{ role: UserRole.Admin }, { role: UserRole.SuperAdmin }],
        order: { created_at: 'DESC' },
      });
    }
  
    // ═══════════════════════════════════════════
    // ارتقای کاربر به ادمین
    // ═══════════════════════════════════════════
    async promoteToAdmin(userId: number) {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('کاربر یافت نشد');
  
      if (user.role === UserRole.Admin) {
        throw new ConflictException('این کاربر از قبل ادمین است');
      }
      if (user.role === UserRole.SuperAdmin) {
        throw new ConflictException('این کاربر سوپر ادمین است');
      }
  
      await this.usersService.updateRole(userId, UserRole.Admin);
  
      return this.usersService.findById(userId);
    }
  
    // ═══════════════════════════════════════════
    // لغو نقش ادمین
    // ═══════════════════════════════════════════
    async demoteAdmin(userId: number) {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('کاربر یافت نشد');
  
      if (user.role === UserRole.SuperAdmin) {
        throw new BadRequestException('نقش سوپر ادمین قابل لغو نیست');
      }
      if (user.role !== UserRole.Admin) {
        throw new BadRequestException('این کاربر ادمین نیست');
      }
  
      await this.usersService.updateRole(userId, UserRole.Customer);
  
      return this.usersService.findById(userId);
    }
  }