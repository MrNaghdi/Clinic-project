import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSpecialistDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}