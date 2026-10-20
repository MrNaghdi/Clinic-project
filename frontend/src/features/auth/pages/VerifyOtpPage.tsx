import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { verifyOtp, sendOtp } from "../api/auth.api";
import { Button } from "../../../shared/components/ui/Button";
import { Container } from "../../../shared/components/ui/Container";
import { AuroraBackground } from "../../../shared/components/effects/AuroraBackground";

import heroImage from "../../../assets/image/baner.png";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const mutation = useMutation({
    mutationFn: (code: string) => verifyOtp(phone, code),
    onSuccess: (data) => {
      // 🎯 فیلد درست: token
      localStorage.setItem("token", data.token);
      
      console.log("✅ Login successful:", data);
      console.log("🔑 Token saved:", data.token?.slice(0, 20) + "...");
      
      const needsProfile = !data.user?.first_name;
      navigate(needsProfile ? "/complete-profile" : "/profile");
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message ||
          "کد وارد شده صحیح نیست. دوباره تلاش کنید.",
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });
  const resendMutation = useMutation({
    mutationFn: () => sendOtp(phone),
    onSuccess: () => {
      setResendTimer(60);
      setError(null);
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setError(null);

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d)) {
      mutation.mutate(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    if (pasted.length === 6) {
      mutation.mutate(pasted);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-ink"
    >
      <div className="hidden lg:flex relative overflow-hidden">
        {/* Background Image */}
        <img
          src={heroImage}
          alt="SkinCare"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-700/70 to-accent-800/80" />

        {/* Aurora Blobs */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-400/30 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-400/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

        {/* Diagonal Lines */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 41px)",
            }}
          />
        </div>

        {/* Glow */}
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
              یک قدم
              <br />
              تا زیبایی
              <br />
              فاصله دارید
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-white/90 mb-8 drop-shadow"
            >
              کد تایید به شماره شما ارسال شد. لطفاً کد ۶ رقمی را وارد کنید.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              {[
                "کد ۶ رقمی به شماره شما ارسال شد",
                "لطفاً کد را دقیقاً وارد کنید",
                "در صورت نیاز، کد را دوباره دریافت کنید",
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
            © {new Date().toLocaleDateString("fa-IR", { year: "numeric" })}{" "}
            SkinCare
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium mb-4">
                <CheckCircle2 size={12} />
                کد ارسال شد
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3">
                کد تایید را وارد کنید
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                کد ۶ رقمی ارسال شده به شماره زیر را وارد کنید:
              </p>
              <p
                className="text-lg font-bold text-gray-900 dark:text-white"
                dir="ltr"
              >
                {phone}
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-6" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-2xl font-black text-center focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-white/10 transition-all"
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 dark:text-red-400 text-center mb-4 flex items-center justify-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.p>
            )}

            {mutation.isPending && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                در حال بررسی...
              </div>
            )}

            {/* Resend */}
            <div className="text-center mb-8">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ارسال مجدد کد تا{" "}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {resendTimer}
                  </span>{" "}
                  ثانیه دیگر
                </p>
              ) : (
                <button
                  onClick={() => resendMutation.mutate()}
                  disabled={resendMutation.isPending}
                  className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 font-semibold transition-colors disabled:opacity-50"
                >
                  <RotateCcw
                    size={14}
                    className={
                      resendMutation.isPending ? "animate-spin" : ""
                    }
                  />
                  {resendMutation.isPending
                    ? "در حال ارسال..."
                    : "ارسال مجدد کد"}
                </button>
              )}
            </div>

            {/* Back */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
              تغییر شماره موبایل
            </Link>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}