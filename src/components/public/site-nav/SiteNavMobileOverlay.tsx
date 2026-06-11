"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type SiteNavMobileOverlayProps = {
  id: string;
  titleId: string;
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
};

/** Tam ekran mobil menü — yalnızca açıkken `body` portal. */
export function SiteNavMobileOverlay({
  id,
  titleId,
  open,
  onClose,
  children,
}: SiteNavMobileOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      id={id}
      className="marketing-nav-mobile-overlay site-nav-mobile-overlay is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <h2 id={titleId} className="sr-only">
        Menu
      </h2>
      <div className="marketing-nav-mobile-body site-nav-mobile-body">{children}</div>
    </div>,
    document.body,
  );
}
