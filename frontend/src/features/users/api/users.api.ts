import axiosInstance from "../../../shared/api/axiosInstance";

export async function fetchMe() {
  const response = await axiosInstance.get("/users/me");
  return response.data;
}

export async function completeProfile(firstName: string, lastName: string) {
  const response = await axiosInstance.patch("/users/me", {
    first_name: firstName,
    last_name: lastName,
  });
  return response.data;
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file); 

  const response = await axiosInstance.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}