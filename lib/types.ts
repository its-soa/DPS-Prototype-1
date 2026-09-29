export type LessonKind = "audio" | "video" | "text" | "pdf";

export interface TranscriptSegment {
  start: number; // seconds
  end: number;
  text: string;
}
export interface TextSection {
  heading: string;
  paragraphs: string[];
}
export interface PdfPage {
  title: string;
  paragraphs: string[];
}
export interface RelatedMaterial {
  title: string;
  kind: "PDF" | "Audio" | "Text" | "Braille-ready file";
  description: string;
}

export interface Choice {
  id: string;
  label: string;
}
export interface PracticeQuestion {
  id: string;
  lessonId: string;
  text: string;
  choices: Choice[];
  correct: string;
  explanation: string;
  /** Feedback shown when the answer is incorrect. */
  hint: string;
  related: {
    label: string;
    excerpt: string;
    /** Only for audio/video lessons. */
    start?: number;
    end?: number;
  };
}
export interface ExamQuestion {
  id: string;
  text: string;
  choices: Choice[];
  correct: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  kind: LessonKind;
  title: string;
  description: string;
  durationSeconds: number; // audio/video length, or estimated reading time
  /** Placeholder path for the MP3 / MP4 / PDF asset (content_assets). */
  assetUrl: string;
  summary: string;
  transcriptPreview: string;
  segments?: TranscriptSegment[]; // audio + video
  audioDescription?: string; // video only
  sections?: TextSection[]; // text
  pages?: PdfPage[]; // pdf
  materials: RelatedMaterial[];
}

export interface Course {
  id: string;
  order: number;
  title: string;
  description: string;
  outcome: string;
}

export interface Account {
  id: string;
  fullName: string;
  email: string;
  password: string; // PROTOTYPE ONLY. Real build uses Supabase Auth.
  role: "learner";
  preferredLanguage: Locale;
  isDemo?: boolean;
}

export type Locale = "en" | "de" | "fr";

export interface LessonProgress {
  position: number;
  completed: boolean;
  updatedAt: string;
  device: string;
}
export interface PracticeAnswer {
  selected: string;
  correct: boolean;
  attempts: number;
}
export interface ExamAttempt {
  attemptNumber: number;
  score: number;
  total: number;
  passed: boolean;
  submittedAt: string;
  answers: Record<string, string>;
}
export interface ExamDraft {
  attemptNumber: number;
  answers: Record<string, string>;
  startedAt: string;
}
export interface Certification {
  issuedAt: string;
  expiresAt: string;
}

export interface UserData {
  onboardingComplete: boolean;
  lessons: Record<string, LessonProgress>;
  practiceDone: Record<string, boolean>;
  practiceAnswers: Record<string, PracticeAnswer>;
  examAttempts: ExamAttempt[];
  examDraft: ExamDraft | null;
  remediation: { recapDone: boolean; practiceDone: boolean; answers: Record<string, PracticeAnswer> };
  certification: Certification | null;
  lastActive: string | null;
}

export interface AccessibilitySettings {
  textSize: "standard" | "large" | "xlarge" | "xxlarge";
  contrast: "standard" | "high";
  theme: "light" | "dark";
  reduceMotion: boolean;
  audioGuidance: boolean;
  defaultSpeed: number;
}
