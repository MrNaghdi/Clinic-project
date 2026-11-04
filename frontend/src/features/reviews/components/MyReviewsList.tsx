import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, Clock, CheckCircle2, MessageSquare, Pencil } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { fetchMyReviews } from "../api/reviews.api";
import { EditReviewModal } from "./EditReviewModal";

export function MyReviewsList() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<{
    id: number;
    rating: number;
    comment: string | null;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: fetchMyReviews,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className={`h-32 rounded-2xl animate-pulse ${
              darkMode ? "bg-white/5" : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`text-center py-12 rounded-2xl border-2 border-dashed ${
          darkMode
            ? "bg-white/[0.02] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <MessageSquare
          size={40}
          className={`mx-auto mb-3 ${
            darkMode ? "text-white/20" : "text-slate-300"
          }`}
        />
        <p
          className={`text-sm ${
            darkMode ? "text-white/50" : "text-slate-500"
          }`}
        >
          هنوز نظری ثبت نکرده‌اید.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {data.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 border ${
              darkMode
                ? "bg-white/[0.03] border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <p
                  className={`font-bold text-sm truncate ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {review.service_name ?? "خدمت"}
                </p>
                <p
                  className={`text-xs truncate ${
                    darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  {review.specialist_name}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={
                        star <= review.rating
                          ? "text-yellow-400"
                          : darkMode
                          ? "text-white/15"
                          : "text-gray-300"
                      }
                      fill={
                        star <= review.rating ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] ${
                    darkMode ? "text-white/40" : "text-slate-400"
                  }`}
                >
                  {new Intl.DateTimeFormat("fa-IR", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(review.created_at))}
                </span>
              </div>
            </div>

            {review.comment && (
              <p
                className={`text-sm leading-7 mt-2 ${
                  darkMode ? "text-white/70" : "text-slate-600"
                }`}
              >
                {review.comment}
              </p>
            )}

            <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-white/10 flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  review.is_approved
                    ? "bg-green-500/15 text-green-500"
                    : "bg-amber-500/15 text-amber-500"
                }`}
              >
                {review.is_approved ? (
                  <>
                    <CheckCircle2 size={10} />
                    تأیید شده
                  </>
                ) : (
                  <>
                    <Clock size={10} />
                    در انتظار تأیید
                  </>
                )}
              </span>

              <button
                onClick={() =>
                  setEditing({
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                  })
                }
                className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-bold transition-colors ${
                  darkMode
                    ? "border-white/10 hover:bg-white/5"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Pencil size={12} />
                ویرایش
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editing && (
        <EditReviewModal
          reviewId={editing.id}
          initialRating={editing.rating}
          initialComment={editing.comment}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["reviews-stats"] });
          }}
        />
      )}
    </>
  );
}