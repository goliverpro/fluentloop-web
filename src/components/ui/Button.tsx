"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#6C63FF] hover:bg-[#5a52d5] text-white focus:ring-[#6C63FF]": variant === "primary",
            "bg-[#1A1D27] hover:bg-[#252836] text-[#E2E8F0] border border-[#2D3148] focus:ring-[#6C63FF]":
              variant === "secondary",
            "hover:bg-[#1A1D27] text-[#64748B] hover:text-[#E2E8F0] focus:ring-[#6C63FF]":
              variant === "ghost",
            "bg-[#EF4444] hover:bg-red-600 text-white focus:ring-red-500": variant === "danger",
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
