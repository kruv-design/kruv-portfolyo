"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { scheduleScrollToTop } from "@/lib/scroll-to-top";

type ScrollToTopLinkProps = ComponentProps<typeof Link>;

/** Proje prev/next — Next varsayılan scroll’u yerine slug frame ile senkron. */
export function ScrollToTopLink({ onClick, scroll = false, ...rest }: ScrollToTopLinkProps) {
  return (
    <Link
      {...rest}
      scroll={scroll}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          scheduleScrollToTop();
        }
      }}
    />
  );
}
