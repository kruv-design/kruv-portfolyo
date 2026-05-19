"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full min-h-olly-10 rounded-olly-sm border border-olly-line bg-olly-surface px-olly-4 py-olly-3 font-olly-sans text-olly-ink shadow-olly-sm outline-none transition-[border-color,box-shadow] duration-olly ease-out placeholder:text-olly-muted focus-visible:border-olly-primary focus-visible:ring-2 focus-visible:ring-olly-primary",
          className,
        )}
        {...rest}
      />
    );
  },
);
