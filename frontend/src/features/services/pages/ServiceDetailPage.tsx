import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Sparkles, Star } from "lucide-react";
import { findOne } from "../api/services.api";
import { Container } from "../../../shared/components/ui/Container";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";

import serviceFace from "../../../assets/image/botax.jpg";
import serviceHair from "../../../assets/image/lift.webp";
import serviceLaser from "../../../assets/image/laser.webp";

const serviceImages: Record<string, string> = {
  "لیزر": serviceLaser,
  "لیزر موهای زائد": serviceLaser,
  "لیزر مو": serviceLaser,
  "لیفت": serviceHair,
  "لیفت صورت": serviceHair,
  "لیفت ابرو": serviceHair,
  "بوتاکس": serviceFace,
  "تزریق بوتاکس": serviceFace,
  "بوتاکس صورت": serviceFace,
};

const DEFAULT_IMAGE = serviceFace;

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = Number(id);

  const { data: service, isLoading, isError } = useQuery({
    queryKey: ["services", serviceId],
    queryFn: () => findOne(serviceId),
    enabled: !!serviceId,
  });

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink pt-24 pb-20">
        <Container size="lg">
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-ink-light border border-gray-200 dark:border-white/5 animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-white/5" />
            <div className="p-10">
              <div className="h-10 w-64 rounded bg-gray-200 dark:bg-white/5 mb-4" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-white/5 mb-2" />
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-white/5" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // ─── Error ───
  if (isError || !service) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink pt-32 pb-20">
        <Container size="md">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles size={32} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              خدمت یافت نشد
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              خدمت مورد نظر پیدا نشد یا حذف شده است
            </p>
            <Link to="/services">
              <Button variant="brand" size="lg" icon={<ArrowRight size={18} />}>
                بازگشت به لیست خدمات
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const image = serviceImages[service.name] || DEFAULT_IMAGE;

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <Container size="lg">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-brand-500 transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link to="/services" className="hover:text-brand-500 transition-colors">
            خدمات
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {service.name}
          </span>
        </motion.nav>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ─── Left: Image ─── */}
          <RevealOnScroll className="lg:col-span-3">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10">
              <img
                src={image}
                alt={service.name}
                className="w-full h-[400px] lg:h-[600px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badge on image */}
              <div className="absolute top-6 right-6">
                <Badge variant="success" dot>
                  فعال
                </Badge>
              </div>

              {/* Service name on image (mobile) */}
              <div className="absolute bottom-0 right-0 left-0 p-8 lg:hidden">
                <h1 className="text-4xl font-black text-white">
                  {service.name}
                </h1>
              </div>
            </div>
          </RevealOnScroll>

          {/* ─── Right: Info ─── */}
          <div className="lg:col-span-2">
            <RevealOnScroll delay={0.1}>
              <div className="sticky top-28">
                <div className="hidden lg:block mb-6">
                  <Badge variant="success" dot>
                    فعال
                  </Badge>
                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mt-4 mb-2">
                    {service.name}
                  </h1>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    درباره این خدمت
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-7">
                    {service.description || "توضیحی برای این خدمت ثبت نشده است."}
                  </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-ink-light p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-brand-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        مدت زمان
                      </span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {service.duration_minutes}
                      <span className="text-sm font-medium text-gray-500 mr-1">
                        دقیقه
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-ink-light p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        هزینه
                      </span>
                    </div>
                    <p className="text-2xl font-black text-brand-500">
                      {service.price.toLocaleString("fa-IR")}
                      <span className="text-sm font-medium text-gray-500 mr-1">
                        تومان
                      </span>
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3">
                  <Link to={`/specialists?service=${service.id}`}>
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full"
                      icon={<ArrowLeft size={20} />}
                    >
                      مشاهده متخصصان این خدمت
                    </Button>
                  </Link>
                  <button
                    onClick={() => navigate(-1)}
                    className="w-full h-14 rounded-2xl border-2 border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={18} />
                    بازگشت
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </div>
  );
} 