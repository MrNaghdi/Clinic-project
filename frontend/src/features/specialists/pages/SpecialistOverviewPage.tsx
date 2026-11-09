import { useQuery } from "@tanstack/react-query";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Star,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  Activity,
  Award,
  ArrowLeft,
  XCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMe } from "../../users/api/users.api";
import { getSpecialistStats } from "../../booking/api/booking.api";
import { AuroraBackground } from "../../../shared/components/effects/AuroraBackground";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { getJalaliInfo, getRelativeLabel } from "../../booking/utils/date";

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

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "brand" | "green" | "yellow" | "red";
  delay: number;
}) {
  const colors = {
    brand: {
      bg: "bg-brand-500/10",
      text: "text-brand-500",
      glow: "from-brand-500/20 to-accent-500/20",
      border: "from-brand-500/50 to-accent-500/50",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-500",
      glow: "from-green-500/20 to-emerald-500/20",
      border: "from-green-500/50 to-emerald-500/50",
    },
    yellow: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
      glow: "from-yellow-500/20 to-orange-500/20",
      border: "from-yellow-500/50 to-orange-500/50",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      glow: "from-red-500/20 to-rose-500/20",
      border: "from-red-500/50 to-rose-500/50",
    },
  };
  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div
        className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${c.border} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}
      />
      <div className="relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 overflow-hidden">
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${c.glow} blur-3xl group-hover:scale-150 transition-transform duration-700`}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}
            >
              <Icon size={22} />
            </div>
            <TrendingUp
              size={18}
              className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className={`text-3xl font-black ${c.text}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SpecialistOverviewPage() {
  const { data: user } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", "specialist"],
    queryFn: getSpecialistStats,
  });

  const avatarUrl = getImageUrl(user?.profile_image ?? null);

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
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.first_name || ""}
                    className="w-28 h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white/40 shadow-2xl"
                  />
                ) : (
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-5xl font-black border-4 border-white/40 shadow-2xl">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                  <Activity size={14} className="text-white" />
                </div>
              </div>
            </motion.div>

            <div className="text-center sm:text-right flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-3"
              >
                <Sparkles size={12} className="text-white" />
                <span className="text-xs font-medium text-white">
                  متخصص فعال
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg"
              >
                دکتر {user?.first_name} {user?.last_name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 mb-4"
              >
                به پنل شخصی خود خوش آمدید 👋
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-2 justify-center sm:justify-start"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <Award size={14} className="text-white" />
                  <span className="text-xs font-semibold text-white">
                    ۱۰+ سال تجربه
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <Star
                    size={14}
                    className="text-yellow-300"
                    fill="currentColor"
                  />
                  <span className="text-xs font-semibold text-white">
                    {stats?.rating ?? "—"} امتیاز
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-brand-500" size={40} />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard>
            <StatCard
              icon={Calendar}
              label="نوبت‌های امروز"
              value={stats.today_count.toLocaleString("fa-IR")}
              color="brand"
              delay={0.1}
            />
          </TiltCard>
          <TiltCard>
            <StatCard
              icon={Clock}
              label="نوبت‌های آینده"
              value={stats.upcoming_count.toLocaleString("fa-IR")}
              color="yellow"
              delay={0.2}
            />
          </TiltCard>
          <TiltCard>
            <StatCard
              icon={CheckCircle2}
              label="انجام‌شده"
              value={stats.completed_count.toLocaleString("fa-IR")}
              color="green"
              delay={0.3}
            />
          </TiltCard>
          <TiltCard>
            <StatCard
              icon={Users}
              label="کل نوبت‌ها"
              value={stats.total_count.toLocaleString("fa-IR")}
              color="brand"
              delay={0.4}
            />
          </TiltCard>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600" />
            <div className="relative p-6 lg:p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <p className="text-sm font-medium text-white/90">درآمد کل</p>
              </div>
              <p className="text-4xl font-black mb-1">
                {stats.total_earned.toLocaleString("fa-IR")}
              </p>
              <p className="text-sm text-white/80">تومان</p>
              <p className="text-xs text-white/70 mt-4">
                از {stats.completed_count.toLocaleString("fa-IR")} نوبت
                انجام‌شده
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                نوبت بعدی شما
              </p>
            </div>

            {stats.next_appointment ? (
              <div>
                {(() => {
                  const j = getJalaliInfo(stats.next_appointment!.date);
                  const rel = getRelativeLabel(stats.next_appointment!.date);
                  return (
                    <>
                      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {stats.next_appointment!.start_time.slice(0, 5)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {j.weekdayFull} {j.fullDate}
                        </p>
                        {rel && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                            {rel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stats.next_appointment!.service_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        مراجع: {stats.next_appointment!.customer_name} —{" "}
                        <span dir="ltr">
                          {stats.next_appointment!.customer_phone}
                        </span>
                      </p>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  نوبتی در آینده ندارید
                </p>
              </div>
            )}

            <Link
              to="/specialist/appointments"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              مشاهده همه نوبت‌ها
              <ArrowLeft size={14} />
            </Link>
          </motion.div>
        </div>
      )}

      {stats && stats.cancelled_count > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-4 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center">
            <XCircle size={16} />
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">
            شما{" "}
            <span className="font-bold">
              {stats.cancelled_count.toLocaleString("fa-IR")}
            </span>{" "}
            نوبت لغو‌شده دارید
          </p>
        </motion.div>
      )}
    </div>
  );
}