import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { AvailableSlotsDto } from './dto/available-slots.dto';
import { WeekAvailabilityDto } from './dto/week-availability.dto';
import { AppointmentStatus } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get('week-availability')
  getWeekAvailability(@Query() dto: WeekAvailabilityDto) {
    return this.appointmentsService.getWeekAvailability(dto);
  }

  @Get('available')
  getAvailable(@Query() dto: AvailableSlotsDto) {
    return this.appointmentsService.getAvailableSlots(dto);
  }

  @Get('stats/user')
  @UseGuards(JwtAuthGuard)
  getUserStats(@CurrentUser() user: User) {
    return this.appointmentsService.getUserStats(user);
  }

  @Get('stats/specialist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  getSpecialistStats(@CurrentUser() user: User) {
    return this.appointmentsService.getSpecialistStats(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.Customer,
    UserRole.Specialist,
    UserRole.Admin,
    UserRole.SuperAdmin,
  )
  create(@CurrentUser() user: User, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(user, dto);
  }

  @Get('my/reviewable')
  @UseGuards(JwtAuthGuard)
  findMyReviewable(@CurrentUser() user: User) {
    return this.appointmentsService.findReviewable(user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(
    @CurrentUser() user: User,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentsService.findMyAppointments(user, status);
  }

  @Get('specialist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  findForSpecialist(
    @CurrentUser() user: User,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentsService.findForSpecialist(user, status);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  confirm(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.appointmentsService.confirm(id, user);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  complete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.appointmentsService.complete(id, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  findAll(@Query('status') status?: AppointmentStatus) {
    return this.appointmentsService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.appointmentsService.findById(id, user);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.appointmentsService.cancel(id, user, dto);
  }
}