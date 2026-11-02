"use client";

import { useCallback, useEffect } from "react";

export type LightboxItem = {
  src: string;
  alt: string;
};

export function Lightbox({
  items,
  index,
  onClose,
  onChangeIndex,
  closeLabel = "Kapat",
  prevLabel = "Önceki görsel",
  nextLabel = "Sonraki görsel",
}: {
  items: LightboxItem[];
  /** Açık değilse null */
  index: number | null;
  onClose: () => void;
  onChangeIndex: (next: number) => void;
  closeLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const open = index !== null && items.length > 0;
  const current = open ? items[((index % items.length) + items.length) % items.length] : null;
  const multi = items.length > 1;

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      const next = (index + delta + items.length) % items.length;
      onChangeIndex(next);
    },
    [index, items.length, onChangeIndex],
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    },
    [open, onClose, go],
  );

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, handleKey]);

  if (!open || !current) return null;

  return (
    <div
      className="project-lightbox"
      style={{ background: "color-mix(in srgb, var(--black-fixed) 92%, transparent)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || "Görsel"}
    >
      <button
        type="button"
        className="project-lightbox__close"
        onClick={onClose}
        aria-label={closeLabel}
      >
        <span aria-hidden="true">✕</span>
      </button>

      {multi ? (
        <button
          type="button"
          className="project-lightbox__nav project-lightbox__nav--prev"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label={prevLabel}
        >
          <span aria-hidden="true">←</span>
        </button>
      ) : null}

      {multi ? (
        <button
          type="button"
          className="project-lightbox__nav project-lightbox__nav--next"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label={nextLabel}
        >
          <span aria-hidden="true">→</span>
        </button>
      ) : null}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.src}
        alt={current.alt}
        className="project-lightbox__img"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {multi ? (
        <p className="project-lightbox__count" aria-hidden="true">
          {(index ?? 0) + 1} / {items.length}
        </p>
      ) : null}
    </div>
  );
}
