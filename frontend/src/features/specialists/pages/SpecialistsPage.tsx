import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { findAllSpecialists } from "../api/specialists.api";
import { Container } from "../../../shared/components/ui/Container";
import { SectionTitle } from "../../../shared/components/ui/SectionTitle";
import { Badge } from "../../../shared/components/ui/Badge";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { TiltCard } from "../../../shared/components/animations/TiltCard";

export default function SpecialistsPage() {
  const { data: specialists, isLoading, isError } = useQuery({
    queryKey: ["specialists"],
    queryFn: findAllSpecialists,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <Container>
        <SectionTitle
          eyebrow="تیم متخصصان"
          title="متخصصان ما"
          description="تیمی از بهترین پزشکان و متخصصان پوست و زیبایی با سال‌ها تجربه"
        />

        {/* Loading */}
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

        {/* Error */}
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

        {/* Empty */}
        {specialists && specialists.length === 0 && (
          <div className="rounded-3xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-ink-light p-20 text-center">
            <Users
              size={48}
              className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              هنوز متخصصی ثبت نشده
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              به‌زودی متخصصان اضافه می‌شوند
            </p>
          </div>
        )}

        {/* Grid */}
        {specialists && specialists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialists.map((specialist, index) => {
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

              return (
                <RevealOnScroll key={specialist.id} delay={index * 0.05}>
                  <TiltCard intensity={8}>
                    <Link
                      to={`/specialists/${specialist.id}`}
                      className="group block relative rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/20 p-6 text-center"
                    >
                      {/* ── Avatar ── */}
                      <div className="relative inline-block mb-5">
                        {/* Gradient ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

                        <div className="relative">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={fullName}
                              className="w-32 h-32 rounded-full object-cover object-center border-4 border-white dark:border-ink-light shadow-xl group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-4xl font-black border-4 border-white dark:border-ink-light shadow-xl group-hover:scale-105 transition-transform duration-500">
                              {initials || "؟"}
                            </div>
                          )}

                          {/* Verified Badge */}
                          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-500 border-4 border-white dark:border-ink-light flex items-center justify-center shadow-lg">
                            <CheckCircle2
                              size={16}
                              className="text-white"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ── Name ── */}
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">
                        {fullName}
                      </h3>

                      {/* ── Specialty ── */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        متخصص پوست و زیبایی
                      </p>

                      {/* ── Rating ── */}
                      <div className="flex items-center justify-center gap-1 mb-5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-yellow-400"
                            fill="#facc15"
                          />
                        ))}
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">
                          5.0
                        </span>
                      </div>

                      {/* ── CTA Button ── */}
                      <div className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-accent-500 group-hover:text-white text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all duration-300">
                        مشاهده پروفایل
                        <motion.span
                          className="inline-block"
                          whileHover={{ x: -4 }}
                        >
                          <ArrowLeft size={16} />
                        </motion.span>
                      </div>

                      {/* Gradient border on hover */}
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