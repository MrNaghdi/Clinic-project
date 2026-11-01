import { motion, AnimatePresence } from "framer-motion";
import { Scissors, User, Calendar, Clock, X } from "lucide-react";
import type { Service } from "../../services/api/services.api";
import type { Specialist } from "../../specialists/api/specialists.api";
import { getJalaliInfo } from "../utils/date";

interface SelectionSummaryProps {
  service: Service | null;
  specialist: Specialist | null;
  date: string | null;
  time: string | null;
  currentStep: number;
  onClearService: () => void;
  onClearSpecialist: () => void;
  onClearDate: () => void;
  onClearTime: () => void;
}

export function SelectionSummary({
  service,
  specialist,
  date,
  time,
  currentStep,
  onClearService,
  onClearSpecialist,
  onClearDate,
  onClearTime,
}: SelectionSummaryProps) {
  const hasAny =
    (service && currentStep > 1) ||
    (specialist && currentStep > 2) ||
    (date && currentStep > 3) ||
    (time && currentStep > 3);

  if (!hasAny) return null;

  const specialistName = specialist
    ? `${specialist.user?.first_name ?? ""} ${specialist.user?.last_name ?? ""}`.trim()
    : "";

  const dateLabel = date ? getJalaliInfo(date) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-wrap items-center justify-center gap-2"
    >
      {/* Service */}
      <AnimatePresence>
        {service && currentStep > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1.5 pl-1.5 pr-3 h-9 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20"
          >
            <button
              onClick={onClearService}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="حذف خدمت"
            >
              <X size={10} />
            </button>
            <Scissors size={12} />
            <span>{service.name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Specialist */}
      <AnimatePresence>
        {specialist && currentStep > 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1.5 pl-1.5 pr-3 h-9 rounded-full bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20"
          >
            <button
              onClick={onClearSpecialist}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="حذف پزشک"
            >
              <X size={10} />
            </button>
            <User size={12} />
            <span>{specialistName || "پزشک"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date */}
      <AnimatePresence>
        {dateLabel && currentStep > 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1.5 pl-1.5 pr-3 h-9 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg shadow-green-500/20"
          >
            <button
              onClick={onClearDate}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="حذف تاریخ"
            >
              <X size={10} />
            </button>
            <Calendar size={12} />
            <span>
              {dateLabel.weekdayFull} {dateLabel.shortDate}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time */}
      <AnimatePresence>
        {time && currentStep > 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-1.5 pl-1.5 pr-3 h-9 rounded-full bg-orange-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/20"
          >
            <button
              onClick={onClearTime}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="حذف ساعت"
            >
              <X size={10} />
            </button>
            <Clock size={12} />
            <span>{time}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}