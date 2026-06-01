import fs from "node:fs";
import path from "node:path";

const assetsDir = path.join(process.cwd(), "public/assets");
const shapeSvg = fs.readFileSync(
  path.join(assetsDir, "kruv-nav-emblem-shape.svg"),
  "utf8",
);
const markSvg = fs.readFileSync(
  path.join(assetsDir, "kruv-nav-emblem-mark.svg"),
  "utf8",
);

const shapePath = shapeSvg
  .match(/<path[^>]*>/)[0]
  .replace('fill="#fff"', 'fill="#6366f1"');

const markPaths = [...markSvg.matchAll(/<path[^>]*>/g)]
  .map((match) => match[0].replace('fill="#fff"', 'fill="#ffffff"'))
  .join("\n    ");

function buildSquareIcon(size, padding) {
  const inner = size - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="kruv">
  <svg x="${padding}" y="${padding}" width="${inner}" height="${inner}" viewBox="0 0 308 373" preserveAspectRatio="xMidYMid meet">
    ${shapePath}
    ${markPaths}
  </svg>
</svg>
`;
}

const appDir = path.join(process.cwd(), "src/app");
fs.mkdirSync(appDir, { recursive: true });
fs.writeFileSync(path.join(appDir, "icon.svg"), buildSquareIcon(32, 2));
fs.writeFileSync(path.join(appDir, "apple-icon.svg"), buildSquareIcon(180, 14));
console.log("Wrote src/app/icon.svg and src/app/apple-icon.svg");
