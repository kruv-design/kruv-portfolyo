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

/**
 * Figma drops genişliği — PNG + şeffaf köşe (radius).
 * f_auto JPEG’e düşüp yuvarlatılmış PNG köşelerini dolduruyordu.
 */
const DROPS_DISPLAY_WIDTH = 1320;

function dropsDeliveryTransforms(dpr: 1 | 2): string {
  const w = DROPS_DISPLAY_WIDTH * dpr;
  return [`c_limit`, `w_${w}`, `f_png`].join(",");
}

export function publicCldImageUrlBest(publicIdOrUrl: string, dpr: 1 | 2 = 2): string {
  if (!publicIdOrUrl) return "";
  if (/^https?:\/\//i.test(publicIdOrUrl)) return publicIdOrUrl;
  if (publicIdOrUrl.startsWith("/")) return publicIdOrUrl;
  const cn = cloudName();
  if (!cn) return publicIdOrUrl;
  return `https://res.cloudinary.com/${cn}/image/upload/${dropsDeliveryTransforms(dpr)}/${publicIdOrUrl}`;
}

/** Retina ekranlar için 1x / 2x srcset */
export function publicCldImageSrcSet(publicIdOrUrl: string): string {
  const oneX = publicCldImageUrlBest(publicIdOrUrl, 1);
  const twoX = publicCldImageUrlBest(publicIdOrUrl, 2);
  if (!oneX || oneX === publicIdOrUrl) return "";
  return `${oneX} 1x, ${twoX} 2x`;
}
