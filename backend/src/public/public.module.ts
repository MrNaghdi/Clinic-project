import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Review } from '../reviews/entities/review.entity';
import { PublicStatsController } from './public-stats.controller';
import { PublicStatsService } from './public-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Specialist, Review])],
  controllers: [PublicStatsController],
  providers: [PublicStatsService],
})
export class PublicModule {}