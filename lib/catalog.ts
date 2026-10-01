"use client";

import { useMemo } from "react";
import { COURSES, EXAM_QUESTIONS, LESSONS, PRACTICE_QUESTIONS, REMEDIATION } from "./mock-data";
import { localizeCourse, localizeExam, localizeLesson, localizePractice, localizeRemediationQuestion, packFor } from "./localize";
import { useApp } from "./store";

/** Course content in the learner's language. Ids, timings and answer keys always come from the English source. */
export function useCatalog() {
  const { state } = useApp();
  const locale = state.language;
  return useMemo(() => {
    const courses = COURSES.map((c) => localizeCourse(c, locale));
    const lessons = LESSONS.map((l) => localizeLesson(l, locale));
    const practice = PRACTICE_QUESTIONS.map((q) => localizePractice(q, locale));
    const exam = EXAM_QUESTIONS.map((q) => localizeExam(q, locale));
    const pack = packFor(locale);
    const remediation = {
      ...REMEDIATION,
      title: pack?.remediation.title || REMEDIATION.title,
      segments: REMEDIATION.segments.map((s, i) => ({ ...s, text: pack?.remediation.segments[i] || s.text })),
      questions: REMEDIATION.questions.map((q) => localizeRemediationQuestion(q, locale)),
    };
    return {
      courses,
      lessons,
      exam,
      remediation,
      courseById: (id: string) => courses.find((c) => c.id === id),
      lessonById: (id: string) => lessons.find((l) => l.id === id),
      lessonsForCourse: (courseId: string) => lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order),
      practiceForLesson: (lessonId: string) => practice.filter((q) => q.lessonId === lessonId),
    };
  }, [locale]);
}
