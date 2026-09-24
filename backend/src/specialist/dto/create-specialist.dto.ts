import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecialistDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsOptional()
  bio?: string;
}