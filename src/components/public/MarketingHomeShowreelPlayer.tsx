"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ProjectDetailImage } from "./ProjectDetailImage";

function setVideoMuted(v: HTMLVideoElement, muted: boolean) {
  v.muted = muted;
  v.defaultMuted = muted;
  if (muted) {
    v.setAttribute("muted", "");
  } else {
    v.removeAttribute("muted");
  }
}

function primeVideoForAutoplay(v: HTMLVideoElement) {
  setVideoMuted(v, true);
  v.playsInline = true;
  v.loop = true;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
}

function isElementInViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/** Evrensel medya kontrolü — Lucide VolumeX / Volume2 (YouTube, Instagram ile aynı dil). */
function ShowreelSoundIcon({ muted }: { muted: boolean }) {
  const speaker = (
    <path
      fill="currentColor"
      d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5V4.7Z"
    />
  );

  if (muted) {
    return (
      <svg
        className="home-showreel-player__sound-icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
      >
        {speaker}
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          d="M16 9l6 6M22 9l-6 6"
        />
      </svg>
    );
  }

  return (
    <svg
      className="home-showreel-player__sound-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      {speaker}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        d="M15.5 8.5a5 5 0 0 1 0 7"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        d="M19 5a9 9 0 0 1 0 14"
      />
    </svg>
  );
}

/** Anasayfa showreel — viewport'a girince sessiz autoplay; ses toggle ile açılır. */
export function MarketingHomeShowreelPlayer({
  posterSrc,
  videoSrc,
  playLabel,
  playCtaLabel,
  errorLabel,
  openVideoLabel,
  muteLabel,
  unmuteLabel,
  eager = false,
}: {
  posterSrc: string;
  videoSrc: string | null;
  playLabel: string;
  playCtaLabel: string;
  errorLabel: string;
  openVideoLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  /** Hero gibi fold üstü — hemen yükle, IO bekleme. */
  eager?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMutedRef = useRef(true);
  const [loadVideo, setLoadVideo] = useState(() => Boolean(eager && videoSrc));
  const [hasFrames, setHasFrames] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [playError, setPlayError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const tryPlay = useCallback((v: HTMLVideoElement) => {
    if (document.hidden) return Promise.reject(new Error("document hidden"));
    setVideoMuted(v, isMutedRef.current);
    v.playsInline = true;
    v.loop = true;
    return v.play().then(
      () => {
        setVideoReady(true);
        setPlayError(false);
      },
      () => {
        setPlayError(true);
        setVideoReady(false);
        return Promise.reject(new Error("play rejected"));
      },
    );
  }, []);

  const beginLoad = useCallback(() => {
    if (!videoSrc || reducedMotion) return;
    setPlayError(false);
    setLoadVideo(true);
  }, [videoSrc, reducedMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (eager || !videoSrc || reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    if (isElementInViewport(container)) {
      beginLoad();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          beginLoad();
        }
      },
      { threshold: 0.01, rootMargin: "120px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [eager, videoSrc, reducedMotion, beginLoad]);

  useLayoutEffect(() => {
    const v = videoRef.current;
    if (!v || !loadVideo || !videoSrc || reducedMotion) return;

    let cancelled = false;
    let autoplayPrimed = false;

    const attempt = () => {
      if (cancelled || document.hidden) return;
      if (!autoplayPrimed) {
        primeVideoForAutoplay(v);
        autoplayPrimed = true;
      } else {
        setVideoMuted(v, isMutedRef.current);
      }
      void tryPlay(v).catch(() => {});
    };

    attempt();

    const onReady = () => attempt();
    v.addEventListener("canplay", onReady);
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplaythrough", onReady, { once: true });

    if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) {
      v.load();
    }

    const raf = requestAnimationFrame(attempt);

    const onVis = () => {
      if (document.hidden) {
        v.pause();
        return;
      }
      if (v.paused && v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setVideoMuted(v, isMutedRef.current);
        void tryPlay(v).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplaythrough", onReady);
    };
  }, [loadVideo, videoSrc, reducedMotion, tryPlay]);

  const handleManualPlay = useCallback(() => {
    if (!videoSrc) return;
    setPlayError(false);
    setLoadVideo(true);
    const v = videoRef.current;
    if (!v) return;
    primeVideoForAutoplay(v);
    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void tryPlay(v).catch(() => {});
      return;
    }
    const onReady = () => void tryPlay(v).catch(() => {});
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) {
      v.load();
    }
    void tryPlay(v).catch(() => {});
  }, [videoSrc, tryPlay]);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !isMuted;
    setVideoMuted(v, nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      v.volume = 1;
      void v.play().catch(() => {});
    }
  }, [isMuted]);

  const showPlayUi =
    Boolean(videoSrc) && (playError || (reducedMotion && !videoReady));
  const videoShowing = loadVideo && (hasFrames || videoReady) && !playError;
  const posterHidden = videoShowing;
  const showSoundToggle = loadVideo && (hasFrames || videoReady) && !playError;

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
                handleManualPlay();
              }}
              aria-label={playLabel}
            >
              <ProjectDetailImage
                src={posterSrc}
                alt="Kruv showreel"
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
            <ProjectDetailImage
              src={posterSrc}
              alt="Kruv showreel"
              variant="gallery"
              priority={eager}
              sizes="100vw"
            />
          ) : null}

          {playError && !loadVideo ? (
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

      {videoSrc && loadVideo ? (
        <>
          <video
            ref={videoRef}
            className={`project-detail-media__video is-mounted${
              videoShowing ? " is-visible" : ""
            }`}
            poster={posterSrc || undefined}
            src={videoSrc}
            muted={isMuted}
            autoPlay
            playsInline
            loop
            preload={eager ? "auto" : "metadata"}
            tabIndex={-1}
            aria-hidden={showSoundToggle ? undefined : true}
            onLoadedData={() => setHasFrames(true)}
            onPlaying={() => {
              setHasFrames(true);
              setVideoReady(true);
              setPlayError(false);
            }}
            onPlay={() => {
              setHasFrames(true);
              setVideoReady(true);
              setPlayError(false);
            }}
            onError={() => {
              setPlayError(true);
              setVideoReady(false);
            }}
          />
          {showSoundToggle ? (
            <button
              type="button"
              className="home-showreel-player__sound"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSound();
              }}
              aria-label={isMuted ? unmuteLabel : muteLabel}
              aria-pressed={!isMuted}
            >
              <ShowreelSoundIcon muted={isMuted} />
            </button>
          ) : null}
          {playError && loadVideo ? (
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
