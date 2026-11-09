import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  BookOpen,
  Clock,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import {
  fetchArticles,
  deleteArticle,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_OPTIONS,
  ArticleCategory,
  type Article,
} from "../api/articles.api";
import { ArticleFormModal } from "../components/ArticleFormModal";

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export default function AdminArticles() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Article | "new" | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "articles", { search, category, page }],
    queryFn: () =>
      fetchArticles({
        search: search || undefined,
        category: category ? (category as ArticleCategory) : undefined,
        page,
        limit: 15,
      }),
    staleTime: 1 * 60 * 1000,
  });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  const handleDelete = async (a: Article) => {
    if (!window.confirm(`حذف مقاله «${a.title}»؟`)) return;
    try {
      await deleteArticle(a.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch {
      alert("خطا");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2
            className={`text-xl sm:text-2xl font-black mb-1 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            مقالات
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            مدیریت محتوای مجله
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90"
        >
          <Plus size={16} />
          مقاله جدید
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-white/40" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="جستجو در مقالات..."
            className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
              darkMode
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
            }`}
          />
        </div>

        <CustomSelect
          value={category}
          onChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          options={[{ value: "", label: "همه دسته‌ها" }, ...CATEGORY_OPTIONS]}
          className="sm:w-44"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-24 rounded-2xl animate-pulse ${
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
          <BookOpen
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
            مقاله‌ای یافت نشد
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((article, i) => {
              const image = getImageUrl(article.cover_image);
              const gradient = CATEGORY_COLORS[article.category];
              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl border transition-colors ${
                    darkMode
                      ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0 relative">
                    {image ? (
                      <img
                        src={image}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${gradient} opacity-30 flex items-center justify-center`}
                      >
                        <BookOpen size={28} className="text-white/50" />
                      </div>
                    )}
                    {article.is_featured && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow">
                        <Flame size={12} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${gradient}`}
                      >
                        {CATEGORY_LABELS[article.category]}
                      </span>
                      {article.is_featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500">
                          <Flame size={9} />
                          ویژه
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-bold text-sm mb-1 line-clamp-1 ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {article.title}
                    </h3>
                    <p
                      className={`text-xs line-clamp-1 mb-2 ${
                        darkMode ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      {article.excerpt}
                    </p>
                    <div
                      className={`flex items-center gap-3 text-[10px] ${
                        darkMode ? "text-white/40" : "text-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {toFa(article.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {toFa(article.read_time)} دقیقه
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 shrink-0">
                    <Link
                      to={`/articles/${article.slug}`}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        darkMode
                          ? "hover:bg-white/10 text-white/60"
                          : "hover:bg-slate-100 text-slate-500"
                      }`}
                      title="مشاهده"
                    >
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => setEditing(article)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        darkMode
                          ? "hover:bg-white/10 text-white/60"
                          : "hover:bg-slate-100 text-slate-500"
                      }`}
                      title="ویرایش"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(article)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        darkMode
                          ? "hover:bg-red-500/10 text-red-400"
                          : "hover:bg-red-50 text-red-500"
                      }`}
                      title="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center items-center gap-1.5 flex-wrap">
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

      {editing && (
        <ArticleFormModal
          article={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
            queryClient.invalidateQueries({ queryKey: ["articles"] });
          }}
        />
      )}
    </div>
  );
}
