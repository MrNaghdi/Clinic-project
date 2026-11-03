import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Calendar, User, Sparkles } from "lucide-react";
import { findAll } from "../../services/api/services.api";
import { findAllSpecialists } from "../../specialists/api/specialists.api";
import type { Service } from "../../services/api/services.api";
import type { Specialist } from "../../specialists/api/specialists.api";
import { createAppointment } from "../api/booking.api";
import { ServiceStep } from "../components/ServiceStep";
import { SpecialistStep } from "../components/SpecialistStep";
import { DateStep } from "../components/DateStep";

type Step = "service" | "specialist" | "date" | "confirm" | "success";

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export default function BookingPage() {
  const { specialistId } = useParams<{ specialistId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedSpecialistId = specialistId ? Number(specialistId) : null;
  const preselectedServiceId = searchParams.get("service")
    ? Number(searchParams.get("service"))
    : null;

  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: findAll,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allSpecialists = [] } = useQuery({
    queryKey: ["specialists"],
    queryFn: findAllSpecialists,
    staleTime: 5 * 60 * 1000,
  });

  const preselectedSpecialist = useMemo(() => {
    if (!preselectedSpecialistId) return null;
    return allSpecialists.find((s) => s.id === preselectedSpecialistId) ?? null;
  }, [preselectedSpecialistId, allSpecialists]);

  const preselectedService = useMemo(() => {
    if (!preselectedServiceId) return null;
    return services.find((s) => s.id === preselectedServiceId) ?? null;
  }, [preselectedServiceId, services]);

  useEffect(() => {
    if (!preselectedSpecialist) return;
    if (selectedSpecialist?.id === preselectedSpecialist.id) return;
    setSelectedSpecialist(preselectedSpecialist);

    if (preselectedService) {
      setSelectedService(preselectedService);
      setStep("date");
    } else {
      setStep("service");
    }
  }, [preselectedSpecialist, preselectedService, selectedSpecialist?.id]);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setSelectedSpecialist(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSelectSpecialist = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goNextFromService = () => {
    if (!selectedService) return;
    if (preselectedSpecialist) {
      setStep("date");
    } else {
      setStep("specialist");
    }
  };

  const goNextFromSpecialist = () => {
    if (!selectedSpecialist) return;
    setStep("date");
  };

  const goNextFromDate = () => {
    if (!selectedDate || !selectedTime) return;
    setStep("confirm");
  };

  const goBack = () => {
    if (step === "service") return;
    if (step === "specialist") return setStep("service");
    if (step === "date") {
      if (preselectedSpecialist) return setStep("service");
      return setStep("specialist");
    }
    if (step === "confirm") return setStep("date");
    if (step === "success") return;
  };

  const handlePaymentAndBook = async () => {
    if (
      !selectedService ||
      !selectedSpecialist ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    setError("");
    setSubmitting(true);

    // شبیه‌سازی درگاه پرداخت
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // درگاه فیکی: ۱۰٪ شانس خطا برای تست
    if (Math.random() < 0.1) {
      setError("پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.");
      setSubmitting(false);
      return;
    }

    try {
      await createAppointment({
        specialist_id: selectedSpecialist.id,
        service_id: selectedService.id,
        date: selectedDate,
        start_time: selectedTime,
        notes: notes || undefined,
      });
      setStep("success");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "خطا در ثبت نوبت");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {step !== "success" && (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
                رزرو نوبت
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                در چند مرحله ساده نوبت خود را رزرو کنید
              </p>
            </div>

            <StepsIndicator currentStep={step} />
          </>
        )}

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {step === "service" && (
              <motion.div
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceStep
                  selectedId={selectedService?.id ?? null}
                  onSelect={handleSelectService}
                  onNext={goNextFromService}
                  specialist={preselectedSpecialist}
                />
              </motion.div>
            )}

            {step === "specialist" && selectedService && (
              <motion.div
                key="specialist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SpecialistStep
                  service={selectedService}
                  selectedId={selectedSpecialist?.id ?? null}
                  onSelect={handleSelectSpecialist}
                  onNext={goNextFromSpecialist}
                  onBack={goBack}
                />
              </motion.div>
            )}

            {step === "date" && selectedService && selectedSpecialist && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DateStep
                  specialistId={selectedSpecialist.id}
                  serviceId={selectedService.id}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={setSelectedDate}
                  onSelectTime={setSelectedTime}
                  onNext={goNextFromDate}
                  onBack={goBack}
                />
              </motion.div>
            )}

            {step === "confirm" &&
              selectedService &&
              selectedSpecialist &&
              selectedDate &&
              selectedTime && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConfirmStep
                    service={selectedService}
                    specialist={selectedSpecialist}
                    date={selectedDate}
                    time={selectedTime}
                    notes={notes}
                    onNotesChange={setNotes}
                    onBack={goBack}
                    onPay={handlePaymentAndBook}
                    submitting={submitting}
                    error={error}
                  />
                </motion.div>
              )}

            {step === "success" && selectedService && selectedSpecialist && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <SuccessStep
                  service={selectedService}
                  specialist={selectedSpecialist}
                  date={selectedDate!}
                  time={selectedTime!}
                  onGoProfile={() => navigate("/profile/appointments")}
                  onGoHome={() => navigate("/")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepsIndicator({ currentStep }: { currentStep: Step }) {
  const steps: Array<{ key: Step; label: string }> = [
    { key: "service", label: "خدمت" },
    { key: "specialist", label: "پزشک" },
    { key: "date", label: "تاریخ و ساعت" },
    { key: "confirm", label: "تأیید" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((s, i) => {
        const isActive = i === currentIndex;
        const isDone = i < currentIndex;

        return (
          <div key={s.key} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30"
                    : isDone
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={`hidden sm:block text-xs font-bold ${
                  isActive
                    ? "text-gray-900 dark:text-white"
                    : isDone
                    ? "text-green-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`w-6 sm:w-10 h-0.5 rounded-full ${
                  isDone ? "bg-green-500" : "bg-gray-200 dark:bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ConfirmStep({
  service,
  specialist,
  date,
  time,
  notes,
  onNotesChange,
  onBack,
  onPay,
  submitting,
  error,
}: {
  service: Service;
  specialist: Specialist;
  date: string;
  time: string;
  notes: string;
  onNotesChange: (v: string) => void;
  onBack: () => void;
  onPay: () => void;
  submitting: boolean;
  error: string;
}) {
  const fullName = `${specialist.user?.first_name ?? ""} ${
    specialist.user?.last_name ?? ""
  }`.trim();
  const dateLabel = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          تأیید نهایی
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لطفاً اطلاعات را بررسی کنید
        </p>
      </div>

      <div className="rounded-3xl border-2 border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-500 to-accent-500 p-5 text-white">
          <p className="text-xs opacity-80 mb-1">خدمت انتخابی</p>
          <p className="text-xl font-black">{service.name}</p>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <User size={14} /> پزشک
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {fullName}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Calendar size={14} /> تاریخ
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {dateLabel}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Clock size={14} /> ساعت
            </span>
            <span className="font-bold text-gray-900 dark:text-white tabular-nums">
              {toFa(time)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200 dark:border-white/10">
            <span className="text-gray-500 dark:text-gray-400">مدت زمان</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {toFa(service.duration_minutes)} دقیقه
            </span>
          </div>

          <div className="flex items-center justify-between text-base pt-3 border-t border-gray-200 dark:border-white/10">
            <span className="font-bold text-gray-700 dark:text-gray-300">
              مبلغ قابل پرداخت
            </span>
            <span className="font-black text-brand-500 text-lg tabular-nums">
              {toFa(service.price.toLocaleString("fa-IR"))} تومان
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
          توضیحات (اختیاری)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="مثلاً: حساسیت به فلان دارو دارم..."
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-light text-sm outline-none resize-none focus:border-brand-500"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400 font-bold">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-2xl p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 flex items-center gap-3">
        <Sparkles size={18} className="text-brand-500 shrink-0" />
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-6">
          با کلیک روی پرداخت، مبلغ از درگاه امن کسر می‌شود. درخواست شما برای
          تأیید به پزشک ارسال می‌شود.
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
        <button
          onClick={onBack}
          disabled={submitting}
          className="h-12 px-6 rounded-full border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50"
        >
          مرحله قبل
        </button>
        <button
          onClick={onPay}
          disabled={submitting}
          className="flex-1 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              در حال پرداخت...
            </>
          ) : (
            <>پرداخت و ثبت نوبت</>
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessStep({
  service,
  specialist,
  date,
  time,
  onGoProfile,
  onGoHome,
}: {
  service: Service;
  specialist: Specialist;
  date: string;
  time: string;
  onGoProfile: () => void;
  onGoHome: () => void;
}) {
  const fullName = `${specialist.user?.first_name ?? ""} ${
    specialist.user?.last_name ?? ""
  }`.trim();
  const dateLabel = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

  return (
    <div className="max-w-lg mx-auto text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
      >
        <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-black text-gray-900 dark:text-white mb-2"
      >
        درخواست شما ثبت شد!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-7"
      >
        درخواست رزرو نوبت شما با موفقیت ثبت شد و در انتظار تأیید پزشک است. پس از
        تأیید، به شما اطلاع داده می‌شود.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-gray-200 dark:border-white/10 p-5 mb-6 text-right"
      >
        <div className="flex items-center justify-between text-sm py-1.5">
          <span className="text-gray-500 dark:text-gray-400">خدمت</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {service.name}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5">
          <span className="text-gray-500 dark:text-gray-400">پزشک</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {fullName}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5">
          <span className="text-gray-500 dark:text-gray-400">تاریخ</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {dateLabel}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm py-1.5">
          <span className="text-gray-500 dark:text-gray-400">ساعت</span>
          <span className="font-bold text-gray-900 dark:text-white tabular-nums">
            {toFa(time)}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={onGoProfile}
          className="flex-1 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:opacity-90"
        >
          مشاهده نوبت‌های من
        </button>
        <button
          onClick={onGoHome}
          className="flex-1 h-12 rounded-full border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5"
        >
          بازگشت به خانه
        </button>
      </motion.div>
    </div>
  );
}
