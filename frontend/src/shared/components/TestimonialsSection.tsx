import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

import {
  Star,
  Quote,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Sparkles,
  Zap,
  Heart,
  Droplets,
  Syringe,
  Smile,
  Sun,
} from "lucide-react";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode,
  type KeyboardEvent,
  type TouchEvent,
} from "react";

import user1 from "../../assets/image/user1.png";
import user2 from "../../assets/image/user2.png";

import { useDarkMode } from "../hook/useDarkMode";
import { Container } from "./ui/Container";
import { RevealOnScroll } from "./animations/RevealOnScroll";

// --------------------------------------------------
// Types
// --------------------------------------------------

type ServiceIconName =
  | "zap"
  | "syringe"
  | "smile"
  | "droplets"
  | "heart"
  | "sun";

type Testimonial = {
  id: number;
  image: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  service: string;
  serviceIcon: ServiceIconName;
  text: string;
};

// --------------------------------------------------
// Testimonials
// --------------------------------------------------

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: user2,
    name: "مبینا رضایی",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۲ هفته پیش",
    service: "لیزر موهای زائد",
    serviceIcon: "zap",
    text: "خدمات این کلینیک عالی بود. محیط آرام و برخورد کارکنان بسیار خوب بود. حتماً دوباره مراجعه می‌کنم.",
  },
  {
    id: 2,
    image: user1,
    name: "علی محمدی",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۳ هفته پیش",
    service: "لیزر موهای زائد",
    serviceIcon: "zap",
    text: "بسیار حرفه‌ای بود. نتیجه لیزر موهای زائد کاملاً رضایت‌بخش بود. از تیم حرفه‌ای کلینیک ممنونم.",
  },
  {
    id: 3,
    image: user2,
    name: "نرگس کریمی",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۱ ماه پیش",
    service: "تزریق ژل",
    serviceIcon: "syringe",
    text: "برای تزریق ژل زیر نظر تیم حرفه‌ای مراجعه کردم و از روند مشاوره و خدمات رضایت داشتم.",
  },
  {
    id: 4,
    image: user1,
    name: "سارا احمدی",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۱ ماه پیش",
    service: "مشاوره پوست",
    serviceIcon: "smile",
    text: "از مشاوره اولیه تا پایان درمان، روند کار منظم و رضایت‌بخش بود. تیم پشتیبانی هم پاسخ‌گو بود.",
  },
  {
    id: 5,
    image: user2,
    name: "مریم حسینی",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۲ ماه پیش",
    service: "هایفوتراپی",
    serviceIcon: "sun",
    text: "تجهیزات و بهداشت محیط برایم اهمیت زیادی داشت. از نحوه توضیح مراحل درمان و رسیدگی تیم راضی بودم.",
  },
  {
    id: 6,
    image: user1,
    name: "رضا نوری",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۲ ماه پیش",
    service: "پاکسازی پوست",
    serviceIcon: "droplets",
    text: "کیفیت خدمات خوب بود و پرسنل با حوصله به سؤال‌ها پاسخ می‌دادند. محیط هم آرامش‌بخش بود.",
  },
  {
    id: 7,
    image: user2,
    name: "الهام صادقی",
    role: "مراجعه‌کننده",
    rating: 5,
    date: "۳ ماه پیش",
    service: "میکرونیدلینگ",
    serviceIcon: "heart",
    text: "توضیحات مربوط به روند درمان روشن بود و در طول جلسات، راهنمایی‌های لازم را دریافت کردم.",
  },
];

// --------------------------------------------------
// Constants
// --------------------------------------------------

const AUTOPLAY_MS = 6500;

const SERVICE_ICONS: Record<ServiceIconName, ReactNode> = {
  zap: <Zap size={14} />,
  syringe: <Syringe size={14} />,
  smile: <Smile size={14} />,
  droplets: <Droplets size={14} />,
  heart: <Heart size={14} />,
  sun: <Sun size={14} />,
};

// --------------------------------------------------
// Component
// --------------------------------------------------

