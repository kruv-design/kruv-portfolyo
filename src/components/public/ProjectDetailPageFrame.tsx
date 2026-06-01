"use client";

import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import {
  enableManualScrollRestoration,
  scheduleScrollToTop,
} from "@/lib/scroll-to-top";

/** Slug değişince içerik yeniden mount + scroll en üstte. */
export function ProjectDetailPageFrame({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    enableManualScrollRestoration();
  }, []);

  useLayoutEffect(() => {
    scheduleScrollToTop();
  }, [slug]);

  return <div key={slug}>{children}</div>;
}
