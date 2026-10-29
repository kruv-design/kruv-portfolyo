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

function gg(n: number) {
  return `${HOSP}/gg-${String(n).padStart(2, "0")}`;
}

function borden(n: number) {
  return `${HOSP}/borden-${String(n).padStart(2, "0")}`;
}

/**
 * Figma Hospitaly portfolio — Opera 3×4 main şablon.
 * GG Pizza: 4957:2234 (9 kare, 3×3)
 * Borden: 4958:2302 (6 kare, 3×2)
 */
export const HOSPITALITY_GALLERY: HospitalityGalleryItem[] = [
  // Opera Hotel Bosphorus — full 3×4
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

  // GG Pizza — Figma 4957:2243 reading order (3×3, same cell size as Opera)
  {
    id: "gg-1",
    filter: "gg-pizza",
    src: gg(1),
    altTr: "GG Pizza — galeri 1",
    altEn: "GG Pizza — gallery 1",
  },
  {
    id: "gg-2",
    filter: "gg-pizza",
    src: gg(2),
    altTr: "GG Pizza — galeri 2",
    altEn: "GG Pizza — gallery 2",
  },
  {
    id: "gg-3",
    filter: "gg-pizza",
    src: gg(3),
    altTr: "GG Pizza — galeri 3",
    altEn: "GG Pizza — gallery 3",
  },
  {
    id: "gg-4",
    filter: "gg-pizza",
    src: gg(4),
    altTr: "GG Pizza — galeri 4",
    altEn: "GG Pizza — gallery 4",
  },
  {
    id: "gg-5",
    filter: "gg-pizza",
    src: gg(5),
    altTr: "GG Pizza — galeri 5",
    altEn: "GG Pizza — gallery 5",
  },
  {
    id: "gg-6",
    filter: "gg-pizza",
    src: gg(6),
    altTr: "GG Pizza — galeri 6",
    altEn: "GG Pizza — gallery 6",
  },
  {
    id: "gg-7",
    filter: "gg-pizza",
    src: gg(7),
    altTr: "GG Pizza — galeri 7",
    altEn: "GG Pizza — gallery 7",
  },
  {
    id: "gg-8",
    filter: "gg-pizza",
    src: gg(8),
    altTr: "GG Pizza — galeri 8",
    altEn: "GG Pizza — gallery 8",
  },
  {
    id: "gg-9",
    filter: "gg-pizza",
    src: gg(9),
    altTr: "GG Pizza — galeri 9",
    altEn: "GG Pizza — gallery 9",
  },

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
