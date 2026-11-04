import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, CheckCircle2, Trash2 } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import {
  fetchReviews,
  updateReview,
  deleteReview,
} from "../../reviews/api/reviews.api";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";

const FILTER_OPTIONS = [
  { value: "pending", label: "در انتظار تأیید" },
  { value: "approved", label: "تأیید شده" },
  { value: "all", label: "همه" },
];

export default function AdminReviews() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("pending");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews", { filter, page }],
    queryFn: () =>
      fetchReviews({
        approved_only: filter === "approved" ? true : false,
        page,
        limit: 15,
      }),
    staleTime: 1 * 60 * 1000,
  });

  const items = (data?.items ?? []).filter((r) => {
    if (filter === "pending") return !r.is_approved;
    if (filter === "approved") return r.is_approved;
    return true;
  });

  const pages = data?.pages ?? 1;

  const handleApprove = async (id: number) => {
    try {
      await updateReview(id, { is_approved: true });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews-stats"] });
    } catch {
      alert("خطا");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("این نظر حذف شود؟")) return;
    try {
      await deleteReview(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews-stats"] });
    } catch {
      alert("خطا");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black mb-1">
          نظرات کاربران
        </h2>
        <p
          className={`text-xs sm:text-sm ${
            darkMode ? "text-white/50" : "text-slate-500"
          }`}
        >
          مدیریت و تأیید نظرات
        </p>
      </div>

      <CustomSelect
        value={filter}
        onChange={(v) => {
          setFilter(v);
          setPage(1);
        }}
        options={FILTER_OPTIONS}
        className="w-full sm:w-56"
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-32 rounded-2xl animate-pulse ${
                darkMode ? "bg-white/5" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className={`rounded-2xl p-12 text-center border ${
            darkMode
              ? "bg-white/[0.03] border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            نظری یافت نشد
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((review, i) => {
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
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl p-4 border ${
                  darkMode
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
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
                    <div className="flex items-center gap-1 mt-0.5">
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
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      review.is_approved
                        ? "bg-green-500/15 text-green-500"
                        : "bg-amber-500/15 text-amber-500"
                    }`}
                  >
                    {review.is_approved ? "تأیید شده" : "در انتظار"}
                  </span>
                </div>

                {review.comment && (
                  <p
                    className={`text-sm leading-7 mb-3 ${
                      darkMode ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    {review.comment}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-dashed border-gray-300/30">
                  {!review.is_approved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600"
                    >
                      <CheckCircle2 size={12} />
                      تأیید
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/10"
                  >
                    <Trash2 size={12} />
                    حذف
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-1.5 flex-wrap">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                page === i + 1
                  ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                  : darkMode
                  ? "bg-white/5 text-white/60 hover:bg-white/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}