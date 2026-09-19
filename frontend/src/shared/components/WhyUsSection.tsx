import clinicImage from "../../assets/image/clinic.jpg";
import { useDarkMode } from '../../shared/hook/useDarkMode';
import { homeTheme } from "../theme";

const whyUs = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
      </svg>
    ),
    title: "متخصصان مجرب و حرفه‌ای",
    description: "پزشکان و متخصصان با سال‌ها تجربه در کنار شما",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M8 12h8M8 12l8-6M8 12l8 6" />
      </svg>
    ),
    title: "تجهیزات مدرن",
    description: "جدیدترین دستگاه‌های روز دنیا با استاندارد بین‌المللی",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v6M12 3a4 4 0 0 1 4 4M12 3a4 4 0 0 0-4 4" />
        <path d="M6 21c0-4 2.5-7 6-7s6 3 6 7" />
      </svg>
    ),
    title: "محیط آرام و بهداشتی",
    description: "کلینیکی تمیز و آرامش‌بخش برای بهترین تجربه شما",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    title: "پشتیبانی آنلاین",
    description: "مشاوره رایگان قبل از نوبت و پاسخگویی سریع",
  },
];

const WhyUsSection = () => {
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  return (
    <div
      dir="rtl"
      className={`w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 py-10 sm:py-12 lg:py-16 transition-colors ${
        darkMode ? "bg-gray-900" : "bg-blue-50"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 sm:gap-10 lg:gap-16">
        <div className="w-full lg:w-1/2 order-1 lg:order-1">
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8 ${t.titleText}`}>
            چرا کلینیک ما؟
          </h2>
          <p className={`text-sm sm:text-base mb-6 sm:mb-8 leading-7 ${t.mutedText}`}>
            ما به زیبایی شما اهمیت می‌دهیم
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {whyUs.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${t.iconCircle}`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h3 className={`font-bold text-sm mb-1 ${t.titleText}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs leading-5 ${t.mutedText}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 order-2 lg:order-2">
          <img
            src={clinicImage}
            alt="clinic"
            className="w-full h-56 sm:h-72 md:h-80 lg:h-80 object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default WhyUsSection;