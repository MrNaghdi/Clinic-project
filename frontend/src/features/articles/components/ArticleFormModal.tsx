import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  ImageIcon,
  Trash2,
  Loader2,
  Plus,
  Tag,
  Flame,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import {
  createArticle,
  updateArticle,
  uploadArticleCover,
  CATEGORY_OPTIONS,
  ArticleCategory,
  type Article,
} from "../api/articles.api";

export function ArticleFormModal({
  article,
  onClose,
  onSuccess,
}: {
  article: Article | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { darkMode } = useDarkMode();
  const isEdit = !!article;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [category, setCategory] = useState<ArticleCategory>(
    article?.category ?? ArticleCategory.Skin
  );
  const [tags, setTags] = useState<string[]>(article?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(article?.is_featured ?? false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    getImageUrl(article?.cover_image)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((x) => x !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setError("");
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    setError("");

    if (!title.trim() || title.trim().length < 3) {
      setError("عنوان حداقل ۳ کاراکتر باشد");
      return;
    }
    if (!excerpt.trim() || excerpt.trim().length < 10) {
      setError("خلاصه حداقل ۱۰ کاراکتر باشد");
      return;
    }
    if (!content.trim() || content.trim().length < 20) {
      setError("محتوا حداقل ۲۰ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        tags: tags.length > 0 ? tags : undefined,
        is_featured: isFeatured,
      };

      let saved: Article;

      if (isEdit && article) {
        saved = await updateArticle(article.id, payload);
      } else {
        saved = await createArticle(payload);
      }

      if (imageFile && saved.id) {
        await uploadArticleCover(saved.id, imageFile);
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
      : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
  }`;

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
          className={`w-full max-w-2xl rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-[#0c0a14]" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3
              className={`text-lg font-black ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {isEdit ? "ویرایش مقاله" : "مقاله جدید"}
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
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                تصویر کاور
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
                    کلیک برای انتخاب تصویر
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
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                عنوان *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: راهنمای کامل مراقبت از پوست"
                className={inputCls}
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                Slug (اختیاری — خودکار از عنوان)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="care-skin-guide"
                className={inputCls}
                dir="ltr"
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                دسته‌بندی *
              </label>
              <CustomSelect
                value={category}
                onChange={(v) => setCategory(v as ArticleCategory)}
                options={CATEGORY_OPTIONS}
                className="w-full"
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                تگ‌ها
              </label>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <AnimatePresence>
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          darkMode
                            ? "bg-brand-500/15 text-brand-400"
                            : "bg-brand-50 text-brand-600"
                        }`}
                      >
                        <Tag size={10} />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                            darkMode
                              ? "hover:bg-brand-500/30"
                              : "hover:bg-brand-100"
                          }`}
                        >
                          <X size={10} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="تگ جدید (Enter بزن)"
                  className={inputCls}
                />
                <button
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                isFeatured
                  ? darkMode
                    ? "bg-orange-500/10 border-orange-500/30"
                    : "bg-orange-50 border-orange-200"
                  : darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-orange-500 w-4 h-4"
              />
              <Flame
                size={18}
                className={isFeatured ? "text-orange-500" : "text-slate-400"}
              />
              <div className="flex-1">
                <p className="text-sm font-bold">مقاله ویژه</p>
                <p
                  className={`text-[10px] ${
                    darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  نمایش در بالای صفحه با بج ویژه
                </p>
              </div>
            </label>

            <div>
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                خلاصه *
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="خلاصه‌ای کوتاه از مقاله..."
                className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold mb-1.5 block ${
                  darkMode ? "text-white/70" : "text-slate-700"
                }`}
              >
                محتوا *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="متن کامل مقاله..."
                className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    {isEdit ? "ذخیره" : "ایجاد و انتشار"}
                  </>
                )}
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
