#!/usr/bin/env node
/**
 * Drops görsellerini Cloudinary'ye yükler.
 * Kaynak: .cache/drops-hires/{specimens|heroes}/...
 *
 * Kullanım: node scripts/upload-drops-to-cloudinary.mjs
 * (.env.local içinde CLOUDINARY_* tanımlı olmalı)
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE = path.join(ROOT, ".cache/drops-hires");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET gerekli (.env.local)");
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function uploadOne(filePath) {
  const rel = path.relative(CACHE, filePath).replace(/\\/g, "/");
  const publicId = `kruv-drops/${rel.replace(/\.(png|jpe?g|webp)$/i, "")}`;
  const res = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    quality: "auto:best",
  });
  return { publicId: res.public_id, url: res.secure_url, bytes: res.bytes, width: res.width, height: res.height };
}

const files = walk(CACHE);
if (files.length === 0) {
  console.error(`Dosya yok: ${CACHE}`);
  process.exit(1);
}

console.log(`Yükleniyor: ${files.length} dosya → kruv-drops/…`);

const results = {};
for (const file of files.sort()) {
  const rel = path.relative(CACHE, file).replace(/\\/g, "/");
  process.stdout.write(`  ${rel} … `);
  try {
    const r = await uploadOne(file);
    results[rel] = r;
    console.log(`OK ${r.width}×${r.height} (${Math.round(r.bytes / 1024)} KB)`);
  } catch (err) {
    console.log("HATA", err.message || err);
    process.exitCode = 1;
  }
}

const manifest = path.join(CACHE, "upload-manifest.json");
fs.writeFileSync(manifest, JSON.stringify(results, null, 2));
console.log(`\nManifest: ${manifest}`);
