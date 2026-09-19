import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/users.api";
import { useDarkMode } from "../../../shared/hook/useDarkMode";

export default function ProfilePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });
  const { darkMode } = useDarkMode();

  const card = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const title = darkMode ? "text-white" : "text-gray-800";

  if (isLoading) {
    return <p className="text-gray-500">در حال بارگذاری...</p>;
  }

  if (isError) {
    return <p className="text-red-500">خطا: {error?.message}</p>;
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-l from-blue-400 via-blue-400 to-cyan-300 p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute left-24 -bottom-16 w-52 h-52 rounded-full bg-white/10" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div className="order-2 sm:order-1">
            <p className="text-blue-50 text-sm mb-2">خوش برگشتی 👋</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {data.first_name} {data.last_name}
            </h1>
            <p className="text-blue-50 text-sm" dir="ltr">
              {data.phone}
            </p>
          </div>
          {data.profile_image ? (
            <img
              src={`http://localhost:3000${data.profile_image}`}
              alt="عکس پروفایل"
              className="order-1 sm:order-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/30"
            />
          ) : (
            <div className="order-1 sm:order-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-xl sm:text-2xl font-bold border-4 border-white/30">
              {data.first_name?.[0]}
              {data.last_name?.[0]}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className={`rounded-2xl border p-5 sm:p-6 hover:shadow-md transition-shadow ${card}`}>
          <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">نوبت‌های فعال</p>
          <p className={`text-2xl font-bold ${title}`}>۰</p>
        </div>

        <div className={`rounded-2xl border p-5 sm:p-6 hover:shadow-md transition-shadow ${card}`}>
          <div className="w-11 h-11 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">خدمات انجام‌شده</p>
          <p className={`text-2xl font-bold ${title}`}>۰</p>
        </div>

        <div className={`rounded-2xl border p-5 sm:p-6 hover:shadow-md transition-shadow ${card}`}>
          <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-400 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6L12 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm mb-1">امتیاز عضویت</p>
          <p className={`text-2xl font-bold ${title}`}>—</p>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 sm:p-6 ${card}`}>
        <h3 className={`font-bold mb-6 ${title}`}>اطلاعات حساب کاربری</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">نام</span>
            <span className={`text-sm font-medium ${title}`}>{data.first_name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">نام خانوادگی</span>
            <span className={`text-sm font-medium ${title}`}>{data.last_name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">شماره تلفن</span>
            <span className={`text-sm font-medium ${title}`} dir="ltr">{data.phone}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-xs">وضعیت حساب</span>
            <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              فعال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}