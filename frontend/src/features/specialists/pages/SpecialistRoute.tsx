import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../../users/api/users.api";

export default function SpecialistRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
    enabled: !!token,
    retry: false,
  });

  if (!token) return <Navigate to="/login" replace />;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
      </div>
    );
  }

  const allowed = ["specialist", "admin", "super_admin"];

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}