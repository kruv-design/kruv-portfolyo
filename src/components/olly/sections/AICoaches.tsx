"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";

type Coach = "oliver" | "olivia";

const intro: Record<Coach, string> = {
  oliver:
    "Merhaba, ben Oliver. Sakin ve bilge bir tonla riskleri netleştirir, ilk adımı atmana yardım ederim.",
  olivia:
    "Selam, ben Olivia. Neşeli ve destekleyici yaklaşımımla sohbeti yumuşatır, güvenli bir alan kurarım.",
};

export function AICoaches() {
  const [active, setActive] = useState<Coach | null>(null);

  const pick = useCallback((c: Coach) => {
    setActive((p) => (p === c ? null : c));
  }, []);

  const onKey = useCallback(
    (e: React.KeyboardEvent, c: Coach) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(c);
      }
    },
    [pick],
  );

  return (
    <section
      id="olly-coach"
      className={cn(sectionShellClass(), "bg-olly-canvas")}
      aria-labelledby="olly-coaches-heading"
    >
      <Container>
        <div className="olly-surface-coach-panel flex flex-col gap-olly-10 rounded-olly-lg p-olly-8 md:flex-row md:items-center md:gap-olly-12 md:p-olly-16 lg:gap-olly-16">
          <div className="max-w-xl flex-1">
            <Typography variant="eyebrow" className="text-olly-accent">
              Kendi Tercihini Yap
            </Typography>
            <Typography
              id="olly-coaches-heading"
              variant="h2"
              className="mt-olly-3 text-olly-ink"
            >
              Senin AI Koçun:
              <span className="mt-olly-2 block font-normal text-olly-muted">
                Olivia ve Oliver
              </span>
            </Typography>
            <Typography variant="b3" className="mt-olly-5 text-olly-muted">
              Senin tercihlerini, kişilik özelliklerini ve güncel ihtiyaçlarını analiz
              eder. 🔎
            </Typography>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-olly-6 md:flex-row md:items-end md:justify-center">
            <div className="flex w-full max-w-sm justify-center md:mr-[-2.5rem]">
              <div className="origin-center -rotate-6 md:-rotate-[10.5deg]">
                <button
                  type="button"
                  role="button"
                  tabIndex={0}
                  aria-pressed={active === "oliver"}
                  aria-expanded={active === "oliver"}
                  aria-label="Oliver: Sakin ve Bilge"
                  onClick={() => pick("oliver")}
                  onKeyDown={(e) => onKey(e, "oliver")}
                  className={cn(
                    "w-full max-w-olly-coach rounded-olly-lg border bg-olly-surface/70 px-olly-8 py-olly-8 text-left shadow-olly-md outline-none backdrop-blur-sm transition duration-olly ease-out hover:-translate-y-1 hover:shadow-olly-lg focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas",
                    active === "oliver"
                      ? "border-olly-primary shadow-olly-glow ring-1 ring-olly-primary/50"
                      : "border-olly-line",
                  )}
                >
                  <div className="relative mx-auto h-olly-32 w-olly-32 overflow-hidden rounded-olly-full border border-olly-line/40">
                    <Image
                      src={ollyFigma.coachOliver}
                      alt="Oliver"
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                  <Typography variant="h3" className="mt-olly-6 text-center text-olly-ink">
                    Oliver
                  </Typography>
                  <Typography variant="b1" className="mt-olly-2 text-center text-olly-dim">
                    Sakin &amp; Bilge
                  </Typography>
                </button>
              </div>
            </div>

            <div className="flex w-full max-w-sm justify-center md:pb-olly-20">
              <div className="origin-center rotate-3 md:rotate-[5.5deg]">
                <button
                  type="button"
                  role="button"
                  tabIndex={0}
                  aria-pressed={active === "olivia"}
                  aria-expanded={active === "olivia"}
                  aria-label="Olivia: Neşeli ve Destekleyici"
                  onClick={() => pick("olivia")}
                  onKeyDown={(e) => onKey(e, "olivia")}
                  className={cn(
                    "w-full max-w-olly-coach rounded-olly-lg border bg-olly-primary/10 px-olly-8 py-olly-8 text-left shadow-olly-md outline-none transition duration-olly ease-out hover:-translate-y-1 hover:shadow-olly-lg focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas",
                    active === "olivia"
                      ? "border-olly-primary shadow-olly-glow ring-1 ring-olly-primary/50"
                      : "border-olly-primary",
                  )}
                >
                  <div className="relative mx-auto h-olly-32 w-olly-32 overflow-hidden rounded-olly-full border border-olly-line/40">
                    <Image
                      src={ollyFigma.coachOlivia}
                      alt="Olivia"
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                  <Typography variant="h3" className="mt-olly-6 text-center text-olly-ink">
                    Olivia
                  </Typography>
                  <Typography variant="b1" className="mt-olly-2 text-center text-olly-dim">
                    Neşeli &amp; Destekleyici
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="olly-expand mt-olly-8" data-open={active ? "true" : "false"} aria-live="polite">
          <div className="olly-expand-inner">
            <div className="rounded-olly-md border border-olly-line bg-olly-surface-2">
              {active ? (
                <Typography variant="b2" className="p-olly-5 text-olly-muted">
                  {intro[active]}
                </Typography>
              ) : (
                <div className="p-0" aria-hidden />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
