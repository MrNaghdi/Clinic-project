import { useState, useRef, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import "../../styles/app.css";
import logo from "../../assets/image/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../shared/hook/useDarkMode";
import { homeTheme } from "../theme";

const navItems = [
  { label: "خانه", to: "/" },
  { label: "خدمات", to: "/services" },
  { label: "پزشکان", to: "/doctors" },
  { label: "مقالات", to: "/articles" },
  { label: "درباره ی ما", to: "/about" },
  { label: "تماس با ما", to: "/contact" },
];

const suggestions = [
  "لیزر موهای زائد",
  "تزریق ژل",
  "میکرونیدلینگ",
  "بوتاکس",
  "پاکسازی پوست",
  "مشاوره پوست",
];

const HeaderHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        isSearchOpen &&
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setQuery("");
  };

  const filteredSuggestions = query.trim()
    ? suggestions.filter((s) => s.includes(query.trim()))
    : suggestions;

  const DashboardButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <Link
      to="/profile"
      onClick={() => setIsMenuOpen(false)}
      className={`${
        fullWidth ? "w-full flex" : "hidden sm:flex"
      } items-center justify-center gap-2 ${t.primaryBtn} rounded-xl py-2 px-4 transition-colors text-sm md:text-base`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
      داشبورد
    </Link>
  );

  return (
    <header
      dir="rtl"
      className={`w-full relative backdrop-blur-md sticky top-0 z-50 border-b transition-colors ${t.headerBg}`}
    >
      <div className="w-full flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 py-3">
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="logo"
            className={`w-16 sm:w-20 md:w-24 lg:w-32 h-auto transition-all ${
              darkMode ? "brightness-0 invert" : ""
            }`}
          />
        </Link>

        {/* ناوبری دسکتاپ */}
        <nav className="hidden lg:flex items-center gap-1 list-none">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  isActive
                    ? "bg-blue-400 text-white shadow-sm shadow-blue-200/50"
                    : darkMode
                    ? "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                    : "text-gray-500 hover:text-blue-400 hover:bg-blue-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {hasToken ? (
            <DashboardButton />
          ) : (
            <Link
              to="/login"
              className={`hidden sm:flex ${t.primaryBtn} py-2 px-4 justify-center items-center rounded-xl transition-colors text-sm md:text-base`}
            >
              ورود/ثبت نام
            </Link>
          )}

          <button
            type="button"
            aria-label="جستجو"
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((p) => !p)}
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer ${
              isSearchOpen ? t.iconBtnActive : t.iconBtn
            }`}
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search Panel */}
      <div
        ref={searchWrapRef}
        className={`hidden sm:block absolute top-full left-0 w-full transition-all duration-300 ease-out overflow-hidden ${
          isSearchOpen
            ? `max-h-[420px] opacity-100 border-t backdrop-blur-lg shadow-xl ${t.searchPanel}`
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-5">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative group">
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${t.mutedText} group-focus-within:text-blue-400`}>
                <Search size={20} />
              </div>

              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی خدمات، پزشکان، مقالات..."
                className={`w-full h-14 pr-12 pl-32 border-2 rounded-2xl outline-none text-base transition-all ${t.inputBg}`}
              />

              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="پاک کردن"
                    className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="h-10 px-5 rounded-xl text-sm font-medium text-white bg-gradient-to-l from-blue-400 to-cyan-400 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200/50"
                >
                  جستجو
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className={`text-xs mb-3 flex items-center gap-1.5 ${t.mutedText}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.5 6.5 19.5l1-6.2L3 8.9 9 8z" />
              </svg>
              {query.trim() ? "نتایج پیشنهادی" : "جستجوهای پرطرفدار"}
            </p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      searchInputRef.current?.focus();
                    }}
                    className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${t.chip}`}
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <p className={`text-xs ${t.mutedText}`}>
                  نتیجه‌ای برای «{query}» یافت نشد
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${
          isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        } ${t.mobileMenu}`}
      >
        <nav className="flex flex-col px-4 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-2 border-2 transition-all ${
              darkMode
                ? "bg-gray-800 border-transparent text-gray-100 placeholder:text-gray-500 focus-within:border-blue-500 focus-within:bg-gray-800"
                : "bg-gray-50 border-transparent text-gray-700 placeholder:text-gray-400 focus-within:border-blue-400 focus-within:bg-white"
            }`}
          >
            <Search size={18} className={`${t.mutedText} shrink-0`} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="پاک کردن"
                className={`${t.mutedText} cursor-pointer shrink-0`}
              >
                <X size={16} />
              </button>
            )}
          </form>

          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-3 rounded-xl mb-1 transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-blue-400 text-white font-medium"
                    : darkMode
                    ? "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-400 hover:bg-blue-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="pt-4">
            {hasToken ? (
              <DashboardButton fullWidth />
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`w-full ${t.primaryBtn} py-2.5 px-4 flex justify-center items-center rounded-xl transition-colors`}
              >
                ورود/ثبت نام
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderHome;