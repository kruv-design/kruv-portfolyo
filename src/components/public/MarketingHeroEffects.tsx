"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";

declare global {
  interface Window {
    initHeroV2Cursor?: () => void;
    destroyHeroV2Cursor?: () => void;
  }
}

/** Hero scriptleri locale / client navigasyonda yeniden bağlar. */
export function MarketingHeroEffects({ locale }: { locale: Locale }) {
  const cursorReady = useRef(false);

  useEffect(() => {
    if (!cursorReady.current) return;

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        window.destroyHeroV2Cursor?.();
        window.initHeroV2Cursor?.();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [locale]);

  useEffect(() => {
    return () => {
      window.destroyHeroV2Cursor?.();
    };
  }, []);

  return (
    <>
      <Script
        src="/hero-v2-rotator.js"
        strategy="afterInteractive"
      />
      <Script
        src="/hero-v2-cursor.js"
        strategy="afterInteractive"
        onLoad={() => {
          cursorReady.current = true;
          window.initHeroV2Cursor?.();
        }}
      />
    </>
  );
}
