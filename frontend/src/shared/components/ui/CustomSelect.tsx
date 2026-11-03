import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useDarkMode } from "../../hook/useDarkMode";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  className = "",
}: CustomSelectProps) {
  const { darkMode } = useDarkMode();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 px-4 rounded-xl border text-sm font-bold flex items-center justify-between gap-2 transition-colors ${
          darkMode
            ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
        } ${open ? (darkMode ? "border-brand-500" : "border-brand-500") : ""}`}
      >
        <span className={selected ? "" : darkMode ? "text-white/40" : "text-slate-400"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${darkMode ? "text-white/50" : "text-slate-400"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 mt-2 w-full rounded-xl border shadow-2xl overflow-hidden ${
              darkMode
                ? "bg-[#0c0a14] border-white/10 shadow-black/50"
                : "bg-white border-slate-200 shadow-slate-200/50"
            }`}
          >
            <div className="max-h-64 overflow-y-auto p-1.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-right transition-colors ${
                      isSelected
                        ? "bg-brand-500/10 text-brand-500"
                        : darkMode
                        ? "text-white/80 hover:bg-white/5"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}