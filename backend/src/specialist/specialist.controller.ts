import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistProfileDto } from './dto/update-specialist-profile.dto';
import { UpdateServicesDto } from './dto/update-services.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';

@Controller('specialists')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}

  // ═══════════════════════════════════════
  // Public
  // ═══════════════════════════════════════
  @Get()
  findAll() {
    return this.specialistService.findAll();
  }

  // ═══════════════════════════════════════
  // Specialist
  // ═══════════════════════════════════════
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  findMe(@CurrentUser() user: User) {
    return this.specialistService.findByUserId(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  updateMe(
    @CurrentUser() user: User,
    @Body() dto: UpdateSpecialistProfileDto,
  ) {
    return this.specialistService.updateByUserId(user.id, dto);
  }

  @Patch('me/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  updateMyServices(
    @CurrentUser() user: User,
    @Body() dto: UpdateServicesDto,
  ) {
    return this.specialistService.updateServicesByUserId(
      user.id,
      dto.service_ids,
    );
  }

  @Patch('me/working-hours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Specialist)
  updateMyWorkingHours(
    @CurrentUser() user: User,
    @Body() dto: UpdateWorkingHoursDto,
  ) {
    return this.specialistService.updateWorkingHoursByUserId(
      user.id,
      dto.working_hours,
    );
  }

  // ═══════════════════════════════════════
  // Public
  // ═══════════════════════════════════════
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specialistService.findById(id);
  }

  // ═══════════════════════════════════════
  // Admin
  // ═══════════════════════════════════════
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  create(@Body() dto: CreateSpecialistDto) {
    return this.specialistService.create(dto);
  }
}