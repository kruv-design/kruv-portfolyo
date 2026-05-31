"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectDetailImage } from "./ProjectDetailImage";

type PlayerPhase = "idle" | "playing" | "failed";

const CONTROLS_FALLBACK_MS = 2000;

function primeVideoElement(v: HTMLVideoElement) {
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;
  v.loop = true;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
}

/** Anasayfa showreel — basit oynatıcı (poster + play, native controls fallback). */
export function MarketingHomeShowreelPlayer({
  posterSrc,
  videoSrc,
  playLabel,
  errorLabel,
  openVideoLabel,
}: {
  posterSrc: string;
  videoSrc: string | null;
  playLabel: string;
  errorLabel: string;
  openVideoLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<PlayerPhase>("idle");
  const [showControls, setShowControls] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearFallbackTimer(), [clearFallbackTimer]);

  const enableControlsFallback = useCallback(() => {
    setShowControls(true);
    const v = videoRef.current;
    if (v) void v.play().catch(() => setPhase("failed"));
  }, []);

  const startPlayback = useCallback(() => {
    if (!videoSrc || reducedMotion) return;

    clearFallbackTimer();
    setPhase("playing");
    setShowControls(false);

    const v = videoRef.current;
    if (!v) return;

    primeVideoElement(v);

    fallbackTimerRef.current = window.setTimeout(() => {
      if (v.paused && !v.ended) {
        enableControlsFallback();
      }
    }, CONTROLS_FALLBACK_MS);

    void v.play().then(
      () => {
        clearFallbackTimer();
        setPhase("playing");
      },
      () => {
        enableControlsFallback();
      },
    );
  }, [videoSrc, reducedMotion, clearFallbackTimer, enableControlsFallback]);

  const showPoster = phase === "idle" || phase === "failed";
  const showVideo = Boolean(videoSrc) && !reducedMotion && phase !== "idle";
  const showPlayUi =
    Boolean(videoSrc) && !reducedMotion && (phase === "idle" || phase === "failed");

  return (
    <div className="project-detail-media project-detail-media--gallery home-showreel-player">
      {posterSrc ? (
        <div
          className={
            showPoster
              ? "project-detail-media__poster-wrap home-showreel-player__poster"
              : "project-detail-media__poster-wrap is-under-video"
          }
        >
          {showPlayUi ? (
            <button
              type="button"
              className="home-showreel-player__hit"
              onClick={(e) => {
                e.preventDefault();
                startPlayback();
              }}
              aria-label={playLabel}
            >
              <ProjectDetailImage
                src={posterSrc}
                alt=""
                variant="gallery"
              />
              <span className="project-detail-media__play" aria-hidden="true">
                <span className="project-detail-media__play-icon" />
              </span>
            </button>
          ) : (
            <ProjectDetailImage src={posterSrc} alt="" variant="gallery" />
          )}

          {phase === "failed" ? (
            <div className="home-showreel-player__error" role="status">
              <p className="project-detail-media__play-error">{errorLabel}</p>
              {videoSrc ? (
                <a
                  className="home-showreel-player__open-link"
                  href={videoSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {openVideoLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {videoSrc && !reducedMotion ? (
        <video
          ref={videoRef}
          className={`project-detail-media__video is-mounted${
            showVideo ? " is-visible" : ""
          }${showControls ? " has-controls" : ""}`}
          poster={posterSrc || undefined}
          src={videoSrc}
          muted
          playsInline
          loop
          preload="auto"
          controls={showControls}
          tabIndex={showControls ? 0 : -1}
          onPlay={() => {
            clearFallbackTimer();
            setPhase("playing");
          }}
          onError={() => {
            clearFallbackTimer();
            setPhase("failed");
            setShowControls(true);
          }}
        />
      ) : null}
    </div>
  );
}
