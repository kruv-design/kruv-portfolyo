"use client";

import Script from "next/script";
import { useEffect, useLayoutEffect } from "react";
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
  innerHtml,
  locale,
}: {
  innerHtml: string;
  locale: Locale;
}) {
  useLayoutEffect(() => {
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
  }, [innerHtml, locale]);

  useEffect(() => {
    if (typeof window.initHeroV2Cursor === "function" && heroDomReady()) {
      void bindHeroCursor();
    }
  }, []);

  return (
    <>
      <div
        className="marketing-hero-mount"
        suppressHydrationWarning
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
      <Script
        src="/hero-v2-cursor.js"
        strategy="lazyOnload"
        onLoad={() => {
          void bindHeroCursor();
        }}
      />
    </>
  );
}