const TestimonialsSection = () => {
  const { darkMode } = useDarkMode();
  const reduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = testimonials.length;

  // -----------------------------------------------
  // 3D card interaction
  // -----------------------------------------------

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cardRotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [4, -4]),
    {
      stiffness: 150,
      damping: 24,
    },
  );

  const cardRotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-4, 4]),
    {
      stiffness: 150,
      damping: 24,
    },
  );

  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetCardTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // -----------------------------------------------
  // Slider navigation
  // -----------------------------------------------

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    setActiveIndex((index) => (index + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((index) => (index - 1 + total) % total);
  }, [total]);

  // -----------------------------------------------
  // Autoplay
  // -----------------------------------------------

  useEffect(() => {
    if (isHovered || reduceMotion) return;

    const intervalId = window.setInterval(next, AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, [isHovered, reduceMotion, next]);

  // -----------------------------------------------
  // Keyboard controls
  // -----------------------------------------------

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      next();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      prev();
    }
  };

  // -----------------------------------------------
  // Touch / swipe controls
  // -----------------------------------------------

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) return;

    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
  };

  // -----------------------------------------------
  // Slide positions
  // -----------------------------------------------

  const getOffset = (index: number) => {
    let offset = index - activeIndex;

    if (offset > total / 2) {
      offset -= total;
    }

    if (offset < -total / 2) {
      offset += total;
    }

    return offset;
  };

  // -----------------------------------------------
  // Dark theme
  // -----------------------------------------------

  const sectionBackground = darkMode
    ? "bg-[#030711]"
    : "bg-gradient-to-br from-[#E8EEF7] via-[#F1F5FB] to-[#DFE8F4]";

  const cardBackground = darkMode
    ? "bg-gradient-to-br from-[#0B1423] via-[#080F1C] to-[#050B15]"
    : "bg-[#F8FAFE]";

  const primaryText = darkMode
    ? "text-[#EAF1FC]"
    : "text-[#14243B]";

  const secondaryText = darkMode
    ? "text-[#91A5C0]"
    : "text-[#526781]";

  const mutedText = darkMode
    ? "text-[#687D99]"
    : "text-[#71839B]";

  // -----------------------------------------------
  // Render
  // -----------------------------------------------

  return (
    <section
      dir="rtl"
      aria-labelledby="testimonials-heading"
      className={`relative isolate overflow-hidden py-20 sm:py-24 lg:py-28 ${sectionBackground}`}
    >
      {/* Background effects */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {!reduceMotion && (
          <>
            <motion.div
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute -left-32 top-10 h-[380px] w-[380px] rounded-full blur-[120px] sm:h-[520px] sm:w-[520px] ${
                darkMode
                  ? "bg-[#12396A]/20"
                  : "bg-[#9BBCE5]/30"
              }`}
            />

            <motion.div
              animate={{
                x: [0, -25, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute -right-32 bottom-0 h-[350px] w-[350px] rounded-full blur-[115px] sm:h-[480px] sm:w-[480px] ${
                darkMode
                  ? "bg-[#104763]/15"
                  : "bg-[#B3D5E9]/30"
              }`}
            />
          </>
        )}

        {/* Subtle grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(${
              darkMode ? "#FFFFFF" : "#0F172A"
            } 1px, transparent 1px), linear-gradient(${
              darkMode ? "#FFFFFF" : "#0F172A"
            } 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
          }}
        />
      </div>

      <Container className="relative z-10">
        {/* Heading */}

        <RevealOnScroll>
          <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                darkMode
                  ? "border-[#1C304B] bg-[#091323] text-[#82BCE8]"
                  : "border-[#D1DEEF] bg-[#E6EFFB] text-[#234D80]"
              }`}
            >
              <Sparkles size={14} />
              تجربه مراجعه‌کنندگان
            </div>

            <h2
              id="testimonials-heading"
              className={`mb-4 text-3xl font-black leading-[1.5] tracking-tight sm:text-4xl lg:text-5xl ${primaryText}`}
            >
              تجربه‌ای فراتر از
              <span className="block bg-gradient-to-l from-[#17365F] via-[#24649A] to-[#62A9D5] bg-clip-text text-transparent">
                انتظار شما
              </span>
            </h2>

            <p
              className={`mx-auto max-w-xl text-sm leading-8 sm:text-base ${secondaryText}`}
            >
              با تجربه افرادی آشنا شوید که برای مراقبت از پوست و زیبایی خود،
              کلینیک ما را انتخاب کرده‌اند.
            </p>

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-[#15345D] to-[#4D99C9]" />
          </header>
        </RevealOnScroll>

        {/* Slider */}

        <RevealOnScroll delay={0.1}>
          <div
            role="region"
            aria-roledescription="اسلایدر نظرات"
            aria-label="نظرات مراجعه‌کنندگان"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#438DBD] focus-visible:ring-offset-8 focus-visible:ring-offset-transparent"
          >
            <div
              className="relative flex min-h-[520px] items-center justify-center sm:h-[560px] sm:min-h-0"
              style={{ perspective: "1600px" }}
            >
              {/* Previous */}

              <button
                type="button"
                onClick={prev}
                aria-label="نمایش نظر قبلی"
                className={`absolute right-0 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438DBD] sm:right-2 sm:h-12 sm:w-12 ${
                  darkMode
                    ? "border-[#1C2B40] bg-[#080F1C]/95 text-[#D9E6F7] hover:border-[#315A7B] hover:bg-[#101E31]"
                    : "border-[#D4DFED] bg-[#F9FBFF]/95 text-[#243B57] hover:border-[#8DB9D8] hover:bg-white"
                }`}
              >
                <ArrowRight size={20} />
              </button>

              {/* Next */}

              <button
                type="button"
                onClick={next}
                aria-label="نمایش نظر بعدی"
                className={`absolute left-0 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#438DBD] sm:left-2 sm:h-12 sm:w-12 ${
                  darkMode
                    ? "border-[#1C2B40] bg-[#080F1C]/95 text-[#D9E6F7] hover:border-[#315A7B] hover:bg-[#101E31]"
                    : "border-[#D4DFED] bg-[#F9FBFF]/95 text-[#243B57] hover:border-[#8DB9D8] hover:bg-white"
                }`}
              >
                <ArrowLeft size={20} />
              </button>

              {/* Testimonial cards */}

              <AnimatePresence initial={false}>
                {testimonials.map((item, index) => {
                  const offset = getOffset(index);
                  const absoluteOffset = Math.abs(offset);

                  if (absoluteOffset > 1) return null;

                  const isActive = offset === 0;

                  return (
                    <motion.div
                      key={item.id}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.94 }
                      }
                      animate={{
                        opacity: isActive ? 1 : 0.4,
                        scale: isActive ? 1 : 0.82,
                        x: `${offset * -76}%`,
                        rotateY: reduceMotion ? 0 : offset * 12,
                        zIndex: isActive ? 20 : 10,
                        filter: isActive ? "blur(0px)" : "blur(1px)",
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.94,
                      }}
                      transition={
                        reduceMotion
                          ? { duration: 0.15 }
                          : {
                              type: "spring",
                              stiffness: 190,
                              damping: 27,
                            }
                      }
                      onClick={() => {
                        if (!isActive) goTo(index);
                      }}
                      className={`absolute left-1/2 top-1/2 w-[calc(100%-5rem)] max-w-[600px] -translate-x-1/2 -translate-y-1/2 ${
                        isActive
                          ? "z-20"
                          : "hidden cursor-pointer sm:block"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <motion.div
                        ref={isActive ? cardRef : undefined}
                        onMouseMove={isActive ? handleMouseMove : undefined}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => {
                          setIsHovered(false);
                          resetCardTilt();
                        }}
                        style={
                          isActive && !reduceMotion
                            ? {
                                rotateX: cardRotateX,
                                rotateY: cardRotateY,
                                transformStyle: "preserve-3d",
                              }
                            : undefined
                        }
                        className="relative"
                      >
                        {/* Active glow */}

                        {isActive && (
                          <div
                            aria-hidden="true"
                            className={`pointer-events-none absolute -inset-2 rounded-[32px] blur-2xl sm:-inset-3 ${
                              darkMode
                                ? "bg-gradient-to-br from-[#102F55]/20 via-[#0B4560]/10 to-[#07111F]/20"
                                : "bg-gradient-to-br from-[#164B87]/25 via-[#147FA8]/15 to-[#0B1B35]/25"
                            }`}
                          />
                        )}

                        {/* Gradient border */}

                        <div
                          className={`relative rounded-[26px] p-[1.5px] sm:rounded-[30px] ${
                            isActive
                              ? darkMode
                                ? "bg-gradient-to-br from-[#18345A] via-[#174E78] to-[#2B7BA8] shadow-2xl shadow-black/40"
                                : "bg-gradient-to-br from-[#163B70] via-[#1767A8] to-[#38A6D9] shadow-2xl shadow-[#020817]/30"
                              : darkMode
                                ? "bg-gradient-to-br from-[#26374C] to-[#111C2C]"
                                : "bg-gradient-to-br from-[#344760] to-[#18283D]"
                          }`}
                        >
                          {/* Card surface */}

                          <article
                            className={`relative overflow-hidden rounded-[24px] px-5 py-6 sm:rounded-[28px] sm:p-9 lg:p-10 ${cardBackground}`}
                          >
                            {/* Spotlight */}

                            {isActive && !reduceMotion && (
                              <motion.div
                                aria-hidden="true"
                                style={{
                                  left: spotlightX,
                                  top: spotlightY,
                                  x: "-50%",
                                  y: "-50%",
                                }}
                                className={`pointer-events-none absolute h-64 w-64 rounded-full blur-3xl ${
                                  darkMode
                                    ? "bg-[#1C5684]/10"
                                    : "bg-[#B8DFF4]/25"
                                }`}
                              />
                            )}

                            {/* Subtle pattern */}

                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 opacity-[0.025]"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                                backgroundSize: "22px 22px",
                              }}
                            />

                            {/* Quote */}

                            <Quote
                              aria-hidden="true"
                              size={64}
                              className={`pointer-events-none absolute left-5 top-5 rotate-180 sm:left-8 sm:top-7 ${
                                darkMode
                                  ? "text-[#4A82B5]/10"
                                  : "text-[#234D80]/10"
                              }`}
                              fill="currentColor"
                            />

                            {/* Rating and service */}

                            <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
                              <div
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 ${
                                  darkMode
                                    ? "border-[#1D2B3F] bg-[#070D18]"
                                    : "border-[#DCE5F0] bg-[#EFF4FA]"
                                }`}
                              >
                                <div
                                  className="flex items-center gap-0.5"
                                  aria-label={`امتیاز ${item.rating} از ۵`}
                                >
                                  {Array.from({
                                    length: item.rating,
                                  }).map((_, starIndex) => (
                                    <Star
                                      key={starIndex}
                                      size={14}
                                      className="text-amber-400"
                                      fill="currentColor"
                                    />
                                  ))}
                                </div>

                                <span
                                  className={`text-xs font-extrabold tabular-nums ${primaryText}`}
                                >
                                  {item.rating}.0
                                </span>
                              </div>

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
                                  darkMode
                                    ? "border-[#1C354B] bg-[#0A1928] text-[#7FB8DE]"
                                    : "border-[#D0E3F2] bg-[#E8F3FB] text-[#285A83]"
                                }`}
                              >
                                {SERVICE_ICONS[item.serviceIcon]}
                                {item.service}
                              </span>
                            </div>

                            {/* Review text */}

                            <div className="relative">
                              <p
                                className={`min-h-[145px] text-sm font-medium leading-[2.1] sm:min-h-[150px] sm:text-base sm:leading-[2.15] lg:text-lg ${primaryText}`}
                              >
                                «{item.text}»
                              </p>
                            </div>

                            {/* Divider */}

                            <div
                              className={`my-6 h-px ${
                                darkMode
                                  ? "bg-gradient-to-l from-transparent via-[#243248] to-transparent"
                                  : "bg-gradient-to-l from-transparent via-[#D5DFEB] to-transparent"
                              }`}
                            />

                            {/* Customer information */}

                            <div className="relative flex items-center justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="relative shrink-0">
                                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#163B70] to-[#38A6D9] opacity-40 blur-sm" />

                                  <img
                                    src={item.image}
                                    alt=""
                                    loading="lazy"
                                    className={`relative h-12 w-12 rounded-full border-2 object-cover sm:h-14 sm:w-14 ${
                                      darkMode
                                        ? "border-[#0B1423]"
                                        : "border-[#F8FAFE]"
                                    }`}
                                  />

                                  <BadgeCheck
                                    size={17}
                                    aria-hidden="true"
                                    className="absolute -bottom-1 -left-1 rounded-full text-[#5BAEDB]"
                                    fill={darkMode ? "#0B1423" : "#F8FAFE"}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p
                                    className={`truncate text-sm font-extrabold sm:text-base ${primaryText}`}
                                  >
                                    {item.name}
                                  </p>

                                  <p
                                    className={`mt-1 text-xs sm:text-sm ${secondaryText}`}
                                  >
                                    {item.role}
                                  </p>
                                </div>
                              </div>

                              <time
                                className={`shrink-0 text-[11px] sm:text-xs ${mutedText}`}
                              >
                                {item.date}
                              </time>
                            </div>
                          </article>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </RevealOnScroll>

        {/* Bottom note */}

        <RevealOnScroll delay={0.2}>
          <div
            className={`mx-auto mt-12 flex max-w-xl items-start gap-3 rounded-2xl border p-4 sm:mt-14 sm:p-5 ${
              darkMode
                ? "border-[#17263A] bg-[#070D18]/90"
                : "border-[#D7E3F0] bg-[#F7FAFE]/90"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#15345D] to-[#2673A4] text-white shadow-md shadow-black/20">
              <Heart size={17} />
            </div>

            <div>
              <p className={`mb-1 text-sm font-extrabold ${primaryText}`}>
                تجربه شما برای ما ارزشمند است
              </p>

              <p className={`text-xs leading-7 sm:text-sm ${secondaryText}`}>
                هدف ما ارائه خدمات مسئولانه، مشاوره شفاف و تجربه‌ای رضایت‌بخش
                برای هر مراجعه‌کننده است.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
};

export default TestimonialsSection;