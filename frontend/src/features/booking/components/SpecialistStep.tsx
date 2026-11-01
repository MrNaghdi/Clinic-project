import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Star, Award, AlertCircle } from "lucide-react";
import { findAllSpecialists } from "../../specialists/api/specialists.api";
import type { Specialist } from "../../specialists/api/specialists.api";
import type { Service } from "../../services/api/services.api";

interface SpecialistStepProps {
  service: Service;
  selectedId: number | null;
  onSelect: (specialist: Specialist) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SpecialistStep({
  service,
  selectedId,
  onSelect,
  onNext,
  onBack,
}: SpecialistStepProps) {
  const { data: allSpecialists, isLoading } = useQuery({
    queryKey: ["specialists"],
    queryFn: findAllSpecialists,
  });

  const specialists = allSpecialists?.filter((s) =>
    s.services?.some((svc) => svc.id === service.id),
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
          کدام پزشک؟
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          متخصصانی که «{service.name}» ارائه می‌دهند
        </p>
      </div>

      {!specialists || specialists.length === 0 ? (
        <div className="text-center py-16 max-w-md mx-auto rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            متخصصی یافت نشد
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 px-4">
            متأسفانه هیچ متخصصی برای «{service.name}» وجود ندارد. لطفاً خدمت دیگری انتخاب کنید.
          </p>
          <button
            onClick={onBack}
            className="px-6 h-11 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm"
          >
            انتخاب خدمت دیگر
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {specialists.map((specialist, index) => {
              const isSelected = selectedId === specialist.id;
              const fullName = `${specialist.user?.first_name ?? ""} ${specialist.user?.last_name ?? ""}`.trim();
              const imageUrl = specialist.user?.profile_image
                ? `http://localhost:3000${specialist.user.profile_image}`
                : null;

              return (
                <motion.button
                  key={specialist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(specialist)}
                  className={`
                    group relative rounded-2xl text-center transition-colors duration-200 border-2 overflow-hidden aspect-square
                    ${
                      isSelected
                        ? "border-brand-500 shadow-lg shadow-brand-500/25"
                        : "border-gray-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/50"
                    }
                  `}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={fullName}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-500 to-accent-500 text-white text-4xl font-black">
                      {specialist.user?.first_name?.[0]}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg"
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  <div className="absolute bottom-0 right-0 left-0 p-3 text-right">
                    <h3 className="text-sm font-black text-white mb-0.5 truncate">
                      {fullName}
                    </h3>
                    <p className="text-[11px] text-white/80 mb-1.5 truncate">
                      متخصص پوست و زیبایی
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        <Star size={11} fill="currentColor" />
                        <span className="font-bold text-white">5.0</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="flex items-center gap-0.5">
                        <Award size={10} />
                        ۱۰+
                      </span>
                    </div>
                  </div>
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
              whileHover={{ scale: selectedId ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              disabled={!selectedId}
              className="px-8 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              مرحله بعد
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}