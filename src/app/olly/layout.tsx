import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { switzerOlly } from "@/lib/fonts/switzer";
import { OllyHeader } from "@/components/olly/OllyHeader";

export const metadata: Metadata = {
  title: "Olly",
  description:
    "Doğru insanlarla bağlantı kur — yapay zekâ destekli sosyal eşleştirme.",
  openGraph: {
    title: "Olly",
    description:
      "Doğru insanlarla bağlantı kur — yapay zekâ destekli sosyal eşleştirme.",
    locale: "tr_TR",
  },
};

export default function OllyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "olly-landing min-h-screen bg-olly-canvas font-olly-sans text-olly-ink antialiased",
        switzerOlly.variable,
      )}
    >
      <OllyHeader />
      {children}
    </div>
  );
}
