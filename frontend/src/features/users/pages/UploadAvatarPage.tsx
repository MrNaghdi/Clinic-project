import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchMe, uploadAvatar } from "../api/users.api";
import { useDarkMode } from "../../../shared/hook/useDarkMode";

const MAX_SIZE = 3 * 1024 * 1024; 
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function UploadAvatarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      setSuccess(data?.message || "عکس پروفایل با موفقیت بارگذاری شد.");
      setSelectedFile(null);
      setPreview(null);

      setTimeout(() => navigate("/profile"), 1500);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        "خطا در آپلود عکس، دوباره تلاش کنید";
      setError(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const card = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-100";
  const title = darkMode ? "text-white" : "text-gray-800";
  const subText = "text-gray-400";

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("فقط فایل‌های JPG، PNG یا WEBP مجاز است");
      return;
    }
    if (file.size > MAX_SIZE) {
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
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold ${title}`}>
          عکس پروفایل
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${subText}`}>
          عکس پروفایل خود را آپلود یا تغییر دهید
        </p>
      </div>

      <div className={`rounded-2xl border p-5 sm:p-8 max-w-xl ${card}`}>
      
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt="پیش‌نمایش"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-linear-to-br from-blue-300 to-cyan-300 text-white flex items-center justify-center text-3xl sm:text-4xl font-bold border-4 border-blue-100">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 left-1 w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg cursor-pointer transition-colors"
              aria-label="انتخاب عکس"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSelect}
            className="hidden"
          />

          <p className={`text-xs mt-3 text-center ${subText}`}>
            فرمت‌های مجاز: JPG، PNG، WEBP — حداکثر ۳ مگابایت
          </p>
        </div>

        {/* پیام‌ها */}
        {error && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl text-sm ${
              darkMode
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-red-50 border border-red-100 text-red-500"
            }`}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl text-sm ${
              darkMode
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-green-50 border border-green-100 text-green-600"
            }`}
          >
            {success}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="flex-1 h-12 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? "در حال آپلود..." : "ذخیره عکس"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className={`h-12 px-6 rounded-full font-medium cursor-pointer transition-colors ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}