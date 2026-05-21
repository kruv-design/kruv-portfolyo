import { z } from "zod";
import { resolveProjectImageUrl } from "@/lib/project-images";
import { slugify } from "@/lib/slugify";

const nonEmpty = z.string().trim().min(1, "Bu alan zorunlu.");
const optStr = z.string().trim().max(500).optional().default("");
const longStr = z.string().trim().max(5000).optional().default("");

export const sectionSchema = z.object({
  baslik: z.string().trim().max(200).optional().default(""),
  metin: z.string().trim().max(5000).optional().default(""),
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

/** Proje linki — `z.url()` bazı geçerli adresleri (boşluk, tarayıcı farkı) düşürüyordu */
const linkUrlOrEmpty = z
  .string()
  .max(2048)
  .transform((s) => compactUrlWhitespace(s))
  .refine(
    (s) => !s || /^https?:\/\//i.test(s),
    "Link http(s) ile başlamalı veya boş bırakın.",
  )
  .refine(
    (s) => {
      if (!s) return true;
      try {
        return Boolean(new URL(s).hostname);
      } catch {
        return false;
      }
    },
    "Geçerli bir adres girin veya boş bırakın.",
  )
  .optional()
  .default("");

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
  kategori: nonEmpty.max(80),
  aciklama: longStr,
  kapak: imageUrlOrEmpty.optional().default(""),
  galeri_1: imageUrlOrEmpty.optional().default(""),
  galeri_2: imageUrlOrEmpty.optional().default(""),
  galeri_3: imageUrlOrEmpty.optional().default(""),
  galeri_4: imageUrlOrEmpty.optional().default(""),
  galeri_5: imageUrlOrEmpty.optional().default(""),
  galeri_6: imageUrlOrEmpty.optional().default(""),
  galeri_7: imageUrlOrEmpty.optional().default(""),
  galeri_8: imageUrlOrEmpty.optional().default(""),
  bolumler: z.array(sectionSchema).max(20).default([]),
  etiketler: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  yil: optStr,
  musteri: optStr,
  sure: optStr,
  link: linkUrlOrEmpty,
  featured: z.boolean().default(false),
  renk: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((v) =>
      normalizeRenkHex(typeof v === "string" ? v : "#C8B8A8"),
    ),
});

export type ProjectFormInput = z.infer<typeof projectSchema>;

/** PostgREST’e yalnızca tablo sütunları — spread ile fazla anahtar riski kalkar */
export function projectPayloadToDbRow(input: ProjectFormInput, slug: string) {
  return {
    slug,
    baslik: input.baslik,
    kategori: input.kategori,
    aciklama: input.aciklama,
    kapak: input.kapak,
    galeri_1: input.galeri_1,
    galeri_2: input.galeri_2,
    galeri_3: input.galeri_3,
    galeri_4: input.galeri_4,
    galeri_5: input.galeri_5,
    galeri_6: input.galeri_6,
    galeri_7: input.galeri_7,
    galeri_8: input.galeri_8,
    bolumler: input.bolumler,
    etiketler: input.etiketler,
    yil: input.yil,
    musteri: input.musteri,
    sure: input.sure,
    link: input.link,
    featured: input.featured,
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
  company: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  projectType: z.string().trim().max(80).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  timeline: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  referrer: z.string().trim().max(80).optional().default(""),
});

export type ContactPayloadInput = z.infer<typeof contactPayloadSchema>;

export const contactPartialBodySchema = z.object({
  sessionId: z.string().uuid("Oturum geçersiz."),
  step: z.number().int().min(0).max(2).optional(),
  payload: contactPayloadSchema,
});

export const contactSubmitBodySchema = z.object({
  sessionId: z.string().uuid("Oturum geçersiz."),
  /** Honeypot — boş kalmalı */
  hp: z.string().optional().default(""),
  payload: contactPayloadSchema,
});

export type ContactPartialBody = z.infer<typeof contactPartialBodySchema>;
export type ContactSubmitBody = z.infer<typeof contactSubmitBodySchema>;
