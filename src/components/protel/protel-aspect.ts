import type { ProtelVideoAspect } from "@/types";

export function protelAspectClass(aspect: ProtelVideoAspect): string {
  return `protel-video--${aspect.replace(":", "-")}`;
}