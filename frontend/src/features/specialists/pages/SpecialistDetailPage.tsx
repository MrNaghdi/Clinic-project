import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Star,
  Clock,
  Sparkles,
  Award,
  Briefcase,
} from "lucide-react";
import { findOneSpecialist } from "../api/specialists.api";
import { Container } from "../../../shared/components/ui/Container";
import { Button } from "../../../shared/components/ui/Button";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";

const DAYS: Record<string | number, string> = {
  0: "یکشنبه",
  1: "دوشنبه",
  2: "سه‌شنبه",
  3: "چهارشنبه",
  4: "پنجشنبه",
  5: "جمعه",
  6: "شنبه",
  sunday: "یکشنبه",
  monday: "دوشنبه",
  tuesday: "سه‌شنبه",
  wednesday: "چهارشنبه",
  thursday: "پنجشنبه",
  friday: "جمعه",
  saturday: "شنبه",
};

export default function SpecialistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const specialistId = Number(id);

  const { data: specialist, isLoading, isError } = useQuery({
    queryKey: ["specialists", specialistId],
    queryFn: () => findOneSpecialist(specialistId),
    enabled: !!specialistId,
  });

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-white dark:bg-ink pt-24 pb-20">
        <Container size="lg">
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-white/5" />
            <div className="p-10">
              <div className="h-10 w-64 rounded bg-gray-200 dark:bg-white/5 mb-4" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/5 mb-2" />
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-white/5" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !specialist) {
    return (
      <div dir="rtl" className="min-h-screen bg-white dark:bg-ink pt-32 pb-20">
        <Container size="md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              متخصص یافت نشد
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              متخصص مورد نظر پیدا نشد یا حذف شده است
            </p>
            <Link to="/specialists">
              <Button variant="brand" size="lg" icon={<ArrowRight size={18} />}>
                بازگشت به لیست متخصصان
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const fullName =
    `${specialist.user?.first_name ?? ""} ${
      specialist.user?.last_name ?? ""
    }`.trim() || "بدون نام";

  const imageUrl = specialist.user?.profile_image
    ? `http://localhost:3000${specialist.user.profile_image}`
    : null;

  const initials =
    (specialist.user?.first_name?.[0] ?? "") +
    (specialist.user?.last_name?.[0] ?? "");

  const workingHours = specialist.working_hours ?? [];
  const services = specialist.services ?? [];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white dark:bg-ink pt-20 pb-20"
    >
      <Container size="lg">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-brand-500 transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link
            to="/specialists"
            className="hover:text-brand-500 transition-colors"
          >
            متخصصان
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {fullName}
          </span>
        </motion.nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ═══ RIGHT — Photo + Stats + CTA ═══ */}
          <div className="lg:col-span-1 lg:order-1">
            <RevealOnScroll>
              <div className="lg:sticky lg:top-28">
                {/* Photo */}
                <div className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 aspect-[4/5] mb-6">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={fullName}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-ink-softer dark:to-ink-light text-gray-400 dark:text-gray-500 text-8xl font-black">
                      {initials || "؟"}
                    </div>
                  )}

                  {/* Verified badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-ink/95 backdrop-blur-md shadow-md">
                    <CheckCircle2
                      size={14}
                      className="text-brand-500"
                      fill="currentColor"
                    />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      تایید شده
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-2xl bg-gray-50 dark:bg-white/5 p-4 text-center">
                    <Award size={20} className="text-brand-500 mx-auto mb-2" />
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      ۱۰+
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      سال تجربه
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 dark:bg-white/5 p-4 text-center">
                    <Star
                      size={20}
                      className="text-yellow-400 mx-auto mb-2"
                      fill="#facc15"
                    />
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                      5.0
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      امتیاز
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Link to={`/booking?specialist=${specialist.id}`}>
                  <Button
                    variant="brand"
                    size="lg"
                    className="w-full"
                    icon={<Calendar size={18} />}
                  >
                    رزرو نوبت
                  </Button>
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* ═══ LEFT — Content ═══ */}
          <div className="lg:col-span-2 lg:order-2 space-y-6">
            {/* Header */}
            <RevealOnScroll delay={0.1}>
              <div className="pb-6 border-b border-gray-200 dark:border-white/5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  متخصص فعال
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {fullName}
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  متخصص پوست و زیبایی
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Star size={16} className="text-yellow-400" fill="#facc15" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      5.0
                    </span>
                    (۱۲ نظر)
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={16} className="text-brand-500" />
                    ۱۰+ سال تجربه
                  </span>
                </div>
              </div>
            </RevealOnScroll>

            {/* About */}
            <RevealOnScroll delay={0.2}>
              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  درباره متخصص
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-8">
                  {specialist.bio || "توضیحی برای این متخصص ثبت نشده است."}
                </p>
              </div>
            </RevealOnScroll>

            {/* Working Hours */}
            {workingHours.length > 0 && (
              <RevealOnScroll delay={0.3}>
                <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="text-brand-500" size={20} />
                    ساعات کاری
                  </h2>

                  <div className="space-y-2">
                    {workingHours.map((wh) => {
                      const dayLabel =
                        DAYS[wh.day_of_week] ??
                        DAYS[String(wh.day_of_week)] ??
                        String(wh.day_of_week);

                      return (
                        <div
                          key={wh.id}
                          className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {dayLabel}
                          </span>
                          <span
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums"
                            dir="ltr"
                          >
                            {wh.start_time?.slice(0, 5)} -{" "}
                            {wh.end_time?.slice(0, 5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </RevealOnScroll>
            )}

            {/* Services */}
            {services.length > 0 && (
              <RevealOnScroll delay={0.4}>
                <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="text-brand-500" size={20} />
                    خدمات ارائه‌شده
                  </h2>

                  <div className="space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors truncate">
                            {service.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {service.duration_minutes} دقیقه
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {service.price.toLocaleString("fa-IR")}
                            <span className="text-xs font-normal text-gray-500 mr-1">
                              تومان
                            </span>
                          </span>
                          <ArrowLeft
                            size={16}
                            className="text-gray-400 group-hover:text-brand-500 transition-colors"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            )}

            {/* Back */}
            <RevealOnScroll delay={0.5}>
              <button
                onClick={() => navigate(-1)}
                className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight size={18} />
                بازگشت
              </button>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </div>
  );
}