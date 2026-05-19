/** İletişim formu — ortak seçenekler ve adım sayısı */

export const CONTACT_TOTAL_STEPS = 3;

export const CONTACT_STEP_TITLES = ["İletişim", "Marka ve öncelik", "Mesajınız"] as const;

export const CONTACT_FOCUS_OPTIONS = [
  { value: "", label: "Seçin…" },
  { value: "kimlik-ambalaj", label: "Marka kimliği, ambalaj veya ürün yüzü" },
  { value: "sosyal-icerik", label: "Sosyal medya ve içerik düzeni" },
  { value: "lansman-tanitim", label: "Lansman, kampanya veya yeniden tanıtım" },
  { value: "web-deneyim", label: "Web sitesi veya dijital deneyim" },
  { value: "strateji-konum", label: "Strateji, konumlandırma veya isimlendirme" },
  { value: "diger", label: "Henüz net değil — birlikte netleştirelim" },
] as const;

export function contactFocusLabel(value: string): string {
  const hit = CONTACT_FOCUS_OPTIONS.find((o) => o.value === value);
  return hit?.label ?? (value || "—");
}
