"use client";

import { Accessibility, Globe2, Lock, ShieldCheck, Smartphone, Target, UserCheck } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";

const SECTIONS = [
  { id: "purpose", label: "Training purpose" },
  { id: "accessibility", label: "Accessibility support" },
  { id: "why", label: "Why this platform exists" },
  { id: "requirements", label: "Entry requirements" },
  { id: "devices", label: "Supported devices" },
  { id: "languages", label: "Multilingual support" },
  { id: "security", label: "Secure, closed access" },
];

export default function InfoPage() {
  const { t } = useApp();
  return (
    <>
      <PageIntro
        title={t("info.title")}
        instructions={t("info.lead")}
      />
      <div className="mb-10 flex flex-wrap gap-3">
        <ButtonLink href="/register" size="lg">{t("info.cta.register")}</ButtonLink>
        <ButtonLink href="/sign-in" size="lg" variant="secondary">{t("info.cta.signIn")}</ButtonLink>
      </div>

      <nav aria-label="On this page" className="mb-10">
        <h2 className="mb-3 text-xl">On this page</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex min-h-12 items-center rounded-lg border-2 border-border-soft bg-surface px-4 text-base font-semibold underline underline-offset-4 hover:bg-surface-strong">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        <section id="purpose" aria-labelledby="purpose-h" className="scroll-mt-6 space-y-3">
          <h2 id="purpose-h" className="flex items-center gap-2 text-2xl"><Target aria-hidden="true" className="size-6 text-primary" /> Training purpose</h2>
          <p className="max-w-prose text-lg">
            This platform prepares visually impaired medical examiners (MTUs) for qualification, recertification and continuing education.
            You complete three required courses, practise after every lesson, and then take the certification exam.
          </p>
        </section>

        <section id="accessibility" aria-labelledby="accessibility-h" className="scroll-mt-6">
          <Card className="space-y-4 border-primary bg-primary-soft">
            <h2 id="accessibility-h" className="flex items-center gap-2 text-2xl"><Accessibility aria-hidden="true" className="size-6" /> Accessibility support</h2>
            <p className="max-w-prose text-lg">Accessibility is the architecture of this platform, not an add-on.</p>
            <ul className="list-disc space-y-1.5 pl-6 text-lg">
              <li>Built and tested for screen readers, including VoiceOver on iPad.</li>
              <li>Every lesson has audio or a readable format, plus a full transcript.</li>
              <li>Audio guidance you switch on or off, and it never starts by itself.</li>
              <li>Full keyboard use, large touch targets and visible focus on every control.</li>
              <li>Text size, high contrast, dark theme and reduced motion settings.</li>
              <li>Spoken confirmations when your answers and progress are saved.</li>
              <li>Braille-ready downloads for related materials.</li>
            </ul>
          </Card>
        </section>

        <section id="why" aria-labelledby="why-h" className="scroll-mt-6 space-y-3">
          <h2 id="why-h" className="flex items-center gap-2 text-2xl"><ShieldCheck aria-hidden="true" className="size-6 text-primary" /> Why this platform exists</h2>
          <p className="max-w-prose text-lg">
            Most learning systems are hard or impossible to use with a screen reader: unclear navigation, inaccessible exams and documents that do not work with adaptive hardware.
            That has slowed international certification for MTUs. This platform is designed from the start for blind and low-vision examiners.
          </p>
        </section>

        <section id="requirements" aria-labelledby="req-h" className="scroll-mt-6 space-y-3">
          <h2 id="req-h" className="flex items-center gap-2 text-2xl"><UserCheck aria-hidden="true" className="size-6 text-primary" /> Entry requirements</h2>
          <ul className="list-disc space-y-1.5 pl-6 text-lg">
            <li>An invitation or access code from your training centre.</li>
            <li>An email address you can access.</li>
            <li>An iPad or another device with a screen reader (recommended).</li>
          </ul>
        </section>

        <section id="devices" aria-labelledby="dev-h" className="scroll-mt-6 space-y-3">
          <h2 id="dev-h" className="flex items-center gap-2 text-2xl"><Smartphone aria-hidden="true" className="size-6 text-primary" /> Supported devices</h2>
          <p className="max-w-prose text-lg">
            Optimised for iPad in portrait with VoiceOver. Also works with a keyboard on a computer, and with Braille displays.
            Your progress is saved, so you can continue on a different device.
          </p>
        </section>

        <section id="languages" aria-labelledby="lang-h" className="scroll-mt-6 space-y-3">
          <h2 id="lang-h" className="flex items-center gap-2 text-2xl"><Globe2 aria-hidden="true" className="size-6 text-primary" /> Multilingual support</h2>
          <p className="max-w-prose text-lg">
            Use the language selector in the page header. This prototype shows English and German, with a French placeholder to show how further languages will work.
          </p>
        </section>

        <section id="security" aria-labelledby="sec-h" className="scroll-mt-6 space-y-3">
          <h2 id="sec-h" className="flex items-center gap-2 text-2xl"><Lock aria-hidden="true" className="size-6 text-primary" /> Secure, closed access</h2>
          <p className="max-w-prose text-lg">
            This is a closed platform. You can only register with a valid access code, and you only see your own progress and results.
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t-2 border-border-soft pt-8">
        <ButtonLink href="/register" size="lg">{t("info.cta.register")}</ButtonLink>
        <ButtonLink href="/sign-in" size="lg" variant="secondary">{t("info.cta.signIn")}</ButtonLink>
      </div>
    </>
  );
}
