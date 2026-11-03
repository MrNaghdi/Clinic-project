import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Stethoscope,
  Scissors,
  CalendarDays,
  TrendingUp,
  Clock,
  ChevronDown,
  ArrowLeft,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import type { AdminStats } from "../api/types";

const fmt = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
const fmtMoney = (n: number) =>
  new Intl.NumberFormat("fa-IR").format(n) + " تومان";

type StatKey =
  | "customers"
  | "specialists"
  | "services"
  | "appointments"
  | "today"
  | "revenue";

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

export function StatsCards({ stats }: { stats: AdminStats }) {
  const { darkMode } = useDarkMode();
  const [openKey, setOpenKey] = useState<StatKey | null>(null);

  const cards: Array<{
    key: StatKey;
    label: string;
    value: string;
    icon: React.ElementType;
    color: string;
  }> = [
    { key: "customers", label: "مشتریان", value: fmt(stats.counts.customers), icon: Users, color: "#8b5cf6" },
    { key: "specialists", label: "متخصصان فعال", value: fmt(stats.counts.specialists_active), icon: Stethoscope, color: "#0ea5e9" },
    { key: "services", label: "خدمات", value: fmt(stats.counts.services), icon: Scissors, color: "#ec4899" },
    { key: "appointments", label: "کل نوبت‌ها", value: fmt(stats.counts.appointments), icon: CalendarDays, color: "#f59e0b" },
    { key: "today", label: "نوبت امروز", value: fmt(stats.today_appointments), icon: Clock, color: "#10b981" },
    { key: "revenue", label: "درآمد کل", value: fmtMoney(stats.total_revenue), icon: TrendingUp, color: "#6366f1" },
  ];

  const header: Record<StatKey, { title: string; desc: string; link?: string }> = {
    customers: {
      title: "مشتریان",
      desc: `${fmt(stats.counts.customers)} کاربر عادی در سیستم`,
      link: "/admin/users?role=customer",
    },
    specialists: {
      title: "متخصصان فعال",
      desc: `${fmt(stats.counts.specialists_active)} از ${fmt(stats.counts.specialists_total)} متخصص فعال هستند`,
      link: "/admin/users?role=specialist",
    },
    services: {
      title: "خدمات",
      desc: `${fmt(stats.counts.services)} خدمت تعریف شده`,
      link: "/admin/services",
    },
    appointments: {
      title: "کل نوبت‌ها",
      desc: `${fmt(stats.counts.appointments)} نوبت ثبت شده`,
      link: "/admin/appointments",
    },
    today: {
      title: "نوبت امروز",
      desc: `${fmt(stats.today_appointments)} نوبت برای امروز`,
      link: "/admin/appointments?today=true",
    },
    revenue: {
      title: "درآمد کل",
      desc: `${fmtMoney(stats.total_revenue)} از نوبت‌های تکمیل‌شده`,
      link: "/admin/appointments?status=completed",
    },
  };

  const toggle = (k: StatKey) => {
    setOpenKey((prev) => (prev === k ? null : k));
  };

  const totalAppointments = Object.values(
    stats.appointments_by_status,
  ).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const isOpen = openKey === c.key;
          return (
            <motion.button
              key={c.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{ y: -2 }}
              onClick={() => toggle(c.key)}
              className={`relative rounded-2xl p-5 border overflow-hidden text-right transition-colors ${
                isOpen
                  ? darkMode
                    ? "bg-white/[0.06] border-brand-500/40"
                    : "bg-brand-50/50 border-brand-500/40"
                  : darkMode
                  ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: c.color }}
              />

              <div className="relative flex items-center justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{
                    backgroundColor: c.color,
                    boxShadow: `0 8px 20px -8px ${c.color}`,
                  }}
                >
                  <c.icon size={20} />
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  } ${darkMode ? "text-white/40" : "text-slate-400"}`}
                />
              </div>

              <p
                className={`relative text-xs font-bold ${
                  darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                {c.label}
              </p>
              <p className="relative text-xl font-black mt-1 tabular-nums">
                {c.value}
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {openKey && (
          <motion.div
            key={openKey}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className={`rounded-2xl border p-6 ${
                darkMode
                  ? "bg-white/[0.03] border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h3
                    className={`text-lg font-black mb-1 ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {header[openKey].title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    {header[openKey].desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {header[openKey].link && (
                    <Link
                      to={header[openKey].link!}
                      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold hover:opacity-90"
                    >
                      مشاهده کامل
                      <ArrowLeft size={12} />
                    </Link>
                  )}
                  <button
                    onClick={() => setOpenKey(null)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      darkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {(openKey === "appointments" || openKey === "today") && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {Object.entries(stats.appointments_by_status).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className={`rounded-xl p-3 text-center ${
                            darkMode
                              ? "bg-white/[0.04] border border-white/[0.08]"
                              : "bg-slate-50 border border-slate-200"
                          }`}
                        >
                          <div
                            className="w-2 h-2 rounded-full mx-auto mb-2"
                            style={{ backgroundColor: STATUS_COLORS[status] }}
                          />
                          <p
                            className={`text-base font-black tabular-nums ${
                              darkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {count}
                          </p>
                          <p
                            className={`text-[10px] ${
                              darkMode ? "text-white/50" : "text-slate-500"
                            }`}
                          >
                            {STATUS_LABELS[status] ?? status}
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  <div
                    className={`h-2 rounded-full overflow-hidden flex ${
                      darkMode ? "bg-white/10" : "bg-slate-200"
                    }`}
                  >
                    {Object.entries(stats.appointments_by_status).map(
                      ([status, count]) => {
                        const pct = totalAppointments
                          ? (count / totalAppointments) * 100
                          : 0;
                        return (
                          <motion.div
                            key={status}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ backgroundColor: STATUS_COLORS[status] }}
                          />
                        );
                      },
                    )}
                  </div>
                </div>
              )}

              {openKey === "revenue" && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div
                      className={`rounded-xl p-4 text-center ${
                        darkMode
                          ? "bg-white/[0.04] border border-white/[0.08]"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <p className="text-[10px] font-bold mb-1 text-green-500">
                        کل درآمد
                      </p>
                      <p
                        className={`text-sm font-black tabular-nums ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {fmtMoney(stats.total_revenue)}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl p-4 text-center ${
                        darkMode
                          ? "bg-white/[0.04] border border-white/[0.08]"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <p className="text-[10px] font-bold mb-1 text-brand-500">
                        تکمیل شده
                      </p>
                      <p
                        className={`text-sm font-black tabular-nums ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats.appointments_by_status.completed ?? 0}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl p-4 text-center ${
                        darkMode
                          ? "bg-white/[0.04] border border-white/[0.08]"
                          : "bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <p className="text-[10px] font-bold mb-1 text-accent-500">
                        میانگین
                      </p>
                      <p
                        className={`text-sm font-black tabular-nums ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats.appointments_by_status.completed
                          ? fmtMoney(
                              Math.round(
                                stats.total_revenue /
                                  stats.appointments_by_status.completed,
                              ),
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {stats.top_services.length > 0 && (
                    <div>
                      <p
                        className={`text-xs font-bold mb-2 ${
                          darkMode ? "text-white/60" : "text-slate-600"
                        }`}
                      >
                        پرفروش‌ترین خدمات
                      </p>
                      <div className="space-y-2">
                        {stats.top_services.map((s, i) => (
                          <div key={s.id} className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${
                                darkMode
                                  ? "bg-white/5 text-white/60"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span
                              className={`flex-1 text-xs font-bold ${
                                darkMode ? "text-white/80" : "text-slate-700"
                              }`}
                            >
                              {s.name}
                            </span>
                            <span className="text-xs tabular-nums text-brand-500 font-bold">
                              {s.appointments} نوبت
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(openKey === "customers" ||
                openKey === "specialists" ||
                openKey === "services") && (
                <p
                  className={`text-xs ${
                    darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  برای مشاهده لیست کامل، روی «مشاهده کامل» کلیک کنید.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}