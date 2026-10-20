import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { findAll } from "../api/services.api";
import { Container } from "../../../shared/components/ui/Container";
import { SectionTitle } from "../../../shared/components/ui/SectionTitle";
import { Badge } from "../../../shared/components/ui/Badge";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { TiltCard } from "../../../shared/components/animations/TiltCard";

import serviceFace from "../../../assets/image/botax.jpg";
import serviceHair from "../../../assets/image/lift.webp";
import serviceLaser from "../../../assets/image/laser.webp";

const serviceImages: Record<string, string> = {
  "لیزر": serviceLaser,
  "لیزر موهای زائد": serviceLaser,
  "لیزر مو": serviceLaser,
  "لیفت": serviceHair,
  "لیفت صورت": serviceHair,
  "لیفت ابرو": serviceHair,
  "بوتاکس": serviceFace,
  "تزریق بوتاکس": serviceFace,
  "بوتاکس صورت": serviceFace,
};

const DEFAULT_IMAGE = serviceFace;

export default function ServicesPage() {
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: findAll,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <Container>
        <SectionTitle
          eyebrow="خدمات ما"
          title="خدمات تخصصی کلینیک"
          description="با بهترین کیفیت و جدیدترین متدهای روز دنیا، زیبایی خود را به سطح بعد ببرید"
        />

        {/* Loading */}
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

        {/* Error */}
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

        {/* Empty */}
        {services && services.length === 0 && (
          <div className="rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-ink-light p-20 text-center">
            <Sparkles
              size={48}
              className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              هنوز خدمتی ثبت نشده
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              به‌زودی خدمات جدید اضافه می‌شود
            </p>
          </div>
        )}

        {/* Grid */}
        {services && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const image = serviceImages[service.name] || DEFAULT_IMAGE;

              return (
                <RevealOnScroll key={service.id} delay={index * 0.05}>
                  <TiltCard intensity={8}>
                    <Link
                      to={`/services/${service.id}`}
                      className="group block relative rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/20"
                    >
                      {/* ── Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={image}
                          alt={service.name}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-ink/90 backdrop-blur-md text-xs font-bold text-gray-900 dark:text-white">
                          {service.price.toLocaleString("fa-IR")} تومان
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1.5">
                          <Clock size={12} />
                          {service.duration_minutes} دقیقه
                        </div>

                        {/* Service Name (on image) */}
                        <div className="absolute bottom-0 right-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-2xl font-black text-white">
                            {service.name}
                          </h3>
                        </div>
                      </div>

                      {/* ── Content */}
                      <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-6 mb-4 line-clamp-2 min-h-[48px]">
                          {service.description || "توضیحات این خدمت به‌زودی..."}
                        </p>

                        {/* CTA */}
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

                      {/* Gradient border on hover — یک رنگ واحد */}
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