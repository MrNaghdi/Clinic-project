import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, X } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  fetchReviewableAppointments,
  getSkippedReviewIds,
  skipReview,
} from "../api/reviews.api";
import { ReviewModal } from "./ReviewModal";

export function ReviewableBanner() {
  const { darkMode } = useDarkMode();
  const [skippedIds, setSkippedIds] = useState<number[]>([]);

  const [reviewTarget, setReviewTarget] = useState<{
    appointmentId: number;
    serviceName: string;
    specialistName: string;
  } | null>(null);

  useEffect(() => {
    setSkippedIds(getSkippedReviewIds());
  }, []);

  const { data: reviewable = [] } = useQuery({
    queryKey: ["reviewable-appointments"],
    queryFn: fetchReviewableAppointments,
    staleTime: 2 * 60 * 1000,
  });

  const filtered = useMemo(
    () => reviewable.filter((r: any) => !skippedIds.includes(r.id)),
    [reviewable, skippedIds],
  );

  const handleSkip = (appointmentId: number) => {
    skipReview(appointmentId);
    setSkippedIds((prev) => [...prev, appointmentId]);
  };

  if (!filtered || filtered.length === 0) return null;

  return (
    <>
      <div
        className={`rounded-2xl p-4 ${
          darkMode
            ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
            <Star size={18} className="text-white" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-black text-sm mb-1 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {filtered.length} نوبت تکمیل‌شده بدون نظر
            </p>
            <p
              className={`text-xs mb-3 ${
                darkMode ? "text-white/60" : "text-slate-600"
              }`}
            >
              تجربه‌ی خود را با دیگران به اشتراک بگذارید
            </p>
            <div className="space-y-2">
              {filtered.slice(0, 3).map((apt: any) => {
                const specName = `${apt.specialist?.user?.first_name ?? ""} ${apt.specialist?.user?.last_name ?? ""}`.trim();
                return (
                  <div
                    key={apt.id}
                    className={`flex items-center gap-2 p-2 rounded-xl ${
                      darkMode ? "bg-white/5" : "bg-white"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setReviewTarget({
                          appointmentId: apt.id,
                          serviceName: apt.service?.name ?? "خدمت",
                          specialistName: specName,
                        })
                      }
                      className={`flex-1 flex items-center justify-between text-xs font-bold transition-colors rounded-lg px-2 py-1.5 ${
                        darkMode
                          ? "hover:bg-white/5 text-white"
                          : "hover:bg-amber-50 text-slate-700"
                      }`}
                    >
                      <span className="truncate text-right">
                        {apt.service?.name} — {specName}
                      </span>
                      <Star
                        size={14}
                        className="text-amber-500 shrink-0 mr-2"
                      />
                    </button>
                    <button
                      onClick={() => handleSkip(apt.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        darkMode
                          ? "hover:bg-white/10 text-white/50"
                          : "hover:bg-gray-100 text-slate-400"
                      }`}
                      title="فعلاً نظر نمی‌دم"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {reviewTarget && (
        <ReviewModal
          appointmentId={reviewTarget.appointmentId}
          serviceName={reviewTarget.serviceName}
          specialistName={reviewTarget.specialistName}
          onClose={() => setReviewTarget(null)}
          onSkip={() => {
            handleSkip(reviewTarget.appointmentId);
            setReviewTarget(null);
          }}
        />
      )}
    </>
  );
}