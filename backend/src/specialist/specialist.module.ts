import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { UsersModule } from 'src/users/users.module';
import { Specialist } from './entities/specialist.entity';
import { WorkingHours } from './entities/workingHours.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist, WorkingHours]), UsersModule],
  controllers: [SpecialistController],
  providers: [SpecialistService],
})
export class SpecialistModule { }
