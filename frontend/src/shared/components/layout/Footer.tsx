import { Link } from "react-router-dom";
import {
  Sparkles,
  Camera,
  Send,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "../ui/Container";

const footerLinks = [
  {
    title: "خدمات",
    links: [
      { label: "مراقبت پوست", to: "/services" },
      { label: "کاشت مو", to: "/services" },
      { label: "لیزر موهای زائد", to: "/services" },
      { label: "زیبایی صورت", to: "/services" },
    ],
  },
  {
    title: "کلینیک",
    links: [
      { label: "درباره ما", to: "/about" },
      { label: "متخصصان", to: "/specialists" },
      { label: "مقالات", to: "/articles" },
      { label: "تماس با ما", to: "/contact" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "سوالات متداول", to: "/faq" },
      { label: "قوانین و مقررات", to: "/terms" },
      { label: "حریم خصوصی", to: "/privacy" },
      { label: "پیگیری نوبت", to: "/profile/appointments" },
    ],
  },
];

const socials = [
  { icon: Camera, label: "اینستاگرام", href: "#" },
  { icon: Send, label: "تلگرام", href: "#" },
  { icon: Briefcase, label: "لینکدین", href: "#" },
];

export function Footer() {
  const year = new Date().toLocaleDateString("fa-IR", { year: "numeric" });

  return (
    <footer
      dir="rtl"
      className="relative bg-gray-50 dark:bg-ink text-gray-700 dark:text-gray-300 overflow-hidden border-t border-gray-200 dark:border-white/5 transition-colors duration-300"
    >
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Container className="relative pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <Sparkles size={20} className="text-white" fill="white" />
              </div>
              <div>
                <p className="font-black text-xl text-gray-900 dark:text-white leading-none tracking-tight">
                  SkinCare
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 leading-none mt-1 tracking-widest">
                  BEAUTY CLINIC
                </p>
              </div>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-7 mb-6 max-w-sm">
              تجربه‌ای متفاوت از خدمات زیبایی و درمانی با بهترین متخصصان و
              جدیدترین تجهیزات روز دنیا. زیبایی طبیعی خود را به ما بسپارید.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="tel:+982188888888"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/5 group-hover:bg-brand-500/10 flex items-center justify-center transition-colors">
                  <Phone size={14} />
                </div>
                <span dir="ltr">۰۲۱ - ۸۸۸۸ ۸۸۸۸</span>
              </a>
              <a
                href="mailto:info@skincare.ir"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/5 group-hover:bg-brand-500/10 flex items-center justify-center transition-colors">
                  <Mail size={14} />
                </div>
                <span dir="ltr">info@skincare.ir</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/5 hover:bg-gradient-to-br hover:from-brand-500 hover:to-accent-500 flex items-center justify-center transition-all duration-300 group"
                  >
                    <Icon
                      size={18}
                      className="text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-1.5 h-0.5 rounded-full bg-brand-500 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-4">
              خبرنامه
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-6 mb-4">
              از تخفیف‌ها و پیشنهادات ویژه باخبر شوید
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full h-10 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                عضویت
                <ArrowLeft size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-right">
              © {year} SkinCare Beauty Clinic. تمامی حقوق محفوظ است.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              ساخته شده با
              <span className="text-red-500 animate-pulse">♥</span>
              در ایران
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              بازگشت به بالا
              <ArrowUpRight
                size={12}
                className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}