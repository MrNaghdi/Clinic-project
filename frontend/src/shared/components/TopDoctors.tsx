import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  Star,
  Award,
} from "lucide-react";
import doctor1 from "../../assets/image/doctor1.png";
import { useDarkMode } from "../hook/useDarkMode";
import { Container } from "./ui/Container";
import { RevealOnScroll } from "./animations/RevealOnScroll";

interface SpecialistEntity {
  id: number;
  user?: {
    first_name?: string | null;
    last_name?: string | null;
    profile_image?: string | null;
  } | null;
  user_id: number;
  bio: string | null;
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  services?: Array<{ id: number; name: string }>;
  years_of_experience?: number | null;
  rating?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

const AUTOPLAY_MS = 9000;
const BRAND = "#1E3A8A";
const BRAND_2 = "#38BDF8";

const TEST_SPECIALISTS: SpecialistEntity[] = [
  {
    id: 1,
    user: { first_name: "سارا", last_name: "احمدی" },
    user_id: 1,
    bio: "متخصص پوست، مو و زیبایی با بیش از ۱۲ سال تجربه در لیزر، تزریق ژل و بوتاکس. دانش‌آموخته دانشگاه تهران و دارای بورد تخصصی پوست.",
    status: "approved",
    is_active: true,
    years_of_experience: 12,
    rating: 4.9,
    services: [
      { id: 1, name: "پوست و زیبایی" },
      { id: 2, name: "لیزر" },
      { id: 3, name: "تزریق ژل" },
    ],
  },
  {
    id: 2,
    user: { first_name: "علی", last_name: "رضایی" },
    user_id: 2,
    bio: "متخصص بیماری‌های پوست و مو با تمرکز بر درمان آکنه، لک و ریزش مو. دارای بورد تخصصی پوست و عضو انجمن متخصصان پوست ایران.",
    status: "approved",
    is_active: true,
    years_of_experience: 9,
    rating: 4.8,
    services: [
      { id: 1, name: "پوست و مو" },
      { id: 2, name: "درمان آکنه" },
    ],
  },
  {
    id: 3,
    user: { first_name: "مریم", last_name: "حسینی" },
    user_id: 3,
    bio: "متخصص لیزر و جوانسازی پوست با مدارک بین‌المللی. متخصص در هایفوتراپی، میکرونیدلینگ و درمان‌های ضدپیری با دستگاه‌های نسل جدید.",
    status: "approved",
    is_active: true,
    years_of_experience: 10,
    rating: 4.9,
    services: [
      { id: 2, name: "لیزر" },
      { id: 4, name: "هایفوتراپی" },
      { id: 5, name: "میکرونیدلینگ" },
    ],
  },
  {
    id: 4,
    user: { first_name: "محمد", last_name: "کریمی" },
    user_id: 4,
    bio: "جراح زیبایی با ۱۵ سال سابقه در جراحی بینی، پلک و لیفت. عضو انجمن جراحان زیبایی ایران و دارای مدرک بورد جراحی.",
    status: "approved",
    is_active: true,
    years_of_experience: 15,
    rating: 4.7,
    services: [
      { id: 6, name: "جراحی زیبایی" },
      { id: 7, name: "لیفت" },
    ],
  },
  {
    id: 5,
    user: { first_name: "نگار", last_name: "موسوی" },
    user_id: 5,
    bio: "متخصص تزریقات زیبایی با رویکرد طبیعی. ارائه‌دهنده خدمات ژل، بوتاکس و مزوتراپی با بالاترین استانداردهای بین‌المللی.",
    status: "approved",
    is_active: true,
    years_of_experience: 8,
    rating: 4.8,
    services: [
      { id: 3, name: "تزریق ژل" },
      { id: 8, name: "بوتاکس" },
      { id: 9, name: "مزوتراپی" },
    ],
  },
];

const mapSpecialist = (s: SpecialistEntity) => {
  const fullName =
    [s.user?.first_name, s.user?.last_name].filter(Boolean).join(" ") ||
    "متخصص";

  return {
    id: s.id,
    name: fullName,
    image: doctor1 as string,
    initial: s.user?.first_name?.[0] ?? "?",
    bio: s.bio ?? "بیوگرافی این متخصص هنوز ثبت نشده است.",
    services: s.services?.map((sv) => sv.name) ?? [],
    experience: s.years_of_experience ?? null,
    rating: s.rating ?? null,
  };
};

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const ease = [0.22, 1, 0.36, 1] as const;

const TopDoctors = () => {
  const { darkMode } = useDarkMode();
  const reduceMotion = useReducedMotion();

  const specialists = TEST_SPECIALISTS;
  const isLoading = false;

  const approved = specialists.filter(
    (s) => s.status === "approved" && s.is_active,
  );
  const mapped = approved.map(mapSpecialist);
  const total = mapped.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState(false);

  const next = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % total);
    setImageError(false);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + total) % total);
    setImageError(false);
  }, [total]);

  const goTo = (i: number) => {
    if (i === activeIndex) return;
    setDirection(i > activeIndex ? 1 : -1);
    setActiveIndex(i);
    setImageError(false);
  };

  const doctor = mapped[activeIndex];

  const sectionBg = darkMode ? "bg-[#08060f]" : "bg-[#faf9f6]";
  const skeleton = "bg-gray-200 dark:bg-white/5 animate-pulse";

  if (isLoading) {
    return (
      <section dir="rtl" className={`relative py-16 lg:py-20 ${sectionBg}`}>
        <Container>
          <div className="mb-8 max-w-xl">
            <div className={`h-8 w-52 rounded mb-2 ${skeleton}`} />
            <div className={`h-4 w-64 rounded ${skeleton}`} />
          </div>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <div className={`aspect-[4/5] rounded-3xl ${skeleton}`} />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className={`h-4 w-32 rounded ${skeleton}`} />
              <div className={`h-12 w-3/4 rounded ${skeleton}`} />
              <div className={`h-20 w-full rounded ${skeleton}`} />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!doctor) {
    return (
      <section dir="rtl" className={`relative py-16 lg:py-20 ${sectionBg}`}>
        <Container>
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Award size={28} className="text-gray-400" />
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              متخصصی یافت نشد
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              هنوز متخصص تأیید شده‌ای ثبت نشده است.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const textMain = darkMode ? "text-white" : "text-slate-900";
  const textMuted = darkMode ? "text-white/60" : "text-slate-500";
  const navBtn = `absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-200 hover:scale-105 ${
    darkMode
      ? "bg-white/[0.06] border-white/15 text-white hover:bg-white/15"
      : "bg-white/90 border-slate-200 text-slate-700 hover:bg-white shadow-md"
  }`;
  const glass = darkMode
    ? "bg-black/40 border-white/15 text-white"
    : "bg-white/85 border-white text-slate-900 shadow-lg";

  const dx = reduceMotion ? 0 : 32;
  const dy = reduceMotion ? 0 : 16;

  const slideVariants = {
    hidden: (d: number) => ({ opacity: 0, x: dx * d }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: -dx * d,
      transition: { duration: 0.25 },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: dy },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      clipPath: reduceMotion ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0 0% 0)",
      transition: { duration: 0.9, ease },
    },
  };

  const float = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -7, 0] },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  return (
    <section
      dir="rtl"
      className={`relative py-16 lg:py-24 overflow-hidden ${sectionBg}`}
    >
      <style>{`
        @keyframes td-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>

      <div
        className="absolute -top-20 right-1/4 w-[520px] h-[420px] rounded-full blur-[130px] pointer-events-none"
        style={{ backgroundColor: BRAND, opacity: darkMode ? 0.2 : 0.16 }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[420px] h-[340px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: BRAND_2, opacity: darkMode ? 0.1 : 0.1 }}
      />
      <div
        className={`absolute inset-0 pointer-events-none ${
          darkMode ? "opacity-[0.05]" : "opacity-[0.04]"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
        }}
      />

      <Container className="relative">
        <RevealOnScroll>
          <div className="mb-10 lg:mb-12 max-w-xl">
            <div className="inline-flex items-center gap-3 mb-3">
              <span
                className="w-8 h-0.5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${BRAND}, ${BRAND_2})`,
                }}
              />
              <span className="text-sm font-bold" style={{ color: BRAND }}>
                تیم پزشکی
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-black leading-[1.3] mb-2.5 ${textMain}`}
            >
              متخصصان برتر
            </h2>
            <p className={`text-sm sm:text-base leading-7 ${textMuted}`}>
              با تجربه‌ترین پزشکان، در کنار شما برای بهترین نتیجه
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {total > 1 && (
              <button
                onClick={prev}
                aria-label="قبلی"
                className={`${navBtn} right-0 lg:-right-3`}
              >
                <ArrowRight size={18} />
              </button>
            )}
            {total > 1 && (
              <button
                onClick={next}
                aria-label="بعدی"
                className={`${navBtn} left-0 lg:-left-3`}
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <div className="px-12 sm:px-14 lg:px-16 min-h-[500px] flex items-center">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={doctor.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  drag={total > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 70) next();
                    else if (info.offset.x < -70) prev();
                  }}
                  className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full"
                >
                  <div className="lg:col-span-5">
                    <div className="relative max-w-[340px] mx-auto lg:max-w-none">
                
                      <div
                        className="absolute -inset-5 rounded-[2rem] blur-3xl opacity-30 pointer-events-none"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-3xl border-2 rotate-[5deg] translate-x-3 translate-y-3 pointer-events-none"
                        style={{ borderColor: `${BRAND}55` }}
                      />

                      <motion.div
                        variants={imageVariants}
                        className={`group relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ${
                          darkMode ? "bg-white/5" : "bg-gray-100"
                        }`}
                      >
                        {!imageError && doctor.image ? (
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            onError={() => setImageError(true)}
                            draggable={false}
                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center text-white text-7xl font-black"
                            style={{
                              background: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,
                            }}
                          >
                            {doctor.initial}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </motion.div>

                      {doctor.rating !== null && (
                        <motion.div
                          variants={itemVariants}
                          className="absolute top-6 -left-3 lg:-left-6 z-10"
                        >
                          <motion.div
                            {...float(0)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border backdrop-blur-md ${glass}`}
                          >
                            <Star
                              size={16}
                              className="text-amber-400"
                              fill="currentColor"
                            />
                            <span className="font-black text-sm">
                              {toFa(doctor.rating.toFixed(1))}
                            </span>
                          </motion.div>
                        </motion.div>
                      )}

                      {doctor.experience !== null && (
                        <motion.div
                          variants={itemVariants}
                          className="absolute bottom-8 -right-3 lg:-right-6 z-10"
                        >
                          <motion.div
                            {...float(1.2)}
                            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border backdrop-blur-md ${glass}`}
                          >
                            <span
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                              style={{
                                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,
                              }}
                            >
                              <Award size={16} />
                            </span>
                            <span className="leading-tight">
                              <span className="block font-black text-sm">
                                {toFa(doctor.experience)} سال
                              </span>
                              <span
                                className={`block text-[11px] ${
                                  darkMode ? "text-white/60" : "text-slate-500"
                                }`}
                              >
                                سابقه کار
                              </span>
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* ستون اطلاعات */}
                  <div className="lg:col-span-7">
                    {doctor.services.length > 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-2 mb-4"
                      >
                        {doctor.services.slice(0, 4).map((sv, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-bold border"
                            style={{
                              color: BRAND,
                              borderColor: `${BRAND}40`,
                              backgroundColor: `${BRAND}12`,
                            }}
                          >
                            {sv}
                          </span>
                        ))}
                        {doctor.services.length > 4 && (
                          <span
                            className={`px-2 py-1 text-xs font-bold ${textMuted}`}
                          >
                            +{toFa(doctor.services.length - 4)}
                          </span>
                        )}
                      </motion.div>
                    )}

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-2.5 mb-4"
                    >
                      <h3
                        className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.25] bg-clip-text text-transparent"
                        style={{
                          backgroundImage: darkMode
                            ? `linear-gradient(135deg, #ffffff 30%, ${BRAND}cc)`
                            : `linear-gradient(135deg, #0f172a 40%, ${BRAND})`,
                        }}
                      >
                        {doctor.name}
                      </h3>
                      <BadgeCheck
                        size={28}
                        className="text-green-500 shrink-0"
                        aria-label="تأیید شده"
                      />
                    </motion.div>

                    <motion.p
                      variants={itemVariants}
                      className={`text-sm lg:text-base leading-8 max-w-lg mb-8 ${
                        darkMode ? "text-white/75" : "text-slate-600"
                      }`}
                    >
                      {doctor.bio}
                    </motion.p>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                    >
                      <Link
                        to={`/specialists/${doctor.id}/book`}
                        className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-white font-bold text-sm transition-transform hover:-translate-y-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND}, ${BRAND_2})`,
                          boxShadow: `0 10px 28px -10px ${BRAND}99`,
                        }}
                      >
                        <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-[420%] transition-all duration-700" />
                        <Calendar size={16} className="relative" />
                        <span className="relative">رزرو نوبت</span>
                      </Link>
                      <Link
                        to={`/specialists/${doctor.id}`}
                        className={`inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full border font-bold text-sm transition-colors ${
                          darkMode
                            ? "border-white/20 text-white/90 hover:bg-white/5"
                            : "border-slate-300 text-slate-700 hover:bg-white"
                        }`}
                      >
                        مشاهده پروفایل
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </RevealOnScroll>

        {total > 1 && (
          <RevealOnScroll delay={0.2}>
            <div className="flex justify-center items-center gap-5 mt-8">
              <div className="flex items-center gap-2">
                {mapped.map((d, i) => {
                  const active = i === activeIndex;
                  return (
                    <button
                      key={d.id}
                      onClick={() => goTo(i)}
                      aria-label={`متخصص ${toFa(i + 1)}`}
                      aria-current={active}
                      className="relative rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        height: 6,
                        width: active ? 44 : 6,
                        backgroundColor: darkMode
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.15)",
                      }}
                    >
                      {active && (
                        <span
                          key={activeIndex}
                          onAnimationEnd={next}
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: BRAND,
                            transformOrigin: "right",
                            animation: reduceMotion
                              ? "none"
                              : `td-progress ${AUTOPLAY_MS}ms linear forwards`,
                            animationPlayState: isPaused ? "paused" : "running",
                            transform: reduceMotion ? "scaleX(1)" : undefined,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <span
                className={`text-xs font-bold tabular-nums ${textMuted}`}
              >
                {toFa(activeIndex + 1)} / {toFa(total)}
              </span>
            </div>
          </RevealOnScroll>
        )}
      </Container>
    </section>
  );
};

export default TopDoctors;
