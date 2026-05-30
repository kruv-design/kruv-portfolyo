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
  /** `click` = poster + oynat butonu; `auto` = scroll’da sessiz loop */
  playback?: PlaybackMode;
  playLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const tryPlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return false;
    try {
      await v.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

  /** Tıklama modu: src yüklendikten sonra oynat */
  useEffect(() => {
    if (!clickMode || !activated || !loadVideo || !videoSrc) return;
    const v = videoRef.current;
    if (!v) return;

    const playWhenReady = () => {
      void tryPlay();
    };

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playWhenReady();
      return;
    }

    v.addEventListener("canplay", playWhenReady, { once: true });
    v.addEventListener("loadeddata", playWhenReady, { once: true });
    return () => {
      v.removeEventListener("canplay", playWhenReady);
      v.removeEventListener("loadeddata", playWhenReady);
    };
  }, [clickMode, activated, loadVideo, videoSrc, tryPlay]);

  const handlePlayClick = useCallback(() => {
    if (!videoSrc || reducedMotion) return;
    setActivated(true);
    setLoadVideo(true);
  }, [videoSrc, reducedMotion]);

  const showVideo =
    Boolean(videoSrc) &&
    loadVideo &&
    !reducedMotion &&
    videoReady &&
    (clickMode ? activated && isPlaying : true);

  const showPlayButton =
    clickMode && Boolean(videoSrc) && !reducedMotion && !isPlaying;

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
            showVideo
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
          autoPlay={!clickMode}
          preload={clickMode && activated ? "auto" : "none"}
          aria-hidden={clickMode ? undefined : true}
          tabIndex={clickMode ? 0 : -1}
          {...(loadVideo ? { src: videoSrc } : {})}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => {
            if (clickMode) return;
            const v = videoRef.current;
            if (v && !document.hidden) void v.play().catch(() => {});
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setActivated(false);
          }}
        />
      ) : null}
    </div>
  );
}
