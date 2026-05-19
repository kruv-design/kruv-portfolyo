import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/olly/ui/Container";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#olly-hero-heading", label: "Anasayfa" },
  { href: "#olly-coaches-heading", label: "AI Koç" },
  { href: "#olly-features-heading", label: "Özellikler" },
];

const linkClass =
  "font-olly-sans text-olly-bright transition duration-olly ease-out hover:text-olly-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olly-primary focus-visible:ring-offset-2 focus-visible:ring-offset-olly-canvas";

export function OllyHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-olly-line/80 bg-olly-canvas/90 backdrop-blur-md">
      <Container className="flex h-olly-20 items-center justify-between py-olly-4">
        <Link href="#olly-hero-heading" className="relative block h-olly-12 w-olly-20 shrink-0">
          <Image
            src={ollyFigma.logoHeader}
            alt="Olly"
            fill
            className="object-contain object-left"
            sizes="80px"
            priority
          />
        </Link>
        <nav aria-label="Üst gezinme" className="flex items-center gap-olly-10">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={cn(linkClass, "olly-type-b1")}>
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
