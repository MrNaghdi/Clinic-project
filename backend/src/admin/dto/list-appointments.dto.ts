import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../../appointments/entities/appointment.entity';

export class ListAppointmentsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsIn(['true', 'false'])
  today?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}