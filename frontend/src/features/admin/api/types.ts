export type AdminRole = "super_admin" | "admin" | "customer" | "specialist";

export interface AdminService {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  specialists_count?: number;
}

export interface AdminServiceDetail extends AdminService {
  specialists: Array<{ id: number; user_id: number; name: string }>;
}

export interface AdminSpecialist {
  id: number;
  user_id: number;
  bio: string | null;
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  services: AdminService[];
}

export interface AdminUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  role: AdminRole;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  specialist: AdminSpecialist | null;
}

export interface AdminUserFull {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  role: AdminRole;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsersListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminStats {
  counts: {
    customers: number;
    admins: number;
    specialists_active: number;
    specialists_total: number;
    services: number;
    appointments: number;
  };
  appointments_by_status: Record<string, number>;
  upcoming_appointments: number;
  today_appointments: number;
  total_revenue: number;
  top_services: Array<{ id: number; name: string; appointments: number }>;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface AdminAppointment {
  id: number;
  customer_id: number;
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    phone: string;
    profile_image: string | null;
  } | null;
  specialist_id: number;
  specialist: {
    id: number;
    user_id: number;
    user: {
      first_name: string | null;
      last_name: string | null;
      profile_image: string | null;
    } | null;
  } | null;
  service_id: number;
  service: { id: number; name: string } | null;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  price: number;
  duration_minutes: number;
  notes: string | null;
  created_at: string;
}

export interface AppointmentsListResponse {
  items: AdminAppointment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  image?: string;
  duration_minutes: number;
  price: number;
  is_active?: boolean;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  image?: string;
  duration_minutes?: number;
  price?: number;
  is_active?: boolean;
}

export interface PromoteSpecialistPayload {
  bio?: string;
  service_ids?: number[];
}