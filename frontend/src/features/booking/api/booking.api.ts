import axiosInstance from "../../../shared/api/axiosInstance";

export enum AppointmentStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Completed = "completed",
  Cancelled = "cancelled",
  NoShow = "no_show",
}

export interface AppointmentCustomer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  profile_image: string | null;
}

export interface AppointmentSpecialistUser {
  first_name: string | null;
  last_name: string | null;
  profile_image: string | null;
}

export interface AppointmentSpecialist {
  id: number;
  user_id: number;
  user: AppointmentSpecialistUser | null;
}

export interface AppointmentService {
  id: number;
  name: string;
}

export interface Appointment {
  id: number;
  customer_id: number;
  specialist_id: number;
  service_id: number;
  status: AppointmentStatus;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  duration_minutes: number;
  notes: string | null;
  cancel_reason: string | null;
  cancelled_at: string | null;
  customer?: AppointmentCustomer | null;
  specialist?: AppointmentSpecialist | null;
  service?: AppointmentService | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentPayload {
  specialist_id: number;
  service_id: number;
  date: string;
  start_time: string;
  notes?: string;
}

export interface AvailableSlotsParams {
  specialist_id: number;
  service_id: number;
  date: string;
}

export interface WeekAvailabilityParams {
  specialist_id: number;
  service_id: number;
  start_date: string;
}

export interface DayAvailability {
  date: string;
  day_of_week: number;
  slots: string[];
  available_count: number;
}

export interface UserStats {
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

export interface SpecialistStats {
  today_count: number;
  upcoming_count: number;
  completed_count: number;
  cancelled_count: number;
  total_count: number;
  total_earned: number;
  rating: number | null;
  next_appointment: {
    id: number;
    date: string;
    start_time: string;
    service_name: string;
    customer_name: string;
    customer_phone: string;
  } | null;
}

export interface WeekAvailabilityResponse {
  days: DayAvailability[];
}

export async function createAppointment(
  dto: CreateAppointmentPayload,
): Promise<Appointment> {
  const response = await axiosInstance.post<Appointment>(
    "/appointments",
    dto,
  );
  return response.data;
}

export async function findMyAppointments(
  status?: AppointmentStatus,
): Promise<Appointment[]> {
  const response = await axiosInstance.get<Appointment[]>(
    "/appointments/my",
    {
      params: status ? { status } : undefined,
    },
  );
  return response.data;
}

export async function findAppointment(id: number): Promise<Appointment> {
  const response = await axiosInstance.get<Appointment>(
    `/appointments/${id}`,
  );
  return response.data;
}

export async function cancelAppointment(
  id: number,
  reason?: string,
): Promise<Appointment> {
  const response = await axiosInstance.patch<Appointment>(
    `/appointments/${id}/cancel`,
    { reason },
  );
  return response.data;
}

export async function getAvailableSlots(
  params: AvailableSlotsParams,
): Promise<string[]> {
  const response = await axiosInstance.get<string[]>(
    "/appointments/available",
    { params },
  );
  return response.data;
}

export async function getWeekAvailability(
  params: WeekAvailabilityParams,
): Promise<WeekAvailabilityResponse> {
  const response = await axiosInstance.get<WeekAvailabilityResponse>(
    "/appointments/week-availability",
    { params },
  );
  return response.data;
}

export async function getUserStats(): Promise<UserStats> {
  const response = await axiosInstance.get<UserStats>(
    "/appointments/stats/user",
  );
  return response.data;
}

export async function getSpecialistStats(): Promise<SpecialistStats> {
  const response = await axiosInstance.get<SpecialistStats>(
    "/appointments/stats/specialist",
  );
  return response.data;
}