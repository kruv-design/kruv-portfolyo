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

export const settingsSchema = z.object({
  siteAdi: nonEmpty.max(100),
  tagline: optStr,
  footerYazi: optStr,
});
