"use client";

import { useEffect, useState } from "react";

const SCROLL_ON = 32;
const SCROLL_OFF = 8;

/** Navbar scroll (sentinel + histerezis) — tüm sayfalarda aynı. */
export function useSiteNavScroll(sentinelId = "nav-sentinel") {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    let isScrolled = false;
    let scrollRaf = 0;

    const apply = (next: boolean) => {
      if (next === isScrolled) return;
      isScrolled = next;
      setScrolled(next);
    };

    const syncFromScroll = () => {
      const y = window.scrollY;
      if (!isScrolled && y > SCROLL_ON) apply(true);
      else if (isScrolled && y <= SCROLL_OFF) apply(false);
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        syncFromScroll();
      });
    };

    if (!sentinel || !("IntersectionObserver" in window)) {
      apply(window.scrollY > SCROLL_ON);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (!e.isIntersecting) apply(true);
        else if (window.scrollY <= SCROLL_OFF) apply(false);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    obs.observe(sentinel);
    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [sentinelId]);

  return scrolled;
}
