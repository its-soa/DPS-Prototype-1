"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEMO_ACCOUNTS, DEVICES, EXAM_QUESTIONS, ACCESS_CODES } from "./mock-data";
import { emptyUserData } from "./progress";
import { persistence, type PersistedState } from "./persistence";
import { INTL_LOCALE, translate, type TKey, type TVars } from "./i18n";
import { addMonths, formatDate } from "./utils";
import type {
  AccessibilitySettings,
  Account,
  Locale,
  PracticeAnswer,
  UserData,
} from "./types";

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: "standard",
  contrast: "standard",
  theme: "light",
  reduceMotion: false,
  audioGuidance: false,
  defaultSpeed: 1,
};

/** Returning learner: course 1 done, course 2 in progress, saved position from another device. */
function seedReturningLearner(): UserData {
  const now = Date.now();
  const iso = (daysAgo: number) => new Date(now - daysAgo * 86_400_000).toISOString();
  const done = (daysAgo: number, position = 0) => ({
    position,
    completed: true,
    updatedAt: iso(daysAgo),
    device: DEVICES.clinic,
  });
  return {
    ...emptyUserData(),
    onboardingComplete: true,
    lessons: {
      "l1-1": done(14, 360),
      "l1-2": done(12, 420),
      "l1-3": done(10, 480),
      "l2-1": done(4, 540),
      "l2-2": { position: 312, completed: false, updatedAt: iso(2), device: DEVICES.clinic },
    },
    practiceDone: { "l1-1": true, "l1-2": true, "l1-3": true, "l2-1": true },
    lastActive: iso(2),
  };
}

function initialState(): PersistedState {
  return {
    version: 1,
    accounts: DEMO_ACCOUNTS,
    currentUserId: null,
    users: {},
    settings: DEFAULT_SETTINGS,
    language: "en",
    device: DEVICES.home,
    usedAccessCodes: [],
  };
}

export type SignInResult =
  | { ok: true; firstLogin: boolean }
  | { ok: false; error: TKey };

