import { createEmptyState, type HabitsState } from "./types";

const STORAGE_KEY = "kruv-habits-v1";

export function loadState(): HabitsState {
  if (typeof window === "undefined") return createEmptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    const parsed = JSON.parse(raw) as Partial<HabitsState>;
    const empty = createEmptyState();
    return {
      habits: Array.isArray(parsed.habits) ? parsed.habits : empty.habits,
      checks: parsed.checks && typeof parsed.checks === "object" ? parsed.checks : empty.checks,
      prefs: { ...empty.prefs, ...(parsed.prefs ?? {}) },
    };
  } catch {
    return createEmptyState();
  }
}

export function saveState(state: HabitsState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* kota/erişim hatasında sessiz geç — UI state zaten bellekte */
  }
}
