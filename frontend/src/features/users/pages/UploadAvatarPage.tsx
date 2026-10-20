import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, Trash2, ArrowRight } from "lucide-react";
import { fetchMe, uploadAvatar } from "../api/users.api";

export default function UploadAvatarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      navigate("/profile");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "خطا در آپلود عکس");
    },
  });

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("فقط فایل تصویری مجاز است");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("حجم عکس نباید بیشتر از ۳ مگابایت باشد");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const currentImage = user?.profile_image
    ? `http://localhost:3000${user.profile_image}`
    : null;

  const displayImage = preview || currentImage;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-1">
          عکس پروفایل
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          عکس پروفایل خود را آپلود یا تغییر دهید
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-ink-light p-8 lg:p-10 max-w-md"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt="پیش‌نمایش"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 dark:border-white/10"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-5xl font-black border-4 border-gray-100 dark:border-white/10">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 left-1 w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              aria-label="انتخاب عکس"
            >
              <Camera size={20} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            فرمت‌های مجاز: JPG، PNG، WEBP — حداکثر ۳ مگابایت
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            {uploadMutation.isPending ? "در حال آپلود..." : "ذخیره عکس"}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-2"
          >
            <ArrowRight size={16} />
            بازگشت
          </button>
        </div>
      </motion.div>
    </div>
  );
}