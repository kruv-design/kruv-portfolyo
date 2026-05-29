"use client";

import { useEffect } from "react";

/** `kruv.html` anasayfa inline scriptleri — mount sonrası çalıştırılır. */
export function MarketingHomeScripts({ scripts }: { scripts: string[] }) {
  useEffect(() => {
    if (!scripts.length) return;

    const run = () => {
      for (const code of scripts) {
        const el = document.createElement("script");
        el.text = code;
        document.body.appendChild(el);
      }
    };

    // Layout ölçümü (marquee fill) için paint sonrası çalıştır.
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [scripts]);

  return null;
}
