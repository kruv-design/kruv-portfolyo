"use client";

import { useEffect, useState, type RefObject } from "react";
import type { Locale } from "@/lib/i18n/config";
import { normalizeDropFontText } from "@/lib/drops-font-assets";

type Props = {
  fontName: string;
  fontSlug: string;
  locale: Locale;
  label: string;
  sentinelRef: RefObject<HTMLElement | null>;
  hidden?: boolean;
  onDownload: () => void;
};

export function DropFontStickyDownload({
  fontName,
  fontSlug,
  locale,
  label,
  sentinelRef,
  hidden = false,
  onDownload,
}: Props) {
  const [pastIntro, setPastIntro] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPastIntro(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sentinelRef]);

  const visible = pastIntro && !hidden;
  const name = normalizeDropFontText(fontName, fontSlug, locale);

  return (
    <div
      className={`drops-download-stick${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="drops-download-stick__bar">
        <p
          className="drops-download-stick__name drops-drop-type"
          lang={fontSlug === "local" ? undefined : "en"}
        >
          {name}
        </p>
        <button
          type="button"
          className="drops-download-stick__btn"
          tabIndex={visible ? 0 : -1}
          onClick={onDownload}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
