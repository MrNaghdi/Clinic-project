import { useQuery } from "@tanstack/react-query";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { fetchAdminStats } from "../api/admin.api";
import { StatsCards } from "../components/StatsCards";

export default function AdminDashboard() {
  const { darkMode } = useDarkMode();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    staleTime: 2 * 60 * 1000,  
    gcTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div
            className={`h-8 w-32 rounded-lg animate-pulse mb-2 ${
              darkMode ? "bg-white/5" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-4 w-48 rounded-lg animate-pulse ${
              darkMode ? "bg-white/5" : "bg-gray-200"
            }`}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-32 rounded-2xl animate-pulse ${
                darkMode ? "bg-white/5" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black mb-1">داشبورد</h2>
        <p
          className={`text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}
        >
          نمای کلی کلینیک — روی هر کارت کلیک کنید تا جزئیات را ببینید
        </p>
      </div>

      <StatsCards stats={stats} />
    </div>
  );
}