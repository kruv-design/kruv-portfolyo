"use client";

import { useLayoutEffect, useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Proje slug değişince sayfayı en üste al (paylaşılan layout scroll konumunu korur). */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  useEffect(() => {
    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    const t = window.setTimeout(scrollToTop, 0);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
