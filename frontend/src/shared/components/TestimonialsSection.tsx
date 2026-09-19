import user1 from "../../assets/image/user1.png";
import user2 from "../../assets/image/user2.png";
import { useDarkMode } from "../../shared/hook/useDarkMode";
import { homeTheme } from "../theme";

const testimonials = [
  {
    image: user2,
    name: "مبینا رضایی",
    rating: 5,
    text: "خدمات این کلینیک عالی بود. محیط آرام و برخورد کارکنان بسیار خوب بود. حتماً دوباره مراجعه می‌کنم.",
  },
  {
    image: user1,
    name: "علی محمدی",
    rating: 5,
    text: "بسیار حرفه‌ای خوب بود. نتیجه لیزر موهای زائد کاملاً راضی‌کننده بود. واقعاً از تیم حرفه‌ای‌شان ممنونم.",
  },
  {
    image: user1,
    name: "علی محمدی",
    rating: 5,
    text: "بسیار حرفه‌ای خوب بود. نتیجه لیزر موهای زائد کاملاً راضی‌کننده بود. واقعاً از تیم حرفه‌ای‌شان ممنونم.",
  },
  {
    image: user1,
    name: "علی محمدی",
    rating: 5,
    text: "بسیار حرفه‌ای خوب بود. نتیجه لیزر موهای زائد کاملاً راضی‌کننده بود. واقعاً از تیم حرفه‌ای‌شان ممنونم.",
  },
  {
    image: user2,
    name: "نرگس کریمی",
    rating: 5,
    text: "من برای تزریق ژل زیر نظر تیم حرفه‌ای مراجعه کردم و کاملاً راضی بودم. پیشنهاد می‌کنم حتماً امتحان کنید.",
  },
  {
    image: user2,
    name: "نرگس کریمی",
    rating: 5,
    text: "من برای تزریق ژل زیر نظر تیم حرفه‌ای مراجعه کردم و کاملاً راضی بودم. پیشنهاد می‌کنم حتماً امتحان کنید.",
  },
];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6L12 2z" />
  </svg>
);

const TestimonialsSection = () => {
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  return (
    <div
      dir="rtl"
      className={`w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 py-10 sm:py-12 lg:py-16 transition-colors ${t.pageBg}`}
    >
      <div className="text-center sm:text-right mb-8 sm:mb-10">
        <h2 className={`text-xl sm:text-2xl text-right font-bold mb-2 ${t.titleText}`}>
          نظرات مراجعه‌کنندگان
        </h2>
        <p className={`text-sm sm:text-base text-right ${t.mutedText}`}>
          رضایت شما، بزرگ‌ترین افتخار ماست
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-5 sm:p-6 transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 shadow-lg shadow-black/20"
                : "bg-gray-50 border-gray-100 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className={`font-bold text-sm truncate ${t.titleText}`}>
                  {item.name}
                </h3>
                <div className="flex items-center gap-0.5 text-yellow-400 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < item.rating} />
                  ))}
                </div>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-6 sm:leading-7 ${t.mutedText}`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;