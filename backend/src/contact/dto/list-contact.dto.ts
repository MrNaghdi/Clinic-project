import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../entities/contact-message.entity';

export class ListContactDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  unread_only?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}