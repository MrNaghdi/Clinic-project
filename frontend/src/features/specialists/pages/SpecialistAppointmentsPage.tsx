import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Loader2, Phone } from "lucide-react";
import axiosInstance from "../../../shared/api/axiosInstance";
import {
  AppointmentStatus,
  type Appointment,
} from "../../booking/api/booking.api";
import { getJalaliInfo } from "../../booking/utils/date";

async function findSpecialistAppointments(
  status?: AppointmentStatus,
): Promise<Appointment[]> {
  const res = await axiosInstance.get<Appointment[]>(
    "/appointments/specialist",
    { params: status ? { status } : undefined },
  );
  return res.data;
}

async function confirmAppointment(id: number): Promise<Appointment> {
  const res = await axiosInstance.patch<Appointment>(
    `/appointments/${id}/confirm`,
  );
  return res.data;
}

async function completeAppointment(id: number): Promise<Appointment> {
  const res = await axiosInstance.patch<Appointment>(
    `/appointments/${id}/complete`,
  );
  return res.data;
}

const STATUS_CONFIG = {
  [AppointmentStatus.Pending]: {
    label: "در انتظار تایید",
    className:
      "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200",
  },
  [AppointmentStatus.Confirmed]: {
    label: "تایید‌شده",
    className:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200",
  },
  [AppointmentStatus.Completed]: {
    label: "انجام‌شده",
    className:
      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200",
  },
  [AppointmentStatus.Cancelled]: {
    label: "لغو‌شده",
    className:
      "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200",
  },
  [AppointmentStatus.NoShow]: {
    label: "عدم حضور",
    className:
      "bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200",
  },
};

const TABS = [
  { value: AppointmentStatus.Pending, label: "در انتظار" },
  { value: AppointmentStatus.Confirmed, label: "تایید‌شده" },
  { value: AppointmentStatus.Completed, label: "انجام‌شده" },
  { value: "all", label: "همه" },
];

export default function SpecialistAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<string>(AppointmentStatus.Pending);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments", "specialist", activeTab],
    queryFn: () =>
      findSpecialistAppointments(
        activeTab === "all" ? undefined : (activeTab as AppointmentStatus),
      ),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["appointments", "specialist"],
    });
  };

  const confirmMutation = useMutation({
    mutationFn: confirmAppointment,
    onSuccess: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: completeAppointment,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
          نوبت‌های من
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مدیریت نوبت‌های رزرو شده برای شما
        </p>
      </div>

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

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-500" size={40} />
        </div>
      )}

      {!isLoading && (!appointments || appointments.length === 0) && (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 lg:p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-6">
            <Calendar size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
            نوبتی وجود ندارد
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            نوبتی با این وضعیت وجود ندارد
          </p>
        </div>
      )}

      {!isLoading && appointments && appointments.length > 0 && (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {appointments.map((apt, index) => {
              const status = STATUS_CONFIG[apt.status];
              const jalali = getJalaliInfo(apt.date);
              const canConfirm = apt.status === AppointmentStatus.Pending;
              const canComplete = apt.status === AppointmentStatus.Confirmed;

              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-2xl border bg-white dark:bg-ink-light border-gray-200 dark:border-white/10 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {apt.customer?.profile_image ? (
                        <img
                          src={`http://localhost:3000${apt.customer.profile_image}`}
                          alt={apt.customer.first_name || ""}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center font-bold shrink-0">
                          {apt.customer?.first_name?.[0]}
                          {apt.customer?.last_name?.[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {apt.customer?.first_name} {apt.customer?.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Phone size={12} />
                          <span dir="ltr">{apt.customer?.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border w-fit ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        {apt.service?.name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {jalali.weekdayFull} {jalali.fullDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {apt.start_time.slice(0, 5)} -{" "}
                          {apt.end_time.slice(0, 5)}
                        </span>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        قیمت
                      </p>
                      <p className="text-sm font-bold text-brand-500">
                        {apt.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {canConfirm && (
                        <button
                          onClick={() => confirmMutation.mutate(apt.id)}
                          disabled={confirmMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          تایید
                        </button>
                      )}
                      {canComplete && (
                        <button
                          onClick={() => completeMutation.mutate(apt.id)}
                          disabled={completeMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 size={16} />
                          انجام شد
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