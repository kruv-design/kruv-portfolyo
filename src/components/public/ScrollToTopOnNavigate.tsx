"use client";

import { useLayoutEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  enableManualScrollRestoration,
  scheduleScrollToTop,
} from "@/lib/scroll-to-top";

/** Proje slug / pathname değişince sayfayı en üste al. */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useLayoutEffect(() => {
    enableManualScrollRestoration();
  }, []);

  useLayoutEffect(() => {
    scheduleScrollToTop();
  }, [pathname, slug]);

  return null;
}
