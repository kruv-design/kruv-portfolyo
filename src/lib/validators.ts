import { z } from "zod";
import { normalizeBrandName } from "@/lib/brand";
import {
  GALERI_KEYS,
  GALERI_VIDEO_KEYS,
  GALERI_VIDEO_SLOT_RULES,
  resolveProjectImageUrl,
  resolveProjectVideoUrl,
} from "@/lib/project-images";
import { slugify } from "@/lib/slugify";

const nonEmpty = z.string().trim().min(1, "Bu alan zorunlu.");
const optStr = z.string().trim().max(500).optional().default("");
const longStr = z.string().trim().max(5000).optional().default("");

export const sectionSchema = z.object({
  baslik: z.string().trim().max(200).optional().default(""),
  metin: z.string().trim().max(5000).optional().default(""),
  title: z.string().trim().max(200).optional().default(""),
  text: z.string().trim().max(5000).optional().default(""),
});

/** Yapıştırma hatası: URL içindeki tüm boşluklar (Cloudinary cloud_name vb.) — z.url() kaydı düşürüyordu */
function compactUrlWhitespace(s: string): string {
  return s.trim().replace(/\s+/g, "");
}

const imageUrlOrEmpty = z
  .string()
  .max(2048)
  .transform((s) => {
    const c = compactUrlWhitespace(s);
    if (!c) return "";
    return resolveProjectImageUrl(c);
  })
  .refine(
    (s) => !s || /^https?:\/\//i.test(s),
    "Görsel: https://… URL veya Cloudinary public_id (örn. kruv-portfolio/abc). NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME gerekli.",
  )
  .refine((s) => {
    if (!s) return true;
    try {
      const u = new URL(s);
      return Boolean(u.hostname);
    } catch {
      return false;
    }
  }, "Adres geçerli görünmüyor; kopyaladığınız linki kontrol edin.");

const videoUrlOrEmpty = z
  .string()
  .max(2048)
  .transform((s) => {
    const c = compactUrlWhitespace(s);
    if (!c) return "";
    return resolveProjectVideoUrl(c);
  })
  .refine(
    (s) => !s || /^https?:\/\//i.test(s),
    "Video: https://… URL veya Cloudinary video public_id.",
  )
  .refine((s) => {
    if (!s) return true;
    try {
      const u = new URL(s);
      return Boolean(u.hostname);
    } catch {
      return false;
    }
  }, "Video adresi geçerli görünmüyor.");


/** #RGB → #RRGGBB; geçersiz / boş → varsayılan (kayıt 400 düşmesin) */
function normalizeRenkHex(raw: string): string {
  const t = raw.trim();
  if (/^#[0-9A-Fa-f]{6}$/i.test(t)) {
    return `#${t.slice(1).toUpperCase()}`;
  }
  if (/^#[0-9A-Fa-f]{3}$/i.test(t)) {
    const r = t[1]!.toUpperCase();
    const g = t[2]!.toUpperCase();
    const b = t[3]!.toUpperCase();
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#C8B8A8";
}

const galeriZodObject = z.object({
  ...Object.fromEntries(
    GALERI_KEYS.map((k) => [k, imageUrlOrEmpty.optional().default("")]),
  ),
  ...Object.fromEntries(
    GALERI_VIDEO_KEYS.map((k) => [k, videoUrlOrEmpty.optional().default("")]),
  ),
} as z.ZodRawShape);

export const projectSchema = z
  .object({
  /**
   * Slug: küçük harf, `_` → `-`, geçersiz karakter kalırsa `slugify` ile düzelt.
   * Aksi halde PATCH 400 oluyor; kullanıcı “hiç kaydetmiyor” sanıyordu.
   */
  slug: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((v) => {
      const raw =
        typeof v === "string"
          ? v.trim().toLowerCase().replace(/_/g, "-")
          : "";
      if (raw === "") return "";
      if (/^[a-z0-9-]+$/.test(raw)) return raw.slice(0, 96);
      const fixed = slugify(raw).slice(0, 96);
      return fixed;
    })
    .pipe(
      z
        .string()
        .max(96)
        .refine((s) => s === "" || /^[a-z0-9-]+$/.test(s), {
          message: "Slug üretilemedi; başlıktan otomatik slug kullanılacak.",
        }),
    ),
  baslik: nonEmpty.max(200, "Başlık çok uzun."),
  title: z.string().trim().max(200).optional().default(""),
  kategori: nonEmpty.max(80),
  category: z.string().trim().max(80).optional().default(""),
  aciklama: longStr,
  description: longStr,
  kapak: imageUrlOrEmpty.optional().default(""),
  bolumler: z.array(sectionSchema).max(20).default([]),
  etiketler: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  featured: z.boolean().default(false),
  yayinda: z.boolean().default(true),
  next_project_override: z
    .string()
    .trim()
    .max(96)
    .optional()
    .default(""),
  renk: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((v) =>
      normalizeRenkHex(typeof v === "string" ? v : "#C8B8A8"),
    ),
})
  .merge(galeriZodObject)
  .superRefine((data, ctx) => {
    for (const { galeriKey, videoKey, allowVideoOnly } of GALERI_VIDEO_SLOT_RULES) {
      const rec = data as Record<string, unknown>;
      const video = String(rec[videoKey] ?? "");
      const poster = String(rec[galeriKey] ?? "");
      if (video && !poster && !allowVideoOnly) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [galeriKey],
          message:
            galeriKey === "galeri_5"
              ? "Görsel 5: video için poster görseli zorunlu."
              : "Görsel 1: video için poster görseli zorunlu.",
        });
      }
    }
  });

