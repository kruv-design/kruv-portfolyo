export type HospitalityFilter = "opera" | "gg-pizza" | "borden";

export type HospitalityGalleryItem = {
  id: string;
  filter: HospitalityFilter;
  src: string;
  altTr: string;
  altEn: string;
};

const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload/f_auto,q_auto";
const HOSP = `${CLD}/kruv-portfolio/hospitality`;

function opera(n: number) {
  return `${HOSP}/gallery-${String(n).padStart(2, "0")}`;
}

function borden(n: number) {
  return `${HOSP}/borden-${String(n).padStart(2, "0")}`;
}

function ggPizza(n: number) {
  return `${HOSP}/gg-pizza-${String(n).padStart(2, "0")}`;
}

/** Opera 3×8 portre. Borden 3×2. GG Pizza 3×6 — Figma 4957:2234. */
const GG_PIZZA_ALTS: { tr: string; en: string }[] = [
  { tr: "GG Pizza — otlu semsek", en: "GG Pizza — herb pastry" },
  { tr: "GG Pizza — şaşlık", en: "GG Pizza — şaşlık" },
  { tr: "GG Pizza — şaşlık", en: "GG Pizza — şaşlık" },
  { tr: "GG Pizza — zahter", en: "GG Pizza — zahter" },
  { tr: "GG Pizza — burrata granita", en: "GG Pizza — burrata granita" },
  { tr: "GG Pizza — dört peynir", en: "GG Pizza — four cheese" },
  { tr: "GG Pizza — fırın", en: "GG Pizza — oven" },
  { tr: "GG Pizza — otlu semsek", en: "GG Pizza — herb pastry" },
  { tr: "GG Pizza — zahter", en: "GG Pizza — zahter" },
  { tr: "GG Pizza — pizza servisi", en: "GG Pizza — pizza service" },
  { tr: "GG Pizza — şef mutfakta", en: "GG Pizza — chef in kitchen" },
  { tr: "GG Pizza — pizzayı kesmek", en: "GG Pizza — slicing pizza" },
  { tr: "GG Pizza — garnitür", en: "GG Pizza — garnish" },
  { tr: "GG Pizza — hamur", en: "GG Pizza — dough" },
  { tr: "GG Pizza — fırın içi", en: "GG Pizza — inside the oven" },
  { tr: "GG Pizza — malzeme hazırlığı", en: "GG Pizza — prep" },
];

