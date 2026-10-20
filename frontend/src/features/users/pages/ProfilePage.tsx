import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Star,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  User,
  Activity,
} from "lucide-react";
import { fetchMe } from "../api/users.api";
import { AuroraBackground } from "../../../shared/components/effects/AuroraBackground";

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 rounded-3xl bg-gray-200 dark:bg-white/5" />
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-gray-200 dark:bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-blue-700 to-accent-600" />
        <div className="absolute inset-0 opacity-100">
          <AuroraBackground />
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-white/30 blur-xl" />
              <div className="relative">
                {user?.profile_image ? (
                  <img
                    src={`http://localhost:3000${user.profile_image}`}
                    alt={user.first_name}
                    className="w-28 h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white/40 shadow-2xl"
                  />
                ) : (
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-5xl font-black border-4 border-white/40 shadow-2xl">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </div>
                )}
                <Link
                  to="/profile/avatar"
                  className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-brand-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Sparkles size={16} fill="currentColor" />
                </Link>
              </div>
            </motion.div>

            <div className="text-center sm:text-right flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-3"
              >
                <Activity size={12} className="text-white" />
                <span className="text-xs font-medium text-white">
                  حساب فعال
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg"
              >
                {user?.first_name} {user?.last_name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 mb-2"
              >
                خوش برگشتی 👋
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/70 text-sm"
                dir="ltr"
              >
                {user?.phone}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Stats ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <TiltCard>
          <div className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/50 to-accent-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <Calendar size={22} />
                  </div>
                  <TrendingUp size={18} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  نوبت‌های فعال
                </p>
                <p className="text-3xl font-black text-brand-500">۰</p>
              </div>
            </div>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-green-500/50 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                  <CheckCircle2 size={22} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  خدمات انجام‌شده
                </p>
                <p className="text-3xl font-black text-green-500">۰</p>
              </div>
            </div>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="group relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-yellow-500/50 to-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4">
                  <Star size={22} fill="currentColor" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  امتیاز عضویت
                </p>
                <p className="text-3xl font-black text-yellow-500">—</p>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* ═══ CTA ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-3xl border border-gray-200/50 dark:border-white/10" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Calendar size={26} />
          </div>
          <h3 className="font-black text-lg text-gray-900 dark:text-white mb-2">
            نوبت جدید رزرو کنید
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-md mx-auto">
            با بهترین متخصصان، زیبایی خود را به سطح بعد ببرید
          </p>
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all"
            >
              مشاهده خدمات
              <ArrowLeft size={16} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}