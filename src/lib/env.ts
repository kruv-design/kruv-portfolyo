/**
 * Central env accessor. Throws early at server start if a required var is missing.
 * Public vars are validated lazily (client bundles them via Next).
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `[env] Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

/**
 * Site kök URL — `metadataBase` ve canonical için kullanılır.
 * Şemasız (`127.0.0.1:3000`) değerler `new URL()` ile patlar; otomatik `http://` eklenir.
 */
function safePublicSiteUrl(): string {
  const fallback = "http://localhost:3000";
  let raw = String(process.env.NEXT_PUBLIC_SITE_URL ?? fallback).trim();
  if (!raw) return fallback;
  if (!/^https?:\/\//i.test(raw)) {
    raw = "http://" + raw.replace(/^\/+/, "");
  }
  try {
    const u = new URL(raw);
    return u.href.replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

export const env = {
  get SUPABASE_URL() {
    return required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get SUPABASE_ANON_KEY() {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  },
  get CLOUDINARY_CLOUD_NAME() {
    return required(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    );
  },
  get CLOUDINARY_API_KEY() {
    return required("CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY);
  },
  get CLOUDINARY_API_SECRET() {
    return required(
      "CLOUDINARY_API_SECRET",
      process.env.CLOUDINARY_API_SECRET,
    );
  },
  get CLOUDINARY_UPLOAD_PRESET() {
    return required(
      "CLOUDINARY_UPLOAD_PRESET",
      process.env.CLOUDINARY_UPLOAD_PRESET,
    );
  },
  get SITE_URL() {
    return safePublicSiteUrl();
  },
};
