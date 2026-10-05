import { COURSES, EXAM_QUESTIONS, LESSONS, PRACTICE_QUESTIONS } from "../mock-data";
import type { Choice, Lesson } from "../types";
import type { GlossaryTerm, Quiz, TLearner, TLesson, TQuestion, TrainerState } from "./types";
import { addMonths } from "../utils";

/** Keep the correct answer and the first two wrong ones: trainer questions always have 3 choices. */
function toThree(choices: Choice[], correctId: string): { answers: string[]; correct: number } {
  const wrong = choices.filter((c) => c.id !== correctId).slice(0, 2);
  const keep = choices.filter((c) => c.id === correctId || wrong.includes(c));
  return { answers: keep.map((c) => c.label), correct: keep.findIndex((c) => c.id === correctId) };
}

function transcriptOf(l: Lesson): string {
  if (l.segments) return l.segments.map((s) => s.text).join("\n\n");
  if (l.sections) return l.sections.map((s) => `${s.heading}\n${s.paragraphs.join("\n")}`).join("\n\n");
  if (l.pages) return l.pages.map((p) => `${p.title}\n${p.paragraphs.join("\n")}`).join("\n\n");
  return "";
}

const GLOSSARY: GlossaryTerm[] = [
  { id: "g-landmark", term: "Landmark", definition: "A fixed reference point used to describe where something is, so another examiner can find the same area." },
  { id: "g-consent", term: "Consent", definition: "The patient's freely given agreement to start or continue, which can be withdrawn at any time." },
  { id: "g-escalation", term: "Escalation", definition: "Asking a colleague or clinician to review findings when you are unsure." },
  { id: "g-clock", term: "Clock-face reference", definition: "Describing a position as an hour on a clock, together with a distance from a landmark." },
];
const GLOSSARY_LINKS: Record<string, string[]> = {
  "l1-1": ["g-consent"], "l1-2": ["g-landmark", "g-clock"], "l1-3": ["g-consent"],
  "l2-1": ["g-landmark"], "l2-3": ["g-clock"], "l3-2": ["g-escalation"],
};

/** Exam question -> lesson to suggest as remediation. */
const EXAM_LESSON: Record<string, string> = {
  e1: "l1-1", e2: "l1-1", e3: "l1-2", e4: "l1-3", e5: "l2-1", e6: "l2-2", e7: "l2-2", e8: "l2-3", e9: "l3-1", e10: "l3-1",
};

const daysAgo = (now: number, d: number) => new Date(now - d * 86_400_000).toISOString();

