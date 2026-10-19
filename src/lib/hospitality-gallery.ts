export type HospitalityFilter = "all" | "hotel" | "menu" | "social";

export type HospitalityGalleryItem = {
  id: string;
  filter: Exclude<HospitalityFilter, "all">;
  src: string;
  altTr: string;
  altEn: string;
};

/** Hospitality galeri — mevcut canlı asset’ler (GG Pizza + seçili proje kapakları). */
export const HOSPITALITY_GALLERY: HospitalityGalleryItem[] = [
  {
    id: "g1",
    filter: "menu",
    src: "/projects/gg-pizza/kapak.png",
    altTr: "GG Pizza menü ve marka",
    altEn: "GG Pizza menu and brand",
  },
  {
    id: "g2",
    filter: "menu",
    src: "/projects/gg-pizza/g01.png",
    altTr: "Menü tasarımı",
    altEn: "Menu design",
  },
  {
    id: "g3",
    filter: "menu",
    src: "/projects/gg-pizza/g02.png",
    altTr: "Menü detay",
    altEn: "Menu detail",
  },
  {
    id: "g4",
    filter: "menu",
    src: "/projects/gg-pizza/g04.png",
    altTr: "Ayaklı menü",
    altEn: "Standing menu",
  },
  {
    id: "g5",
    filter: "social",
    src: "/projects/gg-pizza/g07.png",
    altTr: "Sosyal medya grid",
    altEn: "Social media grid",
  },
  {
    id: "g6",
    filter: "social",
    src: "/projects/gg-pizza/g08.png",
    altTr: "Sosyal medya yönetimi",
    altEn: "Social media management",
  },
  {
    id: "g7",
    filter: "social",
    src: "/projects/gg-pizza/g09.png",
    altTr: "Video içerik",
    altEn: "Video content",
  },
  {
    id: "g8",
    filter: "hotel",
    src: "/projects/gg-pizza/g12.png",
    altTr: "Mekan atmosferi",
    altEn: "Venue atmosphere",
  },
  {
    id: "g9",
    filter: "hotel",
    src: "/projects/gg-pizza/g05.png",
    altTr: "Etkinlik branding",
    altEn: "Event branding",
  },
  {
    id: "g10",
    filter: "hotel",
    src: "/projects/gg-pizza/g06.png",
    altTr: "Etkinlik sunumu",
    altEn: "Event presentation",
  },
  {
    id: "g11",
    filter: "social",
    src: "/projects/gg-pizza/g10.png",
    altTr: "Yemek fotoğrafı",
    altEn: "Food photography",
  },
  {
    id: "g12",
    filter: "social",
    src: "/projects/gg-pizza/g14.png",
    altTr: "Performans sonuçları",
    altEn: "Performance results",
  },
];
