import axiosInstance from "../../../shared/api/axiosInstance";

export interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
}

// ==========================================
// API Functions
// ==========================================

// GET /services
export async function findAll(): Promise<Service[]> {
  const response = await axiosInstance.get<Service[]>("/services");
  return response.data;
}

// GET /services/:id
export async function findOne(id: number): Promise<Service> {
  const response = await axiosInstance.get<Service>(`/services/${id}`);
  return response.data;
}

// POST /services
export async function createService(dto: CreateServiceDto): Promise<Service> {
  const response = await axiosInstance.post<Service>("/services", dto);
  return response.data;
}

// PATCH /services/:id
export async function updateService(
  id: number,
  dto: UpdateServiceDto,
): Promise<Service> {
  const response = await axiosInstance.patch<Service>(`/services/${id}`, dto);
  return response.data;
}

// DELETE /services/:id/
export async function deactivateService(id: number): Promise<Service> {
  const response = await axiosInstance.delete<Service>(`/services/${id}`);
  return response.data;
}