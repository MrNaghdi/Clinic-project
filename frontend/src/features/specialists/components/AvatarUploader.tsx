import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { uploadAvatar } from "../../users/api/users.api";

interface AvatarUploaderProps {
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}

export function AvatarUploader({
  firstName,
  lastName,
  profileImage,
}: AvatarUploaderProps) {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const currentImage = getImageUrl(profileImage);
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setError("فقط تصویر JPEG/PNG/WebP مجاز است");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("حجم عکس باید کمتر از ۵ مگابایت باشد");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      await uploadAvatar(file);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["specialists", "me"] });
      queryClient.invalidateQueries({ queryKey: ["specialists"] });

      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const shownImage = preview ?? currentImage;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-md opacity-40" />

        <div className="relative">
          {shownImage ? (
            <img
              src={shownImage}
              alt={`${firstName ?? ""} ${lastName ?? ""}`}
              className={`w-28 h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 shadow-xl ${
                darkMode ? "border-ink-light" : "border-white"
              }`}
            />
          ) : (
            <div
              className={`w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-4xl lg:text-5xl font-black border-4 shadow-xl ${
                darkMode ? "border-ink-light" : "border-white"
              }`}
            >
              {initials || "?"}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-1 left-1 w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-ink-light hover:scale-110 transition-transform disabled:opacity-50"
            aria-label="تغییر عکس"
          >
            <Camera size={16} />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="hidden"
      />

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 hover:opacity-90 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              {uploading ? "در حال آپلود..." : "ذخیره عکس"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={uploading}
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-bold disabled:opacity-50 ${
                darkMode
                  ? "border-white/10 text-white/70 hover:bg-white/5"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <X size={14} />
              لغو
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs text-red-500 font-bold text-center max-w-[200px]">
          {error}
        </p>
      )}
    </div>
  );
}