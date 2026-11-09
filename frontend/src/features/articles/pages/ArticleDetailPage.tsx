import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  BookOpen,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { Container } from "../../../shared/components/ui/Container";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import {
  fetchArticleBySlug,
  incrementArticleViews,
  fetchArticles,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
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

export default function ArticleDetailPage() {
  const { darkMode } = useDarkMode();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["articles", "related", article?.category],
    queryFn: () =>
      fetchArticles({
        category: article?.category,
        page: 1,
        limit: 4,
      }),
    enabled: !!article,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (article?.id) {
      incrementArticleViews(article.id).catch(() => {});
    }
  }, [article?.id]);

  if (isLoading) {
    return (
      <div
        className={`min-h-screen pt-20 pb-20 ${
          darkMode ? "bg-[#08060f]" : "bg-[#faf9f6]"
        }`}
      >
        <Container size="md">
          <div className="animate-pulse">
            <div
              className={`h-96 rounded-3xl mb-8 ${
                darkMode ? "bg-white/5" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-12 rounded-lg mb-4 w-3/4 ${
                darkMode ? "bg-white/5" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-4 rounded-lg mb-2 ${
                darkMode ? "bg-white/5" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-4 rounded-lg w-4/5 ${
                darkMode ? "bg-white/5" : "bg-gray-200"
              }`}
            />
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div
        className={`min-h-screen pt-32 pb-20 ${
          darkMode ? "bg-[#08060f]" : "bg-[#faf9f6]"
        }`}
      >
        <Container size="md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
              <BookOpen size={36} />
            </div>
            <h2
              className={`text-3xl font-black mb-4 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              مقاله یافت نشد
            </h2>
            <p
              className={`mb-8 ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              مقاله مورد نظر پیدا نشد یا حذف شده است
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm"
            >
              <ArrowRight size={16} />
              بازگشت به مقالات
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const image = getImageUrl(article.cover_image);
  const gradient = CATEGORY_COLORS[article.category];

  const related = (relatedData?.items ?? [])
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("لینک کپی شد");
      }
    } catch {}
  };

  return (
    <div
      className={`min-h-screen pt-20 pb-20 relative overflow-hidden ${
        darkMode ? "bg-[#08060f]" : "bg-[#faf9f6]"
      }`}
    >
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] ${
            darkMode ? "bg-brand-500/10" : "bg-brand-300/20"
          }`}
        />
      </div>

      <Container size="md" className="relative">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-8"
        >
          <Link
            to="/"
            className={`hover:text-brand-500 transition-colors ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            خانه
          </Link>
          <span className={darkMode ? "text-white/30" : "text-slate-400"}>
            /
          </span>
          <Link
            to="/articles"
            className={`hover:text-brand-500 transition-colors ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            مقالات
          </Link>
          <span className={darkMode ? "text-white/30" : "text-slate-400"}>
            /
          </span>
          <span
            className={`font-bold truncate ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {article.title}
          </span>
        </motion.nav>

        <RevealOnScroll>
          <div className="text-center mb-8">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-lg`}
              >
                <Sparkles size={12} />
                {CATEGORY_LABELS[article.category]}
              </span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {article.title}
            </h1>
            <div
              className={`flex flex-wrap items-center justify-center gap-4 text-sm ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(article.published_at)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {toFa(article.read_time)} دقیقه مطالعه
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {toFa(article.views)} بازدید
              </span>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div
            className={`relative rounded-3xl overflow-hidden mb-10 ${
              darkMode ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            {image ? (
              <img
                src={image}
                alt={article.title}
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
            ) : (
              <div
                className={`w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br ${gradient} opacity-40 flex items-center justify-center`}
              >
                <BookOpen size={100} className="text-white/50" />
              </div>
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <article
            className={`prose-custom text-base sm:text-lg leading-9 ${
              darkMode ? "text-white/80" : "text-slate-700"
            }`}
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 2.2,
            }}
          >
            {article.content}
          </article>
        </RevealOnScroll>

        {article.tags && article.tags.length > 0 && (
          <RevealOnScroll delay={0.3}>
            <div
              className={`flex flex-wrap items-center gap-2 mt-10 pt-8 border-t ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <Tag
                size={16}
                className={darkMode ? "text-white/40" : "text-slate-400"}
              />
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/articles?tag=${tag}`}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    darkMode
                      ? "bg-white/5 text-white/70 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </RevealOnScroll>
        )}

        <RevealOnScroll delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-white/10">
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-2 px-5 h-11 rounded-xl border font-bold text-sm transition-colors ${
                darkMode
                  ? "border-white/10 text-white/70 hover:bg-white/5"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ArrowRight size={16} />
              بازگشت
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm hover:opacity-90"
            >
              <Share2 size={16} />
              اشتراک‌گذاری
            </button>
          </div>
        </RevealOnScroll>

        {related.length > 0 && (
          <RevealOnScroll delay={0.5}>
            <div className="mt-16 pt-10 border-t border-white/10">
              <h2
                className={`text-2xl font-black mb-6 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                مقالات مرتبط
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((a) => {
                  const img = getImageUrl(a.cover_image);
                  return (
                    <Link
                      key={a.id}
                      to={`/articles/${a.slug}`}
                      className={`group block rounded-2xl overflow-hidden transition-shadow ${
                        darkMode
                          ? "bg-white/[0.03] border border-white/10 hover:border-white/20"
                          : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="h-32 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={a.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${CATEGORY_COLORS[a.category]} opacity-30`}
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <p
                          className={`text-sm font-bold line-clamp-2 group-hover:text-brand-500 transition-colors ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {a.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        )}
      </Container>
    </div>
  );
}