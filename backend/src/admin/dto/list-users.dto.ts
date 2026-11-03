import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class ListUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}