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

/** Anasayfa showreel — poster + tıklayınca sessiz loop (native controls yedek). */
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activated, setActivated] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    if (!videoSrc || reducedMotion) return;

    setActivated(true);
    setPlayError(false);

    const v = videoRef.current;
    if (!v) return;

    primeVideoElement(v);

    if (!v.currentSrc && videoSrc) {
      v.src = videoSrc;
    }

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
  }, [videoSrc, reducedMotion, tryPlay]);

  const posterHidden = activated;
  const showVideo = Boolean(videoSrc) && !reducedMotion && activated;
  const showPlayUi =
    Boolean(videoSrc) && !reducedMotion && !activated;

  return (
    <div className="project-detail-media project-detail-media--gallery home-showreel-player">
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

      {videoSrc && !reducedMotion ? (
        <>
          <video
            ref={videoRef}
            className={`project-detail-media__video${
              activated ? " is-mounted" : ""
            }${showVideo ? " is-visible" : ""}${
              activated ? " has-controls" : ""
            }`}
            poster={posterSrc || undefined}
            src={activated ? videoSrc : undefined}
            muted
            playsInline
            loop
            preload={activated ? "auto" : "metadata"}
            controls={activated}
            tabIndex={activated ? 0 : -1}
            onPlay={() => setPlayError(false)}
            onError={() => setPlayError(true)}
          />
          {playError && activated ? (
            <div className="home-showreel-player__error home-showreel-player__error--over-video" role="status">
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
