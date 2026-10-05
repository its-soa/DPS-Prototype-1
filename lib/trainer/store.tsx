"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { allRequiredDone, progressCsv } from "./selectors";
import { seedTrainerState } from "./seed";
import type { ExportJob, FileMeta, TLearner, TLesson, TQuestion, TrainerState } from "./types";
import { addMonths } from "../utils";

/**
 * Prototype persistence for the trainer area: seeded mock data + localStorage.
 * Kept separate from the learner store so the two demos cannot break each other.
 * Replace with Supabase calls (see /supabase/trainer.sql) without changing the pages.
 */
const KEY = "mtu-trainer-v1";
const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const nowIso = () => new Date().toISOString();

function move<T>(arr: T[], index: number, dir: -1 | 1) {
  const j = index + dir;
  if (index < 0 || j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[index], copy[j]] = [copy[j], copy[index]];
  return copy;
}
/** Re-number items 1..n in their current order and keep the first item unlocked. */
function renumber<T extends { position: number; locked: boolean }>(items: T[]) {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  sorted.forEach((it, i) => { it.position = i + 1; if (i === 0) it.locked = false; });
  return sorted;
}

export interface TrainerActions {
  createProgram: (i: { title: string; description: string; by: string }) => string;
  updateProgram: (id: string, patch: { title: string; description: string }) => void;
  createCourse: (i: { programId: string; title: string; description: string; isRequired: boolean }) => string;
  updateCourse: (id: string, patch: { title: string; description: string; isRequired: boolean }) => void;
  publishCourse: (id: string) => void;
  archiveCourse: (id: string) => void;
  createLesson: (courseId: string, title: string) => string;
  updateLesson: (id: string, patch: Partial<Pick<TLesson, "title" | "explanation" | "transcript" | "audio" | "pdf">>) => void;
  publishLesson: (id: string) => void;
  moveLesson: (id: string, dir: -1 | 1) => void;
  archiveLesson: (id: string) => void;
  addGlossaryTerm: (term: string, definition: string, lessonId?: string) => string;
  linkGlossary: (lessonId: string, termId: string) => void;
  unlinkGlossary: (lessonId: string, termId: string) => void;
  createQuiz: (i: { programId: string; lessonId?: string; title: string }) => string;
  updateQuiz: (id: string, patch: { title: string; lessonId?: string }) => void;
  saveQuizQuestion: (quizId: string, q: TQuestion) => void;
  removeQuizQuestion: (quizId: string, questionId: string) => void;
  moveQuizQuestion: (quizId: string, questionId: string, dir: -1 | 1) => void;
  publishQuiz: (id: string) => void;
  createExam: (i: { programId: string; title: string }) => string;
  updateExam: (id: string, patch: { title: string; instructions: string; passingScore: number; retryLimit: number }) => void;
  saveExamQuestion: (examId: string, q: TQuestion) => void;
  removeExamQuestion: (examId: string, questionId: string) => void;
  moveExamQuestion: (examId: string, questionId: string, dir: -1 | 1) => void;
  saveExam: (id: string) => void;
  createPath: (i: { programId: string; title: string }) => string;
  updatePathTitle: (id: string, title: string) => void;
  addPathItem: (pathId: string, type: "course" | "exam", refId: string) => void;
  removePathItem: (pathId: string, itemId: string) => void;
  movePathItem: (pathId: string, itemId: string, dir: -1 | 1) => void;
  setPathPosition: (pathId: string, itemId: string, position: number) => void;
  setPathLock: (pathId: string, itemId: string, locked: boolean) => void;
  savePath: (id: string) => void;
  addLearner: (i: { fullName: string; email: string }) => string;
  assignPath: (learnerId: string, pathId: string) => void;
  sendInvitation: (learnerId: string) => void;
  archiveLearner: (learnerId: string) => void;
  sendNote: (learnerId: string, text: string, by: string) => void;
  assignRemediation: (learnerId: string, lessonIds: string[], note: string) => void;
  unlockRetry: (learnerId: string) => void;
  simulateRetryPass: (learnerId: string) => void;
  sendRecertReminders: (learnerIds: string[]) => void;
  createExport: (type: string, by: string) => ExportJob;
  reset: () => void;
}

