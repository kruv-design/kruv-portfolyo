"use client";

import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

const sizeClass: Record<ButtonSize, string> = {
  md: "min-h-olly-10 px-olly-6 py-olly-3 rounded-olly-md",
  lg: "min-h-olly-12 px-olly-8 py-olly-4 rounded-olly-md",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      children,
      ...rest
    },
    ref,
  ) {
    const base =
      "group inline-flex items-center justify-center font-olly-sans font-semibold transition-[background-color,border-color,box-shadow,transform] duration-olly ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas disabled:pointer-events-none disabled:opacity-50";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-olly-primary text-olly-gray-0 shadow-olly-sm hover:bg-olly-primary-hover hover:shadow-olly-md",
      secondary:
        "border border-olly-line bg-transparent text-olly-ink hover:bg-olly-surface-2",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizeClass[size], className)}
        {...rest}
      >
        <span className="inline-flex items-center gap-olly-2 transition-all duration-olly ease-out">
          <span>{children}</span>
          <ArrowRight
            className="h-olly-4 w-olly-4 shrink-0 -translate-x-olly-2 opacity-0 transition-all duration-olly ease-out group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden
          />
        </span>
      </button>
    );
  },
);
