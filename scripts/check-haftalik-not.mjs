/**
 * Haftalık sayı dosyalarını SISTEM.md iskeletine göre kontrol eder.
 * Çalıştırma: npm run check:haftalik
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content/haftalik/issues");
const BEATLER = ["iz", "tat", "cizik", "kapi"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAYI = /^\d{4}-\d{2}-\d{2}$/;

function walk(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => walk(v, out));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => walk(v, out));
  }
  return out;
}

const errors = [];
const files = readdirSync(dir).filter((n) => n.endsWith(".json"));
if (files.length === 0) errors.push("issues/ boş");

for (const name of files) {
  const sayi = name.replace(/\.json$/, "");
  const issue = JSON.parse(readFileSync(path.join(dir, name), "utf8"));
  const where = (msg) => errors.push(`${name}: ${msg}`);

  if (!SAYI.test(sayi)) where("dosya adı YYYY-MM-DD.json olmalı");
  if (issue.sayi !== sayi || issue.tarih !== sayi) {
    where("sayi ve tarih dosya adıyla aynı olmalı");
  }
  if (!issue.mercek) where("mercek yok");
  if (JSON.stringify(issue.beatler) !== JSON.stringify(BEATLER)) {
    where("beatler iz, tat, cizik, kapi sırasında olmalı");
  }
  const published = issue.yayinda === true || issue.post?.yayinda === true;
  if (published && issue.onay !== "kullanici") {
    where("onay olmadan yayinda true olamaz");
  }
  if (issue.yayinda !== issue.post?.yayinda) {
    where("yayinda alanları aynı olmalı");
  }
  if (!Array.isArray(issue.kaynaklar) || issue.kaynaklar.length < 2) {
    where("en az iki kaynak gerekli");
  }
  if (!Array.isArray(issue.bakilamayan)) where("bakilamayan dizi olmalı");

  const post = issue.post ?? {};
  if (!SLUG.test(post.slug ?? "")) where("slug Türkçe ASCII ve tireli olmalı");
  for (const key of ["baslik", "title", "aciklama", "description", "kapak"]) {
    if (!String(post[key] ?? "").trim()) where(`post.${key} boş`);
  }
  if (post.baslik === post.title) where("TR ve EN başlık aynı");
  if (!String(post.aciklama).includes("?")) where("girişte soru yok");
  if (!String(post.description).includes("?")) where("EN girişte soru yok");
  if (!Array.isArray(post.bolumler) || post.bolumler.length < 4) {
    where("en az dört bölüm gerekli");
  }

  post.bolumler?.forEach((section, i) => {
    for (const key of ["baslik", "title", "metin", "text"]) {
      if (!String(section[key] ?? "").trim()) where(`bölüm ${i + 1} ${key} boş`);
    }
    if (i < 2 && !String(section.gorsel ?? "").trim()) {
      where(`bölüm ${i + 1} görselsiz`);
    }
  });

  for (const src of [post.kapak, ...(post.bolumler ?? []).map((s) => s.gorsel)]) {
    if (!src || /^https?:\/\//i.test(src)) continue;
    const file = path.join(root, "public", src.replace(/^\//, ""));
    if (!existsSync(file)) where(`görsel yok: ${src}`);
  }

  const strings = walk(issue);
  if (strings.some((s) => s.includes("—"))) where("em dash var");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`haftalık not tamam: ${files.length} sayı`);
