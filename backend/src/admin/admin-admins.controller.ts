import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/entities/user.entity';
  
  import { AdminAdminsService } from './admin-admins.service';
  
  @Controller('admin/admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SuperAdmin) // ← فقط سوپر ادمین
  export class AdminAdminsController {
    constructor(private readonly adminsService: AdminAdminsService) {}
  
    @Get()
    list() {
      return this.adminsService.list();
    }
  
    @Post(':id/promote')
    promote(@Param('id', ParseIntPipe) id: number) {
      return this.adminsService.promoteToAdmin(id);
    }
  
    @Post(':id/demote')
    demote(@Param('id', ParseIntPipe) id: number) {
      return this.adminsService.demoteAdmin(id);
    }
  }