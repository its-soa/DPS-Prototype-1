import type { Account, AccessibilitySettings, Locale, UserData } from "./types";

/**
 * Persistence boundary. The prototype ships with a localStorage adapter so the
 * whole journey (including "sign in on another device") works with no backend.
 *
 * To move to Supabase, implement `PersistenceAdapter` against the tables in
 * /supabase/schema.sql (profiles, lesson_progress, exam_attempts, ...) and swap
 * `persistence` below. Nothing else in the app needs to change.
 */
export interface PersistedState {
  version: 1;
  accounts: Account[];
  currentUserId: string | null;
  users: Record<string, UserData>;
  settings: AccessibilitySettings;
  language: Locale;
  device: string;
  usedAccessCodes: string[];
}

export interface PersistenceAdapter {
  load(): PersistedState | null;
  save(state: PersistedState): void;
  clear(): void;
}

const KEY = "mtu-prototype-v1";

export const localStorageAdapter: PersistenceAdapter = {
  load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedState;
      return parsed.version === 1 ? parsed : null;
    } catch {
      return null;
    }
  },
  save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: the prototype keeps working in-memory */
    }
  },
  clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};

export const persistence: PersistenceAdapter = localStorageAdapter;
