import { IsOptional, IsString } from 'class-validator';

export class PromoteAdminDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;
}