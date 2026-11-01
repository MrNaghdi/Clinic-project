import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateSpecialistProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}