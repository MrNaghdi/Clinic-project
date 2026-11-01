import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistController } from './specialist.controller';
import { SpecialistService } from './specialist.service';
import { WorkingHoursService } from './working-hours.service';
import { Specialist } from './entities/specialist.entity';
import { WorkingHours } from './entities/workingHours.entity';
import { Service } from '../services/entities/service.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialist, WorkingHours, Service]),
    UsersModule,
  ],
  controllers: [SpecialistController],
  providers: [SpecialistService, WorkingHoursService],
  exports: [SpecialistService, WorkingHoursService],
})
export class SpecialistModule {}