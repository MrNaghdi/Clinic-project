import { useState, useRef, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import logo from "../../assets/image/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDarkMode } from "../hook/useDarkMode";
import { homeTheme } from "../theme";

const navItems = [
  { label: "خانه", to: "/" },
  { label: "خدمات", to: "/services" },
  { label: "پزشکان", to: "/specialists" },
  { label: "مقالات", to: "/articles" },
  { label: "درباره ما", to: "/about" },
  { label: "تماس", to: "/contact" },
];

const suggestions = [
  "لیزر موهای زائد",
  "تزریق ژل",
  "میکرونیدلینگ",
  "بوتاکس",
  "پاکسازی پوست",
];

export default function HeaderHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const t = homeTheme(darkMode);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      dir="rtl"
      className={`w-full fixed top-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
        isScrolled
          ? `${t.headerBg} shadow-lg shadow-black/5`
          : `${
              darkMode
                ? "bg-transparent border-transparent"
                : "bg-transparent border-transparent"
            }`
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="shrink-0 group">
            
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="SkinCare"
                className={`h-9 lg:h-10 w-auto transition-transform group-hover:scale-105 ${
                  darkMode ? "brightness-0 invert" : ""
                }`}
              />
              <div className="hidden sm:block">
                <p
                  className={`font-black text-sm leading-tight ${t.titleText}`}
                >
                  SkinCare
                </p>
                <p className={`text-[10px] leading-tight ${t.faintText}`}>
                  Beauty Clinic
                </p>
              </div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? darkMode
                        ? "bg-white/10 text-white"
                        : "bg-gray-900/5 text-gray-900"
                      : darkMode
                      ? "text-gray-400 hover:text-white hover:bg-white/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {hasToken ? (
              <Link
                to="/profile"
                className={`hidden sm:flex items-center gap-2 px-4 h-10 rounded-full text-sm font-semibold transition-all ${
                  darkMode
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                داشبورد
              </Link>
            ) : (
              <Link
                to="/login"
                className={`hidden sm:flex items-center gap-2 px-4 h-10 rounded-full text-sm font-semibold transition-all ${
                  darkMode
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                ورود / ثبت‌نام
              </Link>
            )}

            <button
              type="button"
              aria-label="جستجو"
              onClick={() => setIsSearchOpen((p) => !p)}
              className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer ${
                isSearchOpen
                  ? darkMode
                    ? "bg-white/10 text-white"
                    : "bg-gray-900 text-white"
                  : darkMode
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer ${
                darkMode
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="منو"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Panel */}
      <div
        ref={searchWrapRef}
        className={`hidden sm:block absolute top-full left-0 w-full transition-all duration-300 ease-out overflow-hidden ${
          isSearchOpen
            ? `max-h-[420px] opacity-100 border-t backdrop-blur-xl shadow-2xl ${
                darkMode
                  ? "bg-[#0a0a0f]/95 border-white/5"
                  : "bg-white/95 border-gray-200"
              }`
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative group">
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } group-focus-within:text-blue-400`}
              >
                <Search size={20} />
              </div>

              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی خدمات، پزشکان، مقالات..."
                className={`w-full h-14 pr-12 pl-32 rounded-2xl border-2 outline-none text-base transition-all ${t.inputBg}`}
              />

              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-white hover:bg-white/5"
                        : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all ${
                    query.trim()
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                      : darkMode
                      ? "bg-white/5 text-gray-500"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  جستجو
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <p className={`text-xs font-medium mb-3 ${t.faintText}`}>
              {query.trim() ? "نتایج پیشنهادی" : "پیشنهادهای محبوب"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    searchInputRef.current?.focus();
                  }}
                  className={`text-sm px-4 py-2 rounded-full border transition-all ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t ${
          isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        } ${
          darkMode ? "bg-[#0a0a0f] border-white/5" : "bg-white border-gray-200"
        }`}
      >
        <nav className="flex flex-col px-4 py-4 max-h-[80vh] overflow-y-auto">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3 border-2 transition-all ${t.inputBg}`}
          >
            <Search
              size={18}
              className={darkMode ? "text-gray-500" : "text-gray-400"}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </form>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `py-3 px-4 rounded-xl mb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? darkMode
                      ? "bg-white/10 text-white"
                      : "bg-gray-900/5 text-gray-900"
                    : darkMode
                    ? "text-gray-400 hover:bg-white/5 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div
            className="pt-4 border-t mt-3"
            style={{
              borderColor: darkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            {hasToken ? (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                  darkMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"
                }`}
              >
                داشبورد
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                  darkMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"
                }`}
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
