import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <motion.div
        whileHover={{ rotate: 180, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30"
      >
        <Sparkles className="w-5 h-5 text-white" fill="white" />

        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-300" />
      </motion.div>

      <div className="hidden sm:block">
        <p className="font-black text-base leading-none tracking-tight text-gray-900 dark:text-white">
          SkinCare
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-1 tracking-widest">
          BEAUTY CLINIC
        </p>
      </div>
    </Link>
  );
}