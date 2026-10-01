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
