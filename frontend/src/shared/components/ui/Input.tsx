import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full h-12 rounded-2xl border-2 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400",
              "dark:bg-ink-light dark:border-white/10 dark:text-white dark:placeholder:text-gray-500",
              "px-4 outline-none transition-all",
              "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-ink-light",
              icon && "pr-12",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";