import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';

@Controller('specialists')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}
  
  //Publice routes(All)
  @Get()
  findAll(){
    return this.specialistService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specialistService.findById(id);
  }

  //Private routes(admin, super_admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  create(@Body() dto: CreateSpecialistDto) {
    return this.specialistService.create(dto);
  }
}
