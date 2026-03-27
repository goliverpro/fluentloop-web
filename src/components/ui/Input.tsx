"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#E2E8F0]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "w-full px-4 py-2.5 rounded-lg bg-[#1A1D27] border text-[#E2E8F0] placeholder-[#64748B] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-colors",
            error ? "border-[#EF4444]" : "border-[#2D3148]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
