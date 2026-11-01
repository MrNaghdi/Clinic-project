import { motion } from "framer-motion";
import {
  Check,
  Scissors,
  User,
  Clock,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

const steps = [
  { id: 1, label: "خدمت", desc: "چی می‌خوای؟", icon: Scissors },
  { id: 2, label: "پزشک", desc: "کی؟", icon: User },
  { id: 3, label: "زمان", desc: "کِی؟", icon: Clock },
  { id: 4, label: "تایید", desc: "بررسی", icon: CheckCircle2 },
  { id: 5, label: "پرداخت", desc: "پرداخت", icon: CreditCard },
];

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div dir="rtl" className="w-full max-w-3xl mx-auto mb-10">
      <div className="relative flex items-start justify-between">
        <div className="absolute top-6 right-6 left-6 h-0.5 bg-gray-200 dark:bg-white/10 -z-10" />
        <motion.div
          className="absolute top-6 right-6 h-0.5 bg-gradient-to-l from-brand-500 to-accent-500 -z-10"
          initial={{ width: "0%" }}
          animate={{
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 12px)`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative flex-1"
            >
              <motion.div
                initial={false}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                  ${
                    isCompleted
                      ? "bg-gradient-to-br from-brand-500 to-accent-500 border-transparent text-white shadow-lg shadow-brand-500/30"
                      : isCurrent
                        ? "bg-white dark:bg-ink-light border-brand-500 text-brand-500 shadow-lg shadow-brand-500/20"
                        : "bg-white dark:bg-ink-light border-gray-200 dark:border-white/10 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <Icon size={20} />
                )}
              </motion.div>

              <p
                className={`mt-2 text-xs font-bold transition-colors ${
                  isCurrent || isCompleted
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              <p
                className={`text-[10px] transition-colors ${
                  isCurrent ? "text-brand-500 font-semibold" : "text-gray-400"
                }`}
              >
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}