"use client";

import { Fragment, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { useConstantSpeedMarquee } from "./useConstantSpeedMarquee";

const REPEAT = 2;

/** Figma “Kayan yazı” — tek satır sonsuz marquee + ikon ayırıcı. */
export function MarketingHomeKayanYazi({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const copy = messages.home.kayanYazi;
  const trackRef = useRef<HTMLDivElement>(null);

  useConstantSpeedMarquee(trackRef, {
    pxPerSecVar: "--home-kayan-px-per-sec",
    durationVar: "--home-kayan-dur",
    loopSelector: ".home-kayan-yazi__sequence",
    minDur: 32,
    maxDur: 90,
    minPlausibleWidth: 400,
  });

  return (
    <section
      className="home-kayan-yazi"
      lang={locale}
      aria-label={copy.ariaLabel}
    >
      <div className="home-kayan-yazi__bleed">
        <div className="home-kayan-yazi__track" ref={trackRef}>
          {Array.from({ length: REPEAT }, (_, seq) => (
            <div key={seq} className="home-kayan-yazi__sequence" aria-hidden={seq > 0}>
              {copy.phrases.map((phrase) => (
                <Fragment key={`${seq}-${phrase}`}>
                  <span className="home-kayan-yazi__phrase">{phrase}</span>
                  <span className="home-kayan-yazi__sep" aria-hidden="true">
                    <img src="/assets/kayan-yazi-star.svg" alt="" width={52} height={52} />
                  </span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
