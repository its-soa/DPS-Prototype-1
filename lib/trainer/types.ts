import type { LessonKind } from "../types";

/** Prototype trainer data model. Mirrors the tables added in /supabase/trainer.sql. */

export type ContentStatus = "draft" | "published" | "changes-pending" | "archived";

export interface Program {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "archived";
  createdBy: string;
  createdAt: string;
}
export interface TCourse {
  id: string;
  programId: string;
  title: string;
  description: string;
  isRequired: boolean;
  status: ContentStatus;
  order: number;
}
export interface FileMeta {
  name: string;
  sizeKb: number;
}
export interface TLesson {
  id: string;
  courseId: string;
  order: number;
  kind: LessonKind;
  title: string;
  /** The explanation learners see as the lesson summary. Editing it is the "fix a weak lesson" loop. */
  explanation: string;
  transcript: string;
  audio?: FileMeta;
  pdf?: FileMeta;
  glossaryIds: string[];
  status: ContentStatus;
  updatedAt: string;
  publishedAt?: string;
  /** Lessons added after the cohort was assigned do not change existing learners' completion figures. */
  countsForProgress: boolean;
}
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}
export interface TQuestion {
  id: string;
  text: string;
  answers: string[]; // always 3
  correct: number; // index into answers
  correctFeedback?: string;
  incorrectFeedback?: string;
  /** Exams only: the lesson to suggest as remediation when this question is missed. */
  lessonId?: string;
}
export interface Quiz {
  id: string;
  programId: string;
  lessonId?: string;
  title: string;
  questions: TQuestion[];
  status: "draft" | "published" | "archived";
}
export interface Exam {
  id: string;
  programId: string;
  title: string;
  instructions: string;
  passingScore: number; // percent
  retryLimit: number;
  questions: TQuestion[];
  status: "draft" | "active" | "archived";
}
export interface PathItem {
  id: string;
  type: "course" | "exam";
  refId: string;
  position: number;
  /** Locked until the previous item is complete. */
  locked: boolean;
}
export interface LearningPath {
  id: string;
  programId: string;
  title: string;
  items: PathItem[];
  status: "draft" | "saved" | "archived";
}

export type Invitation = "not-sent" | "sent" | "accepted";
export interface ExamAttempt {
  n: number;
  score: number;
  total: number;
  passed: boolean;
  submittedAt: string;
  /** questionId -> chosen answer index */
  answers: Record<string, number>;
}
export interface Remediation {
  lessonIds: string[];
  note: string;
  assignedAt: string;
  retryUnlocked: boolean;
  retryUnlockedAt?: string;
}
export interface TLearner {
  id: string;
  fullName: string;
  email: string;
  invitation: Invitation;
  invitedAt?: string;
  pathId?: string;
  assignedAt?: string;
  lastActive?: string;
  archived?: boolean;
  lessonStatus: Record<string, "complete" | "in-progress">;
  /** quizId -> practice result */
  practice: Record<string, { total: number; missed: string[] }>;
  attempts: ExamAttempt[];
  remediation?: Remediation;
  certification?: { issuedAt: string; expiresAt: string };
  notes: { at: string; by: string; text: string }[];
  reminders: string[]; // ISO dates recertification reminders were sent
}
export interface ExportJob {
  id: string;
  type: string;
  requestedBy: string;
  requestedAt: string;
  rows: number;
  csv: string;
}

export interface TrainerState {
  version: 1;
  programs: Program[];
  courses: TCourse[];
  lessons: TLesson[];
  glossary: GlossaryTerm[];
  quizzes: Quiz[];
  exams: Exam[];
  paths: LearningPath[];
  learners: TLearner[];
  exports: ExportJob[];
}
