import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";
import { getMessages, type Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";

const KRUV_HTML_PATH = path.join(process.cwd(), "public", "kruv.html");

/** `kruv.html` içinde hero altı gövde başlangıcı (ticker React’te — ideal clients). */
const HOME_BODY_START = '<section class="ideal-section"';
const HOME_SCENE_SECTION = '<section class="scene-section">';
const HOME_PROJECTS_BELIEF = '<section class="projects-belief"';
const HOME_FOOTER_START = '<footer class="site-footer"';

function sliceBetween(html: string, start: string, end: string): string {
  const from = html.indexOf(start);
  if (from === -1) {
    throw new Error(`marketing-home: start marker not found: ${start.slice(0, 40)}`);
  }
  const to = html.indexOf(end, from + start.length);
  if (to === -1) {
    throw new Error(`marketing-home: end marker not found after body start`);
  }
  return html.slice(from, to).trim();
}

function sliceFooter(html: string): string {
  const from = html.indexOf(HOME_FOOTER_START);
  if (from === -1) throw new Error("marketing-home: footer not found");
  const close = html.indexOf("</footer>", from);
  if (close === -1) throw new Error("marketing-home: footer close not found");
  return html.slice(from, close + "</footer>".length).trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Göreli asset, ideal clients metinleri ve dahili linkleri locale’e göre yazar. */
export function rewriteMarketingHomeHtml(
  html: string,
  locale: Locale,
  messages: Messages,
): string {
  let out = html;

  const { tag, title } = messages.home.ideal;
  out = out.replace(
    /(<span class="ideal-tag">)[^<]*(<\/span>)/,
    `$1${escapeHtml(tag)}$2`,
  );
  out = out.replace(
    /(<h2 class="ideal-title" id="ideal-heading">)[^<]*(<\/h2>)/,
    `$1${escapeHtml(title)}$2`,
  );

  out = out.replace(
    /<section[^>]*class="ideal-share-marquee-band"[\s\S]*?<\/section>\s*/g,
    "",
  );

  out = out.replace(/\b(src|href)="assets\//g, '$1="/assets/');
  out = out.replace(/'link\//g, "'/link/");

  out = out.replace(/href="\/contact"/g, `href="${withLocale("/contact", locale)}"`);
  out = out.replace(/href="\/works([^"]*)"/g, (_, rest: string) => {
    const suffix = rest || "";
    return `href="${withLocale("/works", locale)}${suffix}"`;
  });
  out = out.replace(/href="\/projects\//g, `href="${withLocale("/projects/", locale)}`);
  out = out.replace(/href="\/#hero"/g, `href="${withLocale("/", locale)}#hero"`);
  out = out.replace(/href="\/"/g, `href="${withLocale("/", locale)}"`);

  const letsTalk = messages.home.letsTalk;
  const letsTalkHeading = `<span class="lets-talk-heading-line1">${escapeHtml(letsTalk.line1)}</span><span class="lets-talk-heading-line2"><strong>${escapeHtml(letsTalk.line2)}</strong></span>`;
  out = out.replace(
    /<span class="lets-talk-heading-line1">[\s\S]*?<\/span><span class="lets-talk-heading-line2">[\s\S]*?<\/span>/g,
    letsTalkHeading,
  );
  out = out.replace(
    /<section class="lets-talk" lang="[^"]*"/g,
    `<section class="lets-talk" lang="${locale}"`,
  );
  out = out.replace(
    /(<a class="cta-ghost lets-talk-cta"[^>]*>)[^<]*(<\/a>)/g,
    `$1${escapeHtml(letsTalk.cta)}$2`,
  );

  out = rewriteFooterInHtml(out, locale, messages);

  return out;
}

function footerSocialAria(messages: Messages, platform: string): string {
  return messages.footer.socialOpen.replace("{platform}", platform);
}

function buildFooterServiceLinksHtml(locale: Locale, messages: Messages): string {
  const items = messages.footer.serviceLinks
    .map(
      ({ label, filter }) =>
        `          <li><a class="site-footer-service-link" href="${withLocale("/works", locale)}?filter=${filter}">${escapeHtml(label)}</a></li>`,
    )
    .join("\n");
  return `        <ul class="site-footer-list site-footer-services">\n${items}\n        </ul>`;
}

function buildFooterSitemapHtml(locale: Locale, messages: Messages): string {
  const f = messages.footer;
  return `        <ul class="site-footer-list site-footer-links">
          <li><a href="${withLocale("/", locale)}#hero">${escapeHtml(f.home)}</a></li>
          <li><a href="${withLocale("/works", locale)}">${escapeHtml(f.projects)}</a></li>
          <li><a href="${withLocale("/contact", locale)}">${escapeHtml(f.contact)}</a></li>
        </ul>`;
}

function rewriteFooterInHtml(
  html: string,
  locale: Locale,
  messages: Messages,
): string {
  if (!html.includes('class="site-footer"')) return html;

  let out = html;
  const f = messages.footer;

  out = out.replace(
    /<footer class="site-footer" id="contact" lang="[^"]*">/,
    `<footer class="site-footer" id="contact" lang="${locale}">`,
  );

  out = out.replace(
    /(<h3 class="site-footer-heading">)[^<]*(<\/h3>\s*<ul class="site-footer-list site-footer-services">)/,
    `$1${escapeHtml(f.services)}$2`,
  );
  out = out.replace(
    /<ul class="site-footer-list site-footer-services">[\s\S]*?<\/ul>/,
    buildFooterServiceLinksHtml(locale, messages),
  );

  out = out.replace(
    /<nav class="site-footer-col" aria-label="[^"]*">/,
    `<nav class="site-footer-col" aria-label="${escapeHtml(f.sitemapAria)}">`,
  );
  out = out.replace(
    /(<nav class="site-footer-col" aria-label="[^"]*">\s*<h3 class="site-footer-heading">)[^<]*(<\/h3>)/,
    `$1${escapeHtml(f.sitemap)}$2`,
  );
  out = out.replace(
    /<ul class="site-footer-list site-footer-links">[\s\S]*?<\/ul>/,
    buildFooterSitemapHtml(locale, messages),
  );

  out = out.replace(
    /(<div class="site-footer-col site-footer-col--follow">\s*<h3 class="site-footer-heading">)[^<]*(<\/h3>)/,
    `$1${escapeHtml(f.follow)}$2`,
  );

  out = out.replace(
    /<p class="site-footer-follow-sr" lang="[^"]*">[\s\S]*?<\/p>/,
    `<p class="site-footer-follow-sr" lang="${locale}">${escapeHtml(f.followSr)}</p>`,
  );

  const socialPlatforms = [
    "LinkedIn",
    "Behance",
    "Instagram",
    "Dribbble",
    "Pinterest",
    "YouTube",
  ] as const;
  for (const platform of socialPlatforms) {
    out = out.replace(
      new RegExp(
        `aria-label="${platform} — [^"]*"`,
        "g",
      ),
      `aria-label="${escapeHtml(footerSocialAria(messages, platform))}"`,
    );
  }

  out = out.replace(
    /(<ul class="site-footer-social site-footer-social--grid"[^>]*)(>)/,
    `$1 aria-label="${escapeHtml(f.socialAria)}"$2`,
  );

  return out;
}

