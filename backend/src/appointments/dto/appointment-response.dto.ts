import { Appointment } from "../entities/appointment.entity";

export class AppointmentResponseDto {
  id: number;
  customer_id: number;
  specialist_id: number;
  service_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  price: number;
  duration_minutes: number;
  notes: string | null;
  cancel_reason: string | null;
  cancelled_at: Date | null;
  customer: any;
  specialist: any;
  service: any;
  created_at: Date;
  updated_at: Date;

  static fromEntity(a: Appointment): AppointmentResponseDto {
    return {
      id: a.id,
      customer_id: a.customer_id,
      specialist_id: a.specialist_id,
      service_id: a.service_id,
      date: a.date,
      start_time: a.start_time,
      end_time: a.end_time,
      status: a.status,
      price: a.price,
      duration_minutes: a.duration_minutes,
      notes: a.notes,
      cancel_reason: a.cancel_reason,
      cancelled_at: a.cancelled_at,
      customer: a.customer
        ? {
            id: a.customer.id,
            first_name: a.customer.first_name,
            last_name: a.customer.last_name,
            phone: a.customer.phone,
            profile_image: a.customer.profile_image,
          }
        : null,
      specialist: a.specialist
        ? {
            id: a.specialist.id,
            user_id: a.specialist.user_id,
            user: a.specialist.user
              ? {
                  first_name: a.specialist.user.first_name,
                  last_name: a.specialist.user.last_name,
                  profile_image: a.specialist.user.profile_image,
                }
              : null,
          }
        : null,
      service: a.service
        ? {
            id: a.service.id,
            name: a.service.name,
          }
        : null,
      created_at: a.created_at,
      updated_at: a.updated_at,
    };
  }
}