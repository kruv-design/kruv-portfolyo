"use client";

import { useEffect } from "react";

/** `kruv.html` anasayfa inline scriptleri — mount sonrası çalıştırılır. */
export function MarketingHomeScripts({ scripts }: { scripts: string[] }) {
  useEffect(() => {
    if (!scripts.length) return;
    for (const code of scripts) {
      const el = document.createElement("script");
      el.text = code;
      document.body.appendChild(el);
    }
  }, [scripts]);

  return null;
}
