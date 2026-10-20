  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useMutation } from "@tanstack/react-query";
  import { motion } from "framer-motion";
  import { Phone, ArrowLeft, Sparkles, Shield, CheckCircle2 } from "lucide-react";
  import { sendOtp } from "../api/auth.api";
  import { Button } from "../../../shared/components/ui/Button";
  import { Container } from "../../../shared/components/ui/Container";
  import { AuroraBackground } from "../../../shared/components/effects/AuroraBackground";

  import heroImage from "../../../assets/image/baner.png";

  export default function LoginPage() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);

    const mutation = useMutation({
      mutationFn: () => sendOtp(phone),
      onSuccess: () => {
        navigate("/verify-otp", { state: { phone } });
      },
      onError: (err: any) => {
        setError(
          err?.response?.data?.message ||
            "خطا در ارسال کد. لطفاً دوباره تلاش کنید.",
        );
      },
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const cleaned = phone.replace(/\s/g, "");
      if (!/^09\d{9}$/.test(cleaned)) {
        setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
        return;
      }
      mutation.mutate();
    };

    return (
      <div dir="rtl" className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-ink">
        {/* ═══ LEFT: Visual Side (Desktop) ═══ */}
        <div className="hidden lg:flex relative overflow-hidden">
          {/* Background Image */}
          <img
            src={heroImage}
            alt="SkinCare"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />

          {/* Gradient Overlay — نرم‌تر */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-700/70 to-accent-800/80" />

          {/* Aurora Blobs — بزرگ‌تر و واضح‌تر */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-400/30 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 animate-pulse" style={{ animationDuration: "6s" }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-400/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

          {/* Diagonal Lines — جایگزین شطرنجی */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 41px)",
            }} />
          </div>

          <div className="absolute top-1/4 left-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 w-fit group">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform">
                <Sparkles size={20} className="text-white" fill="white" />
              </div>
              <div>
                <p className="font-black text-xl leading-none tracking-tight">
                  SkinCare
                </p>
                <p className="text-[10px] leading-none mt-1 tracking-widest opacity-80">
                  BEAUTY CLINIC
                </p>
              </div>
            </Link>

            {/* Main Text */}
            <div className="max-w-md">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl font-black leading-tight mb-6 drop-shadow-lg"
              >
                زیبایی
                <br />
                از اینجا شروع
                <br />
                می‌شود
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg text-white/90 mb-8 drop-shadow"
              >
                با ورود به حساب کاربری، به تمام خدمات و امکانات کلینیک SkinCare
                دسترسی پیدا کنید.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                {[
                  "دسترسی به بهترین متخصصان",
                  "رزرو آنلاین نوبت",
                  "مشاهده تاریخچه خدمات",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/60">
              © {new Date().toLocaleDateString("fa-IR", { year: "numeric" })} SkinCare
            </p>
          </div>
        </div>

        {/* ═══ RIGHT: Form Side ═══ */}
        <div className="relative flex items-center justify-center p-6 lg:p-12 overflow-hidden">
          <AuroraBackground />

          <Container size="sm" className="relative z-10 max-w-md mx-auto">
            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden inline-flex items-center gap-2.5 mb-8 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Sparkles size={18} className="text-white" fill="white" />
              </div>
              <div>
                <p className="font-black text-lg text-gray-900 dark:text-white leading-none">
                  SkinCare
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-1">
                  BEAUTY CLINIC
                </p>
              </div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium mb-4">
                  <Shield size={12} />
                  ورود امن
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">
                  خوش آمدید 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Phone size={18} />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                      dir="ltr"
                      maxLength={11}
                      autoComplete="tel"
                      className="w-full h-14 pr-12 pl-4 rounded-2xl border-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-lg font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-center tracking-wider"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {error}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  size="lg"
                  loading={mutation.isPending}
                  className="w-full"
                  icon={!mutation.isPending && <ArrowLeft size={20} />}
                >
                  {mutation.isPending ? "در حال ارسال کد..." : "دریافت کد تایید"}
                </Button>

                {/* Terms */}
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 leading-6">
                  با ورود به سایت،
                  <Link
                    to="/terms"
                    className="text-brand-500 hover:text-brand-600 font-medium mx-1"
                  >
                    قوانین و مقررات
                  </Link>
                  را می‌پذیرم
                </p>
              </form>

              {/* Back */}
              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                >
                  <ArrowLeft
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </motion.div>
          </Container>
        </div>
      </div>
    );
  }