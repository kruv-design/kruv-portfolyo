/**
 * Domain types — mirror Supabase schema exactly.
 * Kept in Turkish field names to preserve the prototype's language.
 */

export type ProjectSection = {
  /** TR bölüm başlığı */
  baslik: string;
  /** TR bölüm metni */
  metin: string;
  /** EN bölüm başlığı (boşsa baslik) */
  title?: string;
  /** EN bölüm metni (boşsa metin) */
  text?: string;
};

export type Project = {
  id: string;
  slug: string;
  /** TR başlık */
  baslik: string;
  /** EN başlık (boşsa baslik) */
  title: string;
  /** TR kategori */
  kategori: string;
  /** EN kategori (boşsa kategori / otomatik eşleme) */
  category: string;
  /** TR kısa açıklama */
  aciklama: string;
  /** EN kısa açıklama (boşsa aciklama) */
  description: string;
  kapak: string | null;
  galeri_1: string;
  galeri_1_video: string;
  galeri_2: string;
  galeri_3: string;
  galeri_4: string;
  galeri_5: string;
  galeri_5_video: string;
  galeri_6: string;
  galeri_7: string;
  galeri_8: string;
  galeri_9: string;
  galeri_10: string;
  galeri_11: string;
  galeri_12: string;
  galeri_13: string;
  galeri_14: string;
  galeri_15: string;
  bolumler: ProjectSection[];
  etiketler: string[];
  featured: boolean;
  /** false → portfolyoda gizlenir (admin görür, public görmez) */
  yayinda: boolean;
  /** Proje detay banner'ında manuel sonraki proje slug'ı (boş = otomatik) */
  next_project_override?: string;
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

export type BlogSection = {
  /** TR bölüm başlığı */
  baslik: string;
  /** TR bölüm metni */
  metin: string;
  /** EN bölüm başlığı (boşsa baslik) */
  title?: string;
  /** EN bölüm metni (boşsa metin) */
  text?: string;
  /** Bölüm görseli (opsiyonel) */
  gorsel?: string;
};

/** `blog_posts` tablosu — Supabase */
export type BlogPost = {
  id: string;
  slug: string;
  /** TR başlık */
  baslik: string;
  /** EN başlık (boşsa baslik) */
  title: string;
  /** TR giriş metni */
  aciklama: string;
  /** EN giriş metni (boşsa aciklama) */
  description: string;
  /** Kapak görseli — liste kartı + og image */
  kapak: string;
  bolumler: BlogSection[];
  /** false → blogda gizlenir (admin görür, public görmez) */
  yayinda: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPostInput = Omit<
  BlogPost,
  "id" | "slug" | "created_at" | "updated_at"
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
  /** Anasayfa showreel — web (masaüstü) poster */
  homeVideoPoster: string;
  /** Anasayfa showreel — web video */
  homeVideo: string;
  /** Anasayfa showreel — mobil poster */
  homeVideoPosterMobile: string;
  /** Anasayfa showreel — mobil video */
  homeVideoMobile: string;
};

export type ApiError = {
  error: string;
  details?: Record<string, string[]> | undefined;
};

export type ApiResult<T> = { data: T } | ApiError;

/** `site_events` tablosu — birinci taraf analitik */
export type SiteEventRow = {
  id: number;
  session_id: string;
  event_name: string;
  page: string | null;
  props: Record<string, unknown> | null;
  referrer: string | null;
  ua: string | null;
  ip_hash: string | null;
  created_at: string;
};

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

/** Protel pitch — video en-boy oranı */
export type ProtelVideoAspect = "16:9" | "9:16" | "4:5" | "1:1";

export type ProtelSampleVideo = {
  title: string;
  videoUrl: string;
  aspectRatio: ProtelVideoAspect;
};

export type ProtelMetric = {
  label: string;
  value: string;
};

export type ProtelSocialAccount = {
  platform: string;
  handle: string;
  url: string;
};

export type ProtelBrand = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  metrics: ProtelMetric[];
  socialAccounts: ProtelSocialAccount[];
  video1Title: string;
  video1Url: string;
  video1Aspect: ProtelVideoAspect;
  video2Title: string;
  video2Url: string;
  video2Aspect: ProtelVideoAspect;
  updatedAt: string;
};

export type ProtelProcessStep = {
  title: string;
  description: string;
};

export type ProtelPitchSettings = {
  heroTitle: string;
  heroIntro: string;
  proposalTitle: string;
  proposalVideoUrl: string;
  proposalVideoAspect: ProtelVideoAspect;
  sampleVideos: ProtelSampleVideo[];
  processSteps: ProtelProcessStep[];
  updatedAt: string;
};

export type ProtelPitch = {
  settings: ProtelPitchSettings;
  brands: ProtelBrand[];
};

export type ProtelBrandInput = Omit<ProtelBrand, "updatedAt">;
export type ProtelPitchSettingsInput = Omit<ProtelPitchSettings, "updatedAt">;
