import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AdminSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeed.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const phone = process.env.SUPER_ADMIN_PHONE;
    if (!phone) {
      this.logger.warn(
        'SUPER_ADMIN_PHONE در .env ست نشده — seed سوپر ادمین رد شد',
      );
      return;
    }

    const existing = await this.userRepo.findOne({ where: { phone } });

    if (existing) {
      if (existing.role !== UserRole.SuperAdmin) {
        existing.role = UserRole.SuperAdmin;
        await this.userRepo.save(existing);
        this.logger.log(`نقش ${phone} به سوپر ادمین ارتقا یافت`);
      }
      return;
    }

    await this.userRepo.save(
      this.userRepo.create({
        first_name: 'سوپر',
        last_name: 'ادمین',
        phone,
        role: UserRole.SuperAdmin,
      }),
    );

    this.logger.log(`✅ سوپر ادمین اولیه ساخته شد: ${phone}`);
  }
}