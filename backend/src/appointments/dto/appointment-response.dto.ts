import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

export class AppointmentResponseDto {
  id: number;
  status: AppointmentStatus;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  duration_minutes: number;
  notes: string | null;
  cancel_reason: string | null;
  cancelled_at: Date | null;
  customer?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    phone: string;
    profile_image: string | null;
  };
  specialist?: {
    id: number;
    name: string;
    profile_image: string | null;
  };
  service?: {
    id: number;
    name: string;
  };
  created_at: Date;

  static fromEntity(entity: Appointment): AppointmentResponseDto {
    return {
      id: entity.id,
      status: entity.status,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      price: entity.price,
      duration_minutes: entity.duration_minutes,
      notes: entity.notes,
      cancel_reason: entity.cancel_reason,
      cancelled_at: entity.cancelled_at,
      customer: entity.customer
        ? {
            id: entity.customer.id,
            first_name: entity.customer.first_name,
            last_name: entity.customer.last_name,
            phone: entity.customer.phone,
            profile_image: entity.customer.profile_image,
          }
        : undefined,
      specialist: entity.specialist
        ? {
            id: entity.specialist.id,
            name: `${entity.specialist.user?.first_name ?? ''} ${
              entity.specialist.user?.last_name ?? ''
            }`.trim(),
            profile_image: entity.specialist.user?.profile_image ?? null,
          }
        : undefined,
      service: entity.service
        ? {
            id: entity.service.id,
            name: entity.service.name,
          }
        : undefined,
      created_at: entity.created_at,
    };
  }
}