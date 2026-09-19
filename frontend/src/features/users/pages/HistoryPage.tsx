import { useDarkMode } from "../../../shared/hook/useDarkMode";

const history: {
  id: number;
  service: string;
  doctor: string;
  date: string;
}[] = [];

export default function HistoryPage() {
  const { darkMode } = useDarkMode();

  const card = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const title = darkMode ? "text-white" : "text-gray-800";
  const subText = "text-gray-500";
  const iconBox = "bg-purple-50 text-purple-400";
  const timeline = darkMode ? "before:bg-gray-700" : "before:bg-gray-100";

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold ${title}`}>
          تاریخچه خدمات
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${subText}`}>
          مروری بر خدماتی که تاکنون دریافت کرده‌اید
        </p>
      </div>

      {history.length === 0 ? (
        <div className={`rounded-2xl border p-8 sm:p-16 flex flex-col items-center text-center ${card}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${iconBox}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </div>
          <h3 className={`font-bold mb-2 ${title}`}>تاریخچه‌ای وجود ندارد</h3>
          <p className={`text-sm max-w-xs ${subText}`}>
            بعد از دریافت خدمات، تاریخچه‌ی آن‌ها اینجا نمایش داده می‌شود
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl border p-4 sm:p-8 ${card}`}>
          <div
            className={`relative flex flex-col gap-8 before:absolute before:top-2 before:bottom-2 before:right-[7px] before:w-0.5 ${timeline}`}
          >
            {history.map((item) => (
              <div key={item.id} className="relative flex items-start gap-4 pr-6">
                <span className="absolute right-0 top-1.5 w-4 h-4 rounded-full bg-blue-400 border-4 border-blue-50" />
                <div>
                  <p className={`font-bold text-sm mb-1 ${title}`}>
                    {item.service}
                  </p>
                  <p className={`text-xs mb-1 ${subText}`}>{item.doctor}</p>
                  <p className="text-gray-400 text-xs">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}