import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { Specialist } from '../specialist/entities/specialist.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSeed } from './admin.seed';
import { AdminServicesController } from './admin-services.controller';
import { AdminServicesService } from './admin-services.service';
import { AdminAdminsController } from './admin-admins.controller';
import { AdminAdminsService } from './admin-admins.service';
import { AdminAppointmentsController } from './admin-appointments.controller';
import { AdminAppointmentsService } from './admin-appointments.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Specialist, Service, Appointment]),
  ],
  controllers: [
    AdminController,
    AdminServicesController,
    AdminAdminsController,
    AdminAppointmentsController,  
  ],
  providers: [
    AdminService,
    AdminServicesService,
    AdminAdminsService,
    AdminAppointmentsService,
    AdminSeed,
  ],
})
export class AdminModule {}