import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Users,
  CheckCircle2,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { findAllSpecialists } from "../api/specialists.api";
import { findAll as findAllServices } from "../../services/api/services.api";
import { Container } from "../../../shared/components/ui/Container";
import { SectionTitle } from "../../../shared/components/ui/SectionTitle";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { TiltCard } from "../../../shared/components/animations/TiltCard";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const SORT_OPTIONS = [
  { value: "default", label: "پیش‌فرض (بیشترین امتیاز)" },
  { value: "rating_desc", label: "بیشترین امتیاز" },
  { value: "review_count_desc", label: "بیشترین تعداد نظر" },
  { value: "name_asc", label: "نام (الفبا)" },
];

function SpecialistCard({
  specialist,
  index,
}: {
  specialist: any;
  index: number;
}) {
  const fullName =
    `${specialist.user?.first_name ?? ""} ${
      specialist.user?.last_name ?? ""
    }`.trim() || "بدون نام";

  const imageUrl = getImageUrl(specialist.user?.profile_image ?? null);

  const initials =
    (specialist.user?.first_name?.[0] ?? "") +
    (specialist.user?.last_name?.[0] ?? "");

  const services = specialist.services ?? [];
  const specialtyLabel =
    services.length > 0
      ? services
          .slice(0, 2)
          .map((s: any) => s.name)
          .join(" · ")
      : "متخصص";

  const rating = Number(specialist.rating ?? 0);
  const reviewCount = Number(specialist.review_count ?? 0);
  const hasReviews = reviewCount > 0;

  return (
    <RevealOnScroll delay={index * 0.03}>
      <TiltCard intensity={8}>
        <Link
          to={`/specialists/${specialist.id}`}
          className="group block relative rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/20 p-6 text-center"
        >
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

            <div className="relative">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={fullName}
                  loading="lazy"
                  className="w-32 h-32 rounded-full object-cover object-center border-4 border-white dark:border-ink-light shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-4xl font-black border-4 border-white dark:border-ink-light shadow-xl group-hover:scale-105 transition-transform duration-500">
                  {initials || "؟"}
                </div>
              )}

              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-500 border-4 border-white dark:border-ink-light flex items-center justify-center shadow-lg">
                <CheckCircle2
                  size={16}
                  className="text-white"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">
            {fullName}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
            {specialtyLabel}
          </p>

          <div className="flex items-center justify-center gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = hasReviews && star <= Math.round(rating);
              return (
                <Star
                  key={star}
                  size={14}
                  className={
                    filled
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                  fill={filled ? "#facc15" : "none"}
                />
              );
            })}
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1 tabular-nums">
              {hasReviews
                ? `${rating.toFixed(1)} (${toFa(reviewCount)})`
                : "بدون نظر"}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-accent-500 group-hover:text-white text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all duration-300">
            مشاهده پروفایل
            <motion.span className="inline-block" whileHover={{ x: -4 }}>
              <ArrowLeft size={16} />
            </motion.span>
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
}

export default function SpecialistsPage() {
  const { darkMode } = useDarkMode();
  const [searchParams, setSearchParams] = useSearchParams();

  const serviceIdParam = searchParams.get("service");
  const [serviceFilter, setServiceFilter] = useState<string>(
    serviceIdParam || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const {
    data: specialists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["specialists"],
    queryFn: findAllSpecialists,
    staleTime: 5 * 60 * 1000,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: findAllServices,
    staleTime: 5 * 60 * 1000,
  });

  const serviceOptions = useMemo(
    () => [
      { value: "", label: "همه خدمات" },
      ...services.map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    ],
    [services],
  );

  const activeService = serviceFilter
    ? services.find((s) => String(s.id) === serviceFilter)
    : null;

  const handleServiceChange = (value: string) => {
    setServiceFilter(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("service", value);
    } else {
      newParams.delete("service");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setServiceFilter("");
    setSearchQuery("");
    setSortBy("default");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("service");
    setSearchParams(newParams);
  };

  const filtered = useMemo(() => {
    if (!specialists) return [];

    let result = specialists.filter(
      (s) => s.status === "approved" && s.is_active,
    );

    if (serviceFilter) {
      result = result.filter((s) =>
        s.services?.some((svc) => String(svc.id) === serviceFilter),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((s) => {
        const name =
          `${s.user?.first_name ?? ""} ${s.user?.last_name ?? ""}`.toLowerCase();
        return name.includes(q);
      });
    }

    if (sortBy === "rating_desc" || sortBy === "default") {
      result = [...result].sort((a, b) => {
        const ratingA = Number(a.rating ?? 0);
        const ratingB = Number(b.rating ?? 0);
        const countA = Number(a.review_count ?? 0);
        const countB = Number(b.review_count ?? 0);

        if (ratingB !== ratingA) return ratingB - ratingA;
        return countB - countA;
      });
    } else if (sortBy === "review_count_desc") {
      result = [...result].sort((a, b) => {
        const countA = Number(a.review_count ?? 0);
        const countB = Number(b.review_count ?? 0);
        return countB - countA;
      });
    } else if (sortBy === "name_asc") {
      result = [...result].sort((a, b) => {
        const nameA = `${a.user?.first_name ?? ""} ${a.user?.last_name ?? ""}`;
        const nameB = `${b.user?.first_name ?? ""} ${b.user?.last_name ?? ""}`;
        return nameA.localeCompare(nameB, "fa");
      });
    }

    return result;
  }, [specialists, serviceFilter, searchQuery, sortBy]);

  const hasActiveFilter =
    !!serviceFilter || !!searchQuery || sortBy !== "default";

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <Container>
        <SectionTitle
          eyebrow="تیم متخصصان"
          title={
            activeService ? `متخصصان ${activeService.name}` : "متخصصان ما"
          }
          description={
            activeService
              ? `متخصصانی که «${activeService.name}» ارائه می‌دهند`
              : "تیمی از بهترین پزشکان و متخصصان پوست و زیبایی با سال‌ها تجربه"
          }
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
              فیلتر و جستجو
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                placeholder="جستجوی نام پزشک..."
                className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                    : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
                }`}
              />
            </div>

            <CustomSelect
              value={serviceFilter}
              onChange={handleServiceChange}
              options={serviceOptions}
              placeholder="همه خدمات"
              className="w-full"
            />

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
              {toFa(filtered.length)} متخصص یافت شد
            </p>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 animate-pulse"
              >
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-white/5 mx-auto mb-6" />
                <div className="h-6 w-32 rounded bg-gray-200 dark:bg-white/5 mx-auto mb-3" />
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-white/5 mx-auto mb-4" />
                <div className="h-10 rounded-full bg-gray-200 dark:bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-3xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-12 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              خطا در دریافت متخصصان. لطفاً دوباره تلاش کنید.
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
            <Users
              size={48}
              className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              متخصصی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              با فیلترهای فعلی هیچ متخصصی پیدا نشد
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((specialist, index) => (
              <SpecialistCard
                key={specialist.id}
                specialist={specialist}
                index={index}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}