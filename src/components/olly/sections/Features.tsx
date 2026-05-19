import Image from "next/image";
import { Container } from "@/components/olly/ui/Container";
import { Typography } from "@/components/olly/ui/Typography";
import { ollyFigma } from "@/lib/olly/figma-assets";
import { sectionShellClass } from "@/components/olly/SectionSkeleton";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: ollyFigma.featPuzzle,
    title: "Çok Amaçlı Eşleştirme",
    body: "Romantik ilişkiler, arkadaşlıklar, spor partnerleri, çalışma ortakları ve yerel aktiviteler hepsi Olly’de.",
  },
  {
    icon: ollyFigma.featLock,
    title: "Gizlilik Odaklı Tasarım",
    body: "Kullanıcılar başlangıçta tamamen anonimdir. Ancak başarılı eşleşmeden sonra görünür hale gelirler.",
  },
  {
    icon: ollyFigma.featFace,
    title: "Dinamik Profil Analizi",
    body: "AI, kişilik parametreleri ve ilgi alanı matrisiyle sürekli öğrenen bir eşleştirme profili oluşturur.",
  },
  {
    icon: ollyFigma.featWand,
    title: "Anlık Eşleştirme",
    body: "\"Bu akşam tenis oynamak istiyorum\" dersin, Olly bölgendeki uygun kişileri anında önerir.",
  },
  {
    icon: ollyFigma.featMsg,
    title: "AI Konuşma Motoru",
    body: "Doğal sohbetler, kullanıcı analizi ve bağlam işleme — klasik profil doldurmanın yerini sohbet alıyor.",
  },
  {
    icon: ollyFigma.featGlobe,
    title: "Topluluk Keşfi",
    body: "Benzer ilgi alanlarına sahip yerel topluluklara katıl. Büyük şehir kalabalığında sana uyanları bul.",
  },
];

export function Features() {
  return (
    <section
      className={cn(sectionShellClass(), "bg-olly-canvas")}
      aria-labelledby="olly-features-heading"
    >
      <Container>
        <Typography variant="eyebrow" className="text-olly-accent">
          Özellikler
        </Typography>
        <Typography id="olly-features-heading" variant="h2" className="mt-olly-2 text-olly-ink">
          Olly&apos;yi farklı kılan nedir?
        </Typography>

        <div className="mt-olly-12 grid gap-olly-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="olly-surface-feature rounded-olly-md p-olly-8 shadow-olly-sm transition duration-olly ease-out hover:-translate-y-1 hover:shadow-olly-md"
            >
              <div className="relative h-olly-10 w-olly-10 shrink-0">
                <Image src={item.icon} alt="" fill className="object-contain" sizes="40px" />
              </div>
              <Typography variant="h3" className="mt-olly-4 text-olly-ink">
                {item.title}
              </Typography>
              <Typography variant="b3" className="mt-olly-3 text-olly-muted">
                {item.body}
              </Typography>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