export function seedTrainerState(now = Date.now()): TrainerState {
  const iso = (d: number) => daysAgo(now, d);

  const lessons: TLesson[] = LESSONS.map((l) => ({
    id: l.id,
    courseId: l.courseId,
    order: l.order,
    kind: l.kind,
    title: l.title,
    explanation: l.summary,
    transcript: transcriptOf(l),
    audio: l.kind === "audio" || l.kind === "video" ? { name: `${l.id}-narration.mp3`, sizeKb: Math.round(l.durationSeconds * 16) } : undefined,
    pdf: l.kind === "pdf" ? { name: `${l.id}-handbook.pdf`, sizeKb: 420 } : l.materials.some((m) => m.kind === "PDF") ? { name: `${l.id}-reference.pdf`, sizeKb: 180 } : undefined,
    glossaryIds: GLOSSARY_LINKS[l.id] ?? [],
    status: "published",
    updatedAt: iso(30),
    publishedAt: iso(30),
    countsForProgress: true,
  }));
  // One unfinished lesson so the dashboard has real draft content to flag.
  lessons.push({
    id: "l3-4", courseId: "c3", order: 4, kind: "audio", title: "Recertification refresher (draft)",
    explanation: "", transcript: "", glossaryIds: [], status: "draft", updatedAt: iso(2), countsForProgress: false,
  });

  const quizzes: Quiz[] = LESSONS.map((l) => ({
    id: `qz-${l.id}`,
    programId: "prog-1",
    lessonId: l.id,
    title: `Practice: ${l.title}`,
    status: "published",
    questions: PRACTICE_QUESTIONS.filter((q) => q.lessonId === l.id).map((q): TQuestion => {
      const t = toThree(q.choices, q.correct);
      return { id: q.id, text: q.text, answers: t.answers, correct: t.correct, correctFeedback: q.explanation, incorrectFeedback: q.hint, lessonId: l.id };
    }),
  }));
  quizzes.push({ id: "qz-l3-4", programId: "prog-1", lessonId: "l3-4", title: "Practice: Recertification refresher (draft)", status: "draft", questions: [] });

  const examQuestions: TQuestion[] = EXAM_QUESTIONS.map((q) => {
    const t = toThree(q.choices, q.correct);
    return { id: q.id, text: q.text, answers: t.answers, correct: t.correct, lessonId: EXAM_LESSON[q.id] };
  });
  const answersWith = (correctCount: number) =>
    Object.fromEntries(examQuestions.map((q, i) => [q.id, i < correctCount ? q.correct : (q.correct + 1) % 3]));

  const done = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, "complete" as const]));
  const allLessons = LESSONS.map((l) => l.id);
  const practiceFor = (lessonIds: string[], missed: string[]) =>
    Object.fromEntries(
      lessonIds.map((lid) => [`qz-${lid}`, { total: 2, missed: PRACTICE_QUESTIONS.filter((q) => q.lessonId === lid && missed.includes(q.id)).map((q) => q.id) }]),
    );

  const certNoorIssued = iso(20);
  const certKarlExpires = new Date(now + 58 * 86_400_000).toISOString();

  const learners: TLearner[] = [
    {
      id: "lrn-maxi", fullName: "Maxi Schneider", email: "maxi.schneider@example.org", invitation: "accepted", invitedAt: iso(60),
      pathId: "path-1", assignedAt: iso(60), lastActive: iso(3),
      lessonStatus: done(allLessons), practice: practiceFor(allLessons, ["p2-2-1", "p3-1-2", "p1-2-2", "p2-3-1"]),
      attempts: [{ n: 1, score: 5, total: 10, passed: false, submittedAt: iso(3), answers: answersWith(5) }],
      notes: [], reminders: [],
    },
    {
      id: "lrn-tomasz", fullName: "Tomasz Kowalski", email: "tomasz.kowalski@example.org", invitation: "sent", invitedAt: iso(4),
      pathId: "path-1", assignedAt: iso(4), lessonStatus: {}, practice: {}, attempts: [], notes: [], reminders: [],
    },
    {
      id: "lrn-aisha", fullName: "Aisha Rahman", email: "aisha.rahman@example.org", invitation: "accepted", invitedAt: iso(14),
      pathId: "path-1", assignedAt: iso(14), lastActive: iso(1),
      lessonStatus: { "l1-1": "complete", "l1-2": "in-progress" }, practice: practiceFor(["l1-1"], ["p1-1-2"]),
      attempts: [], notes: [], reminders: [],
    },
    {
      id: "lrn-elena", fullName: "Elena Petrova", email: "elena.petrova@example.org", invitation: "accepted", invitedAt: iso(50),
      pathId: "path-1", assignedAt: iso(50), lastActive: iso(5),
      lessonStatus: done(allLessons), practice: practiceFor(allLessons, ["p2-2-1", "p3-1-2"]),
      attempts: [], notes: [], reminders: [],
    },
    {
      id: "lrn-noor", fullName: "Noor Hassan", email: "noor.hassan@example.org", invitation: "accepted", invitedAt: iso(80),
      pathId: "path-1", assignedAt: iso(80), lastActive: iso(18),
      lessonStatus: done(allLessons), practice: practiceFor(allLessons, ["p2-3-2"]),
      attempts: [{ n: 1, score: 8, total: 10, passed: true, submittedAt: certNoorIssued, answers: answersWith(8) }],
      certification: { issuedAt: certNoorIssued, expiresAt: addMonths(certNoorIssued, 24) },
      notes: [], reminders: [],
    },
    {
      id: "lrn-karl", fullName: "Karl Vogel", email: "karl.vogel@example.org", invitation: "accepted", invitedAt: iso(700),
      pathId: "path-1", assignedAt: iso(700), lastActive: iso(40),
      lessonStatus: done(allLessons), practice: practiceFor(allLessons, ["p2-2-1"]),
      attempts: [{ n: 1, score: 9, total: 10, passed: true, submittedAt: addMonths(certKarlExpires, -24), answers: answersWith(9) }],
      certification: { issuedAt: addMonths(certKarlExpires, -24), expiresAt: certKarlExpires },
      notes: [], reminders: [],
    },
  ];

  return {
    version: 1,
    programs: [{
      id: "prog-1", title: "MTU Qualification Programme",
      description: "The complete qualification route for medical tactile examiners: three required courses and the certification exam.",
      status: "active", createdBy: "trainer-alex", createdAt: iso(120),
    }],
    courses: COURSES.map((c) => ({ id: c.id, programId: "prog-1", title: c.title, description: c.description, isRequired: true, status: "published" as const, order: c.order })),
    lessons,
    glossary: GLOSSARY,
    quizzes,
    exams: [{
      id: "exam-1", programId: "prog-1", title: "MTU Certification Exam",
      instructions: "Answer all ten questions. Choose one answer for each question and select Save answer. You can return to earlier questions before you submit. There is no time limit.",
      passingScore: 70, retryLimit: 3, status: "active", questions: examQuestions,
    }],
    paths: [{
      id: "path-1", programId: "prog-1", title: "MTU qualification path", status: "saved",
      items: [
        { id: "pi-1", type: "course", refId: "c1", position: 1, locked: false },
        { id: "pi-2", type: "course", refId: "c2", position: 2, locked: true },
        { id: "pi-3", type: "course", refId: "c3", position: 3, locked: true },
        { id: "pi-4", type: "exam", refId: "exam-1", position: 4, locked: true },
      ],
    }],
    learners,
    exports: [],
  };
}
