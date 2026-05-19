import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";

const nav = [
  { href: "#olly-hero-heading", label: "Anasayfa" },
  { href: "#olly-coaches-heading", label: "AI Koç" },
  { href: "#olly-moment-heading", label: "Anlar" },
  { href: "#olly-features-heading", label: "Özellikler" },
  { href: "#olly-pricing-heading", label: "Fiyatlar" },
  { href: "#olly-final-cta-heading", label: "İndir" },
];

const social = [
  { href: "https://www.instagram.com/", label: "Instagram", src: ollyFigma.socialA },
  { href: "https://www.linkedin.com/", label: "LinkedIn", src: ollyFigma.socialB },
  { href: "https://github.com/", label: "GitHub", src: ollyFigma.socialC },
] as const;

const linkClass =
  "inline-block rounded-olly-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-olly-line/50 bg-olly-canvas py-olly-16">
      <Container className="flex flex-col gap-olly-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="#olly-hero-heading" className="relative block h-olly-12 w-olly-28 shrink-0">
            <Image
              src={ollyFigma.logoFooter}
              alt="Olly"
              fill
              className="object-contain object-left"
              sizes="112px"
            />
          </Link>
          <Typography variant="b3" className="mt-olly-4 max-w-xs text-olly-muted">
            Anlamlı bağlantılar için yapay zekâ destekli sosyal eşleştirme.
          </Typography>
        </div>

        <nav aria-label="Alt gezinme">
          <ul className="flex flex-col gap-olly-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  <Typography
                    variant="b2"
                    className="text-olly-muted underline-offset-4 transition duration-olly ease-out hover:text-olly-ink"
                  >
                    {item.label}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-olly-4">
          {social.map(({ href, label, src }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="relative h-olly-12 w-olly-12 overflow-hidden rounded-olly-md border border-olly-line transition duration-olly ease-out hover:border-olly-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas"
            >
              <Image src={src} alt="" fill className="object-contain p-olly-2" sizes="48px" />
            </a>
          ))}
        </div>
      </Container>

      <Container className="mt-olly-12 border-t border-olly-line/40 pt-olly-8">
        <Typography variant="b3" className="text-olly-dim">
          olly© {year} Tüm hakları saklıdır.
        </Typography>
      </Container>
    </footer>
  );
}
