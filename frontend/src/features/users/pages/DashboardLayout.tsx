import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Camera,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Home,
  Star,
  FileText,
} from "lucide-react";
import { fetchMe } from "../api/users.api";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

const menuItems = [
  { label: "نمای کلی", to: "/profile", icon: LayoutDashboard, end: true },
  { label: "نوبت‌های من", to: "/profile/appointments", icon: Calendar },
  { to: "/profile/reviews", label: "نظرات من", icon: Star },
  { to: "/profile/tickets", label: "تیکت‌های من", icon: FileText },
  { label: "تاریخچه خدمات", to: "/profile/history", icon: Clock },
  { label: "عکس پروفایل", to: "/profile/avatar", icon: Camera },
  { label: "تنظیمات", to: "/profile/settings", icon: Settings },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isError) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-ink p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
            <LogOut size={36} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            نیاز به لاگین دارید
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            برای دسترسی به داشبورد، ابتدا وارد حساب کاربری خود شوید
          </p>
          <Link to="/login">
            <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all">
              ورود به حساب
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-ink">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  const avatarUrl = getImageUrl(user?.profile_image ?? null);

  const SidebarContent = (
    <>
      <Link
        to="/"
        className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-200 dark:border-white/5 group"
      >
        <motion.div
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30"
        >
          <Sparkles size={18} className="text-white" fill="white" />
        </motion.div>
        <div>
          <p className="font-black text-base text-gray-900 dark:text-white leading-none">
            SkinCare
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-1 tracking-widest">
            PANEL
          </p>
        </div>
      </Link>

      {user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-5 p-3 rounded-xl overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-brand-500/10 dark:via-ink-light dark:to-accent-500/10 border border-gray-200 dark:border-white/5"
        >
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-brand-500/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.first_name ?? ""}
                className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-ink-light shadow-md shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                {user.first_name?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {user.first_name} {user.last_name}
              </p>
              <p
                className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 font-mono"
                dir="ltr"
              >
                {user.phone}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 mb-5">
        <NavLink
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 text-xs font-semibold py-2 px-4 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
        >
          <Home size={14} />
          صفحه اصلی
        </NavLink>
        <NavLink
          to="/booking"
          onClick={() => setSidebarOpen(false)}
          className="group relative flex items-center justify-center gap-2 text-xs font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          <Calendar size={14} className="relative" />
          <span className="relative">رزرو نوبت</span>
        </NavLink>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform"
                    }
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-3 group"
      >
        <LogOut
          size={17}
          className="group-hover:translate-x-1 transition-transform"
        />
        خروج از حساب
      </button>
    </>
  );

  return (
    <div dir="rtl" className="min-h-screen flex bg-gray-50 dark:bg-ink">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 w-11 h-11 rounded-xl bg-white dark:bg-ink-light shadow-lg border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300"
        aria-label="باز کردن منو"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed lg:sticky lg:top-0 right-0 top-0 z-50
          w-64 h-screen border-l flex flex-col px-4 py-5 shrink-0 transition-transform duration-300
          bg-white dark:bg-ink-light border-gray-200 dark:border-white/5
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          aria-label="بستن منو"
        >
          <X size={18} />
        </button>

        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {SidebarContent}
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}