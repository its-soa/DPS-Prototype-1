import type {
  Account,
  Course,
  ExamQuestion,
  Lesson,
  PracticeQuestion,
} from "./types";

/**
 * SAMPLE CONTENT for a feedback prototype. Not clinical guidance.
 * Mirrors the `courses`, `lessons`, `practice_questions` tables in /supabase/schema.sql.
 */

export const PASS_MARK_PERCENT = 70;
export const MAX_EXAM_ATTEMPTS = 3;

export const COURSES: Course[] = [
  {
    id: "c1",
    order: 1,
    title: "Introduction to Theoretical MTU Training",
    description:
      "Understand the role of a medical tactile examiner, the foundations of tactile examination, and how to communicate with patients respectfully.",
    outcome: "You can explain the MTU role, tactile landmarks and consent practice.",
  },
  {
    id: "c2",
    order: 2,
    title: "Applied Tactile Examination Principles",
    description:
      "Learn a systematic examination pattern, how to vary pressure and pace, and how to document findings clearly.",
    outcome: "You can describe and apply a consistent, documented examination approach.",
  },
  {
    id: "c3",
    order: 3,
    title: "Certification Preparation and Quality Standards",
    description:
      "Review quality standards, hygiene and escalation practice, and learn what to expect in the certification exam.",
    outcome: "You are ready to take the certification exam with confidence.",
  },
];

const MP3 = "/media/placeholder-lesson.mp3";
const MP4 = "/media/placeholder-lesson.mp4";
const PDF = "/media/placeholder-handbook.pdf";

