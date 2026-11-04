import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}