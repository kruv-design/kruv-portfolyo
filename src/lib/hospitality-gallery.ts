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

function img(n: number) {
  return `${HOSP}/gallery-${String(n).padStart(2, "0")}`;
}

/**
 * Figma Hospitaly portfolio (4930:1395) — brand filtreleri + galeri sırası.
 * Opera = 12’li grid; GG Pizza / Borden = Figma alternatif state alt kümeleri.
 */
export const HOSPITALITY_GALLERY: HospitalityGalleryItem[] = [
  // Opera Hotel Bosphorus — full 3×4 (Rectangle 190–201)
  {
    id: "opera-1",
    filter: "opera",
    src: img(1),
    altTr: "Opera Hotel Bosphorus — resepsiyon",
    altEn: "Opera Hotel Bosphorus — reception",
  },
  {
    id: "opera-2",
    filter: "opera",
    src: img(2),
    altTr: "Opera Hotel Bosphorus — balkon manzarası",
    altEn: "Opera Hotel Bosphorus — balcony view",
  },
  {
    id: "opera-3",
    filter: "opera",
    src: img(3),
    altTr: "Opera Hotel Bosphorus — asansör detayı",
    altEn: "Opera Hotel Bosphorus — elevator detail",
  },
  {
    id: "opera-4",
    filter: "opera",
    src: img(4),
    altTr: "Opera Hotel Bosphorus — deniz manzarası",
    altEn: "Opera Hotel Bosphorus — sea view",
  },
  {
    id: "opera-5",
    filter: "opera",
    src: img(5),
    altTr: "Opera Hotel Bosphorus — oda detayı",
    altEn: "Opera Hotel Bosphorus — room detail",
  },
  {
    id: "opera-6",
    filter: "opera",
    src: img(6),
    altTr: "Opera Hotel Bosphorus — lifestyle",
    altEn: "Opera Hotel Bosphorus — lifestyle",
  },
  {
    id: "opera-7",
    filter: "opera",
    src: img(7),
    altTr: "Opera Hotel Bosphorus — kahvaltı",
    altEn: "Opera Hotel Bosphorus — breakfast",
  },
  {
    id: "opera-8",
    filter: "opera",
    src: img(8),
    altTr: "Opera Hotel Bosphorus — banyo detayı",
    altEn: "Opera Hotel Bosphorus — bathroom detail",
  },
  {
    id: "opera-9",
    filter: "opera",
    src: img(9),
    altTr: "Opera Hotel Bosphorus — servis",
    altEn: "Opera Hotel Bosphorus — service",
  },
  {
    id: "opera-10",
    filter: "opera",
    src: img(10),
    altTr: "Opera Hotel Bosphorus — siluet",
    altEn: "Opera Hotel Bosphorus — silhouette",
  },
  {
    id: "opera-11",
    filter: "opera",
    src: img(11),
    altTr: "Opera Hotel Bosphorus — oda girişi",
    altEn: "Opera Hotel Bosphorus — room entry",
  },
  {
    id: "opera-12",
    filter: "opera",
    src: img(12),
    altTr: "Opera Hotel Bosphorus — pencere",
    altEn: "Opera Hotel Bosphorus — window",
  },

  // GG Pizza filter state (4957:2243) — 190,192,193,195,191,194,196,197,198
  {
    id: "gg-1",
    filter: "gg-pizza",
    src: img(1),
    altTr: "GG Pizza — hospitality görsel 1",
    altEn: "GG Pizza — hospitality visual 1",
  },
  {
    id: "gg-2",
    filter: "gg-pizza",
    src: img(3),
    altTr: "GG Pizza — hospitality görsel 2",
    altEn: "GG Pizza — hospitality visual 2",
  },
  {
    id: "gg-3",
    filter: "gg-pizza",
    src: img(4),
    altTr: "GG Pizza — hospitality görsel 3",
    altEn: "GG Pizza — hospitality visual 3",
  },
  {
    id: "gg-4",
    filter: "gg-pizza",
    src: img(5),
    altTr: "GG Pizza — hospitality görsel 4",
    altEn: "GG Pizza — hospitality visual 4",
  },
  {
    id: "gg-5",
    filter: "gg-pizza",
    src: img(2),
    altTr: "GG Pizza — hospitality görsel 5",
    altEn: "GG Pizza — hospitality visual 5",
  },
  {
    id: "gg-6",
    filter: "gg-pizza",
    src: img(6),
    altTr: "GG Pizza — hospitality görsel 6",
    altEn: "GG Pizza — hospitality visual 6",
  },
  {
    id: "gg-7",
    filter: "gg-pizza",
    src: img(8),
    altTr: "GG Pizza — hospitality görsel 7",
    altEn: "GG Pizza — hospitality visual 7",
  },
  {
    id: "gg-8",
    filter: "gg-pizza",
    src: img(7),
    altTr: "GG Pizza — hospitality görsel 8",
    altEn: "GG Pizza — hospitality visual 8",
  },
  {
    id: "gg-9",
    filter: "gg-pizza",
    src: img(9),
    altTr: "GG Pizza — hospitality görsel 9",
    altEn: "GG Pizza — hospitality visual 9",
  },

  // Borden filter state (4958:2311) — 192,191,194,190,195,193
  {
    id: "borden-1",
    filter: "borden",
    src: img(3),
    altTr: "Borden — hospitality görsel 1",
    altEn: "Borden — hospitality visual 1",
  },
  {
    id: "borden-2",
    filter: "borden",
    src: img(2),
    altTr: "Borden — hospitality görsel 2",
    altEn: "Borden — hospitality visual 2",
  },
  {
    id: "borden-3",
    filter: "borden",
    src: img(6),
    altTr: "Borden — hospitality görsel 3",
    altEn: "Borden — hospitality visual 3",
  },
  {
    id: "borden-4",
    filter: "borden",
    src: img(1),
    altTr: "Borden — hospitality görsel 4",
    altEn: "Borden — hospitality visual 4",
  },
  {
    id: "borden-5",
    filter: "borden",
    src: img(5),
    altTr: "Borden — hospitality görsel 5",
    altEn: "Borden — hospitality visual 5",
  },
  {
    id: "borden-6",
    filter: "borden",
    src: img(4),
    altTr: "Borden — hospitality görsel 6",
    altEn: "Borden — hospitality visual 6",
  },
];
