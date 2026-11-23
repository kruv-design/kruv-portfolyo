/**
 * Cloudinary / site video URL’lerini HEAD ile doğrular.
 * Kullanım: node scripts/audit-site-videos.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TRANSFORMS = "q_auto,f_mp4,vc_h264,w_1920,c_limit";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".git") continue;
      walk(p, acc);
    } else if (/\.(ts|tsx|mjs|json|sql)$/.test(name.name)) {
      acc.push(p);
    }
  }
  return acc;
}

function embedToDelivery(url) {
  try {
    const u = new URL(url);
    if (!/player\.cloudinary\.com$/i.test(u.hostname)) return url;
    const cloud =
      u.searchParams.get("cloud_name")?.trim() ||
      u.searchParams.get("cloud")?.trim() ||
      "di0qbhh46";
    const publicId = decodeURIComponent(
      u.searchParams.get("public_id")?.trim() ||
        u.searchParams.get("publicId")?.trim() ||
        "",
    );
    if (!publicId) return url;
    return `https://res.cloudinary.com/${cloud}/video/upload/${TRANSFORMS}/${publicId}`;
  } catch {
    return url;
  }
}

function toDelivery(url) {
  const s = url.trim();
  if (s.includes("player.cloudinary.com")) return embedToDelivery(s);
  if (s.includes("/video/upload/")) {
    if (s.includes("vc_h264") && s.includes("f_mp4")) return s;
    const rest = s.split("/video/upload/")[1].split("?")[0];
    const segs = rest.split("/").filter(Boolean);
    if (/^v\d+$/.test(segs[0] ?? "")) segs.shift();
    while (
      segs.length > 1 &&
      /^[a-z0-9_,.-]+$/i.test(segs[0] ?? "") &&
      (segs[0].includes(",") || /^(q_|f_|w_|c_|vc_)/.test(segs[0]))
    ) {
      segs.shift();
    }
    const pid = segs.join("/").replace(/\.mp4$/i, "");
    const cloud = s.match(/res\.cloudinary\.com\/([^/]+)/)?.[1] ?? "di0qbhh46";
    return `https://res.cloudinary.com/${cloud}/video/upload/${TRANSFORMS}/${pid}`;
  }
  return s;
}

const patterns = [
  /https:\/\/res\.cloudinary\.com\/[^\s"'\\)]+/g,
  /https:\/\/player\.cloudinary\.com\/[^\s"'\\)]+/g,
];

const raw = new Set();
for (const file of walk(join(ROOT, "src"))) {
  const text = readFileSync(file, "utf8");
  for (const pat of patterns) {
    for (const m of text.matchAll(pat)) raw.add(m[0]);
  }
}

const videos = [...raw]
  .filter((u) => u.includes("/video/") || u.includes("player.cloudinary"))
  .map(toDelivery);

const unique = [...new Set(videos)];
let fail = 0;
for (const url of unique.sort()) {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
    const ct = res.headers.get("content-type") ?? "";
    const ok = res.ok && (ct.includes("video") || ct.includes("octet"));
    if (!ok) {
      fail += 1;
      console.log(`FAIL ${res.status} ${ct} ${url.slice(0, 100)}`);
    }
  } catch (e) {
    fail += 1;
    console.log(`ERR ${e.message?.slice(0, 60)} ${url.slice(0, 100)}`);
  }
}

console.log(`\n${unique.length} unique delivery URL — ${fail} failure(s)`);
process.exitCode = fail > 0 ? 1 : 0;