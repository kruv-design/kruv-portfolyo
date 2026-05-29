"use client";

import Script from "next/script";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";

declare global {
  interface Window {
    initHeroV2Cursor?: () => void;
    destroyHeroV2Cursor?: () => void;
  }
}

function heroDomReady(): boolean {
  return (
    !!document.querySelector(".hero-v2") &&
    !!document.getElementById("hero-v2-cursor")
  );
}

function waitForHeroDom(maxFrames = 48): Promise<void> {
  return new Promise((resolve) => {
    let frames = 0;
    const tick = () => {
      if (heroDomReady() || frames >= maxFrames) {
        resolve();
        return;
      }
      frames += 1;
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function waitForCursorApi(maxFrames = 48): Promise<void> {
  return new Promise((resolve) => {
    let frames = 0;
    const tick = () => {
      if (typeof window.initHeroV2Cursor === "function" || frames >= maxFrames) {
        resolve();
        return;
      }
      frames += 1;
      requestAnimationFrame(tick);
    };
    tick();
  });
}

async function bindHeroCursor() {
  await waitForCursorApi();
  await waitForHeroDom();
  window.destroyHeroV2Cursor?.();
  if (heroDomReady() && typeof window.initHeroV2Cursor === "function") {
    window.initHeroV2Cursor();
  }
}

/**
 * Hero HTML + imleç: locale değişince önce DOM yazılır, sonra cursor bağlanır.
 */
export function MarketingHeroMount({
  html,
  locale,
}: {
  html: string;
  locale: Locale;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    mount.innerHTML = html;

    let cancelled = false;

    void (async () => {
      await bindHeroCursor();
      if (cancelled) {
        window.destroyHeroV2Cursor?.();
      }
    })();

    return () => {
      cancelled = true;
      window.destroyHeroV2Cursor?.();
    };
  }, [html, locale]);

  useEffect(() => {
    if (typeof window.initHeroV2Cursor === "function" && heroDomReady()) {
      void bindHeroCursor();
    }
  }, []);

  return (
    <>
      <div ref={mountRef} className="marketing-hero-mount" />
      <Script src="/hero-v2-rotator.js" strategy="afterInteractive" />
      <Script
        src="/hero-v2-cursor.js"
        strategy="afterInteractive"
        onLoad={() => {
          void bindHeroCursor();
        }}
      />
    </>
  );
}
