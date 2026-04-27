"use client";

import { useCallback, useEffect } from "react";

export function Lightbox({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!src) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [src, handleKey]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-8 transition-opacity"
      style={{ background: "var(--gray-scrim-900)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="fixed right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors"
        style={{ background: "var(--gray-120)", color: "var(--gray-1000)" }}
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="max-h-[88vh] max-w-[90vw] rounded-sm object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
