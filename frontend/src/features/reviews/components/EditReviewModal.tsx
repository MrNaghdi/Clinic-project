import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2 } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { updateMyReview } from "../api/reviews.api";

const RATING_LABELS: Record<number, string> = {
  1: "خیلی ضعیف",
  2: "ضعیف",
  3: "متوسط",
  4: "خوب",
  5: "عالی",
};

const RATING_COLORS: Record<number, string> = {
  1: "text-red-500",
  2: "text-orange-500",
  3: "text-yellow-500",
  4: "text-lime-500",
  5: "text-green-500",
};

interface EditReviewModalProps {
  reviewId: number;
  initialRating: number;
  initialComment: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditReviewModal({
  reviewId,
  initialRating,
  initialComment,
  onClose,
  onSuccess,
}: EditReviewModalProps) {
  const { darkMode } = useDarkMode();
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(initialComment ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const displayRating = hovered || rating;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await updateMyReview(reviewId, {
        rating,
        comment: comment.trim() || undefined,
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "خطا در ویرایش نظر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl p-5 sm:p-6 ${
            darkMode ? "bg-[#0c0a14]" : "bg-white"
          }`}
        >
          {success ? (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
              >
                <CheckCircle2 size={32} className="text-white" />
              </motion.div>
              <h3
                className={`text-lg font-black mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                نظر شما ویرایش شد!
              </h3>
              <p
                className={`text-sm mb-6 ${
                  darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                نظر شما پس از تأیید مجدد ادمین نمایش داده می‌شود.
              </p>
              <button
                onClick={onSuccess}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm"
              >
                متوجه شدم
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3
                  className={`text-lg font-black ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  ویرایش نظر
                </h3>
                <button
                  onClick={onClose}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    darkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <p
                    className={`text-xs font-bold mb-3 ${
                      darkMode ? "text-white/70" : "text-slate-700"
                    }`}
                  >
                    امتیاز شما
                  </p>
                  <div
                    className="flex items-center justify-center gap-1.5"
                    onMouseLeave={() => setHovered(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = displayRating >= star;
                      return (
                        <button
                          key={star}
                          onMouseEnter={() => setHovered(star)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={36}
                            className={
                              filled
                                ? "text-yellow-400"
                                : darkMode
                                ? "text-white/20"
                                : "text-gray-300"
                            }
                            fill={filled ? "currentColor" : "none"}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="h-6 mt-2 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={displayRating}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={`text-sm font-bold ${
                          RATING_COLORS[displayRating] ?? ""
                        }`}
                      >
                        {RATING_LABELS[displayRating] ?? ""}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label
                    className={`text-xs font-bold mb-1.5 block ${
                      darkMode ? "text-white/70" : "text-slate-700"
                    }`}
                  >
                    نظر شما
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${
                      darkMode
                        ? "bg-white/5 border-white/10 text-white focus:border-brand-500"
                        : "bg-white border-slate-200 focus:border-brand-500"
                    }`}
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-bold">{error}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className={`flex-1 h-11 rounded-xl border font-bold text-sm ${
                      darkMode
                        ? "border-white/10 hover:bg-white/5"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    لغو
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "..." : "ذخیره"}
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}