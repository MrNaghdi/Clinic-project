import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  fetchServicesForSelect,
  promoteToSpecialist,
} from "../api/admin.api";
import type { AdminUser } from "../api/types";

interface ServiceOption {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
}

export function PromoteModal({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { darkMode } = useDarkMode();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServicesForSelect().then(setServices);
  }, []);

  const toggle = (id: number) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await promoteToSpecialist(user.id, {
        bio: bio || undefined,
        service_ids: selected.length ? selected : undefined,
      });
      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "خطا در ارتقا");
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
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg rounded-2xl p-6 ${
            darkMode ? "bg-[#0c0a14]" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-black">ارتقا به متخصص</h3>
              <p
                className={`text-xs mt-0.5 ${
                  darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                {user.first_name} {user.last_name} — {user.phone}
              </p>
            </div>
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
            <div>
              <label className="text-xs font-bold mb-1.5 block">
                بیوگرافی (اختیاری)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="مثلاً: متخصص پوست و زیبایی با ۱۰ سال تجربه"
                className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block">
                خدمات ({selected.length} انتخاب شده)
              </label>
              <div
                className={`max-h-56 overflow-y-auto rounded-xl border p-2 space-y-1 ${
                  darkMode ? "border-white/10" : "border-slate-200"
                }`}
              >
                {services.length === 0 ? (
                  <p
                    className={`text-xs p-3 ${
                      darkMode ? "text-white/40" : "text-slate-400"
                    }`}
                  >
                    خدمتی وجود ندارد
                  </p>
                ) : (
                  services.map((s) => {
                    const isSel = selected.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggle(s.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-right transition-colors ${
                          isSel
                            ? "bg-brand-500/10 text-brand-500"
                            : darkMode
                            ? "hover:bg-white/5"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                            isSel
                              ? "bg-brand-500 border-brand-500"
                              : darkMode
                              ? "border-white/20"
                              : "border-slate-300"
                          }`}
                        >
                          {isSel && <Check size={12} className="text-white" />}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{s.name}</p>
                          <p
                            className={`text-[10px] ${
                              darkMode ? "text-white/40" : "text-slate-400"
                            }`}
                          >
                            {s.duration_minutes} دقیقه —{" "}
                            {new Intl.NumberFormat("fa-IR").format(s.price)}{" "}
                            تومان
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "در حال ارتقا..." : "تأیید و ارتقا"}
              </button>
              <button
                onClick={onClose}
                className={`px-6 h-11 rounded-xl border font-bold text-sm ${
                  darkMode
                    ? "border-white/10 hover:bg-white/5"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                لغو
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}