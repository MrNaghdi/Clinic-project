import { useDarkMode } from "../../shared/hook/useDarkMode";
import { homeTheme } from "../theme";

const services = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8z" />
      </svg>
    ),
    title: "مراقبت پوست",
    description: "پاکسازی، جوانسازی، درمان آکنه و لکه‌ها",
    bg: "bg-pink-50",
    bgDark: "bg-pink-500/15",
    color: "text-pink-400",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 21c-4-3-7-6.5-7-10a7 7 0 0 1 14 0c0 3.5-3 7-7 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
    title: "خدمات مو",
    description: "کاشت مو، تقویت مو، درمان ریزش مو",
    bg: "bg-purple-50",
    bgDark: "bg-purple-500/15",
    color: "text-purple-400",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
      </svg>
    ),
    title: "زیبایی صورت",
    description: "تزریق ژل، بوتاکس و فرم‌دهی صورت",
    bg: "bg-rose-50",
    bgDark: "bg-rose-500/15",
    color: "text-rose-400",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 4l16 16M4 20L20 4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "لیزر موهای زائد",
    description: "لیزر پیشرفته و دائمی برای پوستی صاف",
    bg: "bg-cyan-50",
    bgDark: "bg-cyan-500/15",
    color: "text-cyan-400",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8z" />
        <path d="M12 14v7" />
      </svg>
    ),
    title: "پوست و مو",
    description: "خدمات ترکیبی برای زیبایی کامل",
    bg: "bg-indigo-50",
    bgDark: "bg-indigo-500/15",
    color: "text-indigo-400",
  },
];

const ServicesSection = () => {
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  return (
    <div
      dir="rtl"
      className={`w-full px-4 sm:px-8 lg:px-28 py-10 sm:py-12 lg:py-16 transition-colors ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="text-center mb-8 sm:mb-10">
        <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${t.titleText}`}>
          خدمات ما
        </h2>
        <p className={`text-sm sm:text-base ${t.mutedText}`}>
          با بهترین کیفیت و جدیدترین متدهای روز دنیا
        </p>
      </div>

      <div className="sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {services.map((service, index) => (
          <div
            key={index}
            className={`border mt-2 rounded-2xl p-6 flex justify-between sm:flex-col items-center text-center hover:shadow-lg transition-all ${
              darkMode
                ? "bg-linear-to-r sm:bg-linear-to-b to-gray-700 border-gray-700"
                : "bg-linear-to-l sm:bg-linear-to-t to-blue-100 border-gray-100"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                darkMode ? service.bgDark : service.bg
              } ${service.color}`}
            >
              {service.icon}
            </div>
            <div>
              <h3 className={`text-right font-bold mb-2 ${t.titleText}`}>
                {service.title}
              </h3>
              <p className={`w-44 text-sm text-right leading-6 mb-4 ${t.mutedText}`}>
                {service.description}
              </p>
              <a
                href=""
                className="text-blue-400 text-right text-sm font-medium mt-auto hover:underline"
              >
                مشاهده خدمات
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;