export const LESSONS: Lesson[] = [
  // ───────────────────────── Course 1 ─────────────────────────
  {
    id: "l1-1",
    courseId: "c1",
    order: 1,
    kind: "audio",
    title: "Purpose and role of the MTU",
    description: "What a medical tactile examiner does, and why the method matters.",
    durationSeconds: 360,
    assetUrl: MP3,
    summary:
      "The MTU role combines a refined sense of touch with structured technique and clear communication. Quality comes from consistency, not speed.",
    transcriptPreview: "Welcome to the first lesson. In this lesson we describe the MTU role and why tactile examination is valuable…",
    segments: [
      { start: 0, end: 90, text: "Welcome to the first lesson. In this lesson we describe the role of a medical tactile examiner, often shortened to MTU, and why tactile examination is valuable in early detection." },
      { start: 90, end: 180, text: "An MTU works with a structured method. The method matters because it makes findings repeatable. Two examiners following the same pattern should describe the same area in the same way." },
      { start: 180, end: 270, text: "Patients trust the examiner because the process is calm, explained in advance, and respectful. Before starting, you always explain what you will do and ask for permission to continue." },
      { start: 270, end: 360, text: "To summarise: the role rests on three things. A trained sense of touch, a consistent method, and clear communication. The next lesson covers tactile landmarks in more detail." },
    ],
    materials: [
      { title: "Role overview one-pager", kind: "PDF", description: "One page, screen-reader tagged." },
      { title: "Role overview (Braille-ready)", kind: "Braille-ready file", description: "BRF file for refreshable Braille displays." },
    ],
  },
  {
    id: "l1-2",
    courseId: "c1",
    order: 2,
    kind: "text",
    title: "Tactile landmarks: a reading guide",
    description: "A formatted text lesson you can read at your own pace with your screen reader or Braille display.",
    durationSeconds: 420,
    assetUrl: "",
    summary:
      "Landmarks give you a fixed frame of reference. Always begin from the same landmark and move in the same order so your notes are comparable over time.",
    transcriptPreview: "Landmarks are the fixed reference points you use to describe where something is…",
    sections: [
      {
        heading: "Why landmarks matter",
        paragraphs: [
          "Landmarks are fixed reference points you use to describe where something is. They let another examiner find exactly the same area later.",
          "Without a shared frame of reference, a description such as 'near the upper part' can mean different things to different people.",
        ],
      },
      {
        heading: "Choosing a starting point",
        paragraphs: [
          "Always begin at the same starting landmark. This builds a habit, and habits reduce the chance that an area is missed.",
          "Say the starting point aloud when you dictate your notes. It helps reviewers understand the sequence you followed.",
        ],
      },
      {
        heading: "Describing position",
        paragraphs: [
          "Describe position using a clock-face reference together with the distance from a landmark. For example: 'two o'clock, three centimetres from the starting landmark'.",
          "Keep descriptions short and factual. Avoid words that suggest a conclusion; describe what you feel, not what you think it is.",
        ],
      },
      {
        heading: "Checking your understanding",
        paragraphs: [
          "When you have finished reading, mark the lesson as complete. A short practice session follows with two questions.",
        ],
      },
    ],
    materials: [
      { title: "Landmark glossary", kind: "Text", description: "Plain text, one term per line." },
      { title: "Landmark glossary (Braille-ready)", kind: "Braille-ready file", description: "BRF file." },
    ],
  },
  {
    id: "l1-3",
    courseId: "c1",
    order: 3,
    kind: "pdf",
    title: "Communication and consent handbook",
    description: "A tagged PDF handbook with a built-in page reader, page by page.",
    durationSeconds: 480,
    assetUrl: PDF,
    summary:
      "Explain each step, ask for consent, and check comfort throughout. Consent can be withdrawn at any time and must be respected immediately.",
    transcriptPreview: "Good communication starts before any physical contact. Introduce yourself, explain the purpose…",
    pages: [
      {
        title: "Page 1: Before you begin",
        paragraphs: [
          "Good communication starts before any physical contact. Introduce yourself, explain the purpose of the examination, and describe what will happen in plain language.",
          "Ask whether the patient has questions. Wait for the answer before moving on.",
        ],
      },
      {
        title: "Page 2: Asking for consent",
        paragraphs: [
          "Ask clearly for permission to start. A yes must be freely given. If the patient hesitates, pause and offer more information.",
          "Consent is ongoing. Check in at natural points: 'Is this comfortable? May I continue?'",
        ],
      },
      {
        title: "Page 3: Withdrawal and privacy",
        paragraphs: [
          "If consent is withdrawn at any point, stop immediately, thank the patient, and ask how they would like to proceed.",
          "Keep all findings and personal details confidential. Share information only with people involved in the patient's care.",
        ],
      },
      {
        title: "Page 4: Closing the conversation",
        paragraphs: [
          "Summarise what you did, explain when and how results will be shared, and thank the patient.",
          "Record that consent was given and note any patient concerns raised.",
        ],
      },
    ],
    materials: [
      { title: "Consent phrase cards", kind: "Text", description: "Sample wording for common situations." },
    ],
  },
  // ───────────────────────── Course 2 ─────────────────────────
  {
    id: "l2-1",
    courseId: "c2",
    order: 1,
    kind: "video",
    title: "A systematic examination pattern (audio-described video)",
    description: "A demonstration with full audio description and a complete transcript.",
    durationSeconds: 540,
    assetUrl: MP4,
    summary:
      "A systematic pattern covers the whole area once, without gaps or overlap, and is repeated in the same order every time.",
    transcriptPreview: "In this demonstration the trainer walks through a systematic pattern from the starting landmark…",
    audioDescription:
      "Audio description: A trainer stands beside a padded examination table wearing a plain teal top. A training model lies on the table. The trainer rests two fingers on a marked starting point at the top of the model, then moves in slow, even, overlapping vertical lines from one side to the other.",
    segments: [
      { start: 0, end: 135, text: "In this demonstration the trainer walks through a systematic pattern. First, identify the starting landmark and rest your fingers there." },
      { start: 135, end: 270, text: "Move in vertical lines of equal length. Each line slightly overlaps the previous one so that no area is skipped." },
      { start: 270, end: 405, text: "Keep your pace steady. A steady pace helps you notice changes in texture. Count the lines aloud if that helps you keep your place." },
      { start: 405, end: 540, text: "When you reach the final line, return to the starting landmark, and confirm that the whole area has been covered before you move on." },
    ],
    materials: [
      { title: "Pattern step list", kind: "Text", description: "Numbered steps matching the video." },
      { title: "Full audio description script", kind: "PDF", description: "Tagged PDF." },
    ],
  },
  {
    id: "l2-2",
    courseId: "c2",
    order: 2,
    kind: "audio",
    title: "Pressure levels and pacing",
    description: "How to vary pressure in a controlled way while keeping a steady pace.",
    durationSeconds: 480,
    assetUrl: MP3,
    summary:
      "Use light, medium and deep pressure in sequence at each position. Keep the pace steady and the pressure changes deliberate.",
    transcriptPreview: "Pressure is one of the most important variables in tactile examination. In this lesson…",
    segments: [
      { start: 0, end: 120, text: "Pressure is one of the most important variables in tactile examination. In this lesson we describe three levels: light, medium and deep." },
      { start: 120, end: 240, text: "At each position, begin with light pressure to notice the surface. Then increase to medium, then deep. Return to light before moving to the next position." },
      { start: 240, end: 360, text: "Keep your pace steady. Rushing reduces sensitivity and can make the patient uncomfortable. If a patient reports discomfort, reduce pressure straight away." },
      { start: 360, end: 480, text: "Practise changing pressure smoothly, without sudden jumps. Smooth transitions help you compare what you feel at each level." },
    ],
    materials: [
      { title: "Pressure levels reference", kind: "PDF", description: "One page, screen-reader tagged." },
    ],
  },
  {
    id: "l2-3",
    courseId: "c2",
    order: 3,
    kind: "text",
    title: "Documenting findings accurately",
    description: "How to write clear, factual notes that another examiner can follow.",
    durationSeconds: 360,
    assetUrl: "",
    summary:
      "Record what you felt, where, and at which pressure. Use consistent terms, keep to facts, and sign and date every note.",
    transcriptPreview: "Good documentation is specific and factual. Record location, size, texture, and pressure level…",
    sections: [
      {
        heading: "What to record",
        paragraphs: [
          "Record the position using a clock-face reference and distance from the starting landmark, the approximate size, the texture, and the pressure level at which you noticed it.",
        ],
      },
      {
        heading: "Use facts, not conclusions",
        paragraphs: [
          "Describe what you felt. Do not name a diagnosis. Interpretation belongs to the reviewing clinician.",
        ],
      },
      {
        heading: "Sign and date",
        paragraphs: [
          "Every note needs your name, the date, and the time. Notes without these details cannot be used for quality review.",
        ],
      },
    ],
    materials: [
      { title: "Documentation template", kind: "Text", description: "Plain text template." },
    ],
  },
  // ───────────────────────── Course 3 ─────────────────────────
  {
    id: "l3-1",
    courseId: "c3",
    order: 1,
    kind: "audio",
    title: "Quality standards and hygiene",
    description: "The standards your work is reviewed against, and hygiene routines.",
    durationSeconds: 420,
    assetUrl: MP3,
    summary:
      "Quality standards cover method, communication, documentation and hygiene. Reviewers look for consistency across all four.",
    transcriptPreview: "Your work is reviewed against four quality standards: method, communication, documentation and hygiene…",
    segments: [
      { start: 0, end: 105, text: "Your work is reviewed against four quality standards: method, communication, documentation and hygiene." },
      { start: 105, end: 210, text: "For hygiene, wash your hands before and after every examination, and keep your workspace clear and tidy so it stays predictable for you." },
      { start: 210, end: 315, text: "Reviewers look for consistency. A good result is one that another examiner could repeat by following your notes." },
      { start: 315, end: 420, text: "If you are unsure about anything you feel, do not guess. Follow the escalation process and ask for a second opinion." },
    ],
    materials: [
      { title: "Quality standards checklist", kind: "Text", description: "Plain text." },
    ],
  },
  {
    id: "l3-2",
    courseId: "c3",
    order: 2,
    kind: "pdf",
    title: "Documentation and escalation checklist",
    description: "A tagged PDF checklist covering what to do when you are unsure.",
    durationSeconds: 300,
    assetUrl: PDF,
    summary:
      "Escalate whenever you are unsure. Escalation is a sign of good practice, never a failure.",
    transcriptPreview: "Escalation means asking a colleague or clinician to review your findings…",
    pages: [
      {
        title: "Page 1: When to escalate",
        paragraphs: [
          "Escalation means asking a colleague or clinician to review your findings. Escalate whenever you are unsure, or whenever your notes describe something you cannot explain.",
        ],
      },
      {
        title: "Page 2: How to escalate",
        paragraphs: [
          "Complete your notes first. Then contact the responsible clinician using the agreed route, and record the time you did so.",
        ],
      },
      {
        title: "Page 3: After escalation",
        paragraphs: [
          "Tell the patient what will happen next in plain language. Keep a copy of your notes for quality review.",
        ],
      },
    ],
    materials: [
      { title: "Escalation contact sheet", kind: "PDF", description: "Placeholder document." },
    ],
  },
  {
    id: "l3-3",
    courseId: "c3",
    order: 3,
    kind: "video",
    title: "Exam walk-through: what to expect",
    description: "An audio-described walk-through of the certification exam screens.",
    durationSeconds: 300,
    assetUrl: MP4,
    summary:
      "The exam has ten questions, one per screen. You save each answer, can go back, and review everything before submitting.",
    transcriptPreview: "This walk-through shows the exam from start to finish. There are ten questions, shown one at a time…",
    audioDescription:
      "Audio description: A tablet screen shows a single question with four large answer options and a Save answer button below. A progress line reads 'Question 2 of 10'.",
    segments: [
      { start: 0, end: 75, text: "This walk-through shows the exam from start to finish. There are ten questions, shown one at a time." },
      { start: 75, end: 150, text: "Choose one answer, then select Save answer. You will hear and see a confirmation, and then the Next question button appears." },
      { start: 150, end: 225, text: "You can return to earlier questions at any time. Your saved answers are kept." },
      { start: 225, end: 300, text: "After the last question, a review screen lists every answer. When you are ready, submit the exam. You need seventy percent to pass, and you may retry." },
    ],
    materials: [
      { title: "Exam guide", kind: "Text", description: "Plain text summary of the exam rules." },
    ],
  },
];

