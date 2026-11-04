import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { findAll } from "../api/services.api";
import { Container } from "../../../shared/components/ui/Container";
import { SectionTitle } from "../../../shared/components/ui/SectionTitle";
import { Badge } from "../../../shared/components/ui/Badge";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { TiltCard } from "../../../shared/components/animations/TiltCard";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { useMemo, useState } from "react";

const SORT_OPTIONS = [
  { value: "default", label: "پیش‌فرض" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
  { value: "duration_asc", label: "کمترین زمان" },
  { value: "name_asc", label: "نام (الفبا)" },
];

export default function ServicesPage() {
  const { darkMode } = useDarkMode();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const { data: services, isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: findAll,
    staleTime: 5 * 60 * 1000,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("default");
  };

  const filtered = useMemo(() => {
    if (!services) return [];

    let result = [...services];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)),
      );
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "duration_asc":
        result.sort((a, b) => a.duration_minutes - b.duration_minutes);
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "fa"));
        break;
    }

    return result;
  }, [services, searchQuery, sortBy]);

  const hasActiveFilter = !!searchQuery || sortBy !== "default";

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <Container>
        <SectionTitle
          eyebrow="خدمات ما"
          title="خدمات تخصصی کلینیک"
          description="با بهترین کیفیت و جدیدترین متدهای روز دنیا، زیبایی خود را به سطح بعد ببرید"
        />

        <div
          className={`rounded-2xl border p-4 mb-8 ${
            darkMode
              ? "bg-white/[0.03] border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={16} className="text-brand-500" />
            <span
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              جستجو و مرتب‌سازی
            </span>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="mr-auto inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600"
              >
                <X size={12} />
                پاک کردن
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search
                size={16}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-white/40" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی خدمت..."
                className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                    : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
                }`}
              />
            </div>

            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              placeholder="مرتب‌سازی"
              className="w-full"
            />
          </div>

          {hasActiveFilter && (
            <p
              className={`text-xs mt-3 ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              {filtered.length} خدمت یافت شد
            </p>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-gray-200 dark:bg-white/5" />
                <div className="p-6">
                  <div className="h-6 w-32 rounded bg-gray-200 dark:bg-white/5 mb-3" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/5 mb-2" />
                  <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-3xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-12 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              خطا در دریافت خدمات. لطفاً دوباره تلاش کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
              تلاش دوباره
            </button>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-ink-light p-20 text-center">
            <Sparkles
              size={48}
              className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              خدمتی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              با فیلترهای فعلی هیچ خدمتی پیدا نشد
            </p>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="px-6 h-11 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service, index) => {
              const image = getImageUrl(service.image);

              return (
                <RevealOnScroll key={service.id} delay={index * 0.05}>
                  <TiltCard intensity={8}>
                    <Link
                      to={`/services/${service.id}`}
                      className="group block relative rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/20"
                    >
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-500/20 to-accent-500/20">
                        {image ? (
                          <img
                            src={image}
                            alt={service.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles
                              size={48}
                              className="text-white/40"
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-ink/90 backdrop-blur-md text-xs font-bold text-gray-900 dark:text-white">
                          {service.price.toLocaleString("fa-IR")} تومان
                        </div>

                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1.5">
                          <Clock size={12} />
                          {service.duration_minutes} دقیقه
                        </div>

                        <div className="absolute bottom-0 right-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-2xl font-black text-white">
                            {service.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-6 mb-4 line-clamp-2 min-h-[48px]">
                          {service.description || "توضیحات این خدمت به‌زودی..."}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge variant="brand">مشاهده جزئیات</Badge>
                          <motion.div
                            whileHover={{ x: -4 }}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-accent-500 group-hover:text-white text-gray-600 dark:text-gray-400 transition-all duration-300"
                          >
                            <ArrowLeft size={18} />
                          </motion.div>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          padding: "2px",
                          WebkitMask:
                            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      />
                    </Link>
                  </TiltCard>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}