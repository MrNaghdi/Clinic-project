import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";
import { getAvailableSlots } from "../api/booking.api";

interface TimeStepProps {
  specialistId: number;
  serviceId: number;
  date: string;
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TimeStep({
  specialistId,
  serviceId,
  date,
  selectedTime,
  onSelect,
  onNext,
  onBack,
}: TimeStepProps) {
  const { data: slots, isLoading } = useQuery({
    queryKey: ["available-slots", specialistId, serviceId, date],
    queryFn: () =>
      getAvailableSlots({
        specialist_id: specialistId,
        service_id: serviceId,
        date,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
          چه ساعتی؟
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ساعت مورد نظر خود را انتخاب کنید
        </p>
      </div>

      {slots && slots.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12 rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <Clock size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            زمانی در دسترس نیست
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            برای این روز اسلات خالی وجود ندارد
          </p>
          <button
            onClick={onBack}
            className="px-6 h-11 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm"
          >
            انتخاب تاریخ دیگر
          </button>
        </div>
      ) : (
        <>
          <div className="max-w-lg mx-auto grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
            {slots?.map((slot, index) => {
              const isSelected = selectedTime === slot;

              return (
                <motion.button
                  key={slot}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(slot)}
                  className={`
                    h-14 rounded-2xl font-bold text-sm transition-all
                    ${
                      isSelected
                        ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30 scale-105"
                        : "bg-white dark:bg-ink-light border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500"
                    }
                  `}
                >
                  {slot}
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onBack}
              className="px-6 h-12 rounded-full border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              مرحله قبل
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              disabled={!selectedTime}
              className="px-8 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              مرحله بعد
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}