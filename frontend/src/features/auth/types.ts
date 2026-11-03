export type UserRole = "super_admin" | "admin" | "customer" | "specialist";

export interface AuthUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  role: UserRole;
  profile_image: string | null;
}