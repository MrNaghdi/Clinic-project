import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useDarkMode } from "../hook/useDarkMode";
import { Container } from "./ui/Container";
import { SectionTitle } from "./ui/SectionTitle";
import { RevealOnScroll } from "./animations/RevealOnScroll";

const services = [
  {
    title: "مراقبت پوست",
    description: "پاکسازی، جوانسازی، درمان آکنه و لکه‌ها",
    gradient: "from-pink-500 to-rose-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8z" />
      </svg>
    ),
  },
  {
    title: "خدمات مو",
    description: "کاشت مو، تقویت مو، درمان ریزش مو",
    gradient: "from-purple-500 to-indigo-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21c-4-3-7-6.5-7-10a7 7 0 0 1 14 0c0 3.5-3 7-7 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: "زیبایی صورت",
    description: "تزریق ژل، بوتاکس و فرم‌دهی صورت",
    gradient: "from-rose-500 to-pink-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
      </svg>
    ),
  },
  {
    title: "لیزر موهای زائد",
    description: "لیزر پیشرفته و دائمی برای پوستی صاف",
    gradient: "from-cyan-500 to-blue-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4l16 16M4 20L20 4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "پوست و مو",
    description: "خدمات ترکیبی برای زیبایی کامل",
    gradient: "from-indigo-500 to-purple-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8z" />
        <path d="M12 14v7" />
      </svg>
    ),
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <RevealOnScroll delay={index * 0.08}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="relative"
      >
        <Link
          to="/services"
          className="group block relative rounded-3xl p-8 overflow-hidden border bg-white dark:bg-ink-light border-gray-200 dark:border-white/5 transition-shadow duration-500 hover:shadow-2xl"
        >
          {/* Gradient Background on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          {/* Glow */}
          <div
            className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-50 blur-3xl transition-opacity duration-500`}
          />

          {/* Content */}
          <div style={{ transform: "translateZ(40px)" }} className="relative">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center mb-6 shadow-lg group-hover:bg-white/20 transition-all duration-300`}
            >
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-white transition-colors">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-6 mb-6 group-hover:text-white/90 transition-colors">
              {service.description}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-500 group-hover:text-white transition-colors">
              مشاهده خدمات
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>
      </motion.div>
    </RevealOnScroll>
  );
}

const ServicesSection = () => {
  const { darkMode } = useDarkMode();

  return (
    <section
      dir="rtl"
      className={`relative py-20 lg:py-28 overflow-hidden ${darkMode ? "bg-ink" : "bg-white"}`}
    >
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none ${
          darkMode ? "bg-brand-500/10" : "bg-brand-200/30"
        }`}
      />

      <Container className="relative">
        <SectionTitle
          eyebrow="خدمات ما"
          title="خدمات تخصصی کلینیک"
          description="با بهترین کیفیت و جدیدترین متدهای روز دنیا، زیبایی خود را به سطح بعد ببرید"
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;