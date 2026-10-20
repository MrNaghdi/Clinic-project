import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  { label: "صفحه اصلی", path: "/", shortcut: "H" },
  { label: "خدمات", path: "/services", shortcut: "S" },
  { label: "پزشکان", path: "/specialists", shortcut: "D" },
  { label: "مقالات", path: "/articles", shortcut: "A" },
  { label: "پروفایل من", path: "/profile", shortcut: "P" },
  { label: "تنظیمات", path: "/profile/settings", shortcut: "," },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg px-4"
          >
            <div className="bg-white dark:bg-ink-light rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-white/10">
                <Search size={20} className="text-gray-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو یا رفتن به صفحه..."
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
                />
                <kbd className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-xs font-mono text-gray-600 dark:text-gray-400">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filtered.length > 0 ? (
                  filtered.map((item, i) => (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-right group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
                          <ArrowLeft size={14} className="text-gray-500 dark:text-gray-400 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </span>
                      </div>
                      <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-xs font-mono text-gray-500">
                        {item.shortcut}
                      </kbd>
                    </motion.button>
                  ))
                ) : (
                  <div className="px-3 py-10 text-center text-sm text-gray-500">
                    نتیجه‌ای یافت نشد
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 font-mono">↑↓</kbd>
                    <span>پیمایش</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 font-mono">↵</kbd>
                    <span>انتخاب</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Command size={12} />
                  <span>K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}