const c = (id: string, label: string) => ({ id, label });

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // l1-1
  {
    id: "p1-1-1", lessonId: "l1-1",
    text: "Why does an MTU use a structured method?",
    choices: [c("a", "It makes findings repeatable between examiners"), c("b", "It makes the examination shorter"), c("c", "It removes the need to talk to the patient"), c("d", "It replaces documentation")],
    correct: "a",
    explanation: "A structured method means two examiners following the same pattern describe the same area in the same way.",
    hint: "Think about what happens when two examiners follow the same pattern.",
    related: { label: "Segment 2: why the method matters", excerpt: "An MTU works with a structured method. The method matters because it makes findings repeatable.", start: 90, end: 180 },
  },
  {
    id: "p1-1-2", lessonId: "l1-1",
    text: "What should you do before starting the examination?",
    choices: [c("a", "Start quietly so the patient is not worried"), c("b", "Explain what you will do and ask permission"), c("c", "Wait for the patient to ask questions first"), c("d", "Review the patient's records aloud")],
    correct: "b",
    explanation: "Explaining first and asking permission builds trust and respects the patient's choice.",
    hint: "Trust comes from the process being explained in advance.",
    related: { label: "Segment 3: trust and permission", excerpt: "Before starting, you always explain what you will do and ask for permission to continue.", start: 180, end: 270 },
  },
  // l1-2
  {
    id: "p1-2-1", lessonId: "l1-2",
    text: "Why should you always begin at the same starting landmark?",
    choices: [c("a", "It saves time"), c("b", "It builds a habit that reduces missed areas"), c("c", "It is required by law"), c("d", "It makes notes shorter")],
    correct: "b",
    explanation: "A fixed starting point builds a habit, and habits reduce the chance an area is missed.",
    hint: "Consider what a consistent habit protects against.",
    related: { label: "Section: Choosing a starting point", excerpt: "Always begin at the same starting landmark. This builds a habit, and habits reduce the chance that an area is missed." },
  },
  {
    id: "p1-2-2", lessonId: "l1-2",
    text: "Which description of position is the clearest?",
    choices: [c("a", "Near the upper part"), c("b", "Somewhere on the left"), c("c", "Two o'clock, three centimetres from the starting landmark"), c("d", "Where the patient pointed")],
    correct: "c",
    explanation: "A clock-face reference plus a distance from a landmark is specific and repeatable.",
    hint: "Look for a description that includes both direction and distance.",
    related: { label: "Section: Describing position", excerpt: "Describe position using a clock-face reference together with the distance from a landmark." },
  },
  // l1-3
  {
    id: "p1-3-1", lessonId: "l1-3",
    text: "The patient hesitates when asked for consent. What is the best response?",
    choices: [c("a", "Continue, since they did not say no"), c("b", "Pause and offer more information"), c("c", "End the appointment immediately"), c("d", "Ask a colleague to decide")],
    correct: "b",
    explanation: "Consent must be freely given. Pausing and offering information gives the patient space to decide.",
    hint: "Consent must be freely given, so what supports a free choice?",
    related: { label: "Page 2: Asking for consent", excerpt: "If the patient hesitates, pause and offer more information." },
  },
  {
    id: "p1-3-2", lessonId: "l1-3",
    text: "If consent is withdrawn during the examination, what do you do?",
    choices: [c("a", "Finish the current step first"), c("b", "Stop immediately and ask how they would like to proceed"), c("c", "Note it and continue"), c("d", "Repeat the consent request")],
    correct: "b",
    explanation: "Withdrawal is respected immediately.",
    hint: "The handbook says withdrawal applies at any point.",
    related: { label: "Page 3: Withdrawal and privacy", excerpt: "If consent is withdrawn at any point, stop immediately, thank the patient, and ask how they would like to proceed." },
  },
  // l2-1
  {
    id: "p2-1-1", lessonId: "l2-1",
    text: "Why should each vertical line slightly overlap the previous one?",
    choices: [c("a", "To spend more time on each area"), c("b", "So that no area is skipped"), c("c", "To reduce the pressure needed"), c("d", "Because the patient prefers it")],
    correct: "b",
    explanation: "A small overlap guarantees complete coverage with no gaps.",
    hint: "What would a gap between lines mean for coverage?",
    related: { label: "Segment 2: equal lines with overlap", excerpt: "Each line slightly overlaps the previous one so that no area is skipped.", start: 135, end: 270 },
  },
  {
    id: "p2-1-2", lessonId: "l2-1",
    text: "What do you do after the final line?",
    choices: [c("a", "Finish immediately"), c("b", "Return to the starting landmark and confirm full coverage"), c("c", "Start again at a different landmark"), c("d", "Ask the patient to confirm")],
    correct: "b",
    explanation: "Returning to the start and confirming coverage closes the pattern.",
    hint: "The pattern is closed by going back to where it began.",
    related: { label: "Segment 4: closing the pattern", excerpt: "Return to the starting landmark, and confirm that the whole area has been covered.", start: 405, end: 540 },
  },
  // l2-2
  {
    id: "p2-2-1", lessonId: "l2-2",
    text: "In what order do you apply pressure at each position?",
    choices: [c("a", "Deep, medium, light"), c("b", "Light, medium, deep, then back to light"), c("c", "Medium only"), c("d", "Whichever feels right")],
    correct: "b",
    explanation: "Light, medium, deep, then back to light before moving on.",
    hint: "You start by noticing the surface.",
    related: { label: "Segment 2: the pressure sequence", excerpt: "Begin with light pressure to notice the surface. Then increase to medium, then deep. Return to light before moving to the next position.", start: 120, end: 240 },
  },
  {
    id: "p2-2-2", lessonId: "l2-2",
    text: "A patient reports discomfort. What should you do?",
    choices: [c("a", "Reduce pressure straight away"), c("b", "Finish the position first"), c("c", "Increase pace"), c("d", "Ignore it if the pattern is nearly done")],
    correct: "a",
    explanation: "Patient comfort comes first.",
    hint: "Comfort comes before completing the pattern.",
    related: { label: "Segment 3: pacing and comfort", excerpt: "If a patient reports discomfort, reduce pressure straight away.", start: 240, end: 360 },
  },
  // l2-3
  {
    id: "p2-3-1", lessonId: "l2-3",
    text: "Which is an appropriate note?",
    choices: [c("a", "Probably a harmless cyst"), c("b", "Two o'clock, about two centimetres, firm, noticed at medium pressure"), c("c", "Something unusual"), c("d", "Looks fine")],
    correct: "b",
    explanation: "Good notes state position, size, texture and pressure without naming a diagnosis.",
    hint: "Choose the note with facts, not conclusions.",
    related: { label: "Section: What to record", excerpt: "Record the position, the approximate size, the texture, and the pressure level at which you noticed it." },
  },
  {
    id: "p2-3-2", lessonId: "l2-3",
    text: "Why does every note need a name, date and time?",
    choices: [c("a", "For quality review"), c("b", "For billing"), c("c", "For the patient's records only"), c("d", "It does not need them")],
    correct: "a",
    explanation: "Notes without these details cannot be used for quality review.",
    hint: "Think about who reads the notes later.",
    related: { label: "Section: Sign and date", excerpt: "Notes without these details cannot be used for quality review." },
  },
  // l3-1
  {
    id: "p3-1-1", lessonId: "l3-1",
    text: "Which is one of the four quality standards?",
    choices: [c("a", "Speed"), c("b", "Hygiene"), c("c", "Equipment cost"), c("d", "Session length")],
    correct: "b",
    explanation: "The four standards are method, communication, documentation and hygiene.",
    hint: "Method, communication, documentation, and one more.",
    related: { label: "Segment 1: the four standards", excerpt: "Your work is reviewed against four quality standards: method, communication, documentation and hygiene.", start: 0, end: 105 },
  },
  {
    id: "p3-1-2", lessonId: "l3-1",
    text: "You are unsure about something you feel. What should you do?",
    choices: [c("a", "Make your best guess"), c("b", "Follow the escalation process and ask for a second opinion"), c("c", "Leave it out of the notes"), c("d", "Repeat until it feels certain")],
    correct: "b",
    explanation: "Never guess. Escalate.",
    hint: "The lesson ends with a clear instruction for uncertainty.",
    related: { label: "Segment 4: uncertainty", excerpt: "If you are unsure about anything you feel, do not guess. Follow the escalation process and ask for a second opinion.", start: 315, end: 420 },
  },
  // l3-2
  {
    id: "p3-2-1", lessonId: "l3-2",
    text: "When should you escalate?",
    choices: [c("a", "Only when certain of a problem"), c("b", "Whenever you are unsure"), c("c", "Never without patient permission"), c("d", "Only at the end of the day")],
    correct: "b",
    explanation: "Escalation is good practice whenever you are unsure.",
    hint: "The page says escalation is never a failure.",
    related: { label: "Page 1: When to escalate", excerpt: "Escalate whenever you are unsure, or whenever your notes describe something you cannot explain." },
  },
  {
    id: "p3-2-2", lessonId: "l3-2",
    text: "What do you do before contacting the clinician?",
    choices: [c("a", "Complete your notes"), c("b", "Wait a day"), c("c", "Delete the draft notes"), c("d", "Ask the patient to leave")],
    correct: "a",
    explanation: "Complete your notes first, then contact the clinician and record the time.",
    hint: "Your notes are what the clinician will review.",
    related: { label: "Page 2: How to escalate", excerpt: "Complete your notes first. Then contact the responsible clinician using the agreed route." },
  },
  // l3-3
  {
    id: "p3-3-1", lessonId: "l3-3",
    text: "How many questions are shown on each exam screen?",
    choices: [c("a", "One"), c("b", "Two"), c("c", "Five"), c("d", "All ten")],
    correct: "a",
    explanation: "The exam shows one question per screen.",
    hint: "The lesson says questions are shown one at a time.",
    related: { label: "Segment 1: exam structure", excerpt: "There are ten questions, shown one at a time.", start: 0, end: 75 },
  },
  {
    id: "p3-3-2", lessonId: "l3-3",
    text: "What percentage do you need to pass?",
    choices: [c("a", "50 percent"), c("b", "60 percent"), c("c", "70 percent"), c("d", "100 percent")],
    correct: "c",
    explanation: "The pass mark is seventy percent, and you can retry.",
    hint: "It is stated in the final segment.",
    related: { label: "Segment 4: review and pass mark", excerpt: "You need seventy percent to pass, and you may retry.", start: 225, end: 300 },
  },
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  { id: "e1", text: "What makes a structured examination method valuable?", choices: [c("a", "Findings become repeatable between examiners"), c("b", "It shortens every appointment"), c("c", "It removes the need for notes"), c("d", "It avoids talking to the patient")], correct: "a" },
  { id: "e2", text: "What should you do before beginning an examination?", choices: [c("a", "Begin quietly"), c("b", "Explain what will happen and ask permission"), c("c", "Wait for questions"), c("d", "Read notes aloud")], correct: "b" },
  { id: "e3", text: "Which description of position is the most precise?", choices: [c("a", "Near the top"), c("b", "On the left side"), c("c", "Two o'clock, three centimetres from the starting landmark"), c("d", "Where it feels different")], correct: "c" },
  { id: "e4", text: "The patient withdraws consent midway. What do you do?", choices: [c("a", "Stop immediately and ask how they wish to proceed"), c("b", "Complete the pattern"), c("c", "Continue lightly"), c("d", "Ask them to reconsider")], correct: "a" },
  { id: "e5", text: "Why should vertical lines slightly overlap?", choices: [c("a", "To use more pressure"), c("b", "To make the patient comfortable"), c("c", "So that no area is skipped"), c("d", "To speed things up")], correct: "c" },
  { id: "e6", text: "In which order is pressure applied at each position?", choices: [c("a", "Deep, medium, light"), c("b", "Light, medium, deep, back to light"), c("c", "Medium throughout"), c("d", "Random order")], correct: "b" },
  { id: "e7", text: "A patient reports discomfort. What is the right response?", choices: [c("a", "Reduce pressure straight away"), c("b", "Finish the position"), c("c", "Move faster"), c("d", "Ignore it")], correct: "a" },
  { id: "e8", text: "Which note is acceptable?", choices: [c("a", "Probably nothing"), c("b", "Two o'clock, about two centimetres, firm, noticed at medium pressure"), c("c", "Unusual"), c("d", "All good")], correct: "b" },
  { id: "e9", text: "You are unsure about something you feel. What next?", choices: [c("a", "Guess"), c("b", "Omit it"), c("c", "Follow the escalation process"), c("d", "Repeat until sure")], correct: "c" },
  { id: "e10", text: "Which are the four quality standards?", choices: [c("a", "Method, communication, documentation, hygiene"), c("b", "Speed, cost, length, volume"), c("c", "Method, speed, cost, hygiene"), c("d", "Documentation, length, cost, volume")], correct: "a" },
];

