"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";

const steps = [
  {
    key: 1,
    stage: "1. Aşama",
    title: "Görünmezlik",
    body: "Hiçbir profil görünmez, etkileşim sadece yapay zekâ ile gerçekleşir.",
    highlight: true,
  },
  {
    key: 2,
    stage: "2. Aşama",
    title: "Eşleşme",
    body: "Olly topladığı verilerle dinamik bir eşleştirme profili oluşturur.",
    highlight: false,
  },
  {
    key: 3,
    stage: "3. Aşama",
    title: "Açığa Çıkma",
    body: "Başarılı bir eşleşmeden sonra profilini görünür yapmayı ve iletişime geçmeyi seçebilirsin.",
    highlight: false,
  },
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const pinUntilRef = useRef(0);

  const recalc = useCallback(() => {
    if (typeof window !== "undefined" && Date.now() < pinUntilRef.current) return;
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const travel = Math.max(rect.height - vh * 0.4, 1);
    const progress = clamp((vh * 0.35 - rect.top) / travel, 0, 1);
    setStep(clamp(Math.floor(progress * steps.length), 0, steps.length - 1));
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener("scroll", recalc, { passive: true });
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", recalc);
    };
  }, [recalc]);

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <section
      ref={sectionRef}
      className={cn(sectionShellClass(), "overflow-x-hidden bg-olly-canvas")}
      aria-labelledby="olly-steps-heading"
    >
      <Container>
        <Typography variant="eyebrow" className="text-olly-accent">
          Nasıl Çalışır
        </Typography>
        <Typography id="olly-steps-heading" variant="h2" className="mt-olly-2 text-olly-ink">
          Üç adımda anlamlı bir bağlantı
        </Typography>

        <div className="mt-olly-12 grid gap-olly-5 md:grid-cols-3">
          {steps.map((s, i) => {
            const active = i === step;
            const past = i <= step;
            return (
              <article
                key={s.key}
                className={cn(
                  "flex flex-col gap-olly-6 rounded-olly-md border border-olly-step-line p-olly-7 transition duration-olly ease-out",
                  s.highlight && active
                    ? "bg-gradient-to-b from-olly-surface to-olly-brand-mid/30 shadow-olly-glow"
                    : "bg-olly-surface/40",
                  past ? "opacity-100" : "opacity-40",
                  active ? "scale-105 border-olly-primary shadow-olly-md" : "",
                )}
              >
                <Typography variant="eyebrow" className="text-olly-primary">
                  {s.stage}
                </Typography>
                <div>
                  <Typography variant="h3" className="text-olly-ink">
                    {s.title}
                  </Typography>
                  <Typography variant="b3" className="mt-olly-3 text-olly-gray-200">
                    {s.body}
                  </Typography>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-olly-10 flex flex-col items-center gap-olly-8">
          <div className="flex gap-olly-3 md:hidden" role="tablist" aria-label="Adımlar">
            {steps.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "h-olly-3 w-olly-3 rounded-olly-full border transition duration-olly ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas",
                  i === step
                    ? "border-olly-primary bg-olly-primary"
                    : "border-olly-step-line bg-olly-surface",
                )}
                onClick={() => {
                  pinUntilRef.current = Date.now() + 900;
                  setStep(i);
                }}
              >
                <span className="sr-only">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="relative h-olly-6 w-full max-w-olly-container">
            <Image
              src={ollyFigma.howProgress}
              alt=""
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 top-0 rounded-olly-full bg-olly-primary/25 transition-[width] duration-olly ease-out"
              style={{ width: `${progressPct}%` }}
              aria-hidden
            />
          </div>

          <div className="grid w-full max-w-4xl gap-olly-8 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="relative mx-auto h-olly-32 w-olly-32 shrink-0 overflow-hidden rounded-olly-full blur-sm md:h-olly-40 md:w-olly-40">
              <Image
                src={ollyFigma.profileFrameA}
                alt=""
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <div className="space-y-olly-4">
              <div className="rounded-olly-md border border-olly-line bg-olly-surface p-olly-4">
                <Typography variant="b4" className="text-olly-brand-mid">
                  Oliver&apos;ın Önerisi
                </Typography>
                <div className="mt-olly-4 rounded-olly-md bg-olly-surface-2 p-olly-4">
                  <div className="flex gap-olly-3">
                    <div className="relative h-olly-12 w-olly-12 shrink-0 overflow-hidden rounded-olly-full">
                      <Image src={ollyFigma.profileFrameA} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-olly-ink">
                        Cansu Salkım
                      </Typography>
                      <Typography variant="b3" className="text-olly-dim">
                        25 · İzmir · Ürün geliştiricisi
                      </Typography>
                    </div>
                  </div>
                  <div className="mt-olly-3 flex items-center gap-olly-2">
                    <div className="relative h-olly-3 w-olly-3 shrink-0">
                      <Image src={ollyFigma.howStar} alt="" fill className="object-contain" sizes="12px" />
                    </div>
                    <Typography variant="b3" className="text-olly-bright">
                      Aynı frekanstasınız, sanat &amp; tech
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-olly-3">
                <div className="self-end rounded-olly-md bg-olly-primary px-olly-4 py-olly-3">
                  <Typography variant="b2" className="text-olly-bright">
                    Selam naber?
                  </Typography>
                </div>
                <div className="self-start rounded-olly-md border border-olly-line bg-olly-surface/30 px-olly-4 py-olly-3">
                  <Typography variant="b2" className="text-olly-ink">
                    Selam çok iyiyim, sen?
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
