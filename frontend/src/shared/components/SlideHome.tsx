import { useState, useEffect, useCallback } from "react";
import banner1 from "../../assets/image/baner.png";
import { useDarkMode } from '../../shared/hook/useDarkMode';

const slides = [
  {
    image: banner1,
    title: (
      <>
        مراقبت حرفه‌ای،
        <br /> زیبایی طبیعی
      </>
    ),
    description: (
      <>
        تجربه‌ای متفاوت از خدمات زیبایی و درمانی
        <br />
        با بهترین متخصصان و جدیدترین تجهیزات
      </>
    ),
  },
  {
    image: banner1,
    title: <>پوست شما، اولویت ما</>,
    description: (
      <>
        مراقبت تخصصی پوست با جدیدترین دستگاه‌ها
        <br />
        توسط پزشکان مجرب و متخصص
      </>
    ),
  },
  {
    image: banner1,
    title: <>لیزر و رفع موهای زائد</>,
    description: (
      <>
        نتیجه‌ای ماندگار و بدون درد
        <br />
        با دستگاه‌های روز دنیا
      </>
    ),
  },
];

const SlideHome = () => {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const { darkMode } = useDarkMode();

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
    setAnimKey((prev) => prev + 1);
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const arrowClass = `absolute top-1/2 -translate-y-1/2 z-30 w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center shadow cursor-pointer transition-colors ${
    darkMode
      ? "bg-gray-800/80 hover:bg-gray-700 text-white"
      : "bg-white/80 hover:bg-white text-gray-800"
  }`;

  return (
    <div
      dir="rtl"
      className={`relative w-full overflow-hidden transition-colors ${
        darkMode
          ? "bg-linear-to-r from-gray-500 via-gray-700 to-gray-900"
          : "bg-linear-to-r from-blue-50 to-blue-300"
      }`}
    >
      <style>
        {`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .slide-animate { animation: fadeSlideIn 0.6s ease forwards; }
          .fade-animate { animation: fadeIn 0.8s ease forwards; }
        `}
      </style>

      <button onClick={goNext} className={`${arrowClass} right-2 lg:right-4`} aria-label="قبلی">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <button onClick={goPrev} className={`${arrowClass} left-2 lg:left-4`} aria-label="بعدی">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="relative lg:hidden min-h-[520px] sm:min-h-[480px] flex items-end">
        <img
          key={`mobile-img-${animKey}`}
          src={slides[current].image}
          alt="banner"
          className="fade-animate absolute inset-0 w-full h-full object-cover"
        />

        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-t from-black/95 via-black/70 to-black/40"
              : "bg-gradient-to-t from-black/85 via-black/50 to-black/10"
          }`}
        />

        <div
          key={`mobile-text-${animKey}`}
          className="slide-animate relative z-10 w-full px-5 sm:px-8 pb-10 sm:pb-12 pt-24"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-3 sm:mb-4 drop-shadow-lg">
            {slides[current].title}
          </p>

          <p className="text-gray-200 text-sm sm:text-base text-center leading-6 sm:leading-7 mb-6 sm:mb-7 drop-shadow">
            {slides[current].description}
          </p>

          <div className="flex justify-center items-center gap-3">
            <a
              href=""
              className="hidden sm:inline-flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/40 text-white w-36 h-11 rounded-full text-sm hover:bg-white/25 transition-colors"
            >
              مشاهده متخصصان
            </a>
            <a
              href=""
              className="inline-flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white w-32 sm:w-36 h-11 rounded-full text-sm transition-colors shadow-lg shadow-blue-500/30"
            >
              رزرو نوبت
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex px-16 xl:px-28 h-96 items-center justify-between">
        <div
          key={`desktop-img-${animKey}`}
          className="slide-animate flex items-center shrink-0"
        >
          <img
            src={slides[current].image}
            alt="banner"
            className="w-[380px] xl:w-[420px] h-auto object-contain"
          />
        </div>

        <div key={`desktop-text-${animKey}`} className="slide-animate max-w-xl">
          <p
            className={`text-3xl font-bold text-right mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {slides[current].title}
          </p>

          <p
            className={`text-lg text-right leading-8 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {slides[current].description}
          </p>

          <div className="flex justify-start items-center gap-4 mt-6">
            <a
              href=""
              className={`inline-flex items-center justify-center w-40 h-12 rounded-full border-2 text-base transition-colors ${
                darkMode
                  ? "bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  : "bg-white border-blue-400 text-blue-400 hover:bg-blue-50"
              }`}
            >
              مشاهده متخصصان
            </a>
            <a
              href=""
              className="inline-flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white w-40 h-12 rounded-full text-base transition-colors"
            >
              رزرو نوبت
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row-reverse gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              index === current
                ? "bg-blue-500 w-6"
                : darkMode
                ? "bg-gray-600 hover:bg-gray-500 w-2.5"
                : "bg-white/70 hover:bg-white w-2.5"
            }`}
            aria-label={`اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideHome;