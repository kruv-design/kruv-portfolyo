/**
 * Opera Hotel Bosphorus — Cloudinary upload + Supabase projects upsert.
 * Kullanım:
 *   node --env-file=.env.production.pulled scripts/seed-opera-hotel-bosphorus.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";

const FOLDER = "kruv-portfolio/projects/opera-hotel-bosphorus";
const LOCAL = path.resolve(".cache/opera-hotel-upload");
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "di0qbhh46";
const CLD = `https://res.cloudinary.com/${CLOUD}/image/upload`;

const names = [
  "kapak",
  ...Array.from({ length: 15 }, (_, i) => `g${String(i + 1).padStart(2, "0")}`),
];

cloudinary.config({
  cloud_name: CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Missing Cloudinary credentials");
  process.exit(1);
}

const uploaded = {};
for (const name of names) {
  const file = path.join(LOCAL, `${name}.jpg`);
  if (!fs.existsSync(file)) {
    console.error("missing", file);
    process.exit(1);
  }
  const res = await cloudinary.uploader.upload(file, {
    folder: FOLDER,
    public_id: name,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    tags: ["opera-hotel-bosphorus", "project"],
  });
  uploaded[name] = res.secure_url;
  console.log("uploaded", name, res.bytes);
}

const payload = {
  slug: "opera-hotel-bosphorus",
  baslik: "Opera Hotel Bosphorus",
  title: "Opera Hotel Bosphorus",
  kategori: "Sosyal medya, fotoğraf, hospitality içerik",
  category: "Social media, photography, hospitality content",
  aciklama:
    "Opera Hotel Bosphorus için Boğaz manzarasını, otel ritüellerini ve lifestyle anlarını tek bir görsel dilde topladık. Çekim, sosyal medya ve içerik üretimiyle markayı rezervasyona giden bir hikâyeye dönüştürdük.",
  description:
    "For Opera Hotel Bosphorus we gathered Bosphorus views, hotel rituals, and lifestyle moments into one visual language — photography, social media, and content that turn the brand into a story that leads to bookings.",
  kapak: uploaded.kapak,
  ...Object.fromEntries(
    Array.from({ length: 15 }, (_, i) => {
      const key = `galeri_${i + 1}`;
      const file = `g${String(i + 1).padStart(2, "0")}`;
      return [key, uploaded[file] || ""];
    }),
  ),
  bolumler: [],
  etiketler: ["social-media", "photography", "hospitality"],
  featured: true,
  yayinda: true,
  renk: "#C4A574",
  sira: 1,
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation",
};

// Keep GG first (sira 0); bump others >=1 that collide
const listRes = await fetch(
  `${url}/rest/v1/projects?select=id,slug,sira&order=sira.asc`,
  { headers },
);
const existing = await listRes.json();
if (!Array.isArray(existing)) {
  console.error("list failed", existing);
  process.exit(1);
}

const opera = existing.find((p) => p.slug === "opera-hotel-bosphorus");
if (!opera) {
  for (const p of existing) {
    const s = Number(p.sira) || 0;
    if (s >= 1 && p.slug !== "gg-pizza") {
      await fetch(`${url}/rest/v1/projects?id=eq.${p.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ sira: s + 1 }),
      });
    }
  }
}

const upsertRes = await fetch(`${url}/rest/v1/projects?on_conflict=slug`, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});
const text = await upsertRes.text();
if (!upsertRes.ok) {
  console.error("upsert failed", upsertRes.status, text);
  process.exit(1);
}
const row = JSON.parse(text)?.[0];
console.log(
  "ok",
  row?.slug,
  "sira=",
  row?.sira,
  "kapak_ok=",
  String(row?.kapak || "").includes("cloudinary"),
  "g1_ok=",
  String(row?.galeri_1 || "").includes("cloudinary"),
  "sample_kapak=",
  uploaded.kapak.replace(CLD, "[cld]"),
);
