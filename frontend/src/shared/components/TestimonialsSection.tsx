import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import user1 from "../../assets/image/user1.png";
import user2 from "../../assets/image/user2.png";
import { useDarkMode } from "../hook/useDarkMode";
import { Container } from "./ui/Container";
import { SectionTitle } from "./ui/SectionTitle";
import { RevealOnScroll } from "./animations/RevealOnScroll";

const testimonials = [
  {
    image: user2,
    name: "مبینا رضایی",
    role: "مشتری",
    rating: 5,
    text: "خدمات این کلینیک عالی بود. محیط آرام و برخورد کارکنان بسیار خوب بود. حتماً دوباره مراجعه می‌کنم.",
  },
  {
    image: user1,
    name: "علی محمدی",
    role: "مشتری",
    rating: 5,
    text: "بسیار حرفه‌ای خوب بود. نتیجه لیزر موهای زائد کاملاً راضی‌کننده بود. واقعاً از تیم حرفه‌ای‌شان ممنونم.",
  },
  {
    image: user2,
    name: "نرگس کریمی",
    role: "مشتری",
    rating: 5,
    text: "من برای تزریق ژل زیر نظر تیم حرفه‌ای مراجعه کردم و کاملاً راضی بودم. پیشنهاد می‌کنم حتماً امتحان کنید.",
  },
];

const TestimonialsSection = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      dir="rtl"
      className={`relative py-20 lg:py-28 overflow-hidden ${darkMode ? "bg-ink-light" : "bg-gray-50"}`}
    >
      <div
        className={`absolute top-1/2 left-0 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none ${
          darkMode ? "bg-purple-500/10" : "bg-purple-200/30"
        }`}
      />

      <Container className="relative">
        <SectionTitle
          eyebrow="نظرات"
          title="نظرات مراجعه‌کنندگان"
          description="رضایت شما، بزرگ‌ترین افتخار ماست"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-full rounded-3xl p-8 bg-white dark:bg-ink border border-gray-200 dark:border-white/5 hover:border-transparent transition-all duration-500 hover:shadow-2xl"
              >
                <div className="absolute top-6 left-6 text-brand-500/10 dark:text-brand-500/20">
                  <Quote size={60} fill="currentColor" />
                </div>

                <div className="relative flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400" fill="#facc15" />
                  ))}
                </div>

                <p className="relative text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-7 mb-6 min-h-[100px]">
                  "{item.text}"
                </p>

                <div className="relative flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-100 dark:border-brand-500/30"
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;