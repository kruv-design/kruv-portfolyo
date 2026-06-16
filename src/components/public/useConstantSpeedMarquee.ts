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
  /** Geçerli minimum genişlik — bunun altındaki değerler fallback font olarak kabul edilir */
  minPlausibleWidth?: number;
};

/** Sabit px/s — platforma göre metin genişliği değişse de hız aynı kalır. */
export function useConstantSpeedMarquee(
  trackRef: RefObject<HTMLElement | null>,
  {
    pxPerSecVar,
    durationVar,
    loopSelector,
    minDur = 24,
    maxDur = 90,
    reducedMinDur = 60,
    minPlausibleWidth = 200,
  }: Options,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Animasyonu hemen durdur — font/layout hesaplanana kadar görünmesini engelle
    track.style.animationPlayState = "paused";

    let rafId = 0;
    let timerId = 0;

    const readPxPerSec = () => {
      const raw = getComputedStyle(track).getPropertyValue(pxPerSecVar).trim();
      const n = parseFloat(raw);
      return n > 0 ? n : 78;
    };

    const loopWidth = () => {
      const loopEl = track.querySelector(loopSelector);
      if (loopEl) {
        const w = (loopEl as HTMLElement).getBoundingClientRect().width;
        if (w >= minPlausibleWidth) return w;
      }
      const total = track.getBoundingClientRect().width || track.scrollWidth;
      return total >= minPlausibleWidth * 2 ? total / 2 : 0;
    };

    const apply = () => {
      const width = loopWidth();
      // Henüz layout hazır değil — bekle
      if (width < minPlausibleWidth) return false;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let pxPerSec = readPxPerSec();
      if (reduced) pxPerSec = Math.min(pxPerSec, 45);

      let dur = width / pxPerSec;
      dur = Math.max(minDur, Math.min(maxDur, dur));
      if (reduced) dur = Math.max(dur, reducedMinDur);

      track.style.setProperty(durationVar, `${dur}s`);
      // Animasyonu baştan başlat ki yeni süre düzgün alsın
      track.style.animationPlayState = "paused";
      // Bir frame boşluk: tarayıcı pause'u işlesin
      requestAnimationFrame(() => {
        track.style.animationPlayState = "running";
      });
      return true;
    };

    // Debounce: arka arkaya gelen resize/font olaylarını tek apply'a indirir
    const schedule = () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      rafId = requestAnimationFrame(() => {
        if (!apply()) {
          timerId = window.setTimeout(() => {
            if (!apply()) {
              // Son çare: 500ms daha bekle (yavaş Windows font yüklemesi)
              timerId = window.setTimeout(apply, 500);
            }
          }, 200);
        }
      });
    };

    schedule();

    // Fontlar yüklenince yeniden ölç (Windows'ta kritik)
    document.fonts.ready.then(schedule);

    // Resize sadece 150ms debounce ile — sürekli tetiklenmesin
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(schedule, 150);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [trackRef, pxPerSecVar, durationVar, loopSelector, minDur, maxDur, reducedMinDur, minPlausibleWidth]);
}
