import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Star, Award, AlertCircle } from "lucide-react";
import { findAllSpecialists } from "../../specialists/api/specialists.api";
import type { Specialist } from "../../specialists/api/specialists.api";
import type { Service } from "../../services/api/services.api";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

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
    staleTime: 5 * 60 * 1000,
  });

  const specialists = allSpecialists?.filter(
    (s) =>
      s.status === "approved" &&
      s.is_active &&
      s.services?.some((svc) => svc.id === service.id),
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"
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
            متأسفانه هیچ متخصصی برای «{service.name}» وجود ندارد.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {specialists.map((specialist, index) => {
              const isSelected = selectedId === specialist.id;
              const fullName = `${specialist.user?.first_name ?? ""} ${specialist.user?.last_name ?? ""}`.trim();
              const imageUrl = getImageUrl(specialist.user?.profile_image ?? null);

              return (
                <motion.button
                  key={specialist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(specialist)}
                  className={`
                    group relative rounded-2xl text-right transition-all duration-300 border-2 overflow-hidden flex items-center gap-4 p-5
                    ${
                      isSelected
                        ? "border-brand-500 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 shadow-lg shadow-brand-500/20"
                        : "border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-lg"
                    }
                  `}
                >
                  <div className="relative shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={fullName}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          e.currentTarget.parentElement
                            ?.querySelector(".fallback-avatar")
                            ?.classList.remove("hidden");
                        }}
                        className="w-20 h-20 rounded-full object-cover object-top border-2 border-white dark:border-ink-light shadow"
                      />
                    ) : null}
                    <div
                      className={`fallback-avatar ${
                        imageUrl ? "hidden" : ""
                      } w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-2xl font-black`}
                    >
                      {specialist.user?.first_name?.[0] ?? "?"}
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-md border-2 border-white dark:border-ink-light"
                      >
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                      {fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                      {specialist.services
                        ?.slice(0, 2)
                        .map((s) => s.name)
                        .join(" · ")}
                    </p>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mr-0.5">
                          5.0
                        </span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Award size={12} />
                        ۱۰+ سال
                      </div>
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