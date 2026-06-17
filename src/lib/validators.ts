import { z } from "zod";
import {
  GALERI_KEYS,
  GALERI_VIDEO_KEYS,
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

export const projectSchema = z.object({
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
  kapak_video: videoUrlOrEmpty.optional().default(""),
  galeri_1: imageUrlOrEmpty.optional().default(""),
  galeri_1_video: videoUrlOrEmpty.optional().default(""),
  galeri_2: imageUrlOrEmpty.optional().default(""),
  galeri_2_video: videoUrlOrEmpty.optional().default(""),
  galeri_3: imageUrlOrEmpty.optional().default(""),
  galeri_3_video: videoUrlOrEmpty.optional().default(""),
  galeri_4: imageUrlOrEmpty.optional().default(""),
  galeri_4_video: videoUrlOrEmpty.optional().default(""),
  galeri_5: imageUrlOrEmpty.optional().default(""),
  galeri_5_video: videoUrlOrEmpty.optional().default(""),
  galeri_6: imageUrlOrEmpty.optional().default(""),
  galeri_6_video: videoUrlOrEmpty.optional().default(""),
  galeri_7: imageUrlOrEmpty.optional().default(""),
  galeri_7_video: videoUrlOrEmpty.optional().default(""),
  galeri_8: imageUrlOrEmpty.optional().default(""),
  galeri_8_video: videoUrlOrEmpty.optional().default(""),
  galeri_9: imageUrlOrEmpty.optional().default(""),
  galeri_9_video: videoUrlOrEmpty.optional().default(""),
  galeri_10: imageUrlOrEmpty.optional().default(""),
  galeri_10_video: videoUrlOrEmpty.optional().default(""),
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
  .superRefine((data, ctx) => {
    const pairs: { posterKey: string; videoKey: string; label: string }[] = [
      { posterKey: "kapak", videoKey: "kapak_video", label: "Kapak" },
      ...GALERI_KEYS.map((k, i) => ({
        posterKey: k,
        videoKey: GALERI_VIDEO_KEYS[i]!,
        label: k,
      })),
    ];
    for (const { posterKey, videoKey, label } of pairs) {
      const rec = data as Record<string, unknown>;
      const video = String(rec[videoKey] ?? "");
      const poster = String(rec[posterKey] ?? "");
      if (video && !poster) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [posterKey],
          message: `${label}: video için poster görseli zorunlu (LCP).`,
        });
      }
    }
  });

export type ProjectFormInput = z.infer<typeof projectSchema>;

/** PostgREST’e yalnızca tablo sütunları — spread ile fazla anahtar riski kalkar */
export function projectPayloadToDbRow(input: ProjectFormInput, slug: string) {
  return {
    slug,
    baslik: input.baslik,
    title: input.title,
    kategori: input.kategori,
    category: input.category,
    aciklama: input.aciklama,
    description: input.description,
    kapak: input.kapak,
    kapak_video: input.kapak_video,
    galeri_1: input.galeri_1,
    galeri_1_video: input.galeri_1_video,
    galeri_2: input.galeri_2,
    galeri_2_video: input.galeri_2_video,
    galeri_3: input.galeri_3,
    galeri_3_video: input.galeri_3_video,
    galeri_4: input.galeri_4,
    galeri_4_video: input.galeri_4_video,
    galeri_5: input.galeri_5,
    galeri_5_video: input.galeri_5_video,
    galeri_6: input.galeri_6,
    galeri_6_video: input.galeri_6_video,
    galeri_7: input.galeri_7,
    galeri_7_video: input.galeri_7_video,
    galeri_8: input.galeri_8,
    galeri_8_video: input.galeri_8_video,
    galeri_9: input.galeri_9,
    galeri_9_video: input.galeri_9_video,
    galeri_10: input.galeri_10,
    galeri_10_video: input.galeri_10_video,
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
  siteAdi: nonEmpty.max(100),
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
