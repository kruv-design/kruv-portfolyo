import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

/**
 * Server-only Cloudinary client. Uses signed uploads so the secret
 * never leaves the server.
 */
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadPreset: string;
};

/**
 * Produce a short-lived signature a client can POST directly to Cloudinary.
 * Keeps binary out of our server but verifies upload params.
 */
export function buildUploadSignature(folder = "kruv-portfolio"): UploadSignature {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
    upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET,
  );
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
  };
}

/**
 * Build an optimized Cloudinary delivery URL from a public_id.
 * f_auto + q_auto → modern formats & smart quality. w/h clamp bandwidth.
 */
export function cldUrl(
  publicIdOrUrl: string,
  opts: { w?: number; h?: number; crop?: "fill" | "fit" } = {},
): string {
  if (!publicIdOrUrl) return "";
  // Already a full URL — just return.
  if (/^https?:\/\//i.test(publicIdOrUrl)) return publicIdOrUrl;
  const { w, h, crop = "fill" } = opts;
  const transforms = [
    "f_auto",
    "q_auto",
    w ? `w_${w}` : null,
    h ? `h_${h}` : null,
    w || h ? `c_${crop}` : null,
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicIdOrUrl}`;
}

/** Optimized Cloudinary video delivery (MP4, bandwidth clamp). */
export function cldVideoUrl(
  publicIdOrUrl: string,
  opts: { w?: number } = {},
): string {
  if (!publicIdOrUrl) return "";
  if (/^https?:\/\//i.test(publicIdOrUrl)) return publicIdOrUrl;
  const { w = 1920 } = opts;
  const transforms = ["q_auto", "f_mp4", `w_${w}`, "c_limit"].join(",");
  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/video/upload/${transforms}/${publicIdOrUrl}`;
}
