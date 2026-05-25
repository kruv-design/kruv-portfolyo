"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectDetailImage } from "./ProjectDetailImage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type Variant = "cover" | "gallery";

export function ProjectDetailMedia({
  posterSrc,
  videoSrc,
  alt,
  priority = false,
  variant = "gallery",
  placeholderLabel,
  placeholderColor,
}: {
  posterSrc: string;
  videoSrc: string | null;
  alt: string;
  priority?: boolean;
  variant?: Variant;
  placeholderLabel?: string;
  placeholderColor?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!videoSrc || reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShouldLoadVideo(true);
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoSrc, reducedMotion]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoadVideo || !videoSrc) return;

    const onVis = () => {
      if (document.hidden) v.pause();
      else if (v.paused && v.readyState >= 2) void v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [shouldLoadVideo, videoSrc]);

  const showVideo =
    Boolean(videoSrc) && shouldLoadVideo && !reducedMotion && videoReady;

  if (!posterSrc && !videoSrc) {
    if (!placeholderLabel) return null;
    return (
      <ImagePlaceholder
        label={placeholderLabel}
        color={placeholderColor ?? "#C8B8A8"}
        fontSize={variant === "cover" ? "5rem" : "3rem"}
        className={
          variant === "cover"
            ? "project-detail-cover__placeholder"
            : undefined
        }
      />
    );
  }

  return (
    <div
      ref={rootRef}
      className={
        variant === "cover"
          ? "project-detail-media project-detail-media--cover"
          : "project-detail-media project-detail-media--gallery"
      }
    >
      {posterSrc ? (
        <div
          className={
            showVideo ? "project-detail-media__poster-wrap is-under-video" : "project-detail-media__poster-wrap"
          }
        >
          <ProjectDetailImage
            src={posterSrc}
            alt={alt}
            priority={priority}
            variant={variant}
          />
        </div>
      ) : null}

      {videoSrc && !reducedMotion ? (
        <video
          ref={videoRef}
          className={`project-detail-media__video${showVideo ? " is-visible" : ""}`}
          poster={posterSrc || undefined}
          muted
          playsInline
          loop
          autoPlay
          preload="none"
          aria-hidden
          tabIndex={-1}
          {...(shouldLoadVideo ? { src: videoSrc } : {})}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => {
            const v = videoRef.current;
            if (v && !document.hidden) void v.play().catch(() => {});
          }}
        />
      ) : null}
    </div>
  );
}
