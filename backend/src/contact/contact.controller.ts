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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactDto } from './dto/list-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AddReplyDto } from './dto/add-reply.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: User, @Body() dto: CreateContactDto) {
    return this.contactService.create(user, dto);
  }

  @Post('public')
  createPublic(@Body() dto: CreateContactDto) {
    return this.contactService.create(null, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  listMy(@CurrentUser() user: User) {
    return this.contactService.listForUser(user.id);
  }

  @Get('my/:id')
  @UseGuards(JwtAuthGuard)
  findMy(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOneForUser(id, user.id);
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard)
  addReply(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: AddReplyDto,
  ) {
    return this.contactService.addReply(id, user, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  list(@Query() dto: ListContactDto) {
    return this.contactService.list(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactService.update(id, dto);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markRead(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}