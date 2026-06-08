"use client";

import type { ReactNode } from "react";

type SiteNavMobileOverlayProps = {
  id: string;
  titleId: string;
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
};

/** Tam ekran mobil menü paneli — overlay nav dışında, çarpı navbar’da kalır. */
export function SiteNavMobileOverlay({
  id,
  titleId,
  open,
  onClose,
  children,
}: SiteNavMobileOverlayProps) {
  return (
    <div
      id={id}
      className="marketing-nav-mobile-overlay site-nav-mobile-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
      hidden={!open}
      onClick={(e) => {
        if (!open || !onClose) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <h2 id={titleId} className="sr-only">
        Menu
      </h2>
      <div className="marketing-nav-mobile-body site-nav-mobile-body">{children}</div>
    </div>
  );
}
