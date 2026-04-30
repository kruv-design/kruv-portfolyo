import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  /** `/` → statik `public/kruv.html` (Vercel’de middleware rewrite’dan daha güvenilir). */
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/kruv.html" }],
    };
  },
  async redirects() {
    return [{ source: "/portfolio", destination: "/works", permanent: true }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["zustand"],
  },
};

export default config;
