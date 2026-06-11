import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import {
  projectIntroForLocale,
  projectTitleForLocale,
} from "@/lib/project-locale";
import type { Project, SiteSettings } from "@/types";

export type JsonLdNode = Record<string, unknown>;

const DEFAULT_CONTACT_EMAIL = "hello@kruv.com";

const ORG_LOGO_PATH = "/assets/logo-white.svg";

const ISTANBUL_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Istanbul",
  addressRegion: "Istanbul",
  addressCountry: "TR",
} as const;

function absoluteUrl(path: string): string {
  const base = env.SITE_URL.replace(/\/+$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function compact<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function contactEmail(): string {
  return process.env.CONTACT_NOTIFY_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
}

export function collectSameAs(settings: SiteSettings): string[] {
  return [
    settings.instagramUrl,
    settings.linkedinUrl,
    settings.behanceUrl,
    settings.dribbbleUrl,
    settings.youtubeUrl,
    settings.pinterestUrl,
    settings.xUrl,
    settings.githubUrl,
  ].filter((url) => typeof url === "string" && url.trim().length > 0);
}

export function buildOrganizationSchema({
  locale,
  settings,
  description,
}: {
  locale: Locale;
  settings: SiteSettings;
  description: string;
}): JsonLdNode {
  return compact({
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: "Kruv",
    alternateName: settings.siteAdi,
    url: absoluteUrl(withLocale("/", locale)),
    logo: absoluteUrl(ORG_LOGO_PATH),
    description,
    inLanguage: locale,
    address: ISTANBUL_ADDRESS,
    email: contactEmail(),
    sameAs: collectSameAs(settings),
  });
}

export function buildLocalBusinessSchema({
  locale,
  description,
  image,
}: {
  locale: Locale;
  description: string;
  image?: string;
}): JsonLdNode {
  return compact({
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl("/")}#localbusiness`,
    name: "Kruv",
    image: image || absoluteUrl(ORG_LOGO_PATH),
    description,
    inLanguage: locale,
    url: absoluteUrl(withLocale("/", locale)),
    address: ISTANBUL_ADDRESS,
    email: contactEmail(),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.9879,
      longitude: 29.0197,
    },
  });
}

export function buildWebSiteSchema({
  locale,
  description,
}: {
  locale: Locale;
  description: string;
}): JsonLdNode {
  return compact({
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: "Kruv",
    url: absoluteUrl(withLocale("/", locale)),
    description,
    inLanguage: locale,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(withLocale("/works", locale))}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): JsonLdNode {
  return compact({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

export function buildCreativeWorkSchema({
  project,
  locale,
  description,
}: {
  project: Project;
  locale: Locale;
  description: string;
}): JsonLdNode {
  const title = projectTitleForLocale(project, locale);
  const intro = projectIntroForLocale(project, locale);
  const published = project.created_at?.slice(0, 10);

  return compact({
    "@type": "CreativeWork",
    name: title,
    description: intro || description,
    image: project.kapak || undefined,
    author: {
      "@type": "Organization",
      name: "Kruv",
      url: absoluteUrl(withLocale("/", locale)),
    },
    datePublished: published || undefined,
    keywords: project.etiketler?.length ? project.etiketler.join(", ") : undefined,
    url: absoluteUrl(withLocale(`/projects/${project.slug}`, locale)),
    inLanguage: locale,
  });
}

export function buildContactPointSchema({
  locale,
}: {
  locale: Locale;
}): JsonLdNode {
  return compact({
    "@type": "ContactPage",
    "@id": absoluteUrl(withLocale("/contact", locale)),
    url: absoluteUrl(withLocale("/contact", locale)),
    inLanguage: locale,
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: contactEmail(),
      areaServed: ["TR", "International"],
      availableLanguage: ["Turkish", "English"],
    },
  });
}

export function toJsonLdGraph(nodes: JsonLdNode[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function toJsonLdDocument(node: JsonLdNode): JsonLdNode {
  return {
    "@context": "https://schema.org",
    ...node,
  };
}
