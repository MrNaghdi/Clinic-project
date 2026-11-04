import axiosInstance from "../../../shared/api/axiosInstance";

export enum SpecialistStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export interface SpecialistUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  profile_image: string | null;
  role: string;
}

export interface WorkingHours {
  id: number;
  specialist_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface WorkingHoursInput {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Specialist {
  id: number;
  user_id: number;
  user?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    phone: string;
    profile_image: string | null;
  } | null;
  bio: string | null;
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  rating: number;
  review_count: number;
  services?: Array<{
    id: number;
    name: string;
    duration_minutes: number;
    price: number;
    image: string | null;
  }>;
  working_hours?: Array<{
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface CreateSpecialistDto {
  user_id: number;
  bio?: string;
}

// ═══════════════════════════════════════
// API Functions
// ═══════════════════════════════════════

export async function findAllSpecialists(): Promise<Specialist[]> {
  const response = await axiosInstance.get<Specialist[]>("/specialists");
  return response.data;
}

export async function findOneSpecialist(id: number): Promise<Specialist> {
  const response = await axiosInstance.get<Specialist>(`/specialists/${id}`);
  return response.data;
}

export async function findMySpecialist(): Promise<Specialist> {
  const response = await axiosInstance.get<Specialist>("/specialists/me");
  return response.data;
}

export async function createSpecialist(
  dto: CreateSpecialistDto,
): Promise<Specialist> {
  const response = await axiosInstance.post<Specialist>("/specialists", dto);
  return response.data;
}

export async function updateMySpecialistProfile(dto: {
  bio?: string;
}): Promise<Specialist> {
  const response = await axiosInstance.patch<Specialist>(
    "/specialists/me",
    dto,
  );
  return response.data;
}

export async function updateMySpecialistServices(
  service_ids: number[],
): Promise<Specialist> {
  const response = await axiosInstance.patch<Specialist>(
    "/specialists/me/services",
    { service_ids },
  );
  return response.data;
}

export async function updateMyWorkingHours(
  working_hours: WorkingHoursInput[],
): Promise<Specialist> {
  const response = await axiosInstance.patch<Specialist>(
    "/specialists/me/working-hours",
    { working_hours },
  );
  return response.data;
}