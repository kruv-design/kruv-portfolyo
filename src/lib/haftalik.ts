import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { BlogPost, BlogSection } from "@/types";

export type HaftalikKaynak = {
  ad: string;
  url: string;
  tur: string;
  ne: string;
};

export type HaftalikIssue = {
  sayi: string;
  tarih: string;
  mercek: string;
  beatler: string[];
  yayinda: boolean;
  /** Kullanıcı bu sayıyı siteye koymayı açıkça istediğinde "kullanici". */
  onay?: string;
  gorselHedef: Record<string, string>;
  kaynaklar: HaftalikKaynak[];
  bakilamayan: string[];
  post: {
    slug: string;
    baslik: string;
    title: string;
    aciklama: string;
    description: string;
    kapak: string;
    yayinda: boolean;
    bolumler: BlogSection[];
  };
};

const SAYI = /^\d{4}-\d{2}-\d{2}$/;

export function haftalikIssuePath(sayi: string): string | null {
  if (!SAYI.test(sayi)) return null;
  return path.join(process.cwd(), "content/haftalik/issues", `${sayi}.json`);
}

export function readHaftalikIssue(sayi: string): HaftalikIssue | null {
  const file = haftalikIssuePath(sayi);
  if (!file || !existsSync(file)) return null;
  const raw = JSON.parse(readFileSync(file, "utf8")) as HaftalikIssue;
  if (raw.sayi !== sayi) return null;
  return raw;
}

/** Kullanıcının siteye koyduğu sayılar. Supabase satırı yoksa blog bunları da okur. */
export function listPublishedHaftalikPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), "content/haftalik/issues");
  if (!existsSync(dir)) return [];
  const posts: BlogPost[] = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    const issue = readHaftalikIssue(name.replace(/\.json$/, ""));
    if (!issue || issue.onay !== "kullanici" || !issue.post.yayinda) continue;
    posts.push(issueToPreviewPost(issue));
  }
  return posts;
}

/** Önizleme her zaman okunur. Canlı blog yalnızca onaylı ve yayındaki sayıyı alır. */
export function issueToPreviewPost(issue: HaftalikIssue): BlogPost {
  return {
    id: `haftalik-${issue.sayi}`,
    slug: issue.post.slug,
    baslik: issue.post.baslik,
    title: issue.post.title,
    aciklama: issue.post.aciklama,
    description: issue.post.description,
    kapak: issue.post.kapak,
    bolumler: issue.post.bolumler,
    yayinda: true,
    created_at: `${issue.tarih}T09:00:00+03:00`,
    updated_at: `${issue.tarih}T09:00:00+03:00`,
  };
}
