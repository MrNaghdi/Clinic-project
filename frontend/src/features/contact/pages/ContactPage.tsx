import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Camera,
  MessageCircle,
  Loader2,
  AlertCircle,
  FileText,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { Container } from "../../../shared/components/ui/Container";
import { RevealOnScroll } from "../../../shared/components/animations/RevealOnScroll";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { fetchMe } from "../../users/api/users.api";
import {
  createContactMessage,
  createPublicContactMessage,
  ContactSubject,
  SUBJECT_OPTIONS,
} from "../api/contact.api";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "تلفن",
    value: "۰۲۱-۱۲۳۴۵۶۷۸",
    href: "tel:02112345678",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "آدرس",
    value: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    href: "#map",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Clock,
    title: "ساعات کاری",
    value: "شنبه تا چهارشنبه ۹-۱۸ | پنجشنبه ۹-۱۴",
    href: null,
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function ContactPage() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined" && localStorage.getItem("token");
  const isLoggedIn = !!token;

  const { data: user } = useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
    enabled: isLoggedIn,
    retry: false,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<ContactSubject>(
    ContactSubject.General,
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fullUserName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setError("نام و نام خانوادگی را وارد کنید");
        return;
      }
      if (!/^09\d{9}$/.test(phone)) {
        setError("شماره تلفن نامعتبر است (مثال: 09121234567)");
        return;
      }
    }

    if (message.trim().length < 10) {
      setError("متن پیام حداقل ۱۰ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      if (isLoggedIn) {
        await createContactMessage({
          subject,
          message: message.trim(),
        });
      } else {
        await createPublicContactMessage({
          full_name: fullName.trim(),
          phone,
          subject,
          message: message.trim(),
        });
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "خطا در ارسال پیام");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full h-12 px-4 rounded-xl border text-sm outline-none transition-colors ${
    darkMode
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
      : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
  }`;

  return (
    <div className="min-h-screen bg-white dark:bg-ink pt-20 pb-20">
      <Container>
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold mb-4">
              <MessageCircle size={12} />
              تماس با ما
            </div>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              همیشه در دسترس
              <span className="bg-gradient-to-l from-brand-500 to-accent-500 bg-clip-text text-transparent">
                {" "}
                شما
              </span>
            </h1>
            <p
              className={`max-w-lg mx-auto ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              سوال، پیشنهاد یا انتقادی دارید؟ تیکت بزنید، در سریع‌ترین زمان پاسخ
              می‌دهیم.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {CONTACT_INFO.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                    darkMode
                      ? "bg-white/[0.03] border-white/10"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shrink-0`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold mb-1 ${
                        darkMode ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                      dir={item.title === "تلفن" ? "ltr" : "rtl"}
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              );

              return item.href ? (
                <a key={i} href={item.href}>
                  {content}
                </a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}

            <div className="flex gap-2">
              <a
                href="https://instagram.com/skincare"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border transition-colors ${
                  darkMode
                    ? "border-white/10 hover:bg-white/5 text-white"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Camera size={16} className="text-pink-500" />
                <span className="text-xs font-bold">اینستاگرام</span>
              </a>
              <a
                href="https://wa.me/989121234567"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border transition-colors ${
                  darkMode
                    ? "border-white/10 hover:bg-white/5 text-white"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <MessageCircle size={16} className="text-green-500" />
                <span className="text-xs font-bold">واتساپ</span>
              </a>
            </div>

            {isLoggedIn && (
              <Link
                to="/profile/tickets"
                className={`flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed transition-colors ${
                  darkMode
                    ? "border-white/10 hover:border-brand-500/50 hover:bg-brand-500/5 text-white"
                    : "border-slate-300 hover:border-brand-500/50 hover:bg-brand-50 text-slate-700"
                }`}
              >
                <FileText size={16} className="text-brand-500" />
                <span className="text-xs font-bold">تیکت‌های من</span>
              </Link>
            )}

            <div
              id="map"
              className={`rounded-xl overflow-hidden border h-48 ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.747!2d51.3890!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzIxLjEiTiA1McKwMjMnMjAuNCJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقعیت کلینیک"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <RevealOnScroll delay={0.1}>
              <div
                className={`rounded-2xl border p-6 sm:p-8 ${
                  darkMode
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {success ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                    >
                      <CheckCircle2 size={40} className="text-white" />
                    </motion.div>
                    <h3
                      className={`text-xl font-black mb-2 ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      تیکت شما ثبت شد!
                    </h3>
                    <p
                      className={`text-sm mb-6 max-w-sm mx-auto leading-7 ${
                        darkMode ? "text-white/60" : "text-slate-500"
                      }`}
                    >
                      تیم پشتیبانی در اسرع وقت پاسخ می‌دهد.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSuccess(false);
                          setMessage("");
                          setSubject(ContactSubject.General);
                          if (!isLoggedIn) {
                            setFullName("");
                            setPhone("");
                          }
                        }}
                        className={`px-5 h-11 rounded-xl border font-bold text-sm ${
                          darkMode
                            ? "border-white/10 hover:bg-white/5"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        ارسال تیکت دیگر
                      </button>
                      {isLoggedIn ? (
                        <button
                          onClick={() => navigate("/profile/tickets")}
                          className="px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm inline-flex items-center justify-center"
                        >
                          مشاهده تیکت‌های من
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("/")}
                          className="px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm inline-flex items-center justify-center"
                        >
                          بازگشت به خانه
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2
                        className={`text-xl font-black mb-1 ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        ثبت تیکت جدید
                      </h2>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-white/50" : "text-slate-500"
                        }`}
                      >
                        {isLoggedIn
                          ? "تیکت شما با اطلاعات حسابتان ثبت می‌شود"
                          : "فرم زیر را پر کنید، به‌زودی پاسخ می‌دهیم"}
                      </p>
                    </div>

                    {isLoggedIn && user && (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${
                          darkMode
                            ? "bg-brand-500/5 border border-brand-500/20"
                            : "bg-brand-50 border border-brand-100"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-sm font-black shrink-0">
                          {user.first_name?.[0] ?? "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-bold truncate ${
                              darkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {fullUserName || "کاربر"}
                          </p>
                          <p
                            className={`text-xs font-mono ${
                              darkMode
                                ? "text-white/50"
                                : "text-slate-500"
                            }`}
                            dir="ltr"
                          >
                            {user.phone}
                          </p>
                        </div>
                        <User
                          size={16}
                          className="text-brand-500 shrink-0"
                        />
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLoggedIn && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              className={`text-xs font-bold mb-1.5 block ${
                                darkMode
                                  ? "text-white/70"
                                  : "text-slate-700"
                              }`}
                            >
                              نام و نام خانوادگی *
                            </label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="مثلاً: سارا احمدی"
                              className={inputCls}
                              required
                            />
                          </div>
                          <div>
                            <label
                              className={`text-xs font-bold mb-1.5 block ${
                                darkMode
                                  ? "text-white/70"
                                  : "text-slate-700"
                              }`}
                            >
                              شماره تلفن *
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="09121234567"
                              className={inputCls}
                              dir="ltr"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label
                          className={`text-xs font-bold mb-1.5 block ${
                            darkMode ? "text-white/70" : "text-slate-700"
                          }`}
                        >
                          موضوع *
                        </label>
                        <CustomSelect
                          value={subject}
                          onChange={(v) => setSubject(v as ContactSubject)}
                          options={SUBJECT_OPTIONS}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label
                          className={`text-xs font-bold mb-1.5 block ${
                            darkMode ? "text-white/70" : "text-slate-700"
                          }`}
                        >
                          متن پیام *
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={6}
                          maxLength={2000}
                          placeholder="پیام خود را بنویسید..."
                          className={`w-full p-4 rounded-xl border text-sm outline-none resize-none transition-colors ${
                            darkMode
                              ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                              : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
                          }`}
                          required
                        />
                        <p
                          className={`text-[10px] text-left mt-1 tabular-nums ${
                            darkMode ? "text-white/30" : "text-slate-400"
                          }`}
                        >
                          {message.length} / ۲۰۰۰
                        </p>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                          <AlertCircle
                            size={16}
                            className="text-red-500 shrink-0"
                          />
                          <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                            {error}
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            در حال ارسال...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            ارسال تیکت
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </div>
  );
}