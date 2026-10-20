import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../hook/useDarkMode";

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-white/10 transition-colors duration-300 cursor-pointer overflow-hidden shrink-0"
      aria-label="تغییر تم"
      dir="ltr"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-500 opacity-0 dark:opacity-100 transition-opacity duration-500" />

      {/* Slider */}
      <motion.div
        animate={{
          x: darkMode ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="relative z-10 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center m-1"
      >
        <motion.div
          animate={{ rotate: darkMode ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {darkMode ? (
            <Moon size={14} className="text-brand-500" fill="currentColor" />
          ) : (
            <Sun size={14} className="text-orange-500" fill="currentColor" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}