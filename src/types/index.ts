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
  gorsel: string | null;
  gorseller: string[];
  bolumler: ProjectSection[];
  etiketler: string[];
  yil: string;
  musteri: string;
  rol: string;
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
  githubUrl: string;
};

export type ApiError = {
  error: string;
  details?: Record<string, string[]> | undefined;
};

export type ApiResult<T> = { data: T } | ApiError;
