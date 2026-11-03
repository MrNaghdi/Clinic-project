import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, Check, ArrowLeft } from "lucide-react";
import { findAll } from "../../services/api/services.api";
import type { Service } from "../../services/api/services.api";
import type { Specialist } from "../../specialists/api/specialists.api";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

interface ServiceStepProps {
  selectedId: number | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
  specialist?: Specialist | null;
}

export function ServiceStep({
  selectedId,
  onSelect,
  onNext,
  specialist = null,
}: ServiceStepProps) {
  const { data: allServices, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: findAll,
    staleTime: 5 * 60 * 1000,
  });

  const services = specialist
    ? (specialist.services ?? [])
    : (allServices ?? []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-72 rounded-3xl bg-gray-100 dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (specialist) {
    const fullName = `${specialist.user?.first_name ?? ""} ${specialist.user?.last_name ?? ""}`.trim();
    const imageUrl = getImageUrl(specialist.user?.profile_image ?? null);

    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border border-brand-200 dark:border-brand-500/30 mb-5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-ink-light shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-xl font-black border-2 border-white dark:border-ink-light shadow">
                {specialist.user?.first_name?.[0] ?? "?"}
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                رزرو نوبت با
              </p>
              <p className="text-base font-black text-gray-900 dark:text-white">
                {fullName}
              </p>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
            چه خدمتی می‌خواهید؟
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            از خدمات این پزشک انتخاب کنید
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              این پزشک هنوز خدمتی ثبت نکرده است.
            </p>
          </div>
        ) : (
          <ServiceGrid
            services={services}
            selectedId={selectedId}
            onSelect={onSelect}
            onNext={onNext}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
          چه خدمتی می‌خواهید؟
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          خدمت مورد نظر خود را انتخاب کنید
        </p>
      </div>

      <ServiceGrid
        services={services}
        selectedId={selectedId}
        onSelect={onSelect}
        onNext={onNext}
      />
    </div>
  );
}

function ServiceGrid({
  services,
  selectedId,
  onSelect,
  onNext,
}: {
  services: Service[];
  selectedId: number | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {services.map((service, index) => {
          const isSelected = selectedId === service.id;
          const image = getImageUrl(service.image);

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div
                onClick={() => onSelect(service)}
                className={`
                  group relative rounded-3xl overflow-hidden text-right transition-all duration-300 border-2 cursor-pointer
                  ${
                    isSelected
                      ? "border-brand-500 shadow-xl shadow-brand-500/20"
                      : "border-gray-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-lg"
                  }
                `}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={image ?? ""}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg"
                    >
                      <Check size={16} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-gray-900">
                    {service.price.toLocaleString("fa-IR")} تومان
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-ink-light">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} />
                    {service.duration_minutes} دقیقه
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: selectedId ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!selectedId}
          className="px-8 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/30 disabled:opacity-50 flex items-center gap-2"
        >
          مرحله بعد
          <ArrowLeft size={18} />
        </motion.button>
      </div>
    </>
  );
}