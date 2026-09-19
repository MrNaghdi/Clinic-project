import { useDarkMode } from "../../../shared/hook/useDarkMode";

const appointments: {
  id: number;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}[] = [
  // نمونه؛ بعداً با API واقعی جایگزین کن
  // { id: 1, service: "مراقبت پوست", doctor: "دکتر سارا احمدی", date: "۱۴۰۴/۰۲/۱۲", time: "۱۱:۰۰", status: "upcoming" },
];

const statusMap = {
  upcoming: { label: "در انتظار", className: "bg-blue-50 text-blue-500" },
  completed: { label: "انجام‌شده", className: "bg-green-50 text-green-600" },
  cancelled: { label: "لغو‌شده", className: "bg-red-50 text-red-500" },
};

export default function AppointmentsPage() {
  const { darkMode } = useDarkMode();

  const card = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const title = darkMode ? "text-white" : "text-gray-800";
  const subText = "text-gray-500";
  const iconBox = darkMode
    ? "bg-blue-500/20 text-blue-300"
    : "bg-blue-50 text-blue-400";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${title}`}>
            نوبت‌های من
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${subText}`}>
            مدیریت نوبت‌های رزرو شده و پیشین شما
          </p>
        </div>
        <a
          href="/booking"
          className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-l from-blue-400 to-cyan-400 hover:opacity-90 transition-opacity px-5 py-2.5 rounded-full shadow-sm shadow-blue-200 w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          رزرو نوبت جدید
        </a>
      </div>

      {appointments.length === 0 ? (
        <div className={`rounded-2xl border p-8 sm:p-16 flex flex-col items-center text-center ${card}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconBox}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" />
            </svg>
          </div>
          <h3 className={`font-bold mb-2 ${title}`}>هنوز نوبتی ثبت نکرده‌اید</h3>
          <p className={`text-sm mb-6 max-w-xs ${subText}`}>
            برای دریافت بهترین خدمات زیبایی، همین حالا یک نوبت رزرو کنید
          </p>
          <a
            href="/booking"
            className="text-sm font-medium text-white bg-blue-400 hover:bg-blue-500 transition-colors px-6 py-2.5 rounded-full"
          >
            رزرو نوبت
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-shadow ${card}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBox}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 9h18M8 3v4M16 3v4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-sm mb-1 ${title}`}>{item.service}</p>
                  <p className={`text-xs ${subText}`}>{item.doctor}</p>
                </div>
              </div>

              <div className="text-center sm:text-center">
                <p className={`text-sm font-medium ${title}`}>{item.date}</p>
                <p className="text-gray-400 text-xs mt-1">{item.time}</p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full self-start sm:self-auto ${statusMap[item.status].className}`}
              >
                {statusMap[item.status].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}