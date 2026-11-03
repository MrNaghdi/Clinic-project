import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/entities/user.entity';
  
  import { AdminServicesService } from './admin-services.service';
  import { CreateServiceDto } from './dto/create-service.dto';
  import { UpdateServiceDto } from './dto/update-service.dto';
  
  @Controller('admin/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  export class AdminServicesController {
    constructor(private readonly services: AdminServicesService) {}
  
    @Get()
    list(
      @Query('search') search?: string,
      @Query('includeInactive') includeInactive?: string,
    ) {
      return this.services.list({
        search,
        includeInactive: includeInactive === 'true',
      });
    }
  
    @Get('select')
    listForSelect() {
      return this.services.listForSelect();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.services.findOne(id);
    }
  
    @Post()
    create(@Body() dto: CreateServiceDto) {
      return this.services.create(dto);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateServiceDto,
    ) {
      return this.services.update(id, dto);
    }
  
    @Delete(':id')
    remove(
      @Param('id', ParseIntPipe) id: number,
      @Query('force') force?: string,
    ) {
      return this.services.remove(id, force === 'true');
    }
  
    @Patch(':id/toggle-active')
    toggle(@Param('id', ParseIntPipe) id: number) {
      return this.services.toggleActive(id);
    }
  }