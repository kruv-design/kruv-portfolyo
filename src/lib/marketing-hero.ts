import { readFile } from "node:fs/promises";
import path from "node:path";

const HERO_PARTIAL_PATH = path.join(process.cwd(), "public", "partials", "hero-v2.html");
export const HERO_V2_PARTIAL_MARKER = "<!-- @partial:hero-v2 -->";

export type HeroV2Options = {
  ctaHref?: string;
  /** Doluysa masaüstü hero tıklaması bu URL’ye gider (ör. `/works`). */
  scrollHref?: string;
  /** Mor imleç balonu metni. */
  cursorLabel?: string;
};

/** Ortak hero-v2 HTML — `public/partials/hero-v2.html` tek kaynak. */
export async function loadHeroV2Html(options: HeroV2Options = {}): Promise<string> {
  const { ctaHref = "/works", cursorLabel = "See projects" } = options;
  /** Boş bırakılırsa sayfa içi `#works`; varsayılan CTA ile aynı (`/works`). */
  const scrollHref =
    options.scrollHref !== undefined ? options.scrollHref : ctaHref;
  const raw = await readFile(HERO_PARTIAL_PATH, "utf8");
  return raw
    .replace(/\{\{CTA_HREF\}\}/g, ctaHref)
    .replace(/\{\{SCROLL_HREF\}\}/g, scrollHref)
    .replace(/\{\{CURSOR_LABEL\}\}/g, cursorLabel);
}

/** Statik `kruv.html` gövdesine partial enjekte eder. */
export async function injectHeroV2IntoPageHtml(
  pageHtml: string,
  options: HeroV2Options = {},
): Promise<string> {
  const hero = await loadHeroV2Html(options);
  if (pageHtml.includes(HERO_V2_PARTIAL_MARKER)) {
    return pageHtml.replace(HERO_V2_PARTIAL_MARKER, hero);
  }
  return pageHtml;
}
