import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { AuroraBackground } from "../effects/AuroraBackground";
import { GridPattern } from "../effects/GridPattern";
import { NumberTicker } from "../animations/NumberTicker";

import heroImage from "../../../assets/image/baner.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-white dark:bg-ink">
      {/* ── Aurora Background */}
      <AuroraBackground />
      <GridPattern />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ═══ LEFT — Content ═══ */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm mb-8"
            >
              <Sparkles size={14} className="text-brand-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                کلینیک زیبایی SkinCare
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tighter mb-8 text-gray-900 dark:text-white"
            >
              زیبایی
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 bg-clip-text text-transparent">
                  طبیعی
                </span>
                {/* SVG underline */}
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  height="20"
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    d="M0,10 Q50,0 100,10 T200,10"
                    stroke="url(#grad)"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              با ما
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-lg"
            >
              تجربه‌ای متفاوت از خدمات زیبایی و درمانی با بهترین متخصصان و
              جدیدترین تجهیزات روز دنیا.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/services">
                <Button
                  variant="brand"
                  size="lg"
                  icon={<ArrowLeft size={20} />}
                >
                  رزرو نوبت
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Play size={18} fill="currentColor" />}
                >
                  مشاهده خدمات
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex items-center gap-8 mt-16 pt-8 border-t border-gray-200 dark:border-white/10"
            >
              {[
                { value: 1500, suffix: "+", label: "مشتری راضی" },
                { value: 20, suffix: "+", label: "پزشک متخصص" },
                { value: 10, suffix: "+", label: "سال تجربه" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ═══ RIGHT — Image + Floating Cards ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-500 rounded-[2.5rem] rotate-6 opacity-30 blur-3xl" />

            {/* Image */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-500/20 border-4 border-white dark:border-white/10">
              <img
                src={heroImage}
                alt="Beauty Clinic"
                className="w-full h-[500px] lg:h-[600px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating Card — Doctors */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -left-6 top-1/4 bg-white dark:bg-ink-light rounded-2xl p-4 shadow-xl shadow-black/10 border border-gray-100 dark:border-white/10 flex items-center gap-3 animate-float"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                د
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  متخصصان
                </p>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  +۲۰ پزشک
                </p>
              </div>
            </motion.div>

            {/* Floating Card — Rating */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -right-6 bottom-1/4 bg-white dark:bg-ink-light rounded-2xl p-4 shadow-xl shadow-black/10 border border-gray-100 dark:border-white/10 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-yellow-400"
                    fill="#facc15"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                امتیاز کاربران
              </p>
              <p className="font-black text-lg text-gray-900 dark:text-white">
                ۴.۹ / ۵
              </p>
            </motion.div>

            {/* Floating Card — Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -bottom-6 left-1/4 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl p-4 shadow-xl shadow-brand-500/30 text-white animate-float"
              style={{ animationDelay: "2s" }}
            >
              <p className="text-xs opacity-90">۱۰+ سال</p>
              <p className="font-bold text-sm">تجربه درخشان</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 dark:text-gray-400">
          اسکرول کنید
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
          />
        </div>
      </motion.div>
    </section>
  );
}