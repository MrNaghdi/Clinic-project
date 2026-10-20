import { cn } from "../../../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border bg-white border-gray-200/60 dark:bg-ink-light dark:border-white/5 transition-all duration-300",
        hover &&
          "hover:border-gray-300 hover:shadow-lg dark:hover:border-white/10 dark:hover:bg-ink-softer dark:hover:shadow-black/20",
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}