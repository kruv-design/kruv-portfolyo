import Image from "next/image";
import { Container } from "@/components/olly/ui/Container";
import { Button } from "@/components/olly/ui/Button";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";

const plans = [
  {
    name: "Başlangıç",
    price: "₺39",
    period: "/ay",
    creditLine: "2.000 Algo kredisi · Her ay yenilenir",
    features: [
      "Temel eşleştirme ve günlük öneriler",
      "Gizlilik modunda başla, hazır olunca görün",
      "E-posta ile destek",
    ],
    ctaVariant: "secondary" as const,
    highlight: false,
  },
  {
    name: "PRO",
    price: "₺149",
    period: "/ay",
    creditLine: "Öncelikli sıra ve gelişmiş AI koç özeti",
    features: [
      "Olivia ve Oliver+ ile derinlemesine öneriler",
      "Haftalık bağlantı özeti ve içgörüler",
      "Öncelikli destek hattı",
    ],
    ctaVariant: "primary" as const,
    highlight: true,
  },
  {
    name: "Standart",
    price: "₺269",
    period: "/ay",
    creditLine: "8.000 Algo kredisi · Yoğun kullanım için",
    features: [
      "Sınırsız öneri ve anlık eşleştirme",
      "Özel etkinlik ve topluluk erişimi",
      "Öncelikli destek ve ürün erken erişimi",
    ],
    ctaVariant: "secondary" as const,
    highlight: false,
  },
] as const;

export function Pricing() {
  return (
    <section
      className={cn(sectionShellClass(), "bg-olly-canvas")}
      aria-labelledby="olly-pricing-heading"
    >
      <Container>
        <Typography variant="eyebrow" className="text-olly-accent">
          Fiyatlandırma
        </Typography>
        <Typography id="olly-pricing-heading" variant="h2" className="mt-olly-2 text-olly-ink">
          Enerji tabanlı esnek model
        </Typography>
        <Typography variant="b1" className="mt-olly-4 max-w-3xl text-olly-muted">
          İhtiyacına göre başla, ihtiyaç büyüdükçe yükselt. Tüm planlarda aynı güven ve veri
          kontrolü geçerlidir.
        </Typography>

        <div className="mt-olly-12 grid gap-olly-4 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-olly-xl border px-olly-6 py-olly-8 shadow-olly-sm transition duration-olly ease-out hover:-translate-y-1 hover:shadow-olly-lg",
                p.highlight
                  ? "border-olly-primary bg-olly-surface-2 ring-1 ring-olly-primary/40"
                  : "border-olly-line bg-olly-surface",
              )}
            >
              {p.highlight ? (
                <>
                  <div className="pointer-events-none absolute -right-olly-6 -top-olly-6 h-olly-32 w-olly-32 md:h-olly-40 md:w-olly-40">
                    <Image
                      src={ollyFigma.popularBurst}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="160px"
                    />
                  </div>
                  <div className="pointer-events-none absolute right-olly-10 top-olly-10 h-olly-3 w-olly-3">
                    <Image src={ollyFigma.popularDot} alt="" fill className="object-contain" sizes="12px" />
                  </div>
                  <div className="pointer-events-none absolute right-olly-16 top-olly-14 h-olly-4 w-olly-4">
                    <Image src={ollyFigma.popularPin} alt="" fill className="object-contain" sizes="16px" />
                  </div>
                  <Typography
                    variant="b4"
                    className="relative z-10 mb-olly-4 inline-block self-start rounded-olly-full bg-olly-lime-cta px-olly-4 py-olly-1 text-olly-ink"
                  >
                    Popular
                  </Typography>
                </>
              ) : null}

              <Typography variant="h3" className="text-olly-ink">
                {p.name}
              </Typography>
              <div className="mt-olly-3 flex flex-wrap items-baseline gap-olly-2">
                <Typography variant="h2" className="text-olly-primary">
                  {p.price}
                </Typography>
                <Typography variant="b2" className="text-olly-muted">
                  {p.period}
                </Typography>
              </div>
              <Typography variant="b3" className="mt-olly-2 text-olly-bright">
                {p.creditLine}
              </Typography>

              <ul className="mt-olly-6 flex flex-1 flex-col gap-olly-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-olly-3">
                    <span className="mt-olly-2 h-olly-2 w-olly-2 shrink-0 rounded-olly-full bg-olly-accent" aria-hidden />
                    <Typography variant="b3" className="text-olly-muted">
                      {f}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Button variant={p.ctaVariant} className="mt-olly-8 w-full" type="button">
                Planı seç
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
