import { COURSES, LESSONS, lessonsForCourse, practiceForLesson } from "./mock-data";
import type { Course, Lesson, UserData } from "./types";

export type LessonStatus = "locked" | "not-started" | "in-progress" | "practice-pending" | "complete";
export type CourseStatus = "locked" | "upcoming" | "in-progress" | "complete";

export function emptyUserData(): UserData {
  return {
    onboardingComplete: false,
    lessons: {},
    practiceDone: {},
    practiceAnswers: {},
    examAttempts: [],
    examDraft: null,
    remediation: { recapDone: false, practiceDone: false, answers: {} },
    certification: null,
    lastActive: null,
  };
}

export function isLessonFullyComplete(d: UserData, lessonId: string) {
  return !!d.lessons[lessonId]?.completed && !!d.practiceDone[lessonId];
}

export function lessonStatus(d: UserData, lesson: Lesson): LessonStatus {
  const siblings = lessonsForCourse(lesson.courseId);
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const prevOk = idx === 0 || isLessonFullyComplete(d, siblings[idx - 1].id);
  if (isLessonFullyComplete(d, lesson.id)) return "complete";
  const p = d.lessons[lesson.id];
  if (p?.completed) return "practice-pending";
  if (!prevOk) return "locked";
  if (p && p.position > 0) return "in-progress";
  return "not-started";
}

export function courseLessonsDone(d: UserData, courseId: string) {
  return lessonsForCourse(courseId).filter((l) => isLessonFullyComplete(d, l.id)).length;
}

export function courseProgressPercent(d: UserData, courseId: string) {
  const list = lessonsForCourse(courseId);
  return Math.round((courseLessonsDone(d, courseId) / list.length) * 100);
}

export function isCourseComplete(d: UserData, courseId: string) {
  return courseLessonsDone(d, courseId) === lessonsForCourse(courseId).length;
}

export function courseStatus(d: UserData, course: Course): CourseStatus {
  if (isCourseComplete(d, course.id)) return "complete";
  const prev = COURSES.find((c) => c.order === course.order - 1);
  if (prev && !isCourseComplete(d, prev.id)) return "locked";
  const started = lessonsForCourse(course.id).some((l) => d.lessons[l.id] || d.practiceDone[l.id]);
  return started ? "in-progress" : "upcoming";
}

export function overallPercent(d: UserData) {
  const done = LESSONS.filter((l) => isLessonFullyComplete(d, l.id)).length;
  return Math.round((done / LESSONS.length) * 100);
}

export function allCoursesComplete(d: UserData) {
  return COURSES.every((c) => isCourseComplete(d, c.id));
}

/** The lesson the learner should do next (in-progress first, else first unlocked incomplete). */
export function nextLesson(d: UserData): Lesson | null {
  const inProgress = LESSONS.filter((l) => {
    const s = lessonStatus(d, l);
    return s === "in-progress" || s === "practice-pending";
  });
  if (inProgress.length) {
    // most recently updated first
    return inProgress.sort(
      (a, b) => (d.lessons[b.id]?.updatedAt ?? "").localeCompare(d.lessons[a.id]?.updatedAt ?? ""),
    )[0];
  }
  return LESSONS.find((l) => lessonStatus(d, l) === "not-started") ?? null;
}

export function lessonPracticeCount(lessonId: string) {
  return practiceForLesson(lessonId).length;
}

export type ExamState = "locked" | "ready" | "in-progress" | "retry-locked" | "retry-ready" | "passed";

export function examState(d: UserData): ExamState {
  if (d.certification) return "passed";
  if (!allCoursesComplete(d)) return "locked";
  if (d.examDraft) return "in-progress";
  const last = d.examAttempts[d.examAttempts.length - 1];
  if (!last) return "ready";
  if (last.passed) return "passed";
  return d.remediation.recapDone && d.remediation.practiceDone ? "retry-ready" : "retry-locked";
}
