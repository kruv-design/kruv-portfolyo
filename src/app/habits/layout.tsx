import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Zincir — habit takibi",
  description: "Günlük alışkanlık ve streak takibi.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function HabitsLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-bg text-ink antialiased">{children}</div>;
}
