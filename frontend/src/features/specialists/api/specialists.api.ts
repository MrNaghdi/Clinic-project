import axiosInstance from "../../../shared/api/axiosInstance";
import type { Service } from "../../services/api/services.api";

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
  day_of_week: number | string;  
  start_time: string;
  end_time: string;
}

export interface Specialist {
  id: number;
  user_id: number;
  user: SpecialistUser;
  bio: string | null;
  status: SpecialistStatus;
  is_active: boolean;
  working_hours?: WorkingHours[];   
  services?: Service[];
  created_at: string;
  updated_at: string;
}

export interface CreateSpecialistDto {
  user_id: number;
  bio?: string;
}

export interface UpdateSpecialistDto {
  bio?: string;
  is_active?: boolean;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

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