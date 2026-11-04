import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CACHE_MANAGER } from '@nestjs/cache-manager';
  import type { Cache } from 'cache-manager';
  
  import { Review } from './entities/review.entity';
  import { AppointmentStatus } from '../appointments/entities/appointment.entity';
  import { AppointmentsService } from '../appointments/appointments.service';
  import { Specialist } from '../specialist/entities/specialist.entity';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { ListReviewsDto } from './dto/list-reviews.dto';
  import { UpdateReviewDto } from './dto/update-review.dto';
  import { UpdateMyReviewDto } from './dto/update-my-review.dto';
  
  @Injectable()
  export class ReviewsService {
    constructor(
      @InjectRepository(Review)
      private readonly reviewRepo: Repository<Review>,
  
      @InjectRepository(Specialist)
      private readonly specialistRepo: Repository<Specialist>,
  
      private readonly appointmentsService: AppointmentsService,
  
      @Inject(CACHE_MANAGER)
      private readonly cache: Cache,
    ) {}
  
    async create(userId: number, dto: CreateReviewDto) {
      const appointment = await this.appointmentsService.findByIdInternal(
        dto.appointment_id,
      );
  
      if (!appointment) {
        throw new NotFoundException('نوبت یافت نشد');
      }
  
      if (appointment.customer_id !== userId) {
        throw new ForbiddenException('این نوبت مربوط به شما نیست');
      }
  
      if (appointment.status !== AppointmentStatus.Completed) {
        throw new BadRequestException(
          'فقط بعد از تکمیل نوبت می‌توانید نظر ثبت کنید',
        );
      }
  
      const existing = await this.reviewRepo.findOne({
        where: { appointment_id: dto.appointment_id },
      });
  
      if (existing) {
        throw new ConflictException('برای این نوبت قبلاً نظر ثبت کرده‌اید');
      }
  
      const review = this.reviewRepo.create({
        user_id: userId,
        specialist_id: appointment.specialist_id,
        service_id: appointment.service_id,
        appointment_id: appointment.id,
        rating: dto.rating,
        comment: dto.comment ?? null,
        is_approved: false,
      });
  
      const saved = await this.reviewRepo.save(review);
  
      await this.updateSpecialistRating(saved.specialist_id);
      await this.invalidateSpecialist(saved.specialist_id);
  
      return saved;
    }
  
    async list(dto: ListReviewsDto) {
      const page = Math.max(1, Number(dto.page) || 1);
      const limit = Math.min(50, Math.max(1, Number(dto.limit) || 10));
      const skip = (page - 1) * limit;
  
      const qb = this.reviewRepo
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.specialist', 'specialist')
        .leftJoinAndSelect('specialist.user', 'specialistUser')
        .leftJoinAndSelect('review.service', 'service')
        .orderBy('review.created_at', 'DESC')
        .skip(skip)
        .take(limit);
  
      if (dto.specialist_id) {
        qb.andWhere('review.specialist_id = :sid', {
          sid: Number(dto.specialist_id),
        });
      }
  
      if (dto.service_id) {
        qb.andWhere('review.service_id = :svid', {
          svid: Number(dto.service_id),
        });
      }
  
      if (dto.approved_only !== 'false') {
        qb.andWhere('review.is_approved = :approved', { approved: true });
      }
  
      const [items, total] = await qb.getManyAndCount();
  
      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    }
  
    async findByUser(userId: number) {
      const reviews = await this.reviewRepo.find({
        where: { user_id: userId },
        relations: {
          specialist: { user: true },
          service: true,
        },
        order: { created_at: 'DESC' },
      });
  
      return reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        is_approved: r.is_approved,
        appointment_id: r.appointment_id,
        specialist_id: r.specialist_id,
        service_id: r.service_id,
        specialist_name: r.specialist?.user
          ? `${r.specialist.user.first_name ?? ''} ${r.specialist.user.last_name ?? ''}`.trim()
          : '',
        service_name: r.service?.name ?? null,
        created_at: r.created_at,
      }));
    }
  
    async stats(specialistId: number) {
      const result = await this.reviewRepo
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'avg')
        .addSelect('COUNT(*)', 'count')
        .where('review.specialist_id = :sid', { sid: specialistId })
        .andWhere('review.is_approved = :approved', { approved: true })
        .getRawOne();
  
      return {
        average: result.avg ? Number(result.avg) : 0,
        count: Number(result.count),
      };
    }
  
    async update(id: number, dto: UpdateReviewDto) {
      const review = await this.reviewRepo.findOne({ where: { id } });
      if (!review) throw new NotFoundException('نظر یافت نشد');
  
      if (dto.is_approved !== undefined) {
        review.is_approved = dto.is_approved;
      }
      if (dto.comment !== undefined) {
        review.comment = dto.comment;
      }
  
      const saved = await this.reviewRepo.save(review);
  
      await this.updateSpecialistRating(saved.specialist_id);
      await this.invalidateSpecialist(saved.specialist_id);
  
      return saved;
    }
  
    async remove(id: number) {
      const review = await this.reviewRepo.findOne({ where: { id } });
      if (!review) throw new NotFoundException('نظر یافت نشد');
  
      await this.reviewRepo.delete(id);
  
      await this.updateSpecialistRating(review.specialist_id);
      await this.invalidateSpecialist(review.specialist_id);
  
      return { message: 'نظر حذف شد', id };
    }
  
    async updateByUser(
      userId: number,
      reviewId: number,
      dto: UpdateMyReviewDto,
    ) {
      const review = await this.reviewRepo.findOne({
        where: { id: reviewId },
      });
  
      if (!review) {
        throw new NotFoundException('نظر یافت نشد');
      }
  
      if (review.user_id !== userId) {
        throw new ForbiddenException('این نظر مربوط به شما نیست');
      }
  
      let contentChanged = false;
  
      if (dto.rating !== undefined && dto.rating !== review.rating) {
        review.rating = dto.rating;
        contentChanged = true;
      }
      if (dto.comment !== undefined && dto.comment !== review.comment) {
        review.comment = dto.comment;
        contentChanged = true;
      }
  
      if (contentChanged) {
        review.is_approved = false;
      }
  
      const saved = await this.reviewRepo.save(review);
  
      await this.updateSpecialistRating(saved.specialist_id);
      await this.invalidateSpecialist(saved.specialist_id);
  
      return saved;
    }
  
    private async updateSpecialistRating(specialistId: number) {
      const result = await this.reviewRepo
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'avg')
        .addSelect('COUNT(*)', 'count')
        .where('review.specialist_id = :sid', { sid: specialistId })
        .andWhere('review.is_approved = :approved', { approved: true })
        .getRawOne();
  
      const avg = result.avg ? Number(result.avg) : 0;
      const count = Number(result.count);
  
      await this.specialistRepo.update(specialistId, {
        rating: avg,
        review_count: count,
      });
    }
  
    private async invalidateSpecialist(specialistId: number) {
      await Promise.all([
        this.cache.del('specialist:all'),
        this.cache.del(`specialist:${specialistId}`),
      ]);
    }
  }