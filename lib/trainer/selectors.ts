import type { TCourse, TLearner, TLesson, TQuestion, TrainerState } from "./types";

export const isLive = <T extends { status: string }>(x: T) => x.status !== "archived";

export const lessonsOf = (s: TrainerState, courseId: string) =>
  s.lessons.filter((l) => l.courseId === courseId && isLive(l)).sort((a, b) => a.order - b.order);
export const coursesOf = (s: TrainerState, programId: string) =>
  s.courses.filter((c) => c.programId === programId && isLive(c)).sort((a, b) => a.order - b.order);

/** Lessons that count toward learner completion (published, and part of the assigned cohort snapshot). */
const counted = (s: TrainerState, courseId: string) =>
  lessonsOf(s, courseId).filter((l) => l.countsForProgress && l.status !== "draft");

export type CourseProgress = { course: TCourse; status: "complete" | "in-progress" | "upcoming"; done: number; total: number; percent: number };

export function courseProgress(s: TrainerState, l: TLearner): CourseProgress[] {
  const required = s.courses.filter((c) => c.isRequired && isLive(c)).sort((a, b) => a.order - b.order);
  let previousDone = true;
  return required.map((course) => {
    const lessons = counted(s, course.id);
    const done = lessons.filter((x) => l.lessonStatus[x.id] === "complete").length;
    const total = lessons.length;
    const complete = total > 0 && done === total;
    const started = lessons.some((x) => l.lessonStatus[x.id]);
    const status: CourseProgress["status"] = complete ? "complete" : started || (previousDone && done > 0) ? "in-progress" : "upcoming";
    previousDone = complete;
    return { course, status, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  });
}
export const overallPercent = (s: TrainerState, l: TLearner) => {
  const cp = courseProgress(s, l);
  const total = cp.reduce((n, c) => n + c.total, 0);
  return total ? Math.round((cp.reduce((n, c) => n + c.done, 0) / total) * 100) : 0;
};
export const allRequiredDone = (s: TrainerState, l: TLearner) => {
  const cp = courseProgress(s, l);
  return cp.length > 0 && cp.every((c) => c.status === "complete");
};
export const currentCourse = (s: TrainerState, l: TLearner) => courseProgress(s, l).find((c) => c.status === "in-progress");

export type ExamStatus = "not-eligible" | "ready" | "failed" | "remediation-assigned" | "retry-unlocked" | "passed";
export function examStatus(s: TrainerState, l: TLearner): ExamStatus {
  if (l.certification || l.attempts.some((a) => a.passed)) return "passed";
  const last = l.attempts[l.attempts.length - 1];
  if (last && !last.passed) {
    if (!l.remediation) return "failed";
    return l.remediation.retryUnlocked ? "retry-unlocked" : "remediation-assigned";
  }
  return allRequiredDone(s, l) ? "ready" : "not-eligible";
}
export const EXAM_STATUS_LABEL: Record<ExamStatus, string> = {
  "not-eligible": "Not yet eligible",
  ready: "Ready to take the exam",
  failed: "Failed, awaiting remediation",
  "remediation-assigned": "Remediation assigned",
  "retry-unlocked": "Retry unlocked",
  passed: "Passed",
};

export type CertStatus = "certified" | "due" | "expired" | "none";
export function certStatus(l: TLearner, now = Date.now()): CertStatus {
  if (!l.certification) return "none";
  const left = (new Date(l.certification.expiresAt).getTime() - now) / 86_400_000;
  return left < 0 ? "expired" : left <= 90 ? "due" : "certified";
}
export const daysLeft = (iso: string, now = Date.now()) => Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
export const CERT_LABEL: Record<CertStatus, string> = { certified: "Certified", due: "Due for recertification", expired: "Expired", none: "Not certified" };

export const liveLearners = (s: TrainerState) => s.learners.filter((l) => !l.archived);

export function cohortMetrics(s: TrainerState, now = Date.now()) {
  const ls = liveLearners(s);
  const firstCourse = s.courses.filter((c) => c.isRequired && isLive(c)).sort((a, b) => a.order - b.order)[0];
  return {
    total: ls.length,
    active: ls.filter((l) => l.invitation === "accepted" && l.lastActive && now - new Date(l.lastActive).getTime() < 30 * 86_400_000).length,
    started: ls.filter((l) => Object.keys(l.lessonStatus).length > 0).length,
    firstCourse: firstCourse ? ls.filter((l) => courseProgress(s, l).find((c) => c.course.id === firstCourse.id)?.status === "complete").length : 0,
    allRequired: ls.filter((l) => allRequiredDone(s, l)).length,
    awaitingRemediation: ls.filter((l) => ["failed", "remediation-assigned"].includes(examStatus(s, l))).length,
    dueRecert: ls.filter((l) => ["due", "expired"].includes(certStatus(l, now))).length,
  };
}

/** Per-learner overall practice score, as a percent. */
export function quizScore(l: TLearner): number | null {
  const results = Object.values(l.practice);
  const total = results.reduce((n, r) => n + r.total, 0);
  if (!total) return null;
  return Math.round(((total - results.reduce((n, r) => n + r.missed.length, 0)) / total) * 100);
}
export function quizSummary(s: TrainerState) {
  const scored = liveLearners(s).map((l) => ({ l, score: quizScore(l) })).filter((x): x is { l: TLearner; score: number } => x.score !== null);
  if (!scored.length) return null;
  const sorted = [...scored].sort((a, b) => a.score - b.score);
  return {
    average: Math.round(scored.reduce((n, x) => n + x.score, 0) / scored.length),
    lowest: sorted[0], highest: sorted[sorted.length - 1], scored,
  };
}

export interface QuestionStat {
  question: TQuestion; quizId: string; lessonId?: string; taken: number; missed: number; rate: number; learners: TLearner[];
}
export function questionStats(s: TrainerState): QuestionStat[] {
  const out: QuestionStat[] = [];
  for (const quiz of s.quizzes.filter((q) => q.status !== "archived")) {
    for (const q of quiz.questions) {
      const takers = liveLearners(s).filter((l) => l.practice[quiz.id]);
      if (!takers.length) continue;
      const missedBy = takers.filter((l) => l.practice[quiz.id].missed.includes(q.id));
      out.push({ question: q, quizId: quiz.id, lessonId: quiz.lessonId, taken: takers.length, missed: missedBy.length, rate: Math.round((missedBy.length / takers.length) * 100), learners: missedBy });
    }
  }
  return out.sort((a, b) => b.rate - a.rate || b.missed - a.missed);
}

export function draftItems(s: TrainerState) {
  return [
    ...s.lessons.filter((l) => l.status === "draft").map((l) => ({ kind: "Lesson", title: l.title, href: `/trainer/lessons/${l.id}` })),
    ...s.lessons.filter((l) => l.status === "changes-pending").map((l) => ({ kind: "Lesson update", title: l.title, href: `/trainer/lessons/${l.id}` })),
    ...s.quizzes.filter((q) => q.status === "draft").map((q) => ({ kind: "Quiz", title: q.title, href: `/trainer/quizzes/${q.id}` })),
    ...s.courses.filter((c) => c.status === "draft").map((c) => ({ kind: "Course", title: c.title, href: `/trainer/courses/${c.id}` })),
    ...s.exams.filter((e) => e.status === "draft").map((e) => ({ kind: "Exam", title: e.title, href: `/trainer/exams/${e.id}` })),
  ];
}

export function progressCsv(s: TrainerState, now = Date.now()) {
  const rows = [["Name", "Email", "Invitation", "Overall progress %", "Quiz average %", "Exam status", "Exam attempts", "Best exam score", "Certification", "Expires"]];
  for (const l of liveLearners(s)) {
    rows.push([
      l.fullName, l.email, l.invitation, String(overallPercent(s, l)), String(quizScore(l) ?? ""), EXAM_STATUS_LABEL[examStatus(s, l)],
      String(l.attempts.length), String(l.attempts.length ? Math.max(...l.attempts.map((a) => a.score)) : ""), CERT_LABEL[certStatus(l, now)],
      l.certification ? l.certification.expiresAt.slice(0, 10) : "",
    ]);
  }
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}

export const lessonTitle = (s: TrainerState, id?: string) => s.lessons.find((l) => l.id === id)?.title ?? "Unknown lesson";
export type { TLesson };
