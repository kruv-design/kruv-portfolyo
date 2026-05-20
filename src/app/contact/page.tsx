import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { ContactForm } from "@/components/public/ContactForm";
import { SiteFooter } from "@/components/public/SiteFooter";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Proje teklifi ve iş birliği talepleri için iletişim formu.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg)" }}>
      <MarketingSiteNav settings={settings} />
      <main className="contact-page-main">
        <ContactForm />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
