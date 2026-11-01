import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Plus,
  XCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  findMyAppointments,
  cancelAppointment,
  AppointmentStatus,
} from "../../booking/api/booking.api";
import { getJalaliInfo } from "../../booking/utils/date";

const STATUS_CONFIG = {
  [AppointmentStatus.Pending]: {
    label: "در انتظار",
    className:
      "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
    icon: Clock,
  },
  [AppointmentStatus.Confirmed]: {
    label: "تایید‌شده",
    className:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30",
    icon: CheckCircle2,
  },
  [AppointmentStatus.Completed]: {
    label: "انجام‌شده",
    className:
      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    icon: CheckCircle2,
  },
  [AppointmentStatus.Cancelled]: {
    label: "لغو‌شده",
    className:
      "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30",
    icon: XCircle,
  },
  [AppointmentStatus.NoShow]: {
    label: "عدم حضور",
    className:
      "bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30",
    icon: XCircle,
  },
};

const TABS = [
  { value: "all", label: "همه" },
  { value: AppointmentStatus.Pending, label: "در انتظار" },
  { value: AppointmentStatus.Confirmed, label: "تایید‌شده" },
  { value: AppointmentStatus.Completed, label: "انجام‌شده" },
  { value: AppointmentStatus.Cancelled, label: "لغو‌شده" },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchParams] = useSearchParams();
  const newId = searchParams.get("new");
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", "my"],
    queryFn: () => findMyAppointments(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelAppointment(id, "لغو توسط کاربر"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "my"] });
    },
  });

  const filtered =
    activeTab === "all"
      ? appointments
      : appointments?.filter((a) => a.status === activeTab);

  return (
    <div>
      {newId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 flex items-start gap-3 shadow-lg shadow-green-500/20"
        >
          <CheckCircle2 size={24} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">نوبت شما با موفقیت ثبت شد! 🎉</p>
            <p className="text-sm text-white/90 mt-1">
              منتظر تایید پزشک باشید — پیامک تایید برای شما ارسال می‌شود
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
            نوبت‌های من
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            مدیریت نوبت‌های رزرو شده و پیشین شما
          </p>
        </div>
        <Link to="/booking">
          <button className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50">
            <Plus size={16} />
            رزرو نوبت جدید
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 h-9 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-500" size={40} />
        </div>
      )}

      {/* Empty */}
      {!isLoading && (!filtered || filtered.length === 0) && (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-6">
            <Calendar size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
            نوبتی وجود ندارد
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            {activeTab === "all"
              ? "هنوز نوبتی رزرو نکرده‌اید"
              : "نوبتی با این وضعیت وجود ندارد"}
          </p>
          {activeTab === "all" && (
            <Link to="/booking">
              <button className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold">
                <Calendar size={16} />
                رزرو نوبت
              </button>
            </Link>
          )}
        </div>
      )}

      {/* List */}
      {!isLoading && filtered && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((apt, index) => {
              const status = STATUS_CONFIG[apt.status];
              const StatusIcon = status.icon;
              const jalali = getJalaliInfo(apt.date);
              const canCancel =
                apt.status === AppointmentStatus.Pending ||
                apt.status === AppointmentStatus.Confirmed;

              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-2xl border bg-white dark:bg-ink-light border-gray-200 dark:border-white/10 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-black text-gray-900 dark:text-white">
                          {apt.service?.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.className}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-brand-500" />
                          {apt.specialist?.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-brand-500" />
                          {jalali.weekdayFull} {jalali.fullDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-brand-500" />
                          {apt.start_time.slice(0, 5)} -{" "}
                          {apt.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-left mr-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          قیمت
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {apt.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                      {canCancel && (
                        <button
                          onClick={() => {
                            if (confirm("آیا از لغو این نوبت مطمئن هستید؟")) {
                              cancelMutation.mutate(apt.id);
                            }
                          }}
                          disabled={cancelMutation.isPending}
                          className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="لغو نوبت"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}