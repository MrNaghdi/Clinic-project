import axiosInstance from "../../../shared/api/axiosInstance";
import type { AuthUser } from "../types";

export async function sendOtp(phone: string) {
  const response = await axiosInstance.post("/auth/send-otp", {
    phone,
  });
  return response.data;
}

export async function verifyOtp(phone: string, code: string) {
  const response = await axiosInstance.post("/auth/verify-otp", {
    phone,
    code,
  });
  return response.data;
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await axiosInstance.get("/users/me");
  return data;
}

export async function logout() {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
}