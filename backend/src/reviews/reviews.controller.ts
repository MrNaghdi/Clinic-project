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

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateMyReviewDto } from './dto/update-my-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  // ═══════════════════════════════════════
  // PUBLIC
  // ═══════════════════════════════════════
  @Get()
  list(@Query() dto: ListReviewsDto) {
    return this.reviewsService.list(dto);
  }

  @Get('specialist/:id/stats')
  stats(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.stats(id);
  }

  // ═══════════════════════════════════════
  // CUSTOMER
  // ═══════════════════════════════════════

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(@CurrentUser() user: User) {
    return this.reviewsService.findByUser(user.id);
  }

  @Patch('my/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Customer)
  updateMy(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMyReviewDto,
  ) {
    return this.reviewsService.updateByUser(user.id, id, dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Customer)
  create(@CurrentUser() user: User, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  // ═══════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}