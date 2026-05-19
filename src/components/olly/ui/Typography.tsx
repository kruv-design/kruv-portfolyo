import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantClass: Record<
  "h1" | "h2" | "h3" | "h4" | "b1" | "b2" | "b3" | "b4" | "eyebrow",
  string
> = {
  h1: "olly-type-h1",
  h2: "olly-type-h2",
  h3: "olly-type-h3",
  h4: "olly-type-h4",
  b1: "olly-type-b1",
  b2: "olly-type-b2",
  b3: "olly-type-b3",
  b4: "olly-type-b4",
  eyebrow: "olly-type-eyebrow",
};

const defaultTag: Record<keyof typeof variantClass, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  b1: "p",
  b2: "p",
  b3: "p",
  b4: "p",
  eyebrow: "p",
};

export type TypographyVariant = keyof typeof variantClass;

export type TypographyProps<T extends ElementType = "p"> = {
  as?: T;
  variant: TypographyVariant;
} & Omit<HTMLAttributes<T>, "as">;

export function Typography<T extends ElementType = "p">({
  as,
  variant,
  className,
  ...rest
}: TypographyProps<T>) {
  const Comp = (as ?? defaultTag[variant]) as ElementType;
  return (
    <Comp className={cn(variantClass[variant], className)} {...rest} />
  );
}
