/**
 * Figma 4957:2234 — GG Pizza hospitality grid (16 görseller)
 * node scripts/upload-hospitality-gg-pizza-figma.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PREFIX =
  "https://www.figma.com/api/mcp/asset/96d38138-3d3a-42dc-b28e-6bee007108bf";

const ASSETS = [
  "77b41.png",
  "855e4.png",
  "49249.png",
  "0efda.png",
  "9ea5e.png",
  "42d93.png",
  "66933.png",
  "1e61d.png",
  "6bb93.png",
  "7267e.png",
  "63cad.png",
  "aa55e.png",
  "58e09.png",
  "4a683.png",
  "32135.png",
  "67ea5.png",
];

function loadEnv() {
  const candidates = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env.production.local"),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      const k = t.slice(0, i).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

loadEnv();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const tmp = path.join(os.tmpdir(), "kruv-gg-pizza-hospitality");
fs.mkdirSync(tmp, { recursive: true });

for (let i = 0; i < ASSETS.length; i++) {
  const file = ASSETS[i];
  const n = String(i + 1).padStart(2, "0");
  const publicId = `kruv-portfolio/hospitality/gg-pizza-${n}`;
  const url = `${PREFIX}/${file}`;
  const local = path.join(tmp, `gg-pizza-${n}.png`);

  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`download failed ${url} ${res.status}`);
  fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));

  process.stdout.write(`${publicId} … `);
  const up = await cloudinary.uploader.upload(local, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  console.log("OK", up.width + "x" + up.height);
}

console.log("done");
