import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WeekAvailabilityDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  specialist_id: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  service_id: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  start_date: string;
}