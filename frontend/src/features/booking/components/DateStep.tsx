import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Loader2, Check, CalendarX } from "lucide-react";
import { getWeekAvailability } from "../api/booking.api";
import { getJalaliInfo, getRelativeLabel, getTodayISO } from "../utils/date";

interface DateStepProps {
  specialistId: number;
  serviceId: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DateStep({
  specialistId,
  serviceId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onNext,
  onBack,
}: DateStepProps) {
  const startDate = useMemo(() => getTodayISO(), []);

  const { data, isLoading } = useQuery({
    queryKey: ["week-availability", specialistId, serviceId, startDate],
    queryFn: () =>
      getWeekAvailability({
        specialist_id: specialistId,
        service_id: serviceId,
        start_date: startDate,
      }),
  });

  const days = data?.days ?? [];

  const sortedDays = [...days].sort((a, b) => {
    const toSat = (jsDay: number) => (jsDay + 1) % 7;
    return toSat(a.day_of_week) - toSat(b.day_of_week);
  });

  const selectedDayData = sortedDays.find((d) => d.date === selectedDate);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
          چه زمانی؟
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          روز و ساعت مورد نظر خود را انتخاب کنید
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <Loader2 className="animate-spin text-brand-500" size={40} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            در حال بررسی...
          </p>
        </div>
      ) : sortedDays.length === 0 ? (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
            <CalendarX size={36} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            زمانی موجود نیست
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            این متخصص در ۷ روز آینده زمان خالی ندارد
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {sortedDays.filter((d) => d.available_count > 0).length} روز کاری
              موجود
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedDays.map((day, index) => {
                const info = getJalaliInfo(day.date);
                const relative = getRelativeLabel(day.date);
                const isSelected = selectedDate === day.date;
                const hasSlots = day.available_count > 0;

                return (
                  <motion.button
                    key={day.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={hasSlots ? { y: -3 } : {}}
                    whileTap={hasSlots ? { scale: 0.95 } : {}}
                    disabled={!hasSlots}
                    onClick={() => {
                      onSelectDate(day.date);
                      onSelectTime("");
                    }}
                    className={`
                      relative rounded-2xl p-4 text-center transition-all border-2
                      ${
                        !hasSlots
                          ? "bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/5 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : isSelected
                            ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white border-transparent shadow-lg shadow-brand-500/30 scale-105"
                            : "bg-white dark:bg-ink-light border-gray-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/50"
                      }
                    `}
                  >
                    {relative && (
                      <span
                        className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                          isSelected
                            ? "bg-white text-brand-500"
                            : hasSlots
                              ? "bg-brand-500 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {relative}
                      </span>
                    )}
                    <p
                      className={`text-xs font-semibold mb-1 ${isSelected ? "text-white/90" : hasSlots ? "text-gray-500 dark:text-gray-400" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      {info.weekdayFull}
                    </p>
                    <p
                      className={`text-2xl font-black leading-none mb-1 ${isSelected ? "text-white" : hasSlots ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      {info.day}
                    </p>
                    <p
                      className={`text-[11px] mb-3 ${isSelected ? "text-white/90" : hasSlots ? "text-gray-500 dark:text-gray-400" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      {info.monthName}
                    </p>
                    <div
                      className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold
                        ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : hasSlots
                              ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-white/5 text-gray-400"
                        }
                      `}
                    >
                      <Clock size={10} />
                      {hasSlots ? `${day.available_count} اسلات` : "بدون اسلات"}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDayData && (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {getJalaliInfo(selectedDayData.date).weekdayFull}{" "}
                      {getJalaliInfo(selectedDayData.date).shortDate}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedDayData.available_count} ساعت خالی
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {selectedDayData.slots.map((slot, index) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <motion.button
                        key={slot}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectTime(slot)}
                        className={`
                          h-12 rounded-xl font-bold text-sm transition-all relative
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30"
                              : "bg-white dark:bg-ink-light border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500"
                          }
                        `}
                      >
                        {slot}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow"
                          >
                            <Check
                              size={12}
                              className="text-brand-500"
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedDate && (
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                روی یکی از روزها کلیک کنید تا ساعت‌های خالی رو ببینید
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-6 h-12 rounded-full border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5"
        >
          مرحله قبل
        </button>
        <motion.button
          whileHover={{ scale: selectedDate && selectedTime ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="px-8 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          مرحله بعد
          <ChevronLeft size={18} />
        </motion.button>
      </div>
    </div>
  );
}