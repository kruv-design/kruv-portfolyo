import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";

/** Google Drive (ve benzeri) senkronu `.next` içindeki chunk dosyalarını bozabiliyor → `Cannot find module './331.js'`. */
const projectDir = __dirname;
const looksLikeGoogleDrive = projectDir.includes("GoogleDrive");
const useExternalBuildDir =
  Boolean(process.env.NEXT_DIST_DIR) ||
  process.env.NEXT_DIST_LOCAL === "1" ||
  looksLikeGoogleDrive;
const distDir = process.env.NEXT_DIST_DIR
  ? path.resolve(process.env.NEXT_DIST_DIR)
  : useExternalBuildDir
    ? path.join(os.homedir(), ".cache", "next-dist", "kruv-portfolyo-cms")
    : ".next";

const config: NextConfig = {
  reactStrictMode: true,
  distDir,
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [{ source: "/portfolio", destination: "/works", permanent: true }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "www.figma.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["zustand", "lucide-react"],
  },
};

export default config;
