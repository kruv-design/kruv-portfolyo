"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectDetailImage } from "./ProjectDetailImage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type Variant = "cover" | "gallery";
type PlaybackMode = "auto" | "click";

export function ProjectDetailMedia({
  posterSrc,
  videoSrc,
  alt,
  priority = false,
  variant = "gallery",
  placeholderLabel,
  placeholderColor,
  playback = "auto",
  playLabel = "Play video",
}: {
  posterSrc: string;
  videoSrc: string | null;
  alt: string;
  priority?: boolean;
  variant?: Variant;
  placeholderLabel?: string;
  placeholderColor?: string;
  /** `click` = poster + oynat butonu; `auto` = scroll'da sessiz loop */
  playback?: PlaybackMode;
  playLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const clickMode = playback === "click";

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!videoSrc || reducedMotion || clickMode) return;
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setLoadVideo(true);
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoSrc, reducedMotion, clickMode]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !loadVideo || !videoSrc || clickMode) return;

    const onVis = () => {
      if (document.hidden) v.pause();
      else if (v.paused && v.readyState >= 2) void v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [loadVideo, videoSrc, clickMode]);

  /** Tıklama jesti içinde play — src DOM'da hazır */
  const handlePlayClick = useCallback(() => {
    if (!videoSrc || reducedMotion) return;

    setActivated(true);
    setPlayError(false);

    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.playsInline = true;
    v.loop = true;

    const attemptPlay = () => {
      void v
        .play()
        .then(() => {
          setIsPlaying(true);
          setVideoReady(true);
          setPlayError(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setPlayError(true);
        });
    };

    if (!v.src || !v.currentSrc) {
      v.src = videoSrc;
    }

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      attemptPlay();
      return;
    }

    const onReady = () => attemptPlay();
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    v.load();
    attemptPlay();
  }, [videoSrc, reducedMotion]);

  const posterHidden = clickMode && activated;
  const showVideoVisible = clickMode
    ? activated
    : Boolean(videoSrc) && loadVideo && !reducedMotion && videoReady;

  const showPlayButton =
    clickMode && Boolean(videoSrc) && !reducedMotion && !activated;

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
            posterHidden || showVideoVisible
              ? "project-detail-media__poster-wrap is-under-video"
              : "project-detail-media__poster-wrap"
          }
        >
          <ProjectDetailImage
            src={posterSrc}
            alt={alt}
            priority={priority}
            variant={variant}
          />
          {showPlayButton ? (
            <button
              type="button"
              className="project-detail-media__play"
              onClick={handlePlayClick}
              aria-label={playLabel}
            >
              <span className="project-detail-media__play-icon" aria-hidden="true" />
            </button>
          ) : null}
          {playError && !posterHidden ? (
            <p className="project-detail-media__play-error" role="status">
              Video yüklenemedi — URL'yi kontrol edin.
            </p>
          ) : null}
        </div>
      ) : null}

      {videoSrc && !reducedMotion ? (
        <video
          ref={videoRef}
          className={`project-detail-media__video${
            clickMode || loadVideo ? " is-mounted" : ""
          }${showVideoVisible ? " is-visible" : ""}`}
          poster={posterSrc || undefined}
          muted
          playsInline
          loop
          autoPlay={!clickMode && loadVideo}
          preload={clickMode ? "metadata" : "none"}
          tabIndex={clickMode ? 0 : -1}
          src={clickMode || loadVideo ? videoSrc : undefined}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => {
            if (clickMode) return;
            const v = videoRef.current;
            if (v && !document.hidden) void v.play().catch(() => {});
          }}
          onPlay={() => {
            setIsPlaying(true);
            setPlayError(false);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setPlayError(true);
          }}
        />
      ) : null}
    </div>
  );
}
