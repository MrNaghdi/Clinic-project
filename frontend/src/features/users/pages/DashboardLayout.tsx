import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/users.api";
import logo from "../../../assets/image/logo.png";
import type { JSX } from "react/jsx-runtime";
import { useState } from "react";
import { useDarkMode } from '../../../shared/hook/useDarkMode';

const menuItems = [
  { label: "نمای کلی", to: "/profile", icon: "grid", end: true },
  { label: "نوبت‌های من", to: "/profile/appointments", icon: "calendar" },
  { label: "تاریخچه خدمات", to: "/profile/history", icon: "clock" },
  { label: "عکس پروفایل", to: "/profile/avatar", icon: "camera" }, 
  { label: "تنظیمات", to: "/profile/settings", icon: "settings" },
];

const MenuIcon = ({ type }: { type: string }) => {
  const icons: Record<string, JSX.Element> = {
    grid: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    calendar: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    ),
    clock: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    camera: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
      </svg>
    ),
  };
  return icons[type] ?? null;
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const theme = darkMode
    ? {
        pageBg: "bg-gray-900",
        sidebar: "bg-gray-800 border-gray-700",
        brandTitle: "text-white",
        brandSub: "text-gray-400",
        userName: "text-white",
        userPhone: "text-gray-400",
        divider: "border-gray-700",
        navIdle: "text-gray-300 hover:bg-gray-700",
        navActive: "bg-blue-500/20 text-blue-300",
        logout: "text-red-400 hover:bg-red-500/10",
        mobileBtn: "bg-gray-800 text-white",
        overlay: "bg-black/50",
      }
    : {
        pageBg: "bg-gray-50",
        sidebar: "bg-white border-gray-100",
        brandTitle: "text-gray-800",
        brandSub: "text-gray-400",
        userName: "text-gray-800",
        userPhone: "text-gray-400",
        divider: "border-gray-100",
        navIdle: "text-gray-500 hover:bg-gray-50",
        navActive: "bg-blue-50 text-blue-500",
        logout: "text-red-400 hover:bg-red-50",
        mobileBtn: "bg-white text-gray-800",
        overlay: "bg-black/40",
      };

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 mb-8">
        <img src={logo} alt="SkinCare" className="w-9 h-9" />
        <div>
          <p className={`font-bold text-sm leading-4 ${theme.brandTitle}`}>
            SkinCare
          </p>
          <p className={`text-xs leading-4 ${theme.brandSub}`}>
            Beauty Clinic
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <NavLink
          to="/booking"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-l from-blue-400 to-cyan-400 hover:opacity-90 transition-opacity py-2.5 rounded-full shadow-sm shadow-blue-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          رزرو نوبت جدید
        </NavLink>
        <NavLink
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-l from-blue-400 to-cyan-400 hover:opacity-90 transition-opacity py-2.5 rounded-full shadow-sm shadow-blue-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 19l-7-7 7-7" />
            <path d="M3 12h18" />
          </svg>
          بازگشت به صفحه اصلی
        </NavLink>
      </div>

      {data && (
        <div className={`flex items-center gap-3 mb-6 pb-6 border-b ${theme.divider}`}>
          {data.profile_image ? (
            <img
              src={`http://localhost:3000${data.profile_image}`}
              alt="عکس پروفایل"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-300 to-cyan-300 text-white flex items-center justify-center font-bold">
              {data.first_name?.[0]}
              {data.last_name?.[0]}
            </div>
          )}
          <div className="min-w-0">
            <p className={`font-bold text-sm truncate ${theme.userName}`}>
              {data.first_name} {data.last_name}
            </p>
            <p className={`text-xs ${theme.userPhone}`} dir="ltr">
              {data.phone}
            </p>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? theme.navActive : theme.navIdle
              }`
            }
          >
            <MenuIcon type={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer mt-4 ${theme.logout}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
        خروج از حساب
      </button>
    </>
  );

  return (
    <div
      dir="rtl"
      className={`w-full min-h-screen flex ${theme.pageBg} transition-colors`}
    >
      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="باز کردن منو"
        className={`lg:hidden fixed top-4 right-4 z-40 w-11 h-11 rounded-xl shadow-md flex items-center justify-center ${theme.mobileBtn}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className={`lg:hidden fixed inset-0 z-40 ${theme.overlay}`}
        />
      )}

      <aside
        className={`
          fixed lg:sticky lg:top-0 right-0 top-0 z-50
          w-72 h-screen border-l flex flex-col px-6 py-8 shrink-0 transition-transform duration-300
          ${theme.sidebar}
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="بستن منو"
          className={`lg:hidden absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center ${theme.navIdle}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {SidebarContent}
        </div>
      </aside>

      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pt-20 lg:pt-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}