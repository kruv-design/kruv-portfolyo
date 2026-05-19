import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-olly-container px-olly-4 md:px-olly-6 lg:px-olly-8",
        className,
      )}
      {...rest}
    />
  );
}
