"use client";

import { useEffect, type RefObject } from "react";

type Options = {
  /** CSS değişkeni — px/s (ör. --home-kayan-px-per-sec) */
  pxPerSecVar: string;
  /** Animasyon süresi değişkeni (ör. --home-kayan-dur) */
  durationVar: string;
  /** Tek döngü genişliği = track'in yarısı veya ilk sequence */
  loopSelector: string;
  minDur?: number;
  maxDur?: number;
  reducedMinDur?: number;
};

/** Sabit px/s — platforma göre metin genişliği değişse de hız aynı kalır. */
export function useConstantSpeedMarquee(
  trackRef: RefObject<HTMLElement | null>,
  { pxPerSecVar, durationVar, loopSelector, minDur = 24, maxDur = 90, reducedMinDur = 60 }: Options,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const readPxPerSec = () => {
      const raw = getComputedStyle(track).getPropertyValue(pxPerSecVar).trim();
      const n = parseFloat(raw);
      return n > 0 ? n : 78;
    };

    const loopWidth = () => {
      const loopEl = track.querySelector(loopSelector);
      if (loopEl) {
        const w = loopEl.getBoundingClientRect().width;
        if (w > 1) return w;
      }
      const total = track.getBoundingClientRect().width || track.scrollWidth;
      return total > 1 ? total / 2 : 0;
    };

    const apply = () => {
      const width = loopWidth();
      if (width < 1) return false;

      let pxPerSec = readPxPerSec();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        pxPerSec = Math.min(pxPerSec, 45);
      }

      let dur = width / pxPerSec;
      dur = Math.max(minDur, Math.min(maxDur, dur));
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        dur = Math.max(dur, reducedMinDur);
      }

      track.style.setProperty(durationVar, `${dur}s`);
      track.style.animationPlayState = "running";
      return true;
    };

    track.style.animationPlayState = "paused";

    const schedule = () => {
      requestAnimationFrame(() => {
        if (!apply()) window.setTimeout(apply, 150);
      });
    };

    schedule();

    const ro = new ResizeObserver(schedule);
    ro.observe(track);
    window.addEventListener("resize", schedule);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [trackRef, pxPerSecVar, durationVar, loopSelector, minDur, maxDur, reducedMinDur]);
}
