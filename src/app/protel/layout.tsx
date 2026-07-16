import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protel",
  robots: { index: false, follow: false },
};

export default function ProtelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="protel-pitch-shell min-h-screen">
      {children}
    </div>
  );
}
