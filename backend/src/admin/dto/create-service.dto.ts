import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsInt()
  @Min(1)
  duration_minutes: number;

  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}