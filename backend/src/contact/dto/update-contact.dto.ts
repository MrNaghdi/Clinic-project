import { IsEnum, IsOptional } from 'class-validator';
import { TicketStatus } from '../entities/contact-message.entity';

export class UpdateContactDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}