interface Store {
  hydrated: boolean;
  state: PersistedState;
  account: Account | null;
  data: UserData | null;
  t: (key: TKey, vars?: TVars) => string;
  locale: Locale;
  /** Date in the learner's language, e.g. "29. September 2026". */
  fmtDate: (iso: string | null | undefined) => string;
  /** 312 -> "5 minutes 12 seconds" / "5 Minuten 12 Sekunden", for screen readers. */
  spoken: (seconds: number) => string;
  // auth
  validateAccessCode: (code: string) => "valid" | "expired" | "used" | "unknown";
  register: (input: { fullName: string; email: string; password: string; code: string }) => void;
  emailExists: (email: string) => boolean;
  signIn: (email: string, password: string, device: string) => Promise<SignInResult>;
  signOut: () => void;
  // settings
  setSettings: (patch: Partial<AccessibilitySettings>) => void;
  setLanguage: (l: Locale) => void;
  // learner data
  completeOnboarding: () => void;
  saveLesson: (lessonId: string, position: number, completed?: boolean) => void;
  answerPractice: (questionId: string, selected: string, correct: boolean) => PracticeAnswer;
  finishPractice: (lessonId: string) => void;
  startExam: () => void;
  saveExamAnswer: (questionId: string, choiceId: string) => void;
  submitExam: () => { passed: boolean; score: number; total: number };
  setRecapDone: () => void;
  answerRemediation: (questionId: string, selected: string, correct: boolean) => void;
  finishRemediationPractice: () => void;
  // prototype tools
  unlockAllCourses: () => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const saved = persistence.load();
    if (saved) setState({ ...initialState(), ...saved, settings: { ...DEFAULT_SETTINGS, ...saved.settings } });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistence.save(state);
  }, [state, hydrated]);

  // Apply accessibility settings to <html>
  useEffect(() => {
    const el = document.documentElement;
    const s = state.settings;
    el.dataset.textSize = s.textSize;
    el.dataset.contrast = s.contrast;
    el.dataset.theme = s.theme;
    el.dataset.reduceMotion = String(s.reduceMotion);
    el.lang = state.language;
  }, [state.settings, state.language]);

  const account = state.accounts.find((a) => a.id === state.currentUserId) ?? null;
  const data = account ? state.users[account.id] ?? null : null;

  const patchUser = useCallback((fn: (d: UserData) => UserData) => {
    setState((s) => {
      if (!s.currentUserId) return s;
      const current = s.users[s.currentUserId] ?? emptyUserData();
      const next = fn(current);
      return { ...s, users: { ...s.users, [s.currentUserId]: { ...next, lastActive: new Date().toISOString() } } };
    });
  }, []);

  const store = useMemo<Store>(() => {
    const t = (key: TKey, vars?: TVars) => translate(state.language, key, vars);
    const spoken = (total: number) => {
      const sec = Math.max(0, Math.floor(total));
      const m = Math.floor(sec / 60);
      const r = sec % 60;
      const parts: string[] = [];
      if (m) parts.push(t("time.minutes", { count: m }));
      if (r || !m) parts.push(t("time.seconds", { count: r }));
      return parts.join(" ");
    };

    return {
      hydrated,
      state,
      account,
      data,
      t,
      locale: state.language,
      fmtDate: (iso) => formatDate(iso, INTL_LOCALE[state.language]),
      spoken,

      validateAccessCode(code) {
        const normalised = code.trim().toUpperCase();
        const row = ACCESS_CODES.find((c) => c.code === normalised);
        if (!row) return "unknown";
        if (row.status === "expired") return "expired";
        if (stateRef.current.usedAccessCodes.includes(normalised)) return "used";
        return "valid";
      },
      emailExists: (email) =>
        stateRef.current.accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase()),
      register({ fullName, email, password, code }) {
        setState((s) => ({
          ...s,
          usedAccessCodes: [...s.usedAccessCodes, code.trim().toUpperCase()],
          accounts: [
            ...s.accounts,
            {
              id: `user-${Date.now()}`,
              fullName: fullName.trim(),
              email: email.trim().toLowerCase(),
              password,
              role: "learner",
              preferredLanguage: s.language,
            },
          ],
        }));
      },
      async signIn(email, password, device) {
        await new Promise((r) => setTimeout(r, 900)); // mock network latency
        const found = stateRef.current.accounts.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
        );
        if (!found) {
          return { ok: false, error: "signin.error.invalid" };
        }
        const userData =
          stateRef.current.users[found.id] ??
          (found.id === "user-returning" ? seedReturningLearner() : emptyUserData());
        const firstLogin = !userData.onboardingComplete;
        setState((s) => ({
          ...s,
          currentUserId: found.id,
          device,
          users: {
            ...s.users,
            [found.id]: s.users[found.id] ?? userData,
          },
        }));
        return { ok: true, firstLogin };
      },
      signOut() {
        setState((s) => ({ ...s, currentUserId: null }));
      },

      setSettings: (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      setLanguage: (language) => setState((s) => ({ ...s, language })),

      completeOnboarding: () => patchUser((d) => ({ ...d, onboardingComplete: true })),

      saveLesson(lessonId, position, completed) {
        patchUser((d) => {
          const prev = d.lessons[lessonId];
          return {
            ...d,
            lessons: {
              ...d.lessons,
              [lessonId]: {
                position,
                completed: completed ?? prev?.completed ?? false,
                updatedAt: new Date().toISOString(),
                device: stateRef.current.device,
              },
            },
          };
        });
      },

      answerPractice(questionId, selected, correct) {
        const prev = stateRef.current.users[stateRef.current.currentUserId ?? ""]?.practiceAnswers[questionId];
        const next: PracticeAnswer = { selected, correct, attempts: (prev?.attempts ?? 0) + 1 };
        patchUser((d) => ({ ...d, practiceAnswers: { ...d.practiceAnswers, [questionId]: next } }));
        return next;
      },
      finishPractice: (lessonId) =>
        patchUser((d) => ({ ...d, practiceDone: { ...d.practiceDone, [lessonId]: true } })),

      startExam() {
        patchUser((d) => ({
          ...d,
          examDraft: d.examDraft ?? {
            attemptNumber: d.examAttempts.length + 1,
            answers: {},
            startedAt: new Date().toISOString(),
          },
        }));
      },
      saveExamAnswer(questionId, choiceId) {
        patchUser((d) =>
          d.examDraft
            ? { ...d, examDraft: { ...d.examDraft, answers: { ...d.examDraft.answers, [questionId]: choiceId } } }
            : d,
        );
      },
      submitExam() {
        const s = stateRef.current;
        const d = s.users[s.currentUserId ?? ""] ?? emptyUserData();
        const draft = d.examDraft;
        const answers = draft?.answers ?? {};
        const total = EXAM_QUESTIONS.length;
        const actual = EXAM_QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
        const attemptNumber = d.examAttempts.length + 1;
        // PROTOTYPE RULE: attempt 1 always fails, attempt 2+ always passes,
        // so partners can see both journeys whatever they answer.
        const score = attemptNumber === 1 ? Math.min(actual, 5) : Math.max(actual, 9);
        const passed = score / total >= 0.7;
        const submittedAt = new Date().toISOString();
        patchUser((cur) => ({
          ...cur,
          examDraft: null,
          examAttempts: [...cur.examAttempts, { attemptNumber, score, total, passed, submittedAt, answers }],
          remediation: passed ? cur.remediation : { recapDone: false, practiceDone: false, answers: {} },
          certification: passed
            ? { issuedAt: submittedAt, expiresAt: addMonths(submittedAt, 24) }
            : cur.certification,
        }));
        return { passed, score, total };
      },

      setRecapDone: () => patchUser((d) => ({ ...d, remediation: { ...d.remediation, recapDone: true } })),
      answerRemediation(questionId, selected, correct) {
        patchUser((d) => {
          const prev = d.remediation.answers[questionId];
          return {
            ...d,
            remediation: {
              ...d.remediation,
              answers: { ...d.remediation.answers, [questionId]: { selected, correct, attempts: (prev?.attempts ?? 0) + 1 } },
            },
          };
        });
      },
      finishRemediationPractice: () =>
        patchUser((d) => ({ ...d, remediation: { ...d.remediation, practiceDone: true } })),

      unlockAllCourses() {
        patchUser((d) => {
          const lessons = { ...d.lessons };
          const practiceDone = { ...d.practiceDone };
          const now = new Date().toISOString();
          for (const id of ["l1-1","l1-2","l1-3","l2-1","l2-2","l2-3","l3-1","l3-2","l3-3"]) {
            lessons[id] = { position: lessons[id]?.position ?? 0, completed: true, updatedAt: now, device: stateRef.current.device };
            practiceDone[id] = true;
          }
          return { ...d, onboardingComplete: true, lessons, practiceDone };
        });
      },
      resetDemo() {
        persistence.clear();
        setState(initialState());
      },
    };
  }, [state, hydrated, account, data, patchUser]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

/** For learner pages: the guard in the learner layout guarantees data exists. */
export function useLearner() {
  const app = useApp();
  return { ...app, account: app.account!, data: app.data! };
}
