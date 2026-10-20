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
} from "lucide-react";
import { fetchMe } from "../../users/api/users.api";
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
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
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
  value: string;
  color: "brand" | "green" | "yellow";
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
      {/* Gradient Border */}
      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${c.border} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />
      
      {/* Card */}
      <div className="relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 overflow-hidden">
        {/* Glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${c.glow} blur-3xl group-hover:scale-150 transition-transform duration-700`} />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
              <Icon size={22} />
            </div>
            <TrendingUp size={18} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
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

  return (
    <div className="space-y-6">
      {/* ═══ Hero with Aurora ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-blue-700 to-accent-600" />
        
        {/* Aurora */}
        <div className="absolute inset-0 opacity-100">
          <AuroraBackground />
        </div>

        {/* Grid subtle */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Content */}
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
                {/* Online Badge */}
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                  <Activity size={14} className="text-white" />
                </div>
              </div>
            </motion.div>

            {/* Info */}
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
                  <Star size={14} className="text-yellow-300" fill="currentColor" />
                  <span className="text-xs font-semibold text-white">
                    ۵.۰ امتیاز
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <TiltCard>
          <StatCard
            icon={Calendar}
            label="نوبت‌های امروز"
            value="۰"
            color="brand"
            delay={0.1}
          />
        </TiltCard>
        <TiltCard>
          <StatCard
            icon={CheckCircle2}
            label="انجام‌شده این ماه"
            value="۰"
            color="green"
            delay={0.2}
          />
        </TiltCard>
        <TiltCard>
          <StatCard
            icon={Star}
            label="امتیاز شما"
            value="—"
            color="yellow"
            delay={0.3}
          />
        </TiltCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 backdrop-blur-xl" />
        
        {/* Border */}
        <div className="absolute inset-0 rounded-3xl border border-gray-200/50 dark:border-white/10" />

        {/* Glow */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative p-8">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 blur-lg opacity-50" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                به پنل متخصص خوش آمدید
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">
                در این پنل می‌توانید نوبت‌های خود را مدیریت کنید، پروفایل خود را
                ویرایش کنید و گزارش عملکرد خود را ببینید.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}