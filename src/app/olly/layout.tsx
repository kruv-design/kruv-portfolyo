import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import { OllyHeader } from "@/components/olly/OllyHeader";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-olly-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

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
        manrope.variable,
      )}
    >
      <OllyHeader />
      {children}
    </div>
  );
}
