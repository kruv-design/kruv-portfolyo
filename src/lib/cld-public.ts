/** Client-safe Cloudinary URL helpers (no server secrets). */

function cloudName(): string {
  return String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();
}

export function publicCldImageUrl(
  publicIdOrUrl: string,
  opts: { w?: number; h?: number; crop?: "fill" | "fit" } = {},
): string {
  if (!publicIdOrUrl) return "";
  if (/^https?:\/\//i.test(publicIdOrUrl)) return publicIdOrUrl;
  const cn = cloudName();
  if (!cn) return publicIdOrUrl;
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
  return `https://res.cloudinary.com/${cn}/image/upload/${transforms}/${publicIdOrUrl}`;
}

export function publicCldRawUrl(publicIdOrUrl: string): string {
  if (!publicIdOrUrl) return "";
  if (/^https?:\/\//i.test(publicIdOrUrl)) return publicIdOrUrl;
  const cn = cloudName();
  if (!cn) return publicIdOrUrl;
  return `https://res.cloudinary.com/${cn}/raw/upload/${publicIdOrUrl}`;
}
