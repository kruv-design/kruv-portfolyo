/** Gün sınırı her zaman Europe/Istanbul — tarayıcı saat dilimi streak bozmasın. */
const TZ = "Europe/Istanbul";

const keyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

export const TR_DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
] as const;

export const TR_DAYS_SHORT = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"] as const;

export function todayKey(): string {
  return keyFormatter.format(new Date());
}

export function addDays(key: string, n: number): string {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 0 = Pazartesi … 6 = Pazar */
export function weekdayIndex(key: string): number {
  const d = new Date(`${key}T12:00:00Z`);
  return (d.getUTCDay() + 6) % 7;
}

export function weekStart(key: string): string {
  return addDays(key, -weekdayIndex(key));
}

export function weekDays(startKey: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startKey, i));
}

/** "YYYY-MM" */
export function monthOf(key: string): string {
  return key.slice(0, 7);
}

export function daysInMonth(monthKey: string): number {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function addMonths(monthKey: string, n: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
}

/** Pazartesi hizalı ay ızgarası; baştaki boşluklar null. */
export function monthGrid(monthKey: string): (string | null)[] {
  const first = `${monthKey}-01`;
  const lead = weekdayIndex(first);
  const total = daysInMonth(monthKey);
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= total; day++) {
    cells.push(`${monthKey}-${String(day).padStart(2, "0")}`);
  }
  return cells;
}

export function formatMonthTitle(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return `${TR_MONTHS[m - 1]} ${y}`;
}

export function formatDayTitle(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${d} ${TR_MONTHS[m - 1]} · ${TR_DAYS[weekdayIndex(key)]}`;
}

export function formatDayShort(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${d} ${TR_MONTHS[m - 1]}`;
}
