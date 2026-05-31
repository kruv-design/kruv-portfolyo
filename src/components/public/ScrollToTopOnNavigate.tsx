"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Proje slug değişince sayfayı en üste al (next/prev banner, oklar). */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname]);

  return null;
}
