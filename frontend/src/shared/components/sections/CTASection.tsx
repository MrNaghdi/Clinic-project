import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function CTASection() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      dir="rtl"
      className="relative py-24 bg-white dark:bg-ink overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 1000,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-white/5 to-accent-500/5 backdrop-blur-3xl" />

          {/* Gradient border */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-transparent to-accent-500/30 p-[1px]">
            <div className="w-full h-full rounded-[2.5rem] bg-white/70 dark:bg-ink/70 backdrop-blur-3xl" />
          </div>

          {/* Content wrapper */}
          <div
            className="relative p-12 lg:p-20 text-center"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* Floating Decorative Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 opacity-20 blur-xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-xl"
            />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-accent-500/10 backdrop-blur-md border border-brand-500/20 mb-6"
            >
              <Sparkles size={14} className="text-brand-500" />
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                همین امروز شروع کنید
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-black mb-6 leading-tight text-gray-900 dark:text-white"
            >
              آماده‌اید زیبایی خود را
              <br />
              <span className="bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 bg-clip-text text-transparent">
                به سطح بعد ببرید؟
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto"
            >
              با بهترین متخصصان و جدیدترین تجهیزات، تجربه‌ای متفاوت از زیبایی را
              آغاز کنید.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-8 mb-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">
                    ۱۵۰۰+
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    مشتری راضی
                  </p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                  <Star size={18} fill="currentColor" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">
                    ۴.۹
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    امتیاز
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/services">
                <Button
                  variant="brand"
                  size="lg"
                  icon={<ArrowLeft size={20} />}
                  className="shadow-2xl shadow-brand-500/40"
                >
                  رزرو نوبت
                </Button>
              </Link>
              <Link to="/specialists">
                <Button
                  variant="outline"
                  size="lg"
                  className="!border-brand-500/30 !text-brand-600 dark:!text-brand-400 hover:!bg-brand-500/10"
                >
                  مشاهده پزشکان
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Shine effect */}
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }}
          />
        </motion.div>
      </Container>
    </section>
  );
}