import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";

const history: {
  id: number;
  service: string;
  doctor: string;
  date: string;
}[] = [];

export default function HistoryPage() {
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

      {history.length === 0 ? (
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
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            بعد از دریافت خدمات، تاریخچه‌ی آن‌ها اینجا نمایش داده می‌شود
          </p>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 lg:p-8">
          <div className="relative flex flex-col gap-8">
            {/* Timeline line */}
            <div className="absolute top-2 bottom-2 right-3.5 w-0.5 bg-gradient-to-b from-brand-500 via-accent-500 to-transparent" />

            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-6 pr-10"
              >
                <div className="absolute right-0 top-0 w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 border-4 border-white dark:border-ink-light flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white mb-1">
                    {item.service}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {item.doctor}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {item.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}