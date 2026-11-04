import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Specialist, SpecialistStatus } from '../specialist/entities/specialist.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class PublicStatsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Specialist)
    private readonly specialistRepo: Repository<Specialist>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async getStats() {
    const [customers, specialists, reviews] = await Promise.all([
      this.userRepo.count({ where: { role: UserRole.Customer } }),
      this.specialistRepo.count({
        where: { is_active: true, status: SpecialistStatus.Approved },
      }),
      this.reviewRepo
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'avg')
        .addSelect('COUNT(*)', 'count')
        .where('review.is_approved = :approved', { approved: true })
        .getRawOne(),
    ]);

    return {
      customers,
      specialists,
      reviews_average: reviews.avg ? Number(reviews.avg) : 0,
      reviews_count: Number(reviews.count),
    };
  }
}