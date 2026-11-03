import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, UserPlus, UserMinus, Shield } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  fetchAdminUsers,
  demoteSpecialist,
} from "../api/admin.api";
import type { AdminUser } from "../api/types";
import { PromoteModal } from "../components/PromoteModal";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { useQueryClient } from "@tanstack/react-query";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "سوپر ادمین",
  admin: "ادمین",
  specialist: "متخصص",
  customer: "مشتری",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "#ef4444",
  admin: "#8b5cf6",
  specialist: "#0ea5e9",
  customer: "#10b981",
};

const ROLE_OPTIONS = [
  { value: "", label: "همه نقش‌ها" },
  { value: "customer", label: "مشتری" },
  { value: "specialist", label: "متخصص" },
  { value: "admin", label: "ادمین" },
  { value: "super_admin", label: "سوپر ادمین" },
];

export default function AdminUsers() {
  const { darkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "",
  );
  const [page, setPage] = useState(1);
  const [promoteTarget, setPromoteTarget] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { search, roleFilter, page }],
    queryFn: () =>
      fetchAdminUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        page,
        limit: 15,
      }),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const users = data?.items ?? [];
  const pages = data?.pages ?? 1;

  const handleDemote = async (user: AdminUser) => {
    if (!user.specialist) return;
    if (
      !window.confirm(
        `آیا مطمئنی می‌خوای نقش متخصص ${user.first_name} ${user.last_name} رو لغو کنی؟`,
      )
    )
      return;

    try {
      await demoteSpecialist(user.specialist.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "خطا در لغو نقش");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black mb-1">کاربران</h2>
        <p
          className={`text-sm ${darkMode ? "text-white/50" : "text-slate-500"}`}
        >
          مدیریت کاربران، متخصصان و ادمین‌ها
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-white/40" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="جستجو بر اساس نام یا شماره تلفن..."
            className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm font-medium outline-none ${
              darkMode
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
            }`}
          />
        </div>

        <CustomSelect
          value={roleFilter}
          onChange={(v) => {
            setRoleFilter(v);
            setPage(1);
          }}
          options={ROLE_OPTIONS}
          className="sm:w-48"
        />
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? "bg-white/[0.03] border-white/10"
            : "bg-white border-slate-200"
        }`}
      >
        {isLoading && !data ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-12 rounded-lg animate-pulse ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className={darkMode ? "text-white/50" : "text-slate-500"}>
              کاربری یافت نشد
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr
                className={`border-b ${
                  darkMode
                    ? "border-white/10 text-white/50"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <th className="text-right p-4 font-bold">کاربر</th>
                <th className="text-right p-4 font-bold">شماره</th>
                <th className="text-right p-4 font-bold">نقش</th>
                <th className="text-right p-4 font-bold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const img = getImageUrl(u.profile_image);
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b last:border-0 transition-colors ${
                      darkMode
                        ? "border-white/5 hover:bg-white/[0.02]"
                        : "border-slate-100 hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display =
                                "none";
                              e.currentTarget.parentElement
                                ?.querySelector(".fallback-avatar")
                                ?.classList.remove("hidden");
                            }}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                          />
                        ) : null}
                        <div
                          className={`fallback-avatar ${
                            img ? "hidden" : ""
                          } w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-xs font-black`}
                        >
                          {u.first_name?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="font-bold">
                            {u.first_name} {u.last_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs tabular-nums">
                      {u.phone}
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: ROLE_COLORS[u.role] }}
                      >
                        {u.role === "admin" || u.role === "super_admin" ? (
                          <Shield size={10} />
                        ) : null}
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.role === "customer" && (
                        <button
                          onClick={() => setPromoteTarget(u)}
                          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold hover:opacity-90"
                        >
                          <UserPlus size={12} />
                          ارتقا به متخصص
                        </button>
                      )}
                      {u.role === "specialist" && u.specialist && (
                        <button
                          onClick={() => handleDemote(u)}
                          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/10"
                        >
                          <UserMinus size={12} />
                          لغو نقش
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                page === i + 1
                  ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                  : darkMode
                  ? "bg-white/5 text-white/60 hover:bg-white/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {promoteTarget && (
        <PromoteModal
          user={promoteTarget}
          onClose={() => setPromoteTarget(null)}
          onSuccess={() => {
            setPromoteTarget(null);
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
          }}
        />
      )}
    </div>
  );
}