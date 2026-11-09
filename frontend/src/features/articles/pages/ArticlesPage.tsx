import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Clock,
  Eye,
  Sparkles,
  BookOpen,
  ArrowLeft,
  TrendingUp,
  X,
  Flame,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { Container } from "../../../shared/components/ui/Container";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import {
  fetchArticles,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_OPTIONS,
  type Article,
  type ArticleCategory,
} from "../api/articles.api";

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const formatDate = (date: string | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

function HeroArticle({ article }: { article: Article }) {
  const { darkMode } = useDarkMode();
  const reduceMotion = useReducedMotion();
  const image = getImageUrl(article.cover_image);
  const gradient = CATEGORY_COLORS[article.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        to={`/articles/${article.slug}`}
        className={`group grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden transition-all duration-500 ${
          darkMode
            ? "bg-white/[0.03] border border-white/10 hover:border-white/20"
            : "bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl"
        }`}
      >
        <div className="relative h-56 lg:h-auto lg:min-h-[320px] overflow-hidden">
          {image ? (
            <motion.img
              src={image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.8 }}
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 flex items-center justify-center`}
            >
              <BookOpen size={64} className="text-white/50" />
            </div>
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black/60 via-black/20 to-transparent`}
          />
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-lg`}
            >
              <Sparkles size={11} />
              {CATEGORY_LABELS[article.category]}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
              <Flame size={11} className="text-orange-400" />
              ویژه
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div
            className={`flex items-center gap-3 text-xs mb-3 ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {toFa(article.read_time)} دقیقه
            </span>
            <span className="w-1 h-1 rounded-full bg-current opacity-40" />
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {toFa(article.views)}
            </span>
          </div>

          <h2
            className={`text-xl sm:text-2xl lg:text-3xl font-black leading-tight mb-3 line-clamp-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {article.title}
          </h2>

          <p
            className={`text-sm leading-7 mb-5 line-clamp-3 ${
              darkMode ? "text-white/60" : "text-slate-600"
            }`}
          >
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold ${
                darkMode ? "text-white/40" : "text-slate-400"
              }`}
            >
              {formatDate(article.published_at)}
            </span>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all group-hover:gap-3 ${
                darkMode ? "bg-white/10 text-white" : "bg-brand-500 text-white"
              }`}
            >
              مطالعه کامل
              <ArrowLeft size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ArticleCard({
  article,
  index = 0,
}: {
  article: Article;
  index?: number;
}) {
  const { darkMode } = useDarkMode();
  const reduceMotion = useReducedMotion();
  const image = getImageUrl(article.cover_image);
  const gradient = CATEGORY_COLORS[article.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={reduceMotion ? {} : { y: -6 }}
      className="group"
    >
      <Link
        to={`/articles/${article.slug}`}
        className={`relative block rounded-2xl overflow-hidden h-full transition-all duration-500 ${
          darkMode
            ? "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-brand-500/10"
            : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl"
        }`}
      >
        <div className="relative h-44 overflow-hidden">
          {image ? (
            <motion.img
              src={image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover"
              whileHover={reduceMotion ? {} : { scale: 1.06 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} opacity-30 flex items-center justify-center`}
            >
              <BookOpen size={48} className="text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${gradient} shadow`}
            >
              {CATEGORY_LABELS[article.category]}
            </span>
            {article.is_featured && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-orange-500/90 text-white shadow">
                <Flame size={9} />
                ویژه
              </span>
            )}
          </div>

          <div className="absolute bottom-0 right-0 left-0 p-4">
            <div className="flex items-center gap-2.5 text-[11px] text-white/80">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {toFa(article.read_time)} دقیقه
              </span>
              <span className="flex items-center gap-1">
                <Eye size={10} />
                {toFa(article.views)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3
            className={`font-bold text-base leading-tight mb-2 line-clamp-2 transition-colors group-hover:text-brand-500 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {article.title}
          </h3>
          <p
            className={`text-xs leading-6 line-clamp-2 mb-3 ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            {article.excerpt}
          </p>
          <div
            className={`flex items-center justify-between text-[11px] ${
              darkMode ? "text-white/40" : "text-slate-400"
            }`}
          >
            <span>{formatDate(article.published_at)}</span>
            <ArrowLeft
              size={12}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ArticlesPage() {
  const { darkMode } = useDarkMode();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["articles", { search, category, page }],
    queryFn: () =>
      fetchArticles({
        search: search || undefined,
        category: category ? (category as ArticleCategory) : undefined,
        page,
        limit: 12,
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;
  const featured = items.find((a) => a.is_featured);
  const rest = featured ? items.filter((a) => a.id !== featured.id) : items;

  const hasFilter = !!search || !!category;

  return (
    <div
      className={`min-h-screen pt-20 pb-20 relative overflow-hidden ${
        darkMode ? "bg-[#08060f]" : "bg-[#faf9f6]"
      }`}
    >
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${
            darkMode ? "bg-brand-500/10" : "bg-brand-300/30"
          }`}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] ${
            darkMode ? "bg-accent-500/10" : "bg-pink-300/25"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            darkMode ? "opacity-[0.03]" : "opacity-[0.02]"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)",
          }}
        />
      </div>

      <Container className="relative">
        <RevealOnScroll>
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-3 ${
                    darkMode
                      ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                      : "bg-brand-50 border border-brand-100 text-brand-600"
                  }`}
                >
                  <BookOpen size={11} />
                  مجله SkinCare
                </motion.div>
                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  دنیای{" "}
                  <span className="bg-gradient-to-l from-brand-500 via-accent-500 to-brand-500 bg-clip-text text-transparent">
                    زیبایی
                  </span>
                </h1>
                <p
                  className={`mt-2 max-w-xl text-sm ${
                    darkMode ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  مقالات تخصصی درباره پوست، مو، زیبایی و جدیدترین متدهای درمانی
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search
                    size={15}
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
                    placeholder="جستجو..."
                    className={`w-full sm:w-56 h-10 pr-9 pl-3 rounded-xl border text-sm outline-none ${
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
                  options={[
                    { value: "", label: "همه دسته‌ها" },
                    ...CATEGORY_OPTIONS,
                  ]}
                  className="w-full sm:w-40"
                />

                {hasFilter && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                      setPage(1);
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border text-sm font-bold transition-colors ${
                      darkMode
                        ? "border-white/10 text-white/70 hover:bg-white/5"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <X size={13} />
                    پاک کردن
                  </button>
                )}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-72 rounded-2xl animate-pulse ${
                  darkMode ? "bg-white/5" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className={`rounded-3xl border-2 border-dashed p-16 text-center ${
              darkMode
                ? "bg-white/[0.02] border-white/10"
                : "bg-slate-50 border-slate-300"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={36} />
            </div>
            <h3
              className={`text-xl font-black mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              مقاله‌ای یافت نشد
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              {hasFilter
                ? "با فیلترهای فعلی هیچ مقاله‌ای پیدا نشد"
                : "به‌زودی مقالات جدید اضافه می‌شوند"}
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-8">
                <HeroArticle article={featured} />
              </div>
            )}

            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-brand-500" />
                  <h2
                    className={`text-lg font-black ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    آخرین مقالات
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((article, i) => (
                    <ArticleCard key={article.id} article={article} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  page === i + 1
                    ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30"
                    : darkMode
                    ? "bg-white/5 text-white/60 hover:bg-white/10"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {toFa(i + 1)}
              </button>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
