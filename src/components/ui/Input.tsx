"use client";

import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  variant?: "dark" | "light";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, leftIcon, variant = "dark", onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const isLight = variant === "light";

    const borderColor = error
      ? "#EF4444"
      : focused
      ? "#006DB2"
      : isLight
      ? "#d1d5db"
      : "#1e3050";

    const boxShadow = focused
      ? "0 0 0 3px rgba(0, 109, 178, 0.15)"
      : "none";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: isLight ? "#64748b" : "#94a3b8",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {leftIcon && (
            <span
              style={{
                position: "absolute",
                left: "12px",
                display: "flex",
                alignItems: "center",
                color: focused ? "#006DB2" : "#94a3b8",
                pointerEvents: "none",
                transition: "color 0.15s",
              }}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={className}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={{
              width: "100%",
              paddingTop: "0.625rem",
              paddingBottom: "0.625rem",
              paddingLeft: leftIcon ? "2.5rem" : "0.875rem",
              paddingRight: "0.875rem",
              fontSize: "0.875rem",
              borderRadius: "8px",
              border: `1.5px solid ${borderColor}`,
              background: isLight ? "#ffffff" : "#162040",
              color: isLight ? "#1e293b" : "#f1f5f9",
              outline: "none",
              boxShadow,
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            {...props}
          />
        </div>
        {error && (
          <p style={{ fontSize: "0.75rem", color: "#EF4444" }}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
