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

/** Opera 3×9 — Figma 5837:2303 reading order (25) */
const OPERA_ALTS: { tr: string; en: string }[] = [
  { tr: "Opera Hotel Bosphorus — resepsiyon", en: "Opera Hotel Bosphorus — reception" },
  { tr: "Opera Hotel Bosphorus — balkon manzarası", en: "Opera Hotel Bosphorus — balcony view" },
  { tr: "Opera Hotel Bosphorus — oda servisi", en: "Opera Hotel Bosphorus — room service" },
  { tr: "Opera Hotel Bosphorus — asansör", en: "Opera Hotel Bosphorus — elevator" },
  { tr: "Opera Hotel Bosphorus — bar", en: "Opera Hotel Bosphorus — bar" },
  { tr: "Opera Hotel Bosphorus — banyo", en: "Opera Hotel Bosphorus — bathtub" },
  { tr: "Opera Hotel Bosphorus — ayna ve manzara", en: "Opera Hotel Bosphorus — mirror and view" },
  { tr: "Opera Hotel Bosphorus — kahvaltı", en: "Opera Hotel Bosphorus — breakfast" },
  { tr: "Opera Hotel Bosphorus — balkon kahvesi", en: "Opera Hotel Bosphorus — balcony coffee" },
  { tr: "Opera Hotel Bosphorus — pencere ve manzara", en: "Opera Hotel Bosphorus — window view" },
  { tr: "Opera Hotel Bosphorus — komodin detayı", en: "Opera Hotel Bosphorus — nightstand" },
  { tr: "Opera Hotel Bosphorus — lifestyle", en: "Opera Hotel Bosphorus — lifestyle" },
  { tr: "Opera Hotel Bosphorus — kahve servisi", en: "Opera Hotel Bosphorus — coffee service" },
  { tr: "Opera Hotel Bosphorus — banyo manzarası", en: "Opera Hotel Bosphorus — bathroom view" },
  { tr: "Opera Hotel Bosphorus — oda girişi", en: "Opera Hotel Bosphorus — room entry" },
  { tr: "Opera Hotel Bosphorus — bornoz", en: "Opera Hotel Bosphorus — bathrobe" },
  { tr: "Opera Hotel Bosphorus — restoran", en: "Opera Hotel Bosphorus — dining" },
  { tr: "Opera Hotel Bosphorus — havuz", en: "Opera Hotel Bosphorus — pool" },
  { tr: "Opera Hotel Bosphorus — yatak odası", en: "Opera Hotel Bosphorus — bedroom" },
  { tr: "Opera Hotel Bosphorus — Boğaz manzarası", en: "Opera Hotel Bosphorus — Bosphorus view" },
  { tr: "Opera Hotel Bosphorus — barmen", en: "Opera Hotel Bosphorus — bartender" },
  { tr: "Opera Hotel Bosphorus — gastronomi", en: "Opera Hotel Bosphorus — gastronomy" },
  { tr: "Opera Hotel Bosphorus — yatak odası servisi", en: "Opera Hotel Bosphorus — in-room dining" },
  { tr: "Opera Hotel Bosphorus — havuz kenarı", en: "Opera Hotel Bosphorus — poolside" },
  { tr: "Opera Hotel Bosphorus — spa", en: "Opera Hotel Bosphorus — spa" },
];

/** GG Pizza 3×6 — Figma 4957:2234 */
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
  ...OPERA_ALTS.map((alt, index) => {
    const n = index + 1;
    return {
      id: `opera-${n}`,
      filter: "opera" as const,
      src: opera(n),
      altTr: alt.tr,
      altEn: alt.en,
    };
  }),

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