export const REMEDIATION = {
  title: "Audio recap: consent, pattern, pressure and notes",
  durationSeconds: 180,
  segments: [
    { start: 0, end: 45, text: "Let's take a calm look at the key ideas again. You have already shown that you understand much of this material, and this is a chance to strengthen it." },
    { start: 45, end: 90, text: "First, consent. Always explain, ask permission, and stop immediately if permission is withdrawn." },
    { start: 90, end: 135, text: "Second, method. Use the same starting landmark, vertical lines that overlap, and pressure in the order light, medium, deep, then light again." },
    { start: 135, end: 180, text: "Third, notes. Record position, size, texture and pressure. Use facts, not conclusions. If you are unsure, escalate. You can retry the exam when you are ready." },
  ],
  questions: [
    {
      id: "r1", lessonId: "remediation",
      text: "The patient reports discomfort during a position. What is the best action?",
      choices: [c("a", "Reduce pressure straight away"), c("b", "Finish the position first"), c("c", "Move faster to finish sooner")],
      correct: "a",
      explanation: "Patient comfort always comes first.",
      hint: "Comfort comes before completing the pattern.",
      related: { label: "Recap segment 2", excerpt: "Always explain, ask permission, and stop immediately if permission is withdrawn.", start: 45, end: 90 },
    },
    {
      id: "r2", lessonId: "remediation",
      text: "Which note follows good documentation practice?",
      choices: [c("a", "Looks harmless"), c("b", "Two o'clock, about two centimetres, firm, noticed at medium pressure"), c("c", "Nothing to report, probably")],
      correct: "b",
      explanation: "Good notes contain position, size, texture and pressure, and no conclusions.",
      hint: "Choose the note with facts, not conclusions.",
      related: { label: "Recap segment 4", excerpt: "Record position, size, texture and pressure. Use facts, not conclusions.", start: 135, end: 180 },
    },
  ] as PracticeQuestion[],
};

export const DEMO_ACCOUNTS: Account[] = [
  {
    id: "user-new",
    fullName: "Amara Okafor",
    email: "new.learner@example.org",
    password: "Learner#2026",
    role: "learner",
    preferredLanguage: "en",
    isDemo: true,
  },
  {
    id: "user-returning",
    fullName: "Jonas Weber",
    email: "returning.learner@example.org",
    password: "Learner#2026",
    role: "learner",
    preferredLanguage: "en",
    isDemo: true,
  },
];

/** Mock `access_codes` rows. */
export const ACCESS_CODES = [
  { code: "MTU-2026-DEMO", status: "active" },
  { code: "DPS-INVITE-001", status: "active" },
  { code: "MTU-OLD-2024", status: "expired" },
];

export const DEVICES = {
  clinic: "iPad in Clinic Room 2",
  home: "iPad at home",
} as const;

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const courseById = (id: string) => COURSES.find((cc) => cc.id === id);
export const lessonsForCourse = (courseId: string) =>
  LESSONS.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
export const practiceForLesson = (lessonId: string) =>
  PRACTICE_QUESTIONS.filter((q) => q.lessonId === lessonId);