export type ProjectFormInput = z.infer<typeof projectSchema>;

/** PostgREST’e yalnızca tablo sütunları — spread ile fazla anahtar riski kalkar */
export function projectPayloadToDbRow(input: ProjectFormInput, slug: string) {
  const galeriRow = Object.fromEntries([
    ...GALERI_KEYS.map((k) => [k, input[k]]),
    ...GALERI_VIDEO_KEYS.map((k) => [k, input[k]]),
  ]);

  return {
    slug,
    baslik: input.baslik,
    title: input.title,
    kategori: input.kategori,
    category: input.category,
    aciklama: input.aciklama,
    description: input.description,
    kapak: input.kapak,
    ...galeriRow,
    bolumler: input.bolumler,
    etiketler: input.etiketler,
    featured: input.featured,
    yayinda: input.yayinda,
    next_project_override: input.next_project_override ?? "",
    renk: input.renk,
  };
}

export const reorderSchema = z.object({
  order: z.array(z.string().uuid()).max(200),
});

// ── Blog ────────────────────────────────────────────────────

export const blogSectionSchema = z.object({
  baslik: z.string().trim().max(200).optional().default(""),
  metin: z.string().trim().max(10000).optional().default(""),
  title: z.string().trim().max(200).optional().default(""),
  text: z.string().trim().max(10000).optional().default(""),
  gorsel: imageUrlOrEmpty.optional().default(""),
});

export const blogPostSchema = z.object({
  slug: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((v) => {
      const raw =
        typeof v === "string" ? v.trim().toLowerCase().replace(/_/g, "-") : "";
      if (raw === "") return "";
      if (/^[a-z0-9-]+$/.test(raw)) return raw.slice(0, 96);
      return slugify(raw).slice(0, 96);
    })
    .pipe(
      z
        .string()
        .max(96)
        .refine((s) => s === "" || /^[a-z0-9-]+$/.test(s), {
          message: "Slug üretilemedi; başlıktan otomatik slug kullanılacak.",
        }),
    ),
  baslik: nonEmpty.max(200, "Başlık çok uzun."),
  title: z.string().trim().max(200).optional().default(""),
  aciklama: z.string().trim().max(10000).optional().default(""),
  description: z.string().trim().max(10000).optional().default(""),
  kapak: imageUrlOrEmpty.optional().default(""),
  bolumler: z.array(blogSectionSchema).max(40).default([]),
  yayinda: z.boolean().default(true),
});

export type BlogPostFormInput = z.infer<typeof blogPostSchema>;

/** PostgREST'e yalnızca `blog_posts` sütunları. */
export function blogPayloadToDbRow(input: BlogPostFormInput, slug: string) {
  return {
    slug,
    baslik: input.baslik,
    title: input.title,
    aciklama: input.aciklama,
    description: input.description,
    kapak: input.kapak,
    bolumler: input.bolumler,
    yayinda: input.yayinda,
  };
}

export const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin."),
  password: z.string().min(8, "En az 8 karakter."),
});

const optHttpUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .default("")
  .refine(
    (s) => s === "" || z.string().url().safeParse(s).success,
    "Geçerli bir URL (https://…) veya boş bırakın.",
  );

