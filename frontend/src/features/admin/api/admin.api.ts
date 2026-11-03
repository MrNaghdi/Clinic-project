import axiosInstance from "../../../shared/api/axiosInstance";
import type {
  AdminStats,
  AdminUserFull,
  AdminService,
  AdminServiceDetail,
  AppointmentsListResponse,
  CreateServicePayload,
  UpdateServicePayload,
  PromoteSpecialistPayload,
  UsersListResponse,
  AdminSpecialist,
} from "./types";

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await axiosInstance.get("/admin/stats");
  return data;
}

// ═══════════════════════════════════════════
// کاربران
// ═══════════════════════════════════════════
export async function fetchAdminUsers(params: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<UsersListResponse> {
  const { data } = await axiosInstance.get("/admin/users", { params });
  return data;
}

export async function promoteToSpecialist(
  userId: number,
  payload: PromoteSpecialistPayload,
): Promise<AdminSpecialist> {
  const { data } = await axiosInstance.post(
    `/admin/users/${userId}/promote-specialist`,
    payload,
  );
  return data;
}

export async function demoteSpecialist(
  specialistId: number,
): Promise<{ message: string; specialist_id: number; user_id: number }> {
  const { data } = await axiosInstance.post(
    `/admin/specialists/${specialistId}/demote`,
  );
  return data;
}

export async function updateSpecialist(
  specialistId: number,
  payload: { bio?: string; is_active?: boolean },
): Promise<AdminSpecialist> {
  const { data } = await axiosInstance.patch(
    `/admin/specialists/${specialistId}`,
    payload,
  );
  return data;
}

export async function assignSpecialistServices(
  specialistId: number,
  serviceIds: number[],
): Promise<AdminSpecialist> {
  const { data } = await axiosInstance.put(
    `/admin/specialists/${specialistId}/services`,
    { service_ids: serviceIds },
  );
  return data;
}

export async function fetchAdminServices(params?: {
  search?: string;
  includeInactive?: boolean;
}): Promise<AdminService[]> {
  const { data } = await axiosInstance.get("/admin/services", { params });
  return data;
}

export async function fetchAdminService(
  id: number,
): Promise<AdminServiceDetail> {
  const { data } = await axiosInstance.get(`/admin/services/${id}`);
  return data;
}

export async function fetchServicesForSelect(): Promise<
  Array<{ id: number; name: string; price: number; duration_minutes: number }>
> {
  const { data } = await axiosInstance.get("/admin/services/select");
  return data;
}

export async function createService(
  payload: CreateServicePayload,
): Promise<AdminService> {
  const { data } = await axiosInstance.post("/admin/services", payload);
  return data;
}

export async function updateService(
  id: number,
  payload: UpdateServicePayload,
): Promise<AdminService> {
  const { data } = await axiosInstance.patch(`/admin/services/${id}`, payload);
  return data;
}

export async function deleteService(
  id: number,
  force = false,
): Promise<{ message: string; id: number }> {
  const { data } = await axiosInstance.delete(`/admin/services/${id}`, {
    params: force ? { force: "true" } : {},
  });
  return data;
}

export async function toggleServiceActive(
  id: number,
): Promise<AdminService> {
  const { data } = await axiosInstance.patch(
    `/admin/services/${id}/toggle-active`,
  );
  return data;
}

export async function uploadServiceImage(
  serviceId: number,
  file: File,
): Promise<AdminService> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post(
    `/services/${serviceId}/image`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function fetchAdmins(): Promise<AdminUserFull[]> {
  const { data } = await axiosInstance.get("/admin/admins");
  return data;
}

export async function promoteToAdmin(userId: number): Promise<AdminUserFull> {
  const { data } = await axiosInstance.post(`/admin/admins/${userId}/promote`);
  return data;
}

export async function demoteAdmin(userId: number): Promise<AdminUserFull> {
  const { data } = await axiosInstance.post(`/admin/admins/${userId}/demote`);
  return data;
}

export async function fetchAdminAppointments(params: {
  search?: string;
  status?: string;
  today?: boolean;
  page?: number;
  limit?: number;
}): Promise<AppointmentsListResponse> {
  const { data } = await axiosInstance.get("/admin/appointments", {
    params: {
      ...params,
      today: params.today ? "true" : undefined,
    },
  });
  return data;
}