import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../../features/users/api/users.api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const token =
    typeof window !== "undefined" && localStorage.getItem("token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-ink">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}