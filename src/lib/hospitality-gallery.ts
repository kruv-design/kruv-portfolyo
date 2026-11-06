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
 * Figma Hospitaly portfolio — Opera 3×8 (5837:2303).
 * GG Pizza: 4957:2243 (16 kare, 3 kolon — son satır 1)
 * Borden: 4958:2302 (6 kare, 3×2)
 */
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

  // GG Pizza — Figma 4957:2243 reading order (3 kolon × 16, same cell size as Opera)
  ...Array.from({ length: 16 }, (_, i) => {
    const n = i + 1;
    return {
      id: `gg-${n}`,
      filter: "gg-pizza" as const,
      src: gg(n),
      altTr: `GG Pizza — galeri ${n}`,
      altEn: `GG Pizza — gallery ${n}`,
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
