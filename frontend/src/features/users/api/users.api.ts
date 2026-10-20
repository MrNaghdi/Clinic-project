import axiosInstance from "../../../shared/api/axiosInstance";

export async function fetchMe() {
  const res = await axiosInstance.get("/users/me");
  return res.data;
}

export async function completeProfile(firstName: string, lastName: string) {
  const res = await axiosInstance.patch("/users/me", {
    first_name: firstName,
    last_name: lastName,
  });
  return res.data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosInstance.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}