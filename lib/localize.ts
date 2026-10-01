import type { Course, ExamQuestion, Lesson, Locale, PracticeQuestion } from "./types";

/**
 * Translatable course content. The English source of truth stays in lib/mock-data.ts
 * (ids, timings, correct answers, asset paths). A ContentPack only holds TEXT, keyed by id,
 * so a translator never touches logic or answer keys.
 */
export interface LessonText {
  title: string;
  description: string;
  summary: string;
  transcriptPreview: string;
  audioDescription?: string;
  /** One string per transcript segment, in the same order as the English source. */
  segments?: string[];
  sections?: { heading: string; paragraphs: string[] }[];
  pages?: { title: string; paragraphs: string[] }[];
  /** Same order as the English source. */
  materials: { title: string; description: string }[];
}
export interface QuestionText {
  text: string;
  /** keyed by choice id (a, b, c, d) */
  choices: Record<string, string>;
  explanation: string;
  hint: string;
  related: { label: string; excerpt: string };
}
export interface ExamQuestionText {
  text: string;
  choices: Record<string, string>;
}
export interface CourseText {
  title: string;
  description: string;
  outcome: string;
}
export interface ContentPack {
  courses: Record<string, CourseText>;
  lessons: Record<string, LessonText>;
  practice: Record<string, QuestionText>;
  exam: Record<string, ExamQuestionText>;
  remediation: {
    title: string;
    segments: string[];
    questions: Record<string, QuestionText>;
  };
}

// Packs are loaded lazily by locale; English needs none (it is the source).
import { de } from "./content/de";
const PACKS: Partial<Record<Locale, ContentPack>> = { de };

export function packFor(locale: Locale): ContentPack | undefined {
  return PACKS[locale];
}

export function localizeCourse(c: Course, locale: Locale): Course {
  const t = packFor(locale)?.courses[c.id];
  return t ? { ...c, ...t } : c;
}

export function localizeLesson(l: Lesson, locale: Locale): Lesson {
  const t = packFor(locale)?.lessons[l.id];
  if (!t) return l;
  return {
    ...l,
    title: t.title,
    description: t.description,
    summary: t.summary,
    transcriptPreview: t.transcriptPreview,
    audioDescription: t.audioDescription ?? l.audioDescription,
    segments: l.segments?.map((s, i) => ({ ...s, text: t.segments?.[i] ?? s.text })),
    sections: l.sections?.map((s, i) => t.sections?.[i] ?? s),
    pages: l.pages?.map((p, i) => t.pages?.[i] ?? p),
    materials: l.materials.map((m, i) => ({ ...m, ...(t.materials[i] ?? {}) })),
  };
}

function applyQuestion(q: PracticeQuestion, t?: QuestionText): PracticeQuestion {
  if (!t) return q;
  return {
    ...q,
    text: t.text,
    choices: q.choices.map((c) => ({ ...c, label: t.choices[c.id] ?? c.label })),
    explanation: t.explanation,
    hint: t.hint,
    related: { ...q.related, label: t.related.label, excerpt: t.related.excerpt },
  };
}
export function localizePractice(q: PracticeQuestion, locale: Locale): PracticeQuestion {
  return applyQuestion(q, packFor(locale)?.practice[q.id]);
}
export function localizeRemediationQuestion(q: PracticeQuestion, locale: Locale): PracticeQuestion {
  return applyQuestion(q, packFor(locale)?.remediation.questions[q.id]);
}
export function localizeExam(q: ExamQuestion, locale: Locale): ExamQuestion {
  const t = packFor(locale)?.exam[q.id];
  if (!t) return q;
  return { ...q, text: t.text, choices: q.choices.map((c) => ({ ...c, label: t.choices[c.id] ?? c.label })) };
}
