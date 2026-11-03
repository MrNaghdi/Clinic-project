import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  createService,
  updateService,
  uploadServiceImage,
} from "../api/admin.api";
import type { AdminService } from "../api/types";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

export function ServiceFormModal({
  service,
  onClose,
  onSuccess,
}: {
  service: AdminService | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { darkMode } = useDarkMode();
  const isEdit = !!service;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [duration, setDuration] = useState(
    service?.duration_minutes?.toString() ?? "30",
  );
  const [price, setPrice] = useState(service?.price?.toString() ?? "0");
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [imagePreview, setImagePreview] = useState<string | null>(
    getImageUrl(service?.image),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setError("فقط تصویر JPEG/PNG/WebP مجاز است");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم عکس باید کمتر از ۵ مگابایت باشد");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) return setError("نام خدمت الزامی است");
    const d = Number(duration);
    const p = Number(price);
    if (!Number.isFinite(d) || d < 1) return setError("مدت نامعتبر است");
    if (!Number.isFinite(p) || p < 0) return setError("قیمت نامعتبر است");

    setLoading(true);
    try {
      let saved: AdminService;

      if (isEdit && service) {
        saved = await updateService(service.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          duration_minutes: d,
          price: p,
          is_active: isActive,
        });
      } else {
        saved = await createService({
          name: name.trim(),
          description: description.trim() || undefined,
          duration_minutes: d,
          price: p,
          is_active: isActive,
        });
      }

      if (imageFile && saved.id) {
        await uploadServiceImage(saved.id, imageFile);
      }

      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "خطا");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full h-11 px-4 rounded-xl border text-sm outline-none ${
    darkMode
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
      : "bg-white border-slate-200 focus:border-brand-500"
  }`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-[#0c0a14]" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black">
              {isEdit ? "ویرایش خدمت" : "خدمت جدید"}
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
            <div>
              <label className="text-xs font-bold mb-1.5 block">
                تصویر خدمت
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold hover:bg-white"
                  >
                    <Upload size={12} />
                    تغییر
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                    darkMode
                      ? "border-white/20 hover:border-brand-500/50 hover:bg-white/5"
                      : "border-slate-300 hover:border-brand-500/50 hover:bg-slate-50"
                  }`}
                >
                  <ImageIcon
                    size={32}
                    className={darkMode ? "text-white/30" : "text-slate-400"}
                  />
                  <span
                    className={`text-xs font-bold ${
                      darkMode ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    کلیک برای انتخاب عکس
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block">نام</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: لیزر موهای زائد"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-xs font-bold mb-1.5 block">
                توضیحات (اختیاری)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold mb-1.5 block">
                  مدت (دقیقه)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min={1}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block">
                  قیمت (تومان)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  className={inputCls}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-brand-500"
              />
              <span className="text-sm font-bold">فعال باشد</span>
            </label>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "در حال ذخیره..." : isEdit ? "ذخیره" : "ایجاد"}
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