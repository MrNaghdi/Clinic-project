import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Stethoscope,
  CircleDollarSign,
  X,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { fetchAdminAppointments } from "../api/admin.api";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

const STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تأیید شده",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  no_show: "عدم حضور",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#0ea5e9",
  completed: "#10b981",
  cancelled: "#ef4444",
  no_show: "#6b7280",
};

const STATUS_OPTIONS = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار" },
  { value: "confirmed", label: "تأیید شده" },
  { value: "completed", label: "تکمیل شده" },
  { value: "cancelled", label: "لغو شده" },
  { value: "no_show", label: "عدم حضور" },
];

export default function AdminAppointments() {
  const { darkMode } = useDarkMode();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [todayOnly, setTodayOnly] = useState(
    searchParams.get("today") === "true",
  );
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin",
      "appointments",
      { search, statusFilter, todayOnly, page },
    ],
    queryFn: () =>
      fetchAdminAppointments({
        search: search || undefined,
        status: statusFilter || undefined,
        today: todayOnly || undefined,
        page,
        limit: 15,
      }),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black mb-1">نوبت‌ها</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            {total > 0
              ? `${new Intl.NumberFormat("fa-IR").format(total)} نوبت یافت شد`
              : "مدیریت و مشاهده نوبت‌های کلینیک"}
          </p>
        </div>
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
            placeholder="جستجو بر اساس نام بیمار یا متخصص..."
            className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm font-medium outline-none ${
              darkMode
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
            }`}
          />
        </div>

        <CustomSelect
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          className="sm:w-44"
        />

        <button
          onClick={() => {
            setTodayOnly((t) => !t);
            setPage(1);
          }}
          className={`inline-flex items-center gap-2 h-11 px-4 rounded-xl border text-sm font-bold transition-colors ${
            todayOnly
              ? "bg-brand-500 border-brand-500 text-white"
              : darkMode
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Calendar size={16} />
          فقط امروز
          {todayOnly && <X size={14} />}
        </button>
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? "bg-white/[0.03] border-white/10"
            : "bg-white border-slate-200"
        }`}
      >
        {isLoading && items.length === 0 ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-14 rounded-lg animate-pulse ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className={darkMode ? "text-white/50" : "text-slate-500"}>
              نوبتی یافت نشد
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50 dark:divide-white/5">
            {items.map((a, i) => {
              const customerImg = getImageUrl(a.customer?.profile_image);
              const specialistImg = getImageUrl(
                a.specialist?.user?.profile_image,
              );
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex flex-col lg:flex-row lg:items-center gap-4 p-4 transition-colors ${
                    darkMode
                      ? "hover:bg-white/[0.02]"
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 lg:w-44 shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        darkMode ? "bg-white/5" : "bg-slate-100"
                      }`}
                    >
                      <Calendar size={16} className="text-brand-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tabular-nums">
                        {new Intl.DateTimeFormat("fa-IR", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(a.date))}
                      </p>
                      <p
                        className={`text-[11px] tabular-nums ${
                          darkMode ? "text-white/50" : "text-slate-500"
                        }`}
                      >
                        {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-1 min-w-0">
                    {customerImg ? (
                      <img
                        src={customerImg}
                        alt=""
                        loading="lazy"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-[10px] font-black">
                        {a.customer?.first_name?.[0] ?? "?"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {a.customer?.first_name} {a.customer?.last_name}
                      </p>
                      <p
                        className={`text-[10px] font-mono ${
                          darkMode ? "text-white/40" : "text-slate-400"
                        }`}
                      >
                        {a.customer?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-1 min-w-0">
                    {specialistImg ? (
                      <img
                        src={specialistImg}
                        alt=""
                        loading="lazy"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center">
                        <Stethoscope size={12} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {a.specialist?.user?.first_name}{" "}
                        {a.specialist?.user?.last_name}
                      </p>
                      <p
                        className={`text-[10px] truncate ${
                          darkMode ? "text-white/40" : "text-slate-400"
                        }`}
                      >
                        {a.service?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 lg:w-32">
                    <CircleDollarSign size={14} className="text-accent-500" />
                    <span className="text-xs font-bold tabular-nums">
                      {new Intl.NumberFormat("fa-IR").format(a.price)}
                    </span>
                  </div>

                  <div className="lg:w-28">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: STATUS_COLORS[a.status] }}
                    >
                      {STATUS_LABELS[a.status] ?? a.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
    </div>
  );
}