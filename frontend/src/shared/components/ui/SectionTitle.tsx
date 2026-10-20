import { cn } from "../../../lib/utils";
import { Badge } from "./Badge";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "right";
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 sm:mb-16 lg:mb-20",
        align === "center" ? "text-center" : "text-right",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-5",
            align === "center" ? "flex justify-center" : "",
          )}
        >
          <Badge variant="brand" dot>
            {eyebrow}
          </Badge>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter leading-[1.1] text-gray-900 dark:text-white mb-5 text-balance">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "text-base sm:text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl text-balance",
            align === "center" ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}