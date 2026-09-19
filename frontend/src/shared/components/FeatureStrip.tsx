import { useDarkMode } from '../../shared/hook/useDarkMode';
import { homeTheme } from "../theme";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
      </svg>
    ),
    title: "متخصصان مجرب و حرفه‌ای",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M8 12h8M8 12l8-6M8 12l8 6" />
      </svg>
    ),
    title: "تجهیزات مدرن و بروز",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v6M12 3a4 4 0 0 1 4 4M12 3a4 4 0 0 0-4 4" />
        <path d="M6 21c0-4 2.5-7 6-7s6 3 6 7" />
      </svg>
    ),
    title: "محیط آرام و بهداشتی",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    title: "پشتیبانی آنلاین و مشاوره قبل از نوبت",
  },
];

const FeatureStrip = () => {
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  return (
    <div
      dir="rtl"
      className={`w-full px-3 sm:px-8 lg:px-28 py-6 sm:py-8 lg:py-10 transition-colors ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 sm:gap-3 text-center"
          >
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${t.iconCircle}`}
            >
              <div className="scale-[0.7] sm:scale-90 lg:scale-100">
                {item.icon}
              </div>
            </div>
            <p
              className={`text-[10px] sm:text-xs lg:text-sm font-medium leading-4 sm:leading-5 lg:leading-6 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureStrip;