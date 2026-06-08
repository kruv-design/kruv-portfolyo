"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectDetailImage } from "./ProjectDetailImage";

function primeVideoElement(v: HTMLVideoElement) {
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;
  v.loop = true;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
}

/** Anasayfa showreel — viewport'a girince sessiz autoplay; reduced-motion veya hata durumunda poster + play butonu. */
export function MarketingHomeShowreelPlayer({
  posterSrc,
  videoSrc,
  playLabel,
  playCtaLabel,
  errorLabel,
  openVideoLabel,
}: {
  posterSrc: string;
  videoSrc: string | null;
  playLabel: string;
  playCtaLabel: string;
  errorLabel: string;
  openVideoLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activated, setActivated] = useState(false);
  const [playError, setPlayError] = useState(false);

  const tryPlay = useCallback((v: HTMLVideoElement) => {
    primeVideoElement(v);
    return v.play().then(
      () => setPlayError(false),
      () => {
        setPlayError(true);
        return Promise.reject(new Error("play rejected"));
      },
    );
  }, []);

  const startPlayback = useCallback(() => {
    if (!videoSrc) return;
    setPlayError(false);
    setActivated(true);
  }, [videoSrc]);

  // IntersectionObserver ile lazy autoplay — video verisi viewport dışında yüklenmez
  useEffect(() => {
    if (!videoSrc) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          startPlayback();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [videoSrc, startPlayback]);

  // activated olunca video element mount edilir, ardından play tetiklenir
  useEffect(() => {
    if (!activated || !videoSrc) return;

    const v = videoRef.current;
    if (!v) return;

    primeVideoElement(v);

    const attempt = () => {
      void tryPlay(v).catch(() => {});
    };

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      attempt();
      return;
    }

    const onReady = () => attempt();
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    v.load();
    attempt();
  }, [activated, videoSrc, tryPlay]);

  const posterHidden = activated && !playError;
  const showVideo = Boolean(videoSrc) && activated;
  const showPlayUi = Boolean(videoSrc) && (!activated || playError);

  return (
    <div
      ref={containerRef}
      className="project-detail-media project-detail-media--gallery home-showreel-player"
    >
      {posterSrc ? (
        <div
          className={
            posterHidden
              ? "project-detail-media__poster-wrap is-under-video"
              : "project-detail-media__poster-wrap home-showreel-player__poster"
          }
        >
          {showPlayUi ? (
            <button
              type="button"
              className="home-showreel-player__hit"
              onClick={(e) => {
                e.preventDefault();
                setPlayError(false);
                startPlayback();
              }}
              aria-label={playLabel}
            >
              <ProjectDetailImage
                src={posterSrc}
                alt=""
                variant="gallery"
                priority
                sizes="100vw"
              />
              <span className="home-showreel-player__cta" aria-hidden="true">
                <span className="home-showreel-player__cta-play">
                  <span className="home-showreel-player__cta-play-icon" />
                </span>
                <span className="home-showreel-player__cta-label">
                  {playCtaLabel}
                </span>
              </span>
            </button>
          ) : !posterHidden ? (
            <ProjectDetailImage src={posterSrc} alt="" variant="gallery" />
          ) : null}

          {playError && !activated ? (
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

      {videoSrc && activated ? (
        <>
          <video
            ref={videoRef}
            className={`project-detail-media__video is-mounted${
              showVideo && !playError ? " is-visible" : ""
            }`}
            poster={posterSrc || undefined}
            src={videoSrc}
            muted
            autoPlay
            playsInline
            loop
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
            onPlay={() => setPlayError(false)}
            onError={() => setPlayError(true)}
          />
          {playError ? (
            <div
              className="home-showreel-player__error home-showreel-player__error--over-video"
              role="status"
            >
              <p className="project-detail-media__play-error">{errorLabel}</p>
              <a
                className="home-showreel-player__open-link"
                href={videoSrc}
                target="_blank"
                rel="noopener noreferrer"
              >
                {openVideoLabel}
              </a>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
