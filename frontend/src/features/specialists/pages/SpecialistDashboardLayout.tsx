import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Home,
  Clock,
  Award,
} from "lucide-react";
import { fetchMe } from "../../users/api/users.api";

const menuItems = [
  { label: "نمای کلی", to: "/specialist", icon: LayoutDashboard, end: true },
  { label: "نوبت‌های من", to: "/specialist/appointments", icon: Calendar },
  { label: "پروفایل من", to: "/specialist/profile", icon: User },
];

export default function SpecialistDashboardLayout() {
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
            برای دسترسی به داشبورد متخصص، وارد شوید
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
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const SidebarContent = (
    <>
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 dark:border-white/5 group"
      >
        <motion.div
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30"
        >
          <Sparkles size={20} className="text-white" fill="white" />
        </motion.div>
        <div>
          <p className="font-black text-lg text-gray-900 dark:text-white leading-none">
            SkinCare
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-1 tracking-widest">
            SPECIALIST
          </p>
        </div>
      </Link>

      {/* User Card */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6 p-4 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-brand-500/10 dark:via-ink-light dark:to-accent-500/10 border border-gray-200 dark:border-white/5"
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-3">
            {user.profile_image ? (
              <img
                src={`http://localhost:3000${user.profile_image}`}
                alt={user.first_name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-ink-light shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                دکتر {user.first_name} {user.last_name}
              </p>
              <p
                className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
                dir="ltr"
              >
                {user.phone}
              </p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-medium">
                <Award size={10} />
                متخصص
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-col gap-2 mb-6">
        <NavLink
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
        >
          <Home size={16} />
          صفحه اصلی
        </NavLink>
      </div>

      {/* Menu */}
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
                `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
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
                      layoutId="specialist-sidebar-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={
                      isActive ? "" : "group-hover:scale-110 transition-transform"
                    }
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-4 group"
      >
        <LogOut
          size={18}
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
          w-72 h-screen border-l flex flex-col px-5 py-6 shrink-0 transition-transform duration-300
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
        <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 pt-20 lg:pt-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}