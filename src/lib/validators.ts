import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "Bu alan zorunlu.");
const optStr = z.string().trim().max(500).optional().default("");
const longStr = z.string().trim().max(5000).optional().default("");

export const sectionSchema = z.object({
  baslik: z.string().trim().max(200).optional().default(""),
  metin: z.string().trim().max(5000).optional().default(""),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .max(96)
    .refine((s) => s === "" || /^[a-z0-9-]+$/.test(s), {
      message: "Slug sadece küçük harf, rakam ve tire içerebilir.",
    })
    .optional()
    .default(""),
  baslik: nonEmpty.max(200, "Başlık çok uzun."),
  kategori: nonEmpty.max(80),
  aciklama: longStr,
  gorsel: z.string().trim().url("Geçerli bir URL olmalı.").or(z.literal("")).optional().default(""),
  gorseller: z.array(z.string().url().or(z.literal(""))).max(30).default([]),
  bolumler: z.array(sectionSchema).max(20).default([]),
  etiketler: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  yil: optStr,
  musteri: optStr,
  rol: optStr,
  sure: optStr,
  link: z.string().trim().url().or(z.literal("")).optional().default(""),
  featured: z.boolean().default(false),
  renk: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "HEX renk olmalı (#RRGGBB).")
    .optional()
    .default("#C8B8A8"),
});

export type ProjectFormInput = z.infer<typeof projectSchema>;

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
  step: z.number().int().min(0).max(3).optional(),
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
