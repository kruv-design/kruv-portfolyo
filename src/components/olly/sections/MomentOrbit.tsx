import Image from "next/image";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";

const pills = [
  { label: "Sosyal Bağlar", rotate: "rotate-[7deg]" },
  { label: "Aktivite Partnerliği", rotate: "-rotate-[6deg]" },
  { label: "Kişisel Gelişim", rotate: "rotate-[1deg]" },
] as const;

export function MomentOrbit() {
  return (
    <section
      className={cn(sectionShellClass(), "relative overflow-hidden bg-olly-canvas")}
      aria-labelledby="olly-moment-heading"
    >
      <Container className="flex flex-col items-center">
        <div className="relative flex w-full max-w-olly-mock items-center justify-center py-olly-12 md:max-w-none md:py-olly-20">
          <div className="relative aspect-square w-full max-w-olly-phone md:max-w-olly-orbit">
            <Image
              src={ollyFigma.momentRing}
              alt=""
              fill
              className="object-contain opacity-90"
              sizes="(max-width: 768px) 80vw, 36rem"
            />
            <div className="absolute inset-[12%] flex items-center justify-center">
              <Image
                src={ollyFigma.momentCore}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 70vw, 30rem"
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-olly-4 top-1/2 flex -translate-y-1/2 justify-center md:inset-x-olly-10">
            <div className="flex w-full max-w-md flex-col items-center gap-olly-4">
              <div className="flex flex-col items-center gap-olly-3">
                {pills.map((p) => (
                  <div
                    key={p.label}
                    className={cn(
                      "rounded-olly-md border border-olly-gray-600 bg-olly-lime-cta px-olly-7 py-olly-3 shadow-olly-sm",
                      p.rotate,
                    )}
                  >
                    <Typography variant="b1" className="text-olly-ink">
                      {p.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-olly-16 max-w-3xl text-center md:-mt-olly-24">
          <Typography id="olly-moment-heading" variant="h2" className="text-olly-ink">
            Hayatın her anı için yanına birini bulduk.
          </Typography>
          <Typography variant="b3" className="mt-olly-6 text-olly-muted">
            Olly sadece romantik bir eşleşme değil; sabah koşundan kütüphanedeki çalışma
            saatlerine, tenis maçından hafta sonu konserine kadar hayatının her anına uygun
            &quot;o&quot; frekansı bulmanı sağlar.
          </Typography>
        </div>
      </Container>
    </section>
  );
}
