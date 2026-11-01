import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Calendar,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  findMyAppointments,
  AppointmentStatus,
} from "../../booking/api/booking.api";
import { getJalaliInfo } from "../../booking/utils/date";

export default function HistoryPage() {
  const { data: allAppointments, isLoading } = useQuery({
    queryKey: ["appointments", "my"],
    queryFn: () => findMyAppointments(),
  });

  const history = allAppointments?.filter(
    (a) => a.status === AppointmentStatus.Completed,
  );


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
          تاریخچه خدمات
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مروری بر خدماتی که تاکنون دریافت کرده‌اید
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-500" size={40} />
        </div>
      )}

      {!isLoading && (!history || history.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-6">
            <Clock size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
            تاریخچه‌ای وجود ندارد
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-8">
            بعد از دریافت اولین خدمت، تاریخچه‌ی آن اینجا نمایش داده می‌شود
          </p>
          <Link to="/booking">
            <button className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30">
              <Sparkles size={16} fill="currentColor" />
              رزرو اولین نوبت
            </button>
          </Link>
        </motion.div>
      )}

      {!isLoading && history && history.length > 0 && (
        <div className="max-w-3xl">
          <div className="relative">
            <div className="absolute top-0 bottom-0 right-5 w-0.5 bg-gradient-to-b from-brand-500 via-accent-500 to-transparent" />

            <div className="flex flex-col gap-6">
              {history.map((item, index) => {
                const jalali = getJalaliInfo(item.date);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pr-14"
                  >
                    <div className="absolute right-0 top-2 w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 z-10">
                      <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light p-5 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <h3 className="font-black text-lg text-gray-900 dark:text-white">
                          {item.service?.name}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold w-fit">
                          <CheckCircle2 size={12} />
                          انجام شد
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-brand-500" />
                          {item.specialist?.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-brand-500" />
                          {jalali.weekdayFull} {jalali.fullDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-brand-500" />
                          {item.start_time.slice(0, 5)}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          مبلغ پرداخت‌شده
                        </span>
                        <span className="text-sm font-bold text-brand-500">
                          {item.price.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}