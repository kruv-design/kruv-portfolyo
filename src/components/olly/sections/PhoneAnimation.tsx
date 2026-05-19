"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";

export function PhoneAnimation() {
  const rootRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onMq = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || fired) return;
        fired = true;
        if (reduceMotion) {
          setPhase(3);
          return;
        }
        [1, 2, 3].forEach((n) => {
          window.setTimeout(() => setPhase(n), n * 420);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduceMotion]);

  return (
    <section
      ref={rootRef}
      id="olly-what"
      className={cn(sectionShellClass(), "relative overflow-hidden bg-olly-canvas")}
      aria-labelledby="olly-what-heading"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(120vw,56rem)] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="relative aspect-square w-full">
          <Image
            src={ollyFigma.ellipseSection}
            alt=""
            fill
            className="object-contain"
            sizes="896px"
          />
        </div>
      </div>

      <Container className="relative z-10 flex flex-col items-center gap-olly-12 lg:flex-row lg:items-start lg:gap-olly-16">
        <div className="w-full max-w-xl text-center lg:max-w-md lg:text-left">
          <Typography variant="eyebrow" className="text-olly-accent">
            Olly Nedir?
          </Typography>
          <Typography
            id="olly-what-heading"
            variant="h2"
            className="mt-olly-3 text-olly-ink"
          >
            İnsan bağlantısını yeniden tanımlıyoruz
          </Typography>
          <Typography variant="b3" className="mt-olly-4 text-olly-muted">
            Olly, profil kaydırma yerine yapay zekâyla derin bir sohbetle başlayan;
            romantik ilişkiden spor partnerine kadar her türlü bağlantıyı akıllıca
            kuran bir platform.
          </Typography>
        </div>

        <div className="relative w-full max-w-olly-phone lg:max-w-none lg:flex-1">
            <div className="relative mx-auto w-full max-w-olly-phone lg:max-w-olly-mock">
            <div className="relative olly-aspect-iphone-do w-full">
              <Image
                src={ollyFigma.iphoneMockup}
                alt="Olly uygulama önizlemesi"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 28rem"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mx-auto mt-olly-8 flex w-full max-w-olly-mock flex-col gap-olly-4">
            <div
              className={cn(
                "self-end rounded-olly-md border border-olly-line bg-olly-chat-user px-olly-4 py-olly-3 shadow-olly-sm transition duration-olly ease-out",
                phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <Typography variant="b1" className="text-olly-chat-user-ink">
                Bana nasıl birisi uygun sence?
              </Typography>
            </div>
            <div
              className={cn(
                "rounded-olly-md border border-olly-line bg-olly-brand-mid px-olly-4 py-olly-3 shadow-olly-sm transition duration-olly ease-out",
                phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <Typography variant="b1" className="text-olly-ink">
                İşte karşında mert! ikinizin de tasarıma ve yapay zekaya olan tutkusu
                %87 oranında eşleşiyor.
              </Typography>
            </div>
            <div
              className={cn(
                "rounded-olly-md border border-olly-line bg-olly-surface p-olly-4 shadow-olly-md transition duration-olly ease-out",
                phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <Typography variant="b4" className="text-olly-brand-mid">
                Olivia&apos;nın Önerisi
              </Typography>
              <div className="mt-olly-4 rounded-olly-md bg-olly-surface-2 p-olly-4">
                <div className="flex gap-olly-4">
                  <div className="relative h-olly-16 w-olly-16 shrink-0 overflow-hidden rounded-olly-full border border-olly-line">
                    <Image
                      src={ollyFigma.profileFrameA}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Typography variant="h4" className="text-olly-ink">
                      Mert Sağdu
                    </Typography>
                    <div className="mt-olly-1 flex flex-wrap items-center gap-olly-2">
                      <Typography variant="b3" className="text-olly-dim">
                        29
                      </Typography>
                      <span className="h-olly-1 w-olly-1 rounded-olly-full bg-olly-dim" aria-hidden />
                      <Typography variant="b3" className="text-olly-dim">
                        İstanbul
                      </Typography>
                      <span className="h-olly-1 w-olly-1 rounded-olly-full bg-olly-dim" aria-hidden />
                      <Typography variant="b3" className="text-olly-dim">
                        Ürün Tasarımcısı
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="mt-olly-3 flex items-center gap-olly-2">
                  <div className="relative h-olly-4 w-olly-4 shrink-0">
                    <Image src={ollyFigma.star} alt="" fill className="object-contain" sizes="16px" />
                  </div>
                  <Typography variant="b2" className="text-olly-bright">
                    Aynı frekanstasınız, sanat &amp; tech
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
