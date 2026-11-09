import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Edit3,
  Save,
  X,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  findMySpecialist,
  updateMySpecialistProfile,
  updateMySpecialistServices,
  updateMyWorkingHours,
  type WorkingHoursInput,
} from "../api/specialists.api";
import { findAll } from "../../services/api/services.api";
import type { Service } from "../../services/api/services.api";
import { AvatarUploader } from "../components/AvatarUploader";

const DAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

export default function SpecialistProfilePage() {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  const [isEditingHours, setIsEditingHours] = useState(false);
  const [hoursDraft, setHoursDraft] = useState<WorkingHoursInput[]>([]);

  const {
    data: myProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["specialists", "me"],
    queryFn: findMySpecialist,
    retry: false,
  });

  const { data: allServices } = useQuery({
    queryKey: ["services"],
    queryFn: findAll,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateMySpecialistProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists", "me"] });
    },
  });

  const updateServicesMutation = useMutation({
    mutationFn: updateMySpecialistServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists", "me"] });
    },
  });

  const hoursMutation = useMutation({
    mutationFn: updateMyWorkingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialists", "me"] });
      queryClient.invalidateQueries({ queryKey: ["week-availability"] });
      setIsEditingHours(false);
    },
  });

  const startEdit = () => {
    setBio(myProfile?.bio || "");
    setSelectedServiceIds(myProfile?.services?.map((s) => s.id) || []);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        updateProfileMutation.mutateAsync({ bio }),
        updateServicesMutation.mutateAsync(selectedServiceIds),
      ]);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleService = (id: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const startEditHours = () => {
    setHoursDraft(
      myProfile?.working_hours?.map((wh) => ({
        day_of_week: wh.day_of_week,
        start_time: wh.start_time.slice(0, 5),
        end_time: wh.end_time.slice(0, 5),
      })) || [],
    );
    setIsEditingHours(true);
  };

  const handleSaveHours = () => {
    if (hoursDraft.length === 0) {
      alert("حداقل یک روز باید انتخاب شود");
      return;
    }

    for (const wh of hoursDraft) {
      if (wh.start_time >= wh.end_time) {
        alert(
          `در روز ${DAYS[wh.day_of_week]}، ساعت پایان باید بزرگ‌تر از شروع باشد`,
        );
        return;
      }
    }

    hoursMutation.mutate(hoursDraft);
  };

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
      <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-6">
          <Sparkles size={36} />
        </div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
          پروفایل تخصصی یافت نشد
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          با مدیر تماس بگیرید
        </p>
      </div>
    );
  }

  const fullName = `${myProfile.user?.first_name ?? ""} ${
    myProfile.user?.last_name ?? ""
  }`.trim();

  const isSaving =
    updateProfileMutation.isPending || updateServicesMutation.isPending;

  const sortedWorkingHours = [...(myProfile.working_hours || [])].sort(
    (a, b) => {
      const toSat = (day: number) => (day + 1) % 7;
      return toSat(a.day_of_week) - toSat(b.day_of_week);
    },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
            پروفایل من
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            اطلاعات تخصصی شما در سیستم
          </p>
        </div>
        <div className="flex gap-2">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={startEdit}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all"
                >
                  <Edit3 size={16} />
                  ویرایش
                </button>
                <Link to={`/specialists/${myProfile.id}`}>
                  <button className="inline-flex items-center gap-2 px-5 h-11 rounded-full border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <User size={16} />
                    مشاهده در سایت
                  </button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-green-500 text-white font-semibold text-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  ذخیره
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 h-11 rounded-full border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold text-sm"
                >
                  <X size={16} />
                  لغو
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <div className="shrink-0">
            <AvatarUploader
              firstName={myProfile.user?.first_name ?? null}
              lastName={myProfile.user?.last_name ?? null}
              profileImage={myProfile.user?.profile_image ?? null}
            />
          </div>

          <div className="text-center sm:text-right flex-1">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center">
              <Phone size={16} className="text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                شماره تماس
              </p>
              <p
                className="text-sm font-semibold text-gray-900 dark:text-white"
                dir="ltr"
              >
                {myProfile.user?.phone ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            درباره من
          </h3>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="درباره خودتان بنویسید..."
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-ink text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none transition-colors"
            />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">
              {myProfile.bio || "توضیحی برای این متخصص ثبت نشده است."}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light p-6 lg:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brand-500" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              خدمات ارائه‌شده
            </h3>
          </div>
          {!isEditing && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {myProfile.services?.length || 0} خدمت
            </p>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allServices?.map((service: Service) => {
              const isChecked = selectedServiceIds.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border-2 text-right transition-all
                    ${
                      isChecked
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-gray-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/50"
                    }
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors
                      ${
                        isChecked
                          ? "bg-gradient-to-br from-brand-500 to-accent-500"
                          : "bg-gray-100 dark:bg-white/10"
                      }
                    `}
                  >
                    {isChecked && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isChecked
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {service.duration_minutes} دقیقه
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <>
            {myProfile.services && myProfile.services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myProfile.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center">
                      <Sparkles size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {service.duration_minutes} دقیقه
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                هنوز خدمتی انتخاب نکرده‌اید. روی «ویرایش» بزنید.
              </p>
            )}
          </>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light p-6 lg:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-brand-500" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              ساعات کاری
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {!isEditingHours ? (
              <motion.button
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={startEditHours}
                className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-semibold transition-colors"
              >
                <Edit3 size={14} />
                ویرایش
              </motion.button>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={handleSaveHours}
                  disabled={hoursMutation.isPending}
                  className="inline-flex items-center gap-1.5 text-sm bg-green-500 text-white px-4 h-9 rounded-lg font-semibold disabled:opacity-50"
                >
                  {hoursMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  ذخیره
                </button>
                <button
                  onClick={() => setIsEditingHours(false)}
                  disabled={hoursMutation.isPending}
                  className="inline-flex items-center gap-1.5 text-sm border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 h-9 rounded-lg font-semibold"
                >
                  <X size={14} />
                  لغو
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isEditingHours ? (
          <div className="space-y-2">
            {[6, 0, 1, 2, 3, 4, 5].map((dayIndex) => {
              const dayName = DAYS[dayIndex];
              const dayHour = hoursDraft.find(
                (h) => h.day_of_week === dayIndex,
              );
              const isActive = !!dayHour;

              return (
                <div
                  key={dayIndex}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-brand-50 dark:bg-brand-500/10 border-2 border-brand-200 dark:border-brand-500/30"
                      : "bg-gray-50 dark:bg-white/5 border-2 border-transparent"
                  }`}
                >
                  <label className="flex items-center gap-2 w-28 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHoursDraft((prev) => [
                            ...prev,
                            {
                              day_of_week: dayIndex,
                              start_time: "09:00",
                              end_time: "18:00",
                            },
                          ]);
                        } else {
                          setHoursDraft((prev) =>
                            prev.filter((h) => h.day_of_week !== dayIndex),
                          );
                        }
                      }}
                      className="w-4 h-4 rounded accent-brand-500"
                    />
                    <span
                      className={`text-sm font-semibold ${
                        isActive
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {dayName}
                    </span>
                  </label>

                  {isActive && dayHour && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="time"
                        value={dayHour.start_time}
                        onChange={(e) => {
                          setHoursDraft((prev) =>
                            prev.map((h) =>
                              h.day_of_week === dayIndex
                                ? { ...h, start_time: e.target.value }
                                : h,
                            ),
                          );
                        }}
                        className="h-9 px-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-ink text-sm flex-1 min-w-0"
                        dir="ltr"
                      />
                      <span className="text-gray-400 text-xs shrink-0">
                        تا
                      </span>
                      <input
                        type="time"
                        value={dayHour.end_time}
                        onChange={(e) => {
                          setHoursDraft((prev) =>
                            prev.map((h) =>
                              h.day_of_week === dayIndex
                                ? { ...h, end_time: e.target.value }
                                : h,
                            ),
                          );
                        }}
                        className="h-9 px-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-ink text-sm flex-1 min-w-0"
                        dir="ltr"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {hoursMutation.isError && (
              <div className="mt-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                {(hoursMutation.error as any)?.response?.data?.message ||
                  "خطا در ذخیره ساعات کاری"}
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              ⚠️ ساعت‌های جدید نباید با نوبت‌های آینده تداخل داشته باشند.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedWorkingHours.length > 0 ? (
              sortedWorkingHours.map((wh) => {
                const dayLabel =
                  DAYS[wh.day_of_week] ?? String(wh.day_of_week);
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
                      {wh.start_time?.slice(0, 5)} -{" "}
                      {wh.end_time?.slice(0, 5)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                هنوز ساعات کاری تنظیم نشده است. روی «ویرایش» بزنید.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}