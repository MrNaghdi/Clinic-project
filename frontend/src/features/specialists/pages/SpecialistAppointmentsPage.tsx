import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../../shared/api/axiosInstance";

interface SpecialistAppointment {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  price: number;
  notes: string | null;
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    phone: string;
    profile_image: string | null;
  } | null;
  service: { id: number; name: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تأیید شده",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  no_show: "عدم حضور",
};

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-600",
  confirmed: "bg-green-500/15 text-green-600",
  completed: "bg-blue-500/15 text-blue-600",
  cancelled: "bg-red-500/15 text-red-600",
  no_show: "bg-gray-500/15 text-gray-600",
};

export default function SpecialistAppointmentsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>("all");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["specialist-appointments", tab],
    queryFn: async () => {
      const params = tab !== "all" ? { status: tab } : {};
      const { data } = await axiosInstance.get("/appointments/specialist", {
        params,
      });
      return data as SpecialistAppointment[];
    },
    staleTime: 1 * 60 * 1000,
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.patch(`/appointments/${id}/confirm`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["specialist-appointments"],
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.patch(`/appointments/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["specialist-appointments"],
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/appointments/${id}`, {
        data: { reason: "لغو توسط متخصص" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["specialist-appointments"],
      });
    },
  });

  const TABS = [
    { value: "all", label: "همه" },
    { value: "pending", label: "در انتظار" },
    { value: "confirmed", label: "تأیید شده" },
    { value: "completed", label: "تکمیل شده" },
    { value: "cancelled", label: "لغو شده" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          نوبت‌ها
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          مدیریت نوبت‌های بیماران
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 h-9 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-500" size={40} />
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-6">
            <Calendar size={36} />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
            نوبتی وجود ندارد
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border bg-white dark:bg-ink-light border-gray-200 dark:border-white/10 p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-black text-gray-900 dark:text-white">
                    {apt.service?.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 tabular-nums">
                    {new Intl.DateTimeFormat("fa-IR", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(apt.date))}
                    {" — "}
                    {apt.start_time?.slice(0, 5)} -{" "}
                    {apt.end_time?.slice(0, 5)}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    STATUS_CLASSES[apt.status] ?? ""
                  }`}
                >
                  {STATUS_LABELS[apt.status] ?? apt.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <User size={14} className="text-brand-500" />
                <span className="font-bold">
                  {apt.customer?.first_name} {apt.customer?.last_name}
                </span>
                {apt.customer?.phone && (
                  <span className="text-xs font-mono text-gray-400">
                    {apt.customer.phone}
                  </span>
                )}
              </div>

              {apt.notes && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    توضیحات بیمار
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-300 leading-7">
                    {apt.notes}
                  </p>
                </div>
              )}

              {apt.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => confirmMutation.mutate(apt.id)}
                    disabled={confirmMutation.isPending}
                    className="flex-1 h-10 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    تأیید
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("این نوبت لغو شود؟")) {
                        cancelMutation.mutate(apt.id);
                      }
                    }}
                    disabled={cancelMutation.isPending}
                    className="flex-1 h-10 rounded-xl border border-red-500/30 text-red-500 text-sm font-bold hover:bg-red-500/10 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} />
                    رد
                  </button>
                </div>
              )}

              {apt.status === "confirmed" && (
                <button
                  onClick={() => completeMutation.mutate(apt.id)}
                  disabled={completeMutation.isPending}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-bold mt-4 disabled:opacity-50"
                >
                  تکمیل شد
                </button>
              )}

              <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">مبلغ</span>
                <span className="font-bold text-gray-900 dark:text-white tabular-nums">
                  {apt.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}