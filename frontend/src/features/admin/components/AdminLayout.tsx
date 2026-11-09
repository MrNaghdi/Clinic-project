import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scissors,
  ShieldCheck,
  CalendarDays,
  Star,
  ArrowRight,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

const baseLinks = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "کاربران", icon: Users, end: false },
  { to: "/admin/services", label: "خدمات", icon: Scissors, end: false },
  {
    to: "/admin/appointments",
    label: "نوبت‌ها",
    icon: CalendarDays,
    end: false,
  },
  { to: "/admin/reviews", label: "نظرات", icon: Star, end: false },
  {
    to: "/admin/messages",
    label: "تیکت‌ها",
    icon: MessageSquare,
    end: false,
  },
];

const superAdminLinks = [
  { to: "/admin/admins", label: "ادمین‌ها", icon: ShieldCheck, end: false },
];

export function AdminLayout() {
  const { darkMode } = useDarkMode();
  const { user } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";
  const links = isSuperAdmin
    ? [...baseLinks, ...superAdminLinks]
    : baseLinks;

  const SidebarContent = (
    <>
      <div className="mb-8 flex items-start justify-between">
        <div>
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
        <button
          onClick={() => setSidebarOpen(false)}
          className={`lg:hidden w-9 h-9 rounded-lg flex items-center justify-center ${
            darkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
          }`}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setSidebarOpen(false)}
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
    </>
  );

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex ${
        darkMode ? "bg-[#08060f] text-white" : "bg-[#faf9f6] text-slate-900"
      }`}
    >
      <aside
        className={`hidden lg:flex w-64 shrink-0 border-l p-5 flex-col ${
          darkMode
            ? "bg-[#0c0a14] border-white/5"
            : "bg-white border-slate-200"
        }`}
      >
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-72 p-5 flex flex-col overflow-y-auto ${
                darkMode
                  ? "bg-[#0c0a14] border-l border-white/5"
                  : "bg-white border-l border-slate-200"
              }`}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0">
        <div
          className={`lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b backdrop-blur-md ${
            darkMode
              ? "bg-[#08060f]/80 border-white/10"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <h1 className="text-base font-black">پنل مدیریت</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-10 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}