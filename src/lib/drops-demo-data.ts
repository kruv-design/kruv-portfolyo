import type { DropFont, DropPack, DropPackWithFonts } from "@/types";
import { DROP_FONT_FILES } from "@/lib/drops-font-assets";
import { DROP_HERO_IMAGES } from "@/lib/drops-hero-assets";

const NOW = new Date().toISOString();

const DEMO_PACK: DropPack = {
  id: "demo-summer-pack",
  slug: "summer-pack",
  baslik: "Summer Pack",
  title: "Summer Pack",
  aciklama: "Seçilmiş font ve tasarım kaynaklarına erişin.",
  description: "Access our curated collection of fonts and design resources.",
  kapak: "",
  pack_zip_url: "",
  sort_order: 0,
  yayinda: true,
  created_at: NOW,
  updated_at: NOW,
};

const DEMO_FONTS: DropFont[] = [
  {
    id: "demo-marzano",
    pack_id: DEMO_PACK.id,
    slug: "marzano",
    name: "Marzano",
    aciklama:
      "Akıcı formlar ve ikonik domates dokunuşlarıyla tasarlanan Marzano fontu, markalara lüks, cesur ve oyuncu bir karakter kazandırır.",
    description:
      "Designed with fluid forms and iconic tomato touches, our Marzano font offers a timeless typographic experience that gives brands a luxurious, bold, and playful character.",
    preview_text: "Designed,\nbaked,\nand served.",
    tester_default_text: "Designed, baked, and served.",
    tester_placeholder: "",
    hero_image: DROP_HERO_IMAGES.marzano,
    font_file_url: DROP_FONT_FILES.marzano,
    font_preview_url: DROP_FONT_FILES.marzano,
    specimen_blocks: [],
    sort_order: 0,
    yayinda: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "demo-local",
    pack_id: DEMO_PACK.id,
    slug: "local",
    name: "Local",
    aciklama:
      "tasarımcının el yazısından oluşan yapmacıksız ve bireysel.",
    description:
      "Local keeps the rhythm of handwriting — personal, warm, and unforced.",
    preview_text: "the story of roots",
    tester_default_text:
      "A tribute to the designer's handwriting. Tasarımcının defterinden geldi, kusurlu kalsın. Samimi, ours — still from the hand.",
    tester_placeholder: "",
    hero_image: DROP_HERO_IMAGES.local,
    font_file_url: DROP_FONT_FILES.local,
    font_preview_url: DROP_FONT_FILES.local,
    specimen_blocks: [],
    sort_order: 1,
    yayinda: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "demo-cove",
    pack_id: DEMO_PACK.id,
    slug: "cove",
    name: "Cove",
    aciklama:
      "Doğanın en yumuşak formlarından ilham alan Cove, sade ve cool bir display karakter sunar.",
    description:
      "Born from pebbles, simple and cool — Cove brings the softest forms of nature to display typography.",
    preview_text: "The softest form\nof nature",
    tester_default_text:
      "Born from pebbles, held by denge. Doğa sakin, form soft. Simple and cool — a quiet balance.",
    tester_placeholder: "",
    hero_image: DROP_HERO_IMAGES.cove,
    font_file_url: DROP_FONT_FILES.cove,
    font_preview_url: DROP_FONT_FILES.cove,
    specimen_blocks: [],
    sort_order: 2,
    yayinda: true,
    created_at: NOW,
    updated_at: NOW,
  },
];

export function getDemoDropPacks(): DropPackWithFonts[] {
  return [
    {
      ...DEMO_PACK,
      fonts: DEMO_FONTS.filter((f) => f.yayinda),
    },
  ];
}

export function getDemoDropPackBySlug(slug: string): DropPackWithFonts | null {
  const pack = getDemoDropPacks().find((p) => p.slug === slug);
  return pack ?? null;
}

export function getDemoDropFont(
  packSlug: string,
  fontSlug: string,
): { pack: DropPackWithFonts; font: DropFont } | null {
  const pack = getDemoDropPackBySlug(packSlug);
  if (!pack) return null;
  const font = pack.fonts.find((f) => f.slug === fontSlug && f.yayinda);
  if (!font) return null;
  return { pack, font };
}
