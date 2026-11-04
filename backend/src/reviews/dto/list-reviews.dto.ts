import { IsIn, IsOptional, IsString } from 'class-validator';

export class ListReviewsDto {
  @IsOptional()
  @IsString()
  specialist_id?: string;

  @IsOptional()
  @IsString()
  service_id?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  approved_only?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}