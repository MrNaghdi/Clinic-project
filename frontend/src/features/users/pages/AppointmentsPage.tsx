import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Plus, Sparkles } from "lucide-react";

const appointments: {
  id: number;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}[] = [];

const statusMap = {
  upcoming: {
    label: "در انتظار",
    className:
      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  completed: {
    label: "انجام‌شده",
    className:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  },
  cancelled: {
    label: "لغو‌شده",
    className: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export default function AppointmentsPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
            نوبت‌های من
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            مدیریت نوبت‌های رزرو شده و پیشین شما
          </p>
        </div>
        <Link to="/services">
          <button className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/30 transition-all">
            <Plus size={16} />
            رزرو نوبت جدید
          </button>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-6">
            <Calendar size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
            هنوز نوبتی ثبت نکرده‌اید
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            برای دریافت بهترین خدمات زیبایی، همین حالا یک نوبت رزرو کنید
          </p>
          <Link to="/services">
            <button className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all">
              <Sparkles size={16} fill="currentColor" />
              شروع رزرو
            </button>
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-5 hover:shadow-lg transition-all"
            >
              
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}