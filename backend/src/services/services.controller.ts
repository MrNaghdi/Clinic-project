import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

const servicesUploadDir = './uploads/services';
if (!existsSync(servicesUploadDir)) {
  mkdirSync(servicesUploadDir, { recursive: true });
}

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  //Public routes (all)
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findById(id);
  }

  //Private routes(admin, super admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.deactivateService(id);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: servicesUploadDir,
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('فقط تصویر مجاز است'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('فایلی ارسال نشده');
    }
    const imagePath = `/uploads/services/${file.filename}`;
    return this.servicesService.updateImage(id, imagePath);
  }
}