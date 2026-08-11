import type { Checks, Habit } from "./types";
import { addDays, weekDays, weekStart } from "./date";

export function activeHabits(habits: Habit[]): Habit[] {
  return habits
    .filter((h) => !h.archived)
    .sort((a, b) => a.order - b.order);
}

export function checkCount(checks: Checks, dateKey: string, habitId: string): number {
  return checks[dateKey]?.[habitId] ?? 0;
}

export function isHabitDone(habit: Habit, checks: Checks, dateKey: string): boolean {
  return checkCount(checks, dateKey, habit.id) >= habit.target;
}

/** Aktif habitlerin hepsi hedefe ulaştıysa "perfect day". */
export function isPerfectDay(habits: Habit[], checks: Checks, dateKey: string): boolean {
  const active = activeHabits(habits);
  if (active.length === 0) return false;
  return active.every((h) => isHabitDone(h, checks, dateKey));
}

export type DayStatus = "perfect" | "partial" | "miss" | "empty";

export function dayStatus(habits: Habit[], checks: Checks, dateKey: string): DayStatus {
  const active = activeHabits(habits);
  if (active.length === 0) return "empty";
  const done = active.filter((h) => isHabitDone(h, checks, dateKey)).length;
  const any = active.some((h) => checkCount(checks, dateKey, h.id) > 0);
  if (done === active.length) return "perfect";
  if (done > 0 || any) return "partial";
  return "miss";
}

/**
 * Ana zincir: ardışık perfect day sayısı.
 * Bugün henüz tamamlanmadıysa zinciri kırmaz — dünden geriye sayılır.
 */
export function dayStreak(habits: Habit[], checks: Checks, today: string): number {
  let cursor = isPerfectDay(habits, checks, today) ? today : addDays(today, -1);
  let streak = 0;
  while (isPerfectDay(habits, checks, cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function habitStreak(habit: Habit, checks: Checks, today: string): number {
  let cursor = isHabitDone(habit, checks, today) ? today : addDays(today, -1);
  let streak = 0;
  while (isHabitDone(habit, checks, cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
}

/** Bu haftanın (Pzt başlangıç) sessiz achievement seti. */
export function weekAchievements(
  habits: Habit[],
  checks: Checks,
  today: string,
): Achievement[] {
  const days = weekDays(weekStart(today));
  const elapsed = days.filter((d) => d <= today);
  const perfectCount = elapsed.filter((d) => isPerfectDay(habits, checks, d)).length;
  const active = activeHabits(habits);
  const everyDayTouched =
    elapsed.length > 0 &&
    active.length > 0 &&
    elapsed.every((d) => active.some((h) => checkCount(checks, d, h.id) > 0));
  const bestHabitStreak = active.reduce(
    (max, h) => Math.max(max, habitStreak(h, checks, today)),
    0,
  );

  return [
    {
      id: "perfect-week",
      name: "Kusursuz hafta",
      desc: "7 günün 7’si perfect",
      unlocked: perfectCount === 7,
    },
    {
      id: "iron-week",
      name: "Demir hafta",
      desc: "Haftada 5+ perfect gün",
      unlocked: perfectCount >= 5,
    },
    {
      id: "no-break",
      name: "Kopmadın",
      desc: "Bu hafta her gün en az 1 tik",
      unlocked: everyDayTouched,
    },
    {
      id: "triple-chain",
      name: "Üçlü zincir",
      desc: "Ana zincir 3 güne ulaştı",
      unlocked: dayStreak(habits, checks, today) >= 3,
    },
    {
      id: "habit-seven",
      name: "Yedili seri",
      desc: "Bir habit 7 gün üst üste",
      unlocked: bestHabitStreak >= 7,
    },
  ];
}
