import Image from "next/image";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";

const storeBtn =
  "group inline-flex min-h-olly-14 flex-1 items-center justify-center gap-olly-3 rounded-olly-md bg-olly-lime-cta px-olly-6 py-olly-4 font-olly-sans text-olly-ink shadow-olly-sm transition duration-olly ease-out hover:bg-olly-lime-cta-hover hover:shadow-olly-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-surface";

export function FinalCTA() {
  return (
    <section
      className={cn(sectionShellClass(), "bg-olly-surface")}
      aria-labelledby="olly-final-cta-heading"
    >
      <Container className="grid items-center gap-olly-12 lg:grid-cols-2 lg:gap-olly-16">
        <div>
          <Typography id="olly-final-cta-heading" variant="h2" className="text-olly-ink">
            Hemen keşfetmeye başla
          </Typography>
          <Typography variant="b2" className="mt-olly-5 text-olly-muted">
            Olly mobil uygulaması çok yakında. Mağaza bağlantıları açıldığında ilk haberdar olan
            sen ol.
          </Typography>
          <div className="mt-olly-8 flex flex-col gap-olly-3 sm:flex-row">
            <a
              href="https://apps.apple.com/"
              className={storeBtn}
              aria-label="App Store üzerinden indir (yakında)"
            >
              <span className="relative h-olly-8 w-olly-8 shrink-0">
                <Image src={ollyFigma.appStoreGlyph} alt="" fill className="object-contain" sizes="32px" />
              </span>
              <Typography as="span" variant="b2" className="text-olly-ink">
                App Store
              </Typography>
            </a>
            <a
              href="https://play.google.com/store"
              className={storeBtn}
              aria-label="Google Play üzerinden indir (yakında)"
            >
              <span className="relative h-olly-8 w-olly-8 shrink-0">
                <Image src={ollyFigma.playIcon} alt="" fill className="object-contain" sizes="32px" />
              </span>
              <Typography as="span" variant="b2" className="text-olly-ink">
                Google Play
              </Typography>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-olly-mock">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-olly-xl border border-olly-line bg-olly-canvas shadow-olly-lg">
            <Image
              src={ollyFigma.iosGridMockup}
              alt=""
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 28rem"
              loading="lazy"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
