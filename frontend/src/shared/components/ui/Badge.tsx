import { cn } from "../../../lib/utils";

type BadgeVariant = "brand" | "accent" | "success" | "danger" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "brand",
  dot = false,
  icon,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    brand:
      "bg-brand-50 text-brand-600 ring-1 ring-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:ring-brand-500/20",
    accent:
      "bg-accent-50 text-accent-600 ring-1 ring-accent-100 dark:bg-accent-500/10 dark:text-accent-400 dark:ring-accent-500/20",
    success:
      "bg-green-50 text-green-600 ring-1 ring-green-100 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20",
    danger:
      "bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
    neutral:
      "bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-white/5 dark:text-gray-400 dark:ring-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full",
        variants[variant],
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {icon}
      {children}
    </span>
  );
}