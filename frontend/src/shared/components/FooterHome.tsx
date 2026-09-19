import logo from "../../assets/image/logo.png";
import { useDarkMode } from "../../shared/hook/useDarkMode";
import { homeTheme } from "../theme";

const footerLinks = [
  { label: "خانه", href: "" },
  { label: "خدمات", href: "" },
  { label: "پزشکان", href: "" },
  { label: "مقالات", href: "" },
  { label: "درباره ما", href: "" },
  { label: "تماس با ما", href: "" },
];

const socialLinks = [
  {
    label: "اینستاگرام",
    href: "",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "تلگرام",
    href: "",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    label: "لینکدین",
    href: "",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8.5" r="1" fill="currentColor" stroke="none" />
        <path d="M8 11v6" />
        <path d="M12 17v-3.5a2 2 0 0 1 4 0V17" />
        <path d="M12 11v1" />
      </svg>
    ),
  },
];

const FooterHome = () => {
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  return (
    <footer
      dir="rtl"
      className={`w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 py-8 sm:py-10 transition-colors ${t.footerBg} ${
        darkMode ? "text-gray-400" : "text-gray-300"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 sm:gap-4">
        <div className="flex items-center gap-2 order-1 sm:order-3">
          <img
            src={logo}
            alt="SkinCare"
            className={`w-9 h-9 ${darkMode ? "brightness-0 invert" : ""}`}
          />
          <div>
            <p className="text-white font-bold leading-4">SkinCare</p>
            <p className={`text-xs leading-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Beauty Clinic
            </p>
          </div>
        </div>

        <nav className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap order-2 sm:order-2">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`text-xs sm:text-sm transition-colors ${
                darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 order-3 sm:order-1">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              aria-label={social.label}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                darkMode
                  ? "bg-white/5 hover:bg-blue-400 text-gray-400 hover:text-white"
                  : "bg-white/10 hover:bg-blue-400 text-gray-300 hover:text-white"
              }`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div
        className={`border-t mt-6 sm:mt-8 pt-5 sm:pt-6 text-center ${
          darkMode ? "border-gray-800" : "border-white/10"
        }`}
      >
        <p
          className={`text-[11px] sm:text-xs ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          © ۲۰۲۵ SkinCare. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
};

export default FooterHome;