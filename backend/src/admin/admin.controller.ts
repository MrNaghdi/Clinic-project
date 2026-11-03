import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

import { AdminService } from './admin.service';
import { ListUsersDto } from './dto/list-users.dto';
import { PromoteSpecialistDto } from './dto/promote-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { AssignServicesDto } from './dto/assign-services.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.SuperAdmin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(@Query() dto: ListUsersDto) {
    return this.adminService.listUsers(dto);
  }

  @Post('users/:id/promote-specialist')
  promote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PromoteSpecialistDto,
  ) {
    return this.adminService.promoteToSpecialist(id, dto);
  }

  @Post('specialists/:id/demote')
  demote(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.demoteSpecialist(id);
  }

  @Patch('specialists/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpecialistDto,
  ) {
    return this.adminService.updateSpecialist(id, dto);
  }

  @Put('specialists/:id/services')
  assignServices(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignServicesDto,
  ) {
    return this.adminService.assignServices(id, dto);
  }

  @Get('stats')
  stats() {
    return this.adminService.stats();
  }
}