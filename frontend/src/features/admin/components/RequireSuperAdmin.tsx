import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

export function RequireSuperAdmin() {
  const { user, isLoading, token } = useCurrentUser();

  if (!token) return <Navigate to="/login" replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "super_admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}