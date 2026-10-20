import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import doctor1 from "../../assets/image/doctor1.png";
import { useDarkMode } from "../hook/useDarkMode";
import { Container } from "./ui/Container";
import { SectionTitle } from "./ui/SectionTitle";

const doctors = [
  { image: doctor1, name: "دکتر سارا احمدی", specialty: "متخصص پوست و زیبایی", rating: 4.9 },
  { image: doctor1, name: "دکتر علی رضایی", specialty: "متخصص پوست و مو", rating: 4.8 },
  { image: doctor1, name: "دکتر مریم حسینی", specialty: "متخصص لیزر و زیبایی", rating: 4.7 },
  { image: doctor1, name: "دکتر محمد کریمی", specialty: "متخصص جراحی زیبایی", rating: 4.9 },
  { image: doctor1, name: "دکتر محمد کریمی", specialty: "متخصص جراحی زیبایی", rating: 4.9 },
];

function DoctorCard({ doctor, index }: { doctor: typeof doctors[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  });

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="w-[280px] shrink-0"
    >
      <Link
        to="/specialists"
        className="group block relative rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 transition-shadow duration-500 hover:shadow-2xl"
      >
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-white/5">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Verified */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg">
            <CheckCircle2 size={18} className="text-brand-500" fill="currentColor" />
          </div>

          {/* Rating */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md flex items-center gap-1">
            <Star size={12} className="text-yellow-400" fill="#facc15" />
            <span className="text-xs font-bold text-white">{doctor.rating}</span>
          </div>

          {/* Name */}
          <div style={{ transform: "translateZ(30px)" }} className="absolute bottom-0 right-0 left-0 p-5">
            <h3 className="text-lg font-black text-white mb-1">{doctor.name}</h3>
            <p className="text-xs text-white/80">{doctor.specialty}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
            مشاهده پروفایل
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const TopDoctors = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useDarkMode();

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <section
      dir="rtl"
      className={`relative py-20 lg:py-28 overflow-hidden ${darkMode ? "bg-ink-light" : "bg-gray-50"}`}
    >
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="text-right">
            <SectionTitle
              eyebrow="تیم متخصصان"
              title="متخصصان برتر"
              description="تجربه، تخصص و تعهد در کنار شما"
              align="right"
              className="mb-0"
            />
          </div>

          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all"
            >
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {doctors.map((doctor, i) => (
            <DoctorCard key={i} doctor={doctor} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TopDoctors;