import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "pro";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        {
          "bg-[#2D3148] text-[#E2E8F0]": variant === "default",
          "bg-[#10B981]/20 text-[#10B981]": variant === "success",
          "bg-[#EF4444]/20 text-[#EF4444]": variant === "error",
          "bg-yellow-500/20 text-yellow-400": variant === "warning",
          "bg-[#6C63FF]/20 text-[#6C63FF]": variant === "pro",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
