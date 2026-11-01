import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelAppointmentDto {
  @IsString()
  @IsOptional()
  @MaxLength(300)
  reason?: string;
}