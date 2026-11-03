import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../../users/api/users.api";

export function useCurrentUser() {
  const token =
    typeof window !== "undefined" && localStorage.getItem("token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
    enabled: !!token,
    retry: false,
    staleTime: 10 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,    
  });

  return { user: user ?? null, isLoading, token };
}