export const settingsSchema = z.object({
  siteAdi: nonEmpty.max(100).transform(normalizeBrandName),
  tagline: optStr,
  footerYazi: optStr,
  instagramUrl: optHttpUrl,
  xUrl: optHttpUrl,
  linkedinUrl: optHttpUrl,
  behanceUrl: optHttpUrl,
  dribbbleUrl: optHttpUrl,
  youtubeUrl: optHttpUrl,
  pinterestUrl: optHttpUrl,
  githubUrl: optHttpUrl,
  homeVideoPoster: optStr,
  homeVideo: optStr,
  homeVideoPosterMobile: optStr,
  homeVideoMobile: optStr,
});

const emptyOrEmail = z
  .string()
  .trim()
  .max(320)
  .refine((s) => s === "" || z.string().email().safeParse(s).success, {
    message: "Geçerli bir e-posta girin veya boş bırakın.",
  });

export const contactPayloadSchema = z.object({
  name: z.string().trim().max(200).optional().default(""),
  email: emptyOrEmail.optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
});

export type ContactPayloadInput = z.infer<typeof contactPayloadSchema>;

export const contactPartialBodySchema = z.object({
  sessionId: z.string().uuid("Oturum geçersiz."),
  /** Eski multi-step form ile uyumluluk; tek-sayfa formda gönderilmez. */
  step: z.number().int().min(0).max(10).optional(),
  payload: contactPayloadSchema,
});

export const contactSubmitBodySchema = z.object({
  sessionId: z.string().uuid("Oturum geçersiz."),
  /** Honeypot — boş kalmalı */
  hp: z.string().optional().default(""),
  locale: z.enum(["tr", "en"]).optional().default("tr"),
  payload: contactPayloadSchema,
});

export type ContactPartialBody = z.infer<typeof contactPartialBodySchema>;
export type ContactSubmitBody = z.infer<typeof contactSubmitBodySchema>;

// ── Protel pitch ────────────────────────────────────────────

export const protelVideoAspectSchema = z.enum(["16:9", "9:16", "4:5", "1:1"]);

export const protelSampleVideoSchema = z.object({
  title: z.string().trim().max(200).optional().default(""),
  videoUrl: z.string().trim().max(2000).optional().default(""),
  aspectRatio: protelVideoAspectSchema.optional().default("16:9"),
});

export const protelMetricSchema = z.object({
  label: z.string().trim().max(120).optional().default(""),
  value: z.string().trim().max(120).optional().default(""),
});

export const protelSocialSchema = z
  .object({
    platform: z.string().trim().max(80).optional().default(""),
    handle: z.string().trim().max(200).optional().default(""),
    url: z.string().trim().max(500).optional().default(""),
  })
  .refine((s) => s.platform.toLowerCase() !== "tiktok", {
    message: "TikTok desteklenmiyor.",
  });

export const protelProcessStepSchema = z.object({
  title: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().max(1000).optional().default(""),
});

export const protelPitchSettingsSchema = z.object({
  heroTitle: z.string().trim().max(200).optional().default(""),
  heroIntro: z.string().trim().max(2000).optional().default(""),
  proposalTitle: z.string().trim().max(200).optional().default(""),
  proposalVideoUrl: z.string().trim().max(2000).optional().default(""),
  proposalVideoAspect: protelVideoAspectSchema.optional().default("16:9"),
  sampleVideos: z.array(protelSampleVideoSchema).max(8).default([]),
  processSteps: z.array(protelProcessStepSchema).max(12).default([]),
});

export const protelBrandSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().trim().max(96).optional(),
  name: z.string().trim().max(200).optional().default(""),
  sortOrder: z.number().int().min(0).max(99).optional().default(0),
  metrics: z.array(protelMetricSchema).max(12).default([]),
  socialAccounts: z.array(protelSocialSchema).max(12).default([]),
  video1Title: z.string().trim().max(200).optional().default(""),
  video1Url: z.string().trim().max(2000).optional().default(""),
  video1Aspect: protelVideoAspectSchema.optional().default("16:9"),
  video2Title: z.string().trim().max(200).optional().default(""),
  video2Url: z.string().trim().max(2000).optional().default(""),
  video2Aspect: protelVideoAspectSchema.optional().default("16:9"),
});

export const protelPitchSaveSchema = z.object({
  settings: protelPitchSettingsSchema,
  brands: z.array(protelBrandSchema).max(8),
});

export type ProtelPitchSaveInput = z.infer<typeof protelPitchSaveSchema>;

export const protelUnlockSchema = z.object({
  password: z.string().min(1, "Şifre gerekli."),
});
