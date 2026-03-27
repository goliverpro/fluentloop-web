"use client";

import { ButtonHTMLAttributes, CSSProperties, forwardRef, useState } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const BASE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "background 0.15s, opacity 0.15s",
  outline: "none",
};

const SIZE: Record<string, CSSProperties> = {
  sm: { fontSize: "0.75rem", padding: "0.375rem 0.75rem" },
  md: { fontSize: "0.875rem", padding: "0.5rem 1rem" },
  lg: { fontSize: "0.875rem", padding: "0.625rem 1rem", width: "100%" },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, variant = "primary", size = "md", loading, children, disabled, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);

    const variantStyle: CSSProperties =
      variant === "primary"
        ? { background: hovered ? "#005490" : "#006DB2", color: "#ffffff" }
        : variant === "secondary"
        ? {
            background: hovered ? "#1a2a4a" : "#162040",
            color: "#f1f5f9",
            border: "1.5px solid #1e3050",
          }
        : variant === "ghost"
        ? { background: hovered ? "#162040" : "transparent", color: hovered ? "#f1f5f9" : "#94a3b8" }
        : { background: hovered ? "#dc2626" : "#EF4444", color: "#ffffff" };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          ...BASE,
          ...SIZE[size],
          ...variantStyle,
          ...(disabled || loading ? { opacity: 0.5, cursor: "not-allowed" } : {}),
          ...style,
        }}
        onMouseEnter={(e) => {
          setHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {loading ? (
          <svg
            style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem", flexShrink: 0 }}
            width="16" height="16" fill="none" viewBox="0 0 24 24"
          >
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
