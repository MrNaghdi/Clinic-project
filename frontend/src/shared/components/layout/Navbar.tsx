import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, LayoutDashboard, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "../../../lib/utils";

const navItems = [
  { label: "خانه", to: "/" },
  { label: "خدمات", to: "/services" },
  { label: "پزشکان", to: "/specialists" },
  { label: "مقالات", to: "/articles" },
  { label: "تماس", to: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 dark:bg-ink/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-white/5 shadow-sm"
            : "bg-transparent",
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Logo />

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                aria-label="جستجو"
                className="hidden sm:flex"
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    ctrlKey: true,
                  });
                  document.dispatchEvent(event);
                }}
              >
                <Search size={18} />
              </Button>

              {hasToken ? (
                <Link to="/profile" className="hidden sm:block">
                  <Button
                    variant="brand"
                    size="sm"
                    icon={<LayoutDashboard size={16} />}
                  >
                    داشبورد
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <Button variant="brand" size="sm" icon={<LogIn size={16} />}>
                    ورود
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
                aria-label="منو"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-ink pt-20 px-4 overflow-y-auto"
          >
            <nav className="flex flex-col gap-2 max-w-md mx-auto">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block px-5 py-4 rounded-2xl text-base font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10"
              >
                {hasToken ? (
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full"
                      icon={<LayoutDashboard size={18} />}
                    >
                      داشبورد
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full"
                      icon={<LogIn size={18} />}
                    >
                      ورود / ثبت‌نام
                    </Button>
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}