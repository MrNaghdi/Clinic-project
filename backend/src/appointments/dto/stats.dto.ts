export class AppointmentStatsDto {
    upcoming_count: number;
    completed_count: number;
    cancelled_count: number;
    total_count: number;
    total_spent: number;
    next_appointment: {
      id: number;
      date: string;
      start_time: string;
      service_name: string;
      specialist_name: string;
    } | null;
  }