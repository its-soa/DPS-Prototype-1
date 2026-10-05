# MTU Training Platform: accessibility-first prototype

Clickable partner-feedback prototype for visually impaired medical tactile examiners (MTUs).
Next.js 16 · React 19 · TypeScript · Tailwind 4 · lucide-react · Framer Motion · Supabase-ready.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Try the journey
Info page → Register (code `MTU-2026-DEMO`) → Sign in → Onboarding (turn on audio guidance) → Dashboard → Lesson → Practice → Progress → Exam → Fail → Remediation → Retry → Pass → Certification.

Demo accounts (password `Learner#2026`), shown on the sign-in page:
- `new.learner@example.org`: first login, onboarding.
- `returning.learner@example.org`: course 1 done, lesson 2.2 saved at 5:12 from "iPad in Clinic Room 2". Use "Signing in from" to simulate another device.

Reviewer shortcuts live in the footer ("Prototype tools"): mark all courses complete, reset demo data. Each lesson player also has a "Skip to the end (prototype)" button.

## Prototype rules to know
- Media playback is **simulated** with a timer (no MP3/MP4 files). `LessonAudioPlayer` is the seam to swap in `<audio>`/`<video>`.
- Exam attempt 1 always fails and attempt 2+ always passes, so both journeys can be shown. The result page says so.
- Lesson formats: audio, video (audio described), formatted text, PDF handbook reader. Every course mixes at least two formats.
- Persistence is `localStorage` via `lib/persistence.ts`. Passwords are stored in plain text for the mock only.
- Languages: English and German, switchable from the header on any page and remembered. French exists only as a hidden placeholder (`NEXT_PUBLIC_SHOW_PLACEHOLDER_LANG=1` shows it).

## Structure
- `app/(public)`: info, register, sign-in. `app/(learner)`: guarded pages (dashboard, courses, lessons, practice, progress, exam/*, certification, settings, onboarding).
- `components/a11y`: `AccessiblePageShell`, `SkipToContent`, `AudioGuidanceToggle`, `ScreenReaderAnnouncement` (persistent polite/assertive live regions), `PageIntro` (h1, title, focus, repeat-instructions text), `AccessibilitySettingsPanel`.
- `components/learning`, `components/exam`, `components/cert`: player, transcript, PDF reader, practice, navigator, toast, certification cards.
- `lib/mock-data.ts`, `lib/store.tsx`, `lib/progress.ts`.
- `supabase/schema.sql`, `rls.sql` (placeholders), `seed.sql`; `lib/dh-adapter.ts` (DH knowledge-management placeholder).

## Accessibility approach
Native controls (radio, checkbox, select, range, dialog, progress); landmarks and one h1 per page; focus moves to the h1 after navigation; skip link; status shown as icon + text; live announcements for sign-in, onboarding, progress, answers, exam submission and result; text size, high contrast, dark theme and reduced motion (also honours the OS setting); no autoplay, drag or hover-only UI.
Automated checks only covered flow and focus. **Real VoiceOver on iPad testing is still needed.**

## Online preview (GitHub Pages)
`.github/workflows/pages.yml` builds a static export (`output: "export"`) and deploys it on every push to `main` or the working branch.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**. The site is then at `https://<org>.github.io/<repo>/`.
Local dev is unaffected (`BASE_PATH` is only set in CI).

## Translations
- **Interface text:** `lib/i18n/en/*.ts` is the source; `lib/i18n/de/*.ts` must contain every English key (the compiler enforces it). Plurals use `key.one` / `key.other`; `**bold**` markers are allowed in strings.
- **Course content** (courses, lessons, transcripts, practice and exam questions, remediation): English lives in `lib/mock-data.ts`; German text only is in `lib/content/de.ts`, keyed by the same ids. Answer keys and timings are never translated, so a translator cannot break scoring.
- **Reviewing German:** send reviewers `lib/i18n/de/*.ts` and `lib/content/de.ts`. Terminology decisions are listed at the top of `lib/content/de.ts`.
- **Adding a language:** add `lib/i18n/<code>/`, a content pack, and register both in `lib/i18n.ts` and `lib/localize.ts`.

## Trainer portal (`feature/trainer-portal`)
A second area of the same app for trainers. The learner flow is unchanged.

- **Entry:** `/for-trainers` (info), `/for-trainers/register`, `/for-trainers/sign-in`. The sign-in opens with the demo trainer **alex.trainer@example.org** (password `Trainer#2026`) already filled in. A second demo trainer is `priya.trainer@example.org`. Learner accounts are refused on the trainer sign-in and the other way round.
- **Workspace:** `/trainer` with a persistent sidebar: Dashboard, Programs, Courses, Learners, Cohort progress, Exam progress, Certifications, Reports. Detail routes: `/trainer/programs/[id]`, `courses/[id]`, `lessons/[id]`, `quizzes/[id]`, `exams/[id]`, `learning-paths/[id]`, `learners/[id]`, `progress/[learnerId]`, `progress/questions`, `exam-progress/[learnerId]`, `certifications/[learnerId]`.
- **Role in this prototype:** one `trainer` role with full create / read / update / publish and learner management. Delete is "archive with confirmation". Master Trainer and System Admin (user and system management) are a later phase; `Account.role` is the place to extend.
- **Data:** `lib/trainer/seed.ts` seeds one program (the three learner courses and nine lessons), published quizzes, one exam, one learning path, and six learners (Maxi plus five others at different stages). `lib/trainer/store.tsx` persists to `localStorage` under its own key; reviewers can reset it from the footer. Nothing is sent anywhere.
- **Linked loops:** question performance → lesson explanation (`#explanation`) → save → republish; failed exam → assign remediation → unlock retry → simulated retry (clearly labelled prototype helper) → certification active.
- **Text:** all trainer-area text goes through `tr("English text")` (`lib/trainer/tr.ts`), keyed by the English source, so a German dictionary can be added later without touching pages. Trainer pages set the page language to English.
- **Accessibility conventions:** every list has a table view and a list view; ordering uses Move up / Move down (and a position field in learning paths); saves, publishes, assignments and exports are announced; dialogs use native `<dialog>`; status is always icon plus text. All trainer pages were checked with axe (WCAG 2.0 to 2.2 AA) in standard, dark, high-contrast and largest-text settings.
- **Schema:** `supabase/trainer.sql` extends the existing tables (it does not duplicate them) and adds placeholder organization-scoped RLS.
- **Hosting note:** trainers create new ids at runtime, so this branch needs the normal Next.js server build (Vercel does this by default). The GitHub Pages workflow sets `STATIC_EXPORT=1` and only suits the learner-only branches; remove or adapt it before merging this branch to `main`.
