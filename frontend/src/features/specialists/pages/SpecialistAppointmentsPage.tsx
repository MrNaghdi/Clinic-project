import { motion } from "framer-motion";
import { Calendar, Sparkles, Clock } from "lucide-react";

export default function SpecialistAppointmentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
          نوبت‌های من
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مدیریت نوبت‌های رزرو شده برای شما
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-6">
          <Calendar size={36} />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
          به‌زودی
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
          این بخش پس از تکمیل ماژول نوبت‌دهی فعال می‌شود
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-brand-500 font-medium">
          <Clock size={14} />
          در حال توسعه...
        </div>
      </motion.div>
    </div>
  );
}