import { useRef } from "react";
import doctor1 from "../../assets/image/doctor1.jpg";
import { useDarkMode } from "../../shared/hook/useDarkMode";
import { homeTheme } from "../theme";

const doctors = [
  { image: doctor1, name: "دکتر سارا احمدی", specialty: "متخصص پوست و زیبایی", rating: 4.9 },
  { image: doctor1, name: "دکتر علی رضایی", specialty: "متخصص پوست و مو", rating: 4.8 },
  { image: doctor1, name: "دکتر مریم حسینی", specialty: "متخصص لیزر و زیبایی", rating: 4.7 },
  { image: doctor1, name: "دکتر محمد کریمی", specialty: "متخصص جراحی زیبایی", rating: 4.9 },
  { image: doctor1, name: "دکتر محمد کریمی", specialty: "متخصص جراحی زیبایی", rating: 4.9 },
  { image: doctor1, name: "دکتر محمد کریمی", specialty: "متخصص جراحی زیبایی", rating: 4.9 },
];

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6L12 2z" />
  </svg>
);

const TopDoctors = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 260;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div
      dir="rtl"
      className={`w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 py-10 sm:py-12 lg:py-16 transition-colors ${t.pageBg}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${t.titleText}`}>
            متخصصان برتر
          </h2>
          <p className={`text-sm sm:text-base ${t.mutedText}`}>
            تجربه، تخصص و تعهد در کنار شما
          </p>
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll("right")}
            className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${t.scrollBtn}`}
            aria-label="راست"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("left")}
            className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${t.scrollBtn}`}
            aria-label="چپ"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className={`w-[200px] sm:w-[220px] md:w-[230px] border rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shrink-0 transition-colors ${t.cardGradient}`}
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-3 sm:mb-4"
            />
            <h3 className={`font-bold text-sm sm:text-base mb-1 ${t.titleText}`}>
              {doctor.name}
            </h3>
            <p className={`text-xs sm:text-sm mb-2 ${t.mutedText}`}>
              {doctor.specialty}
            </p>

            <div className="flex items-center gap-1 text-yellow-400 mb-3 sm:mb-4">
              <StarIcon />
              <span className={`text-xs sm:text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}>
                {doctor.rating}
              </span>
            </div>

            <button className={`w-full py-2 rounded-full border-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${t.outlineBtn}`}>
              مشاهده پروفایل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDoctors;