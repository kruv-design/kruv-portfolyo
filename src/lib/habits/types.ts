export type HabitKind = "boolean" | "count";

export interface Habit {
  id: string;
  name: string;
  kind: HabitKind;
  /** Günlük hedef (boolean için 1). */
  target: number;
  /** Görüntüleme birimi: "kez", "lt", "dk" vb. */
  unit?: string;
  color: string;
  archived: boolean;
  order: number;
  createdAt: string;
}

/** habitId -> o günkü sayım */
export type DayChecks = Record<string, number>;
/** dateKey (YYYY-MM-DD) -> gün kayıtları */
export type Checks = Record<string, DayChecks>;

export type TrackView = "list" | "grid";
export type TabId = "track" | "calendar" | "habits" | "awards";

export interface HabitsPrefs {
  view: TrackView;
  celebratedMilestones: number[];
}

export interface HabitsState {
  habits: Habit[];
  checks: Checks;
  prefs: HabitsPrefs;
}

/** Kromatik habit renkleri (nötr yok — token guard). */
export const HABIT_COLORS = [
  "#6366F1",
  "#38BDF8",
  "#10B981",
  "#F59E0B",
  "#F472B6",
  "#A78BFA",
  "#FB923C",
  "#F87171",
] as const;

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const;

export function createEmptyState(): HabitsState {
  return {
    habits: [],
    checks: {},
    prefs: { view: "list", celebratedMilestones: [] },
  };
}
