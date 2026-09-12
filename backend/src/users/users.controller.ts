import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Patch,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone,
      profile_image: user.profile_image,
    };
  }
  // get user profile
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() dto: RegisterUserDto, @CurrentUser() user: User) {
    return this.usersService.completeRegister(
      user.id,
      dto.first_name,
      dto.last_name,
    );
  }
  // upload user avatar
  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const fileExtension = extname(file.originalname);
          const uniqueFileName = `${randomUUID()}${fileExtension}`;
          callback(null, uniqueFileName);
        },
      }),
      limits: {
        fileSize: 3 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('فقط فایل‌های JPG, PNG یا WEBP مجاز است.'),
            false,
          );
        }
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('فایلی ارسال نشده است.');
    }
    const filePath = `/uploads/avatars/${file.filename}`;

    const updatedUser = await this.usersService.updateProfileImage(
      user.id,
      filePath,
    );

    return {
      message: 'عکس پروفایل با موفقیت بارگذاری شد.',
      profile_image: updatedUser.profile_image,
    };
  }
}