export const HOSPITALITY_GALLERY: HospitalityGalleryItem[] = [
  // Opera Hotel Bosphorus — full 3×8
  {
    id: "opera-1",
    filter: "opera",
    src: opera(1),
    altTr: "Opera Hotel Bosphorus — resepsiyon",
    altEn: "Opera Hotel Bosphorus — reception",
  },
  {
    id: "opera-2",
    filter: "opera",
    src: opera(2),
    altTr: "Opera Hotel Bosphorus — balkon manzarası",
    altEn: "Opera Hotel Bosphorus — balcony view",
  },
  {
    id: "opera-3",
    filter: "opera",
    src: opera(3),
    altTr: "Opera Hotel Bosphorus — asansör detayı",
    altEn: "Opera Hotel Bosphorus — elevator detail",
  },
  {
    id: "opera-4",
    filter: "opera",
    src: opera(4),
    altTr: "Opera Hotel Bosphorus — deniz manzarası",
    altEn: "Opera Hotel Bosphorus — sea view",
  },
  {
    id: "opera-5",
    filter: "opera",
    src: opera(5),
    altTr: "Opera Hotel Bosphorus — oda detayı",
    altEn: "Opera Hotel Bosphorus — room detail",
  },
  {
    id: "opera-6",
    filter: "opera",
    src: opera(6),
    altTr: "Opera Hotel Bosphorus — lifestyle",
    altEn: "Opera Hotel Bosphorus — lifestyle",
  },
  {
    id: "opera-7",
    filter: "opera",
    src: opera(7),
    altTr: "Opera Hotel Bosphorus — kahvaltı",
    altEn: "Opera Hotel Bosphorus — breakfast",
  },
  {
    id: "opera-8",
    filter: "opera",
    src: opera(8),
    altTr: "Opera Hotel Bosphorus — banyo detayı",
    altEn: "Opera Hotel Bosphorus — bathroom detail",
  },
  {
    id: "opera-9",
    filter: "opera",
    src: opera(9),
    altTr: "Opera Hotel Bosphorus — servis",
    altEn: "Opera Hotel Bosphorus — service",
  },
  {
    id: "opera-10",
    filter: "opera",
    src: opera(10),
    altTr: "Opera Hotel Bosphorus — siluet",
    altEn: "Opera Hotel Bosphorus — silhouette",
  },
  {
    id: "opera-11",
    filter: "opera",
    src: opera(11),
    altTr: "Opera Hotel Bosphorus — oda girişi",
    altEn: "Opera Hotel Bosphorus — room entry",
  },
  {
    id: "opera-12",
    filter: "opera",
    src: opera(12),
    altTr: "Opera Hotel Bosphorus — pencere",
    altEn: "Opera Hotel Bosphorus — window",
  },
  {
    id: "opera-13",
    filter: "opera",
    src: opera(13),
    altTr: "Opera Hotel Bosphorus — Türk kahvaltısı",
    altEn: "Opera Hotel Bosphorus — Turkish breakfast",
  },
  {
    id: "opera-14",
    filter: "opera",
    src: opera(14),
    altTr: "Opera Hotel Bosphorus — balkon kahvesi",
    altEn: "Opera Hotel Bosphorus — balcony coffee",
  },
  {
    id: "opera-15",
    filter: "opera",
    src: opera(15),
    altTr: "Opera Hotel Bosphorus — bornoz detayı",
    altEn: "Opera Hotel Bosphorus — robe detail",
  },
  {
    id: "opera-16",
    filter: "opera",
    src: opera(16),
    altTr: "Opera Hotel Bosphorus — restoran",
    altEn: "Opera Hotel Bosphorus — restaurant",
  },
  {
    id: "opera-17",
    filter: "opera",
    src: opera(17),
    altTr: "Opera Hotel Bosphorus — havuz",
    altEn: "Opera Hotel Bosphorus — pool",
  },
  {
    id: "opera-18",
    filter: "opera",
    src: opera(18),
    altTr: "Opera Hotel Bosphorus — yatak odası",
    altEn: "Opera Hotel Bosphorus — bedroom",
  },
  {
    id: "opera-19",
    filter: "opera",
    src: opera(19),
    altTr: "Opera Hotel Bosphorus — Boğaz manzarası",
    altEn: "Opera Hotel Bosphorus — Bosphorus view",
  },
  {
    id: "opera-20",
    filter: "opera",
    src: opera(20),
    altTr: "Opera Hotel Bosphorus — bar",
    altEn: "Opera Hotel Bosphorus — bar",
  },
  {
    id: "opera-21",
    filter: "opera",
    src: opera(21),
    altTr: "Opera Hotel Bosphorus — gastronomi",
    altEn: "Opera Hotel Bosphorus — dining",
  },
  {
    id: "opera-22",
    filter: "opera",
    src: opera(22),
    altTr: "Opera Hotel Bosphorus — oda servisi",
    altEn: "Opera Hotel Bosphorus — room service",
  },
  {
    id: "opera-23",
    filter: "opera",
    src: opera(23),
    altTr: "Opera Hotel Bosphorus — havuz kenarı",
    altEn: "Opera Hotel Bosphorus — poolside",
  },
  {
    id: "opera-24",
    filter: "opera",
    src: opera(24),
    altTr: "Opera Hotel Bosphorus — spa",
    altEn: "Opera Hotel Bosphorus — spa",
  },

  // GG Pizza — Figma 4957:2234 (3 sütun, Opera/Borden ile aynı grid)
  ...GG_PIZZA_ALTS.map((alt, index) => {
    const n = index + 1;
    return {
      id: `gg-${n}`,
      filter: "gg-pizza" as const,
      src: ggPizza(n),
      altTr: alt.tr,
      altEn: alt.en,
    };
  }),

  // Borden — Figma 4958:2311 reading order (3×2)
  {
    id: "borden-1",
    filter: "borden",
    src: borden(1),
    altTr: "Borden — galeri 1",
    altEn: "Borden — gallery 1",
  },
  {
    id: "borden-2",
    filter: "borden",
    src: borden(2),
    altTr: "Borden — galeri 2",
    altEn: "Borden — gallery 2",
  },
  {
    id: "borden-3",
    filter: "borden",
    src: borden(3),
    altTr: "Borden — galeri 3",
    altEn: "Borden — gallery 3",
  },
  {
    id: "borden-4",
    filter: "borden",
    src: borden(4),
    altTr: "Borden — galeri 4",
    altEn: "Borden — gallery 4",
  },
  {
    id: "borden-5",
    filter: "borden",
    src: borden(5),
    altTr: "Borden — galeri 5",
    altEn: "Borden — gallery 5",
  },
  {
    id: "borden-6",
    filter: "borden",
    src: borden(6),
    altTr: "Borden — galeri 6",
    altEn: "Borden — gallery 6",
  },
];