interface Ctx { ready: boolean; state: TrainerState; actions: TrainerActions }
const TrainerCtx = createContext<Ctx | null>(null);

export function TrainerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TrainerState>(() => seedTrainerState());
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as TrainerState;
        if (saved.version === 1) setState(saved);
      }
    } catch { /* fall back to seed */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* in-memory only */ }
  }, [state, ready]);

  const mutate = useCallback((fn: (d: TrainerState) => void) => {
    setState((s) => { const d = structuredClone(s); fn(d); return d; });
  }, []);

  const actions = useMemo<TrainerActions>(() => {
    const lesson = (d: TrainerState, id: string) => d.lessons.find((l) => l.id === id);
    const learner = (d: TrainerState, id: string): TLearner | undefined => d.learners.find((l) => l.id === id);
    const touch = (l: TLesson) => {
      l.updatedAt = nowIso();
      if (l.status === "published") l.status = "changes-pending";
    };
    return {
      createProgram({ title, description, by }) {
        const id = uid("prog");
        mutate((d) => { d.programs.push({ id, title, description, status: "draft", createdBy: by, createdAt: nowIso() }); });
        return id;
      },
      updateProgram(id, patch) { mutate((d) => { const p = d.programs.find((x) => x.id === id); if (p) Object.assign(p, patch); }); },
      createCourse({ programId, title, description, isRequired }) {
        const id = uid("course");
        mutate((d) => {
          const order = d.courses.filter((c) => c.programId === programId).length + 1;
          d.courses.push({ id, programId, title, description, isRequired, status: "draft", order });
        });
        return id;
      },
      updateCourse(id, patch) { mutate((d) => { const c = d.courses.find((x) => x.id === id); if (c) { Object.assign(c, patch); if (c.status === "published") c.status = "changes-pending"; } }); },
      publishCourse(id) { mutate((d) => { const c = d.courses.find((x) => x.id === id); if (c) c.status = "published"; }); },
      archiveCourse(id) { mutate((d) => { const c = d.courses.find((x) => x.id === id); if (c) c.status = "archived"; }); },

      createLesson(courseId, title) {
        const id = uid("lesson");
        mutate((d) => {
          const order = d.lessons.filter((l) => l.courseId === courseId).length + 1;
          d.lessons.push({ id, courseId, order, kind: "audio", title, explanation: "", transcript: "", glossaryIds: [], status: "draft", updatedAt: nowIso(), countsForProgress: false });
        });
        return id;
      },
      updateLesson(id, patch) { mutate((d) => { const l = lesson(d, id); if (l) { Object.assign(l, patch); touch(l); } }); },
      publishLesson(id) { mutate((d) => { const l = lesson(d, id); if (l) { l.status = "published"; l.publishedAt = nowIso(); l.updatedAt = nowIso(); } }); },
      moveLesson(id, dir) {
        mutate((d) => {
          const l = lesson(d, id); if (!l) return;
          const siblings = d.lessons.filter((x) => x.courseId === l.courseId && x.status !== "archived").sort((a, b) => a.order - b.order);
          const moved = move(siblings, siblings.findIndex((x) => x.id === id), dir);
          moved.forEach((x, i) => { x.order = i + 1; });
        });
      },
      archiveLesson(id) { mutate((d) => { const l = lesson(d, id); if (l) l.status = "archived"; }); },

      addGlossaryTerm(term, definition, lessonId) {
        const id = uid("g");
        mutate((d) => { d.glossary.push({ id, term, definition }); if (lessonId) { const l = lesson(d, lessonId); if (l) { l.glossaryIds.push(id); touch(l); } } });
        return id;
      },
      linkGlossary(lessonId, termId) { mutate((d) => { const l = lesson(d, lessonId); if (l && !l.glossaryIds.includes(termId)) { l.glossaryIds.push(termId); touch(l); } }); },
      unlinkGlossary(lessonId, termId) { mutate((d) => { const l = lesson(d, lessonId); if (l) { l.glossaryIds = l.glossaryIds.filter((g) => g !== termId); touch(l); } }); },

      createQuiz({ programId, lessonId, title }) {
        const id = uid("quiz");
        mutate((d) => { d.quizzes.push({ id, programId, lessonId, title, questions: [], status: "draft" }); });
        return id;
      },
      updateQuiz(id, patch) { mutate((d) => { const q = d.quizzes.find((x) => x.id === id); if (q) Object.assign(q, patch); }); },
      saveQuizQuestion(quizId, q) {
        mutate((d) => {
          const quiz = d.quizzes.find((x) => x.id === quizId); if (!quiz) return;
          const i = quiz.questions.findIndex((x) => x.id === q.id);
          if (i >= 0) quiz.questions[i] = q; else quiz.questions.push(q);
        });
      },
      removeQuizQuestion(quizId, qid) { mutate((d) => { const q = d.quizzes.find((x) => x.id === quizId); if (q) q.questions = q.questions.filter((x) => x.id !== qid); }); },
      moveQuizQuestion(quizId, qid, dir) { mutate((d) => { const q = d.quizzes.find((x) => x.id === quizId); if (q) q.questions = move(q.questions, q.questions.findIndex((x) => x.id === qid), dir); }); },
      publishQuiz(id) { mutate((d) => { const q = d.quizzes.find((x) => x.id === id); if (q) q.status = "published"; }); },

      createExam({ programId, title }) {
        const id = uid("exam");
        mutate((d) => { d.exams.push({ id, programId, title, instructions: "", passingScore: 70, retryLimit: 3, questions: [], status: "draft" }); });
        return id;
      },
      updateExam(id, patch) { mutate((d) => { const e = d.exams.find((x) => x.id === id); if (e) Object.assign(e, patch); }); },
      saveExamQuestion(examId, q) {
        mutate((d) => {
          const e = d.exams.find((x) => x.id === examId); if (!e) return;
          const i = e.questions.findIndex((x) => x.id === q.id);
          if (i >= 0) e.questions[i] = q; else e.questions.push(q);
        });
      },
      removeExamQuestion(examId, qid) { mutate((d) => { const e = d.exams.find((x) => x.id === examId); if (e) e.questions = e.questions.filter((x) => x.id !== qid); }); },
      moveExamQuestion(examId, qid, dir) { mutate((d) => { const e = d.exams.find((x) => x.id === examId); if (e) e.questions = move(e.questions, e.questions.findIndex((x) => x.id === qid), dir); }); },
      saveExam(id) { mutate((d) => { const e = d.exams.find((x) => x.id === id); if (e) e.status = "active"; }); },

      createPath({ programId, title }) {
        const id = uid("path");
        mutate((d) => { d.paths.push({ id, programId, title, items: [], status: "draft" }); });
        return id;
      },
      updatePathTitle(id, title) { mutate((d) => { const p = d.paths.find((x) => x.id === id); if (p) { p.title = title; if (p.status === "saved") p.status = "draft"; } }); },
      addPathItem(pathId, type, refId) {
        mutate((d) => {
          const p = d.paths.find((x) => x.id === pathId); if (!p) return;
          p.items.push({ id: uid("pi"), type, refId, position: p.items.length + 1, locked: p.items.length > 0 });
          p.items = renumber(p.items); p.status = "draft";
        });
      },
      removePathItem(pathId, itemId) { mutate((d) => { const p = d.paths.find((x) => x.id === pathId); if (p) { p.items = renumber(p.items.filter((i) => i.id !== itemId)); p.status = "draft"; } }); },
      movePathItem(pathId, itemId, dir) {
        mutate((d) => {
          const p = d.paths.find((x) => x.id === pathId); if (!p) return;
          const sorted = [...p.items].sort((a, b) => a.position - b.position);
          const moved = move(sorted, sorted.findIndex((i) => i.id === itemId), dir);
          moved.forEach((it, i) => { it.position = i + 1; });
          p.items = renumber(moved); p.status = "draft";
        });
      },
      setPathPosition(pathId, itemId, position) {
        mutate((d) => {
          const p = d.paths.find((x) => x.id === pathId); if (!p) return;
          const sorted = [...p.items].sort((a, b) => a.position - b.position);
          const from = sorted.findIndex((i) => i.id === itemId);
          const to = Math.min(Math.max(Math.round(position), 1), sorted.length) - 1;
          const [item] = sorted.splice(from, 1);
          sorted.splice(to, 0, item);
          sorted.forEach((it, i) => { it.position = i + 1; });
          p.items = renumber(sorted); p.status = "draft";
        });
      },
      setPathLock(pathId, itemId, locked) { mutate((d) => { const p = d.paths.find((x) => x.id === pathId); const it = p?.items.find((i) => i.id === itemId); if (p && it) { it.locked = locked; p.status = "draft"; } }); },
      savePath(id) { mutate((d) => { const p = d.paths.find((x) => x.id === id); if (p) p.status = "saved"; }); },

      addLearner({ fullName, email }) {
        const id = uid("lrn");
        mutate((d) => { d.learners.push({ id, fullName, email: email.toLowerCase(), invitation: "not-sent", lessonStatus: {}, practice: {}, attempts: [], notes: [], reminders: [] }); });
        return id;
      },
      assignPath(learnerId, pathId) { mutate((d) => { const l = learner(d, learnerId); if (l) { l.pathId = pathId; l.assignedAt = nowIso(); } }); },
      sendInvitation(learnerId) { mutate((d) => { const l = learner(d, learnerId); if (l) { l.invitation = "sent"; l.invitedAt = nowIso(); } }); },
      archiveLearner(learnerId) { mutate((d) => { const l = learner(d, learnerId); if (l) l.archived = true; }); },
      sendNote(learnerId, text, by) { mutate((d) => { learner(d, learnerId)?.notes.unshift({ at: nowIso(), by, text }); }); },

      assignRemediation(learnerId, lessonIds, note) {
        mutate((d) => { const l = learner(d, learnerId); if (l) l.remediation = { lessonIds, note, assignedAt: nowIso(), retryUnlocked: false }; });
      },
      unlockRetry(learnerId) {
        mutate((d) => { const l = learner(d, learnerId); if (l?.remediation) { l.remediation.retryUnlocked = true; l.remediation.retryUnlockedAt = nowIso(); } });
      },
      simulateRetryPass(learnerId) {
        // PROTOTYPE HELPER: stands in for the learner submitting their retry.
        mutate((d) => {
          const l = learner(d, learnerId); const exam = d.exams.find((e) => e.status === "active");
          if (!l || !exam) return;
          const at = nowIso();
          const total = exam.questions.length;
          const score = Math.max(Math.ceil(total * 0.9), Math.ceil((total * exam.passingScore) / 100));
          l.attempts.push({ n: l.attempts.length + 1, score, total, passed: true, submittedAt: at, answers: Object.fromEntries(exam.questions.map((q, i) => [q.id, i < score ? q.correct : (q.correct + 1) % 3])) });
          l.certification = { issuedAt: at, expiresAt: addMonths(at, 24) };
          l.lastActive = at;
        });
      },
      sendRecertReminders(ids) {
        mutate((d) => { const at = nowIso(); ids.forEach((id) => learner(d, id)?.reminders.push(at)); });
      },
      createExport(type, by) {
        const job: ExportJob = { id: uid("exp"), type, requestedBy: by, requestedAt: nowIso(), rows: 0, csv: "" };
        const s = stateRef.current;
        job.csv = progressCsv(s);
        job.rows = job.csv.split("\n").length - 1;
        mutate((d) => { d.exports.unshift(job); });
        return job;
      },
      reset() { try { window.localStorage.removeItem(KEY); } catch { /* ignore */ } setState(seedTrainerState()); },
    };
  }, [mutate]);

  const value = useMemo(() => ({ ready, state, actions }), [ready, state, actions]);
  return <TrainerCtx.Provider value={value}>{children}</TrainerCtx.Provider>;
}

export function useTrainer() {
  const v = useContext(TrainerCtx);
  if (!v) throw new Error("useTrainer must be used inside TrainerProvider");
  return v;
}
export type { FileMeta };
export { allRequiredDone };
