"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectDetailImage } from "./ProjectDetailImage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type Variant = "cover" | "gallery";
type PlaybackMode = "auto" | "click";

function primeVideoForInlinePlay(v: HTMLVideoElement) {
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.loop = true;
}

export function ProjectDetailMedia({
  posterSrc,
  videoSrc,
  alt,
  priority = false,
  variant = "gallery",
  placeholderLabel,
  placeholderColor,
  playback = "auto",
  loadEagerly = false,
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
  /** Viewport beklemeden yükle (showreel); click modunda preload=auto */
  loadEagerly?: boolean;
  playLabel?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(loadEagerly);
  const [videoReady, setVideoReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const clickMode = playback === "click";

  const shouldMountSrc = clickMode
    ? loadEagerly || loadVideo || activated
    : loadVideo;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (loadEagerly && videoSrc && !reducedMotion) {
      setLoadVideo(true);
    }
  }, [loadEagerly, videoSrc, reducedMotion]);

  useEffect(() => {
    if (!videoSrc || reducedMotion || clickMode) return;
    if (loadEagerly) return;
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
  }, [videoSrc, reducedMotion, clickMode, loadEagerly]);

  const tryPlay = useCallback((v: HTMLVideoElement) => {
    primeVideoForInlinePlay(v);
    return v.play().then(
      () => {
        setVideoReady(true);
        setPlayError(false);
        setAutoplayBlocked(false);
      },
      () => {
        setPlayError(true);
        setAutoplayBlocked(true);
        return Promise.reject(new Error("play rejected"));
      },
    );
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldMountSrc || !videoSrc || clickMode) return;

    primeVideoForInlinePlay(v);

    const attemptPlay = () => {
      if (document.hidden) return;
      void tryPlay(v).catch(() => {});
    };

    attemptPlay();
    v.addEventListener("canplay", attemptPlay, { once: true });
    v.addEventListener("loadeddata", attemptPlay, { once: true });

    const onVis = () => {
      if (document.hidden) v.pause();
      else if (v.paused && v.readyState >= 2) attemptPlay();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("canplay", attemptPlay);
      v.removeEventListener("loadeddata", attemptPlay);
    };
  }, [shouldMountSrc, videoSrc, clickMode, tryPlay]);

  /** Tıklama jesti içinde play — src aynı event döngüsünde */
  const handlePlayClick = useCallback(() => {
    if (!videoSrc || reducedMotion) return;

    setActivated(true);
    setLoadVideo(true);
    setPlayError(false);

    const v = videoRef.current;
    if (!v) return;

    primeVideoForInlinePlay(v);

    if (!v.currentSrc && videoSrc) {
      v.src = videoSrc;
    }

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void tryPlay(v);
      return;
    }

    const onReady = () => {
      void tryPlay(v);
    };
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    if (v.networkState === HTMLMediaElement.NETWORK_EMPTY && videoSrc) {
      v.src = videoSrc;
    }
    void tryPlay(v);
  }, [videoSrc, reducedMotion, tryPlay]);

  const posterHidden = clickMode && activated && !playError;
  const showVideoVisible = clickMode
    ? activated && !playError
    : Boolean(videoSrc) && loadVideo && !reducedMotion && videoReady;

  const showPlayButton =
    Boolean(videoSrc) &&
    !reducedMotion &&
    (playError || (clickMode ? !activated : autoplayBlocked));

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
              onClick={(e) => {
                e.preventDefault();
                handlePlayClick();
              }}
              aria-label={playLabel}
            >
              <span className="project-detail-media__play-icon" aria-hidden="true" />
            </button>
          ) : null}
          {playError && !posterHidden ? (
            <p className="project-detail-media__play-error" role="status">
              Video yüklenemedi — URL adresini kontrol edin.
            </p>
          ) : null}
        </div>
      ) : showPlayButton ? (
        <div className="project-detail-media__poster-wrap project-detail-media__poster-wrap--video-only">
          <button
            type="button"
            className="project-detail-media__play"
            onClick={(e) => {
              e.preventDefault();
              handlePlayClick();
            }}
            aria-label={playLabel}
          >
            <span className="project-detail-media__play-icon" aria-hidden="true" />
          </button>
          {playError ? (
            <p className="project-detail-media__play-error" role="status">
              Video yüklenemedi — URL adresini kontrol edin.
            </p>
          ) : null}
        </div>
      ) : null}

      {videoSrc && !reducedMotion ? (
        <video
          ref={videoRef}
          className={`project-detail-media__video${
            shouldMountSrc ? " is-mounted" : ""
          }${showVideoVisible ? " is-visible" : ""}`}
          poster={posterSrc || undefined}
          muted
          playsInline
          loop
          autoPlay={!clickMode && loadVideo}
          preload={
            clickMode
              ? loadEagerly
                ? "auto"
                : "metadata"
              : loadEagerly
                ? "auto"
                : "none"
          }
          tabIndex={clickMode ? 0 : -1}
          src={shouldMountSrc ? videoSrc : undefined}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => {
            if (clickMode) return;
            const v = videoRef.current;
            if (v && !document.hidden) void tryPlay(v).catch(() => {});
          }}
          onPlay={() => {
            setPlayError(false);
            setAutoplayBlocked(false);
          }}
          onError={() => {
            setPlayError(true);
            setAutoplayBlocked(true);
          }}
        />
      ) : null}
    </div>
  );
}
