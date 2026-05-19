/**
 * Domain types — mirror Supabase schema exactly.
 * Kept in Turkish field names to preserve the prototype's language.
 */

export type ProjectSection = {
  baslik: string;
  metin: string;
};

export type Project = {
  id: string;
  slug: string;
  baslik: string;
  kategori: string;
  aciklama: string;
  kapak: string | null;
  galeri_1: string;
  galeri_2: string;
  galeri_3: string;
  galeri_4: string;
  galeri_5: string;
  galeri_6: string;
  galeri_7: string;
  galeri_8: string;
  bolumler: ProjectSection[];
  etiketler: string[];
  yil: string;
  musteri: string;
  sure: string;
  link: string;
  featured: boolean;
  renk: string;
  sira: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = Omit<
  Project,
  "id" | "slug" | "created_at" | "updated_at" | "sira"
> & {
  slug?: string;
};

export type SiteSettings = {
  siteAdi: string;
  tagline: string;
  footerYazi: string;
  /** Boş veya tam http(s) URL; footer’da ikon olarak gösterilir */
  instagramUrl: string;
  xUrl: string;
  linkedinUrl: string;
  behanceUrl: string;
  dribbbleUrl: string;
  youtubeUrl: string;
  pinterestUrl: string;
  githubUrl: string;
};

export type ApiError = {
  error: string;
  details?: Record<string, string[]> | undefined;
};

export type ApiResult<T> = { data: T } | ApiError;

/** `contact_inquiries` tablosu — Supabase */
export type ContactInquiryRow = {
  id: string;
  session_id: string;
  status: "partial" | "submitted";
  payload: Record<string, unknown>;
  email: string | null;
  hubspot_synced: boolean;
  created_at: string;
  updated_at: string;
};
