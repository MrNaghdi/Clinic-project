import {
    Controller,
    Get,
    Query,
    UseGuards,
  } from '@nestjs/common';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/entities/user.entity';
  
  import { AdminAppointmentsService } from './admin-appointments.service';
  import { ListAppointmentsDto } from './dto/list-appointments.dto';
  
  @Controller('admin/appointments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  export class AdminAppointmentsController {
    constructor(private readonly appointments: AdminAppointmentsService) {}
  
    @Get()
    list(@Query() dto: ListAppointmentsDto) {
      return this.appointments.list(dto);
    }
  }