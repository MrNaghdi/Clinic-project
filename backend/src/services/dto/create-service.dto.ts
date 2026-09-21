import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(1)
  duration_minutes: number;

}
