import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

type Variant = "primary" | "brand" | "outline" | "ghost" | "white" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      loading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants: Record<Variant, string> = {
      primary:
        "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-ink dark:hover:bg-gray-100 shadow-lg shadow-gray-900/10 dark:shadow-white/10",
      brand:
        "bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50",
      outline:
        "border border-gray-300 text-gray-900 hover:border-gray-900 hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/5",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5",
      white:
        "bg-white text-gray-900 hover:bg-gray-50 shadow-lg shadow-black/5",
      danger:
        "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25",
    };

    const sizes: Record<Size, string> = {
      sm: "h-9 px-4 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-14 px-8 text-base gap-2.5",
      icon: "h-10 w-10 !p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          icon
        )}
        {children}
        {iconRight && !loading && iconRight}
      </button>
    );
  },
);

Button.displayName = "Button";