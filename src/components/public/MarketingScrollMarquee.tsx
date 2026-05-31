"use client";

/**
 * @section çift-kayan-yazi
 * Scroll-linked çift satır metin bandı (değerler kartları sonrası).
 * Aktif/pasif: src/lib/marketing-flags.ts → ENABLE_CIFT_KAYAN_YAZI
 */
import { Fragment, useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

const REPEAT = 2;

function MarqueeTrack({
  phrases,
  trackRef,
}: {
  phrases: string[];
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="home-scroll-marquee__row">
      <div className="home-scroll-marquee__track" ref={trackRef}>
        {Array.from({ length: REPEAT }, (_, seq) => (
          <Fragment key={seq}>
            {phrases.map((phrase) => (
              <Fragment key={`${seq}-${phrase}`}>
                <span className="home-scroll-marquee__phrase">{phrase}</span>
                <span className="home-scroll-marquee__sep" aria-hidden="true">
                  —
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/** İki satır — scroll scrub ile yatay kayma (sticky viewport). */
export function MarketingScrollMarquee({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const copy = messages.home.scrollMarquee;
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      section.classList.add("is-reduced-motion");
      return;
    }

    const update = () => {
      const t1 = row1Ref.current;
      const t2 = row2Ref.current;
      if (!section || !t1 || !t2) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollRange = Math.max(section.offsetHeight - vh, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollRange);
      const progress = scrolled / scrollRange;

      const travel1 = t1.scrollWidth * 0.38;
      const travel2 = t2.scrollWidth * 0.38;

      t1.style.transform = `translate3d(${-progress * travel1}px, 0, 0)`;
      t2.style.transform = `translate3d(${travel2 * 0.12 - progress * travel1 * 0.92}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!activeRef.current) return;
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        update();
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = Boolean(entry?.isIntersecting);
        if (activeRef.current) update();
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );

    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="home-scroll-marquee"
      lang={locale}
      aria-label={copy.ariaLabel}
    >
      <div className="home-scroll-marquee__sticky">
        <MarqueeTrack phrases={copy.rows[0] ?? []} trackRef={row1Ref} />
        <MarqueeTrack phrases={copy.rows[1] ?? []} trackRef={row2Ref} />
      </div>
    </section>
  );
}
