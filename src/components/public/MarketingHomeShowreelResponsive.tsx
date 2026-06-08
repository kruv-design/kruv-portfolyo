"use client";

import { useSyncExternalStore } from "react";
import type { HomeShowreelSlot } from "@/lib/home-showreel";
import { MarketingHomeShowreelPlayer } from "./MarketingHomeShowreelPlayer";

/** `globals.css` / `marketing-critical-css` ile aynı */
const SHOWREEL_DESKTOP_MQ = "(min-width: 900px)";

type ShowreelVariant = "web" | "mobile";

function subscribeDesktopMq(onChange: () => void) {
  const mq = window.matchMedia(SHOWREEL_DESKTOP_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktopMqSnapshot() {
  return window.matchMedia(SHOWREEL_DESKTOP_MQ).matches;
}

function getDesktopMqServerSnapshot() {
  return false;
}

export function pickHomeShowreelVariant(
  isDesktop: boolean,
  web: HomeShowreelSlot | null,
  mobile: HomeShowreelSlot | null,
  webOnly: boolean,
): { slot: HomeShowreelSlot; variant: ShowreelVariant } | null {
  if (webOnly && web) {
    return { slot: web, variant: "web" };
  }
  if (isDesktop) {
    if (web) return { slot: web, variant: "web" };
    if (mobile) return { slot: mobile, variant: "mobile" };
    return null;
  }
  if (mobile) return { slot: mobile, variant: "mobile" };
  if (web) return { slot: web, variant: "web" };
  return null;
}

/** Tek showreel player — mobilde dikey, webde yatay (çift video yüklemesi yok). */
export function MarketingHomeShowreelResponsive({
  web,
  mobile,
  webOnly,
  playLabel,
  playCtaLabel,
  errorLabel,
  openVideoLabel,
  muteLabel,
  unmuteLabel,
}: {
  web: HomeShowreelSlot | null;
  mobile: HomeShowreelSlot | null;
  webOnly: boolean;
  playLabel: string;
  playCtaLabel: string;
  errorLabel: string;
  openVideoLabel: string;
  muteLabel: string;
  unmuteLabel: string;
}) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktopMq,
    getDesktopMqSnapshot,
    getDesktopMqServerSnapshot,
  );

  const active = pickHomeShowreelVariant(isDesktop, web, mobile, webOnly);
  if (!active) return null;

  const className =
    active.variant === "web"
      ? `home-showreel__variant home-showreel__variant--web${
          webOnly ? " home-showreel__variant--solo" : ""
        }`
      : "home-showreel__variant home-showreel__variant--mobile";

  return (
    <div className={className}>
      <MarketingHomeShowreelPlayer
        key={`${active.variant}-${active.slot.videoSrc ?? "none"}`}
        posterSrc={active.slot.posterSrc}
        videoSrc={active.slot.videoSrc}
        playLabel={playLabel}
        playCtaLabel={playCtaLabel}
        errorLabel={errorLabel}
        openVideoLabel={openVideoLabel}
        muteLabel={muteLabel}
        unmuteLabel={unmuteLabel}
      />
    </div>
  );
}
