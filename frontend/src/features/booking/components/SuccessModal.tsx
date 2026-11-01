import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Calendar,
  Home,
} from "lucide-react";

interface SuccessModalProps {
  appointmentId: number;
  onClose: () => void;
}

const timeline = [
  {
    icon: CheckCircle2,
    title: "نوبت شما ثبت شد",
    description: "به‌طور خودکار در پنل شما ذخیره شد",
    status: "done" as const,
  },
  {
    icon: Clock,
    title: "منتظر تایید پزشک",
    description: "معمولاً کمتر از ۳۰ دقیقه",
    status: "current" as const,
  },
  {
    icon: MessageSquare,
    title: "پیامک تایید",
    description: "بعد از تایید پزشک دریافت می‌کنید",
    status: "future" as const,
  },
  {
    icon: Calendar,
    title: "روز نوبت",
    description: "با خودتون کارت شناسایی بیارید",
    status: "future" as const,
  },
];

export function SuccessModal({ appointmentId, onClose }: SuccessModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-ink-light rounded-3xl p-8 max-w-md w-full shadow-2xl my-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
        >
          <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2"
        >
          نوبت شما ثبت شد! 🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 dark:text-gray-400 text-center mb-8"
        >
          شماره پیگیری: <span className="font-bold text-gray-900 dark:text-white">#{appointmentId}</span>
        </motion.p>

        {/* Timeline */}
        <div className="relative mb-8">
          <div className="absolute top-5 right-5 bottom-5 w-0.5 bg-gray-200 dark:bg-white/10" />
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="relative flex gap-3 pb-5 last:pb-0 pr-14"
              >
                <div
                  className={`
                    absolute right-0 w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-ink-light
                    ${
                      item.status === "done"
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                        : item.status === "current"
                          ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white"
                          : "bg-gray-100 dark:bg-white/10 text-gray-400"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                <div className="pt-1.5">
                  <p
                    className={`text-sm font-bold ${
                      item.status === "future"
                        ? "text-gray-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2">
          <Link to="/profile/appointments">
            <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2">
              <Calendar size={18} />
              مشاهده نوبت‌های من
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full h-12 rounded-2xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            بازگشت به صفحه اصلی
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}