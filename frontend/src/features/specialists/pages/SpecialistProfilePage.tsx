import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { findMySpecialist } from "../api/specialists.api";

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

export default function SpecialistProfilePage() {
  const {
    data: myProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["specialists", "me"],
    queryFn: findMySpecialist,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-8 animate-pulse">
        <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-white/5 mb-6" />
        <div className="h-6 w-48 rounded bg-gray-200 dark:bg-white/5 mb-3" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/5" />
      </div>
    );
  }

  if (isError || !myProfile) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
            پروفایل من
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            اطلاعات تخصصی خود را ببینید
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
            پروفایل تخصصی یافت نشد
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            برای شما هنوز پروفایل تخصصی توسط مدیر ساخته نشده است. با مدیر تماس
            بگیرید.
          </p>
        </motion.div>
      </div>
    );
  }

  const fullName = `${myProfile.user?.first_name ?? ""} ${
    myProfile.user?.last_name ?? ""
  }`.trim();

  const imageUrl = myProfile.user?.profile_image
    ? `http://localhost:3000${myProfile.user.profile_image}`
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
            پروفایل من
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            اطلاعات تخصصی شما در سیستم
          </p>
        </div>
        <Link to={`/specialists/${myProfile.id}`}>
          <button className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/30 transition-all">
            <ExternalLink size={16} />
            مشاهده در سایت
          </button>
        </Link>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light overflow-hidden"
      >
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-white/10 shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-3xl font-black border-4 border-gray-100 dark:border-white/10 shrink-0">
                {myProfile.user?.first_name?.[0]}
                {myProfile.user?.last_name?.[0]}
              </div>
            )}

            <div className="min-w-0 flex-1 text-center sm:text-right">
              <h2 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-2">
                {fullName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                متخصص پوست و زیبایی
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  متخصص فعال
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium">
                  <Award size={12} />
                  تایید شده
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center">
                <Phone size={16} className="text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  شماره تماس
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white" dir="ltr">
                  {myProfile.user?.phone ?? "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center">
                <Briefcase size={16} className="text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  تخصص
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  پوست و زیبایی
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {myProfile.bio && (
            <div className="pt-6 border-t border-gray-100 dark:border-white/5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                درباره من
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">
                {myProfile.bio}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Working Hours */}
      {myProfile.working_hours && myProfile.working_hours.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-6 lg:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <Clock size={18} className="text-brand-500" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              ساعات کاری
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myProfile.working_hours.map((wh) => {
              const dayLabel =
                DAYS[wh.day_of_week] ??
                DAYS[String(wh.day_of_week)] ??
                String(wh.day_of_week);

              return (
                <div
                  key={wh.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5"
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {dayLabel}
                  </span>
                  <span
                    className="text-sm font-medium text-brand-500"
                    dir="ltr"
                  >
                    {wh.start_time?.slice(0, 5)} - {wh.end_time?.slice(0, 5)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}