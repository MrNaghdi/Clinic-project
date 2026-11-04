import { Controller, Get } from '@nestjs/common';
import { PublicStatsService } from './public-stats.service';

@Controller('public')
export class PublicStatsController {
  constructor(private readonly publicStats: PublicStatsService) {}

  @Get('stats')
  stats() {
    return this.publicStats.getStats();
  }
}