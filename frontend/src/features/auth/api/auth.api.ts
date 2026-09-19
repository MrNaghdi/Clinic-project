import axiosInstance from "../../../shared/api/axiosInstance";

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
