import { cn } from "../../../lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Container({ children, className, size = "xl" }: ContainerProps) {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1400px]",
  };

  return (
    <div className={cn(sizes[size], "mx-auto px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}