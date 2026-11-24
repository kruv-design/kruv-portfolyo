"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { resolveProjectVideoPosterUrl, resolveProjectVideoUrl } from "@/lib/project-images";
import type { ProtelVideoAspect } from "@/types";
import { protelAspectClass } from "./protel-aspect";

function ProtelVideoExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3H3v5M16 3h5v5M16 21h5v-5M8 21H3v-5"
      />
    </svg>
  );
}

export function ProtelVideoEmbed({
  title,
  videoUrl,
  aspectRatio = "16:9",
  framed = false,
  naturalSize = false,
  showCaption = true,
  /** iOS/Safari native fullscreen videoyu stretch eder; lightbox ile oran koru. */
  expandable = true,
  expandLabel = "Videoyu büyüt",
  closeLabel = "Kapat",
}: {
  title?: string;
  videoUrl: string;
  aspectRatio?: ProtelVideoAspect;
  framed?: boolean;
  /** Bento: videonun kendi boyutu; container zorlaması yok. */
  naturalSize?: boolean;
  /** false = başlık gizle (aria-label kalır). */
  showCaption?: boolean;
  expandable?: boolean;
  expandLabel?: string;
  closeLabel?: string;
}) {
  const inlineRef = useRef<HTMLVideoElement>(null);
  const lightboxRef = useRef<HTMLVideoElement>(null);
  const lightboxId = useId();
  const [expanded, setExpanded] = useState(false);
  const src = resolveProjectVideoUrl(videoUrl);
  const poster = resolveProjectVideoPosterUrl(videoUrl);
  const frameClass = framed ? " protel-video--framed" : "";
  const naturalClass = naturalSize ? " protel-video--natural" : "";
  const aspectClass = protelAspectClass(aspectRatio);
  const fitContain = !naturalSize ? " protel-video--fit-contain" : "";

  const closeLightbox = useCallback(() => {
    setExpanded(false);
    lightboxRef.current?.pause();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded, closeLightbox]);

  useEffect(() => {
    if (!expanded) return;
    const inline = inlineRef.current;
    const lb = lightboxRef.current;
    if (!inline || !lb) return;
    const t = inline.currentTime;
  lb.currentTime = Number.isFinite(t) ? t : 0;
    lb.muted = inline.muted;
    void lb.play().catch(() => {});
  }, [expanded]);

  if (!src) {
    return (
      <div
        className={`protel-video protel-video--placeholder ${protelAspectClass(aspectRatio)}${frameClass}${naturalClass}`}
      >
        <span className="protel-video__placeholder-text">
          {title || "Video yakında eklenecek"}
        </span>
      </div>
    );
  }

  const openLightbox = () => {
    if (!expandable) return;
    setExpanded(true);
  };

  return (
    <>
      <figure
        className={`protel-video${naturalSize ? "" : ` ${aspectClass}`}${frameClass}${naturalClass}${fitContain}${
          expandable ? " protel-video--expandable" : ""
        }`}
      >
        <video
          ref={inlineRef}
          src={src}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          controls
          controlsList="nofullscreen"
          disablePictureInPicture
          preload="metadata"
          className="protel-video__el"
          aria-label={title || "Video"}
        />
        {expandable ? (
          <button
            type="button"
            className="protel-video__expand"
            aria-label={expandLabel}
            aria-haspopup="dialog"
            aria-expanded={expanded}
            aria-controls={expanded ? lightboxId : undefined}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openLightbox();
            }}
          >
            <ProtelVideoExpandIcon />
          </button>
        ) : null}
        {showCaption && title && !naturalSize ? (
          <figcaption className="protel-video__caption">{title}</figcaption>
        ) : null}
      </figure>

      {expanded ? (
        <div
          id={lightboxId}
          role="dialog"
          aria-modal="true"
          aria-label={title || expandLabel}
          className="protel-video-lightbox"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="protel-video-lightbox__close"
            aria-label={closeLabel}
            onClick={closeLightbox}
          >
            ×
          </button>
          <div
            className="protel-video-lightbox__frame"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <video
              ref={lightboxRef}
              src={src}
              poster={poster || undefined}
              controls
              playsInline
              loop
              preload="auto"
              className="protel-video-lightbox__el"
              aria-label={title || "Video"}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ProtelVideoStack({
  items,
}: {
  items: Array<{ title: string; videoUrl: string; aspectRatio: ProtelVideoAspect }>;
}) {
  if (items.length === 0) {
    return <p className="protel-pitch__empty">Henüz video eklenmedi.</p>;
  }
  return (
    <div className="protel-video-stack">
      {items.map((item, i) => (
        <ProtelVideoEmbed
          key={`${item.title}-${i}`}
          title={item.title}
          videoUrl={item.videoUrl}
          aspectRatio={item.aspectRatio}
          framed
        />
      ))}
    </div>
  );
}