function patchHomeScript(content: string, locale: Locale): string {
  const projectsBase = withLocale("/projects/", locale);
  return content.replace(
    /function projectURL\(slug\) \{\s*return '\/projects\/' \+ encodeURIComponent\(slug \|\| ''\);\s*\}/,
    `function projectURL(slug) { return '${projectsBase}' + encodeURIComponent(slug || ''); }`,
  );
}

function shouldIncludeHomeScript(content: string): boolean {
  if (
    content.includes("site-nav") ||
    content.includes("nav-menu-toggle") ||
    content.includes("lanShareHint") ||
    content.includes("heroCylinder") ||
    content.includes("fan-wrap") ||
    content.includes("lang-switch-trigger") ||
    content.includes("kruv-theme") ||
    content.includes("Global wheel dampening") ||
    content.includes("bindCMS")
  ) {
    return false;
  }

  return (
    content.includes("featuredWorkCursorHint") ||
    content.includes("focusList") ||
    content.includes("getElementById('scene')") ||
    content.includes("testimonialsMarquee") ||
    content.includes("scroll-theme-bridge") ||
    content.includes("hydrateFooterSocial") ||
    content.includes("location.hash !== '#hero'")
  );
}

function extractHomeScripts(html: string, locale: Locale): string[] {
  const footerEnd = html.indexOf("</footer>");
  if (footerEnd === -1) return [];

  // `initIdealShareMarquee` rotator scriptlerinden sonra — tüm inline scriptleri al.
  const bodyEnd = html.lastIndexOf("</body>");
  const chunkEnd = bodyEnd > footerEnd ? bodyEnd : html.length;
  const chunk = html.slice(footerEnd, chunkEnd);
  const scripts: string[] = [];
  const re = /<script>\s*([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(chunk))) {
    const content = match[1]?.trim() ?? "";
    if (!content || !shouldIncludeHomeScript(content)) continue;
    scripts.push(patchHomeScript(content, locale));
  }
  return scripts;
}

function splitHomeBody(html: string): { beforeScene: string; afterScene: string } {
  const sceneIdx = html.indexOf(HOME_SCENE_SECTION);
  const beliefIdx = html.indexOf(HOME_PROJECTS_BELIEF);
  if (sceneIdx === -1 || beliefIdx === -1 || beliefIdx <= sceneIdx) {
    throw new Error("marketing-home: scene-section or projects-belief marker not found");
  }
  return {
    beforeScene: html.slice(0, sceneIdx).trim(),
    afterScene: html.slice(beliefIdx).trim(),
  };
}

export type MarketingHomeContent = {
  bodyBeforeScene: string;
  bodyAfterScene: string;
  footerHtml: string;
  scripts: string[];
};

let cachedRaw: string | null = null;

async function readKruvHtml(): Promise<string> {
  if (cachedRaw) return cachedRaw;
  cachedRaw = await readFile(KRUV_HTML_PATH, "utf8");
  return cachedRaw;
}

/** Hero altı marketing gövdesi + footer + etkileşim scriptleri — tek kaynak `public/kruv.html`. */
export async function loadMarketingHomeContent(
  locale: Locale,
): Promise<MarketingHomeContent> {
  const html = await readKruvHtml();
  const messages = getMessages(locale);
  const bodyRaw = sliceBetween(html, HOME_BODY_START, HOME_FOOTER_START);
  const { beforeScene, afterScene } = splitHomeBody(bodyRaw);
  const footerRaw = sliceFooter(html);

  return {
    bodyBeforeScene: rewriteMarketingHomeHtml(beforeScene, locale, messages),
    bodyAfterScene: rewriteMarketingHomeHtml(afterScene, locale, messages),
    footerHtml: rewriteMarketingHomeHtml(footerRaw, locale, messages),
    scripts: extractHomeScripts(html, locale),
  };
}
