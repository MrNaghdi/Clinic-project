import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Activity,
  Clock,
  Wallet,
  XCircle,
  Loader2,
} from "lucide-react";
import { fetchMe } from "../api/users.api";
import { getUserStats } from "../../booking/api/booking.api";
import { AuroraBackground } from "../../../shared/components/effects/AuroraBackground";
import { getJalaliInfo, getRelativeLabel } from "../../booking/utils/date";

export default function ProfilePage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats", "user"],
    queryFn: getUserStats,
  });

  if (userLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
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
                    alt={user.first_name || ""}
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

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 hover:shadow-lg transition-all overflow-hidden"
          >
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
              <p className="text-3xl font-black text-brand-500">
                {stats.upcoming_count.toLocaleString("fa-IR")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                <CheckCircle2 size={22} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                خدمات انجام‌شده
              </p>
              <p className="text-3xl font-black text-green-500">
                {stats.completed_count.toLocaleString("fa-IR")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4">
                <Wallet size={22} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                مجموع پرداخت
              </p>
              <p className="text-2xl font-black text-yellow-500">
                {stats.total_spent.toLocaleString("fa-IR")}
              </p>
              <p className="text-xs text-gray-400 mt-1">تومان</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                <XCircle size={22} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                لغو‌شده
              </p>
              <p className="text-3xl font-black text-red-500">
                {stats.cancelled_count.toLocaleString("fa-IR")}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {stats?.next_appointment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 via-blue-500 to-accent-500 p-6 lg:p-8 text-white"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Clock size={20} />
              </div>
              <p className="text-sm font-medium text-white/90">
                نوبت بعدی شما
              </p>
            </div>

            {(() => {
              const j = getJalaliInfo(stats.next_appointment!.date);
              const rel = getRelativeLabel(stats.next_appointment!.date);
              return (
                <>
                  <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                    <p className="text-3xl font-black">
                      {stats.next_appointment!.start_time.slice(0, 5)}
                    </p>
                    <p className="text-sm text-white/90">
                      {j.weekdayFull} {j.fullDate}
                    </p>
                    {rel && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-brand-500 text-[10px] font-bold">
                        {rel}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold mb-1">
                    {stats.next_appointment!.service_name}
                  </p>
                  <p className="text-sm text-white/80">
                    با {stats.next_appointment!.specialist_name}
                  </p>
                  <Link
                    to="/profile/appointments"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-white text-brand-500 px-4 h-9 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    مشاهده نوبت‌ها
                    <ArrowLeft size={14} />
                  </Link>
                </>
              );
            })()}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 lg:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            اطلاعات حساب کاربری
          </h2>
          <Link
            to="/profile/settings"
            className="text-sm text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1 group"
          >
            ویرایش
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              نام
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.first_name || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              نام خانوادگی
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.last_name || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              شماره تلفن
            </p>
            <p
              className="text-sm font-semibold text-gray-900 dark:text-white"
              dir="ltr"
            >
              {user?.phone || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              وضعیت حساب
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              فعال
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}