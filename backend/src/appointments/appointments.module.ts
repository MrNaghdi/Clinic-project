import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from './entities/appointment.entity';
import { Specialist } from '../specialist/entities/specialist.entity';

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

import { SpecialistModule } from '../specialist/specialist.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Specialist]),
    SpecialistModule,
    ServicesModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}