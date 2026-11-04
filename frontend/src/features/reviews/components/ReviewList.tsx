import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { fetchReviews, fetchSpecialistStats } from "../api/reviews.api";

interface ReviewListProps {
  specialistId?: number;
  serviceId?: number;
  showStats?: boolean;
}

export function ReviewList({
  specialistId,
  serviceId,
  showStats = false,
}: ReviewListProps) {
  const { darkMode } = useDarkMode();

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", { specialistId, serviceId }],
    queryFn: () =>
      fetchReviews({
        specialist_id: specialistId,
        service_id: serviceId,
        page: 1,
        limit: 10,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ["reviews-stats", specialistId],
    queryFn: () => fetchSpecialistStats(specialistId!),
    enabled: showStats && !!specialistId,
    staleTime: 5 * 60 * 1000,
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

  if (!data || data.items.length === 0) {
    return (
      <div
        className={`text-center py-10 rounded-2xl border ${
          darkMode
            ? "bg-white/[0.02] border-white/10"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <MessageSquare
          size={32}
          className={`mx-auto mb-3 ${
            darkMode ? "text-white/20" : "text-slate-300"
          }`}
        />
        <p
          className={`text-sm ${
            darkMode ? "text-white/50" : "text-slate-500"
          }`}
        >
          هنوز نظری ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div>
      {showStats && stats && stats.count > 0 && (
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl mb-4 ${
            darkMode
              ? "bg-white/[0.03] border border-white/10"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <div className="flex items-center gap-1">
            <Star size={20} className="text-yellow-400" fill="currentColor" />
            <span
              className={`text-2xl font-black tabular-nums ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {stats.average.toFixed(1)}
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-white/40" : "text-slate-400"
              }`}
            >
              / ۵
            </span>
          </div>
          <span
            className={`text-xs ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            از {stats.count} نظر
          </span>
        </div>
      )}

      <div className="space-y-3">
        {data.items.map((review, i) => {
          const img = getImageUrl(review.user?.profile_image);
          const fullName =
            [review.user?.first_name, review.user?.last_name]
              .filter(Boolean)
              .join(" ") || "کاربر";

          return (
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
              <div className="flex items-start gap-3 mb-2">
                {img ? (
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-sm font-black shrink-0">
                    {review.user?.first_name?.[0] ?? "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm truncate ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {fullName}
                  </p>
                  <div className="flex items-center gap-0.5 mt-0.5">
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
                </div>
                <span
                  className={`text-[10px] shrink-0 ${
                    darkMode ? "text-white/40" : "text-slate-400"
                  }`}
                >
                  {new Intl.DateTimeFormat("fa-IR", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(review.created_at))}
                </span>
              </div>

              {review.comment && (
                <p
                  className={`text-sm leading-7 ${
                    darkMode ? "text-white/70" : "text-slate-600"
                  }`}
                >
                  {review.comment}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}