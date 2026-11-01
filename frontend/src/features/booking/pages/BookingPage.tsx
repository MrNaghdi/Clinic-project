import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BookingStepper } from "../components/BookingStepper";
import { SelectionSummary } from "../components/SelectionSummary";
import { ServiceStep } from "../components/ServiceStep";
import { SpecialistStep } from "../components/SpecialistStep";
import { DateStep } from "../components/DateStep";
import { ConfirmStep } from "../components/ConfirmStep";
import { PaymentStep, type PaymentMethod } from "../components/PaymentStep";
import { createAppointment } from "../api/booking.api";
import { Container } from "../../../shared/components/ui/Container";
import { AuroraBackground } from "../../../shared/components/effects/AuroraBackground";
import type { Service } from "../../services/api/services.api";
import type { Specialist } from "../../specialists/api/specialists.api";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const createMutation = useMutation({
    mutationFn: () =>
      createAppointment({
        specialist_id: specialist!.id,
        service_id: service!.id,
        date: date!,
        start_time: time!,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      navigate(`/profile/appointments?new=${data.id}`);
    },
  });

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handlePaymentConfirm = (_method: PaymentMethod) => {
    createMutation.mutate();
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white dark:bg-ink pt-24 pb-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-40 dark:opacity-60 pointer-events-none">
        <AuroraBackground />
      </div>

      <Container className="relative max-w-5xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-accent-500/10 backdrop-blur-md border border-brand-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              رزرو نوبت آنلاین
            </span>
          </motion.div>
        </div>

        <BookingStepper currentStep={step} />

        <SelectionSummary
          service={service}
          specialist={specialist}
          date={date}
          time={time}
          currentStep={step}
          onClearService={() => {
            setService(null);
            setSpecialist(null);
            setDate(null);
            setTime(null);
            setStep(1);
          }}
          onClearSpecialist={() => {
            setSpecialist(null);
            setDate(null);
            setTime(null);
            setStep(2);
          }}
          onClearDate={() => {
            setDate(null);
            setTime(null);
            setStep(3);
          }}
          onClearTime={() => {
            setTime(null);
            setStep(3);
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <ServiceStep
                selectedId={service?.id ?? null}
                onSelect={setService}
                onNext={next}
              />
            )}

            {step === 2 && service && (
              <SpecialistStep
                service={service}
                selectedId={specialist?.id ?? null}
                onSelect={setSpecialist}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 3 && specialist && service && (
              <DateStep
                specialistId={specialist.id}
                serviceId={service.id}
                selectedDate={date}
                selectedTime={time}
                onSelectDate={setDate}
                onSelectTime={setTime}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 4 && service && specialist && date && time && (
              <ConfirmStep
                service={service}
                specialist={specialist}
                date={date}
                time={time}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 5 && service && specialist && date && time && (
              <PaymentStep
                amount={service.price}
                onConfirm={handlePaymentConfirm}
                onBack={back}
                isSubmitting={createMutation.isPending}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {createMutation.isError && (
          <div className="max-w-lg mx-auto mt-4 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
            {(createMutation.error as any)?.response?.data?.message ||
              "خطا در ثبت نوبت. لطفاً دوباره تلاش کنید."}
          </div>
        )}
      </Container>
    </div>
  );
}