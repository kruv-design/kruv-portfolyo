import { cn } from "@/lib/utils";

export function SectionSkeleton() {
  return (
    <div
      className="w-full animate-pulse rounded-olly-lg bg-olly-surface py-olly-20 md:py-olly-24 lg:py-olly-32"
      aria-hidden
    />
  );
}

export function sectionShellClass() {
  return cn(
    "py-olly-20 md:py-olly-24 lg:py-olly-32",
    "border-t border-olly-line/40",
  );
}
