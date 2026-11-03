import { motion } from "framer-motion";
import { NavLink, Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scissors,
  ShieldCheck,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

const baseLinks = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "کاربران", icon: Users, end: false },
  { to: "/admin/services", label: "خدمات", icon: Scissors, end: false },
  { to: "/admin/appointments", label: "نوبت‌ها", icon: CalendarDays, end: false },
];

const superAdminLinks = [
  { to: "/admin/admins", label: "ادمین‌ها", icon: ShieldCheck, end: false },
];

export function AdminLayout() {
  const { darkMode } = useDarkMode();
  const { user } = useCurrentUser();

  const isSuperAdmin = user?.role === "super_admin";
  const links = isSuperAdmin ? [...baseLinks, ...superAdminLinks] : baseLinks;

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex ${
        darkMode ? "bg-[#08060f] text-white" : "bg-[#faf9f6] text-slate-900"
      }`}
    >
      <aside
        className={`w-64 shrink-0 border-l p-5 flex flex-col ${
          darkMode ? "bg-[#0c0a14] border-white/5" : "bg-white border-slate-200"
        }`}
      >
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:opacity-80"
          >
            <ArrowRight size={16} />
            بازگشت به سایت
          </Link>
          <h1 className="mt-4 text-xl font-black">پنل مدیریت</h1>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-white/40" : "text-slate-500"
            }`}
          >
            {isSuperAdmin ? "سوپر ادمین" : "ادمین"} — کلینیک زیبایی
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/25"
                    : darkMode
                    ? "text-white/70 hover:bg-white/5"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}