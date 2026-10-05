"use client";

import { Accessibility, BarChart3, Lock, PencilRuler, Workflow } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tr } from "@/lib/trainer/tr";

export default function TrainerInfoPage() {
  const sections = [
    { id: "workflow", label: "Trainer workflow overview" },
    { id: "accessibility", label: "Accessibility support" },
    { id: "content", label: "Content management" },
    { id: "progress", label: "Learner progress tracking" },
    { id: "security", label: "Secure platform" },
  ];
  return (
    <>
      <PageIntro title={tr("A calm workspace for training medical tactile examiners")}
        instructions={tr("Build courses, guide learners, and see exactly where each person needs support, with tools designed to work with a screen reader from the start.")} />
      <div className="mb-8 flex flex-wrap gap-3">
        <ButtonLink href="/for-trainers/register" size="lg">{tr("Register as trainer")}</ButtonLink>
        <ButtonLink href="/for-trainers/sign-in" size="lg" variant="secondary">{tr("Sign in")}</ButtonLink>
      </div>
      <nav aria-label={tr("On this page")} className="mb-10">
        <h2 className="mb-3 text-xl">{tr("On this page")}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="flex min-h-12 items-center rounded-lg border-2 border-border-soft bg-surface px-4 font-semibold underline underline-offset-4 hover:bg-surface-strong">{tr(s.label)}</a></li>)}
        </ul>
      </nav>
      <div className="space-y-10">
        <section id="workflow" aria-labelledby="workflow-h" className="scroll-mt-6 space-y-3">
          <h2 id="workflow-h" className="flex items-center gap-2 text-2xl"><Workflow aria-hidden="true" className="size-6 text-primary" /> {tr("Trainer workflow overview")}</h2>
          <ol className="list-decimal space-y-1.5 pl-6 text-lg">
            <li>{tr("Create a training program and its required courses.")}</li>
            <li>{tr("Add lessons with audio, a transcript, supporting PDFs and glossary terms.")}</li>
            <li>{tr("Write practice quizzes and the final exam.")}</li>
            <li>{tr("Build a learning path that sets the order, then assign it to learners.")}</li>
            <li>{tr("Follow progress, support learners who struggle, and track certification.")}</li>
          </ol>
        </section>
        <section id="accessibility" aria-labelledby="a-h" className="scroll-mt-6">
          <Card className="space-y-3 border-primary bg-primary-soft">
            <h2 id="a-h" className="flex items-center gap-2 text-2xl"><Accessibility aria-hidden="true" className="size-6" /> {tr("Accessibility support")}</h2>
            <ul className="list-disc space-y-1.5 pl-6 text-lg">
              <li>{tr("Everything works with a keyboard and with VoiceOver on iPad.")}</li>
              <li>{tr("Every table has a simple list view as an alternative.")}</li>
              <li>{tr("Ordering uses Move up and Move down buttons. Nothing requires dragging.")}</li>
              <li>{tr("Saving, publishing, assigning and exporting are announced aloud.")}</li>
              <li>{tr("Text size, high contrast, dark theme and reduced motion settings.")}</li>
            </ul>
          </Card>
        </section>
        <section id="content" aria-labelledby="c-h" className="scroll-mt-6 space-y-3">
          <h2 id="c-h" className="flex items-center gap-2 text-2xl"><PencilRuler aria-hidden="true" className="size-6 text-primary" /> {tr("Content management")}</h2>
          <p className="max-w-prose text-lg">{tr("Create and update programs, courses, lessons, practice quizzes, exams and learning paths. Changes to a published lesson stay clearly marked until you republish them.")}</p>
        </section>
        <section id="progress" aria-labelledby="p-h" className="scroll-mt-6 space-y-3">
          <h2 id="p-h" className="flex items-center gap-2 text-2xl"><BarChart3 aria-hidden="true" className="size-6 text-primary" /> {tr("Learner progress tracking")}</h2>
          <p className="max-w-prose text-lg">{tr("See each learner's lessons, practice results and exam outcomes. Find the questions many learners miss, open the linked lesson, and improve the explanation.")}</p>
        </section>
        <section id="security" aria-labelledby="s-h" className="scroll-mt-6 space-y-3">
          <h2 id="s-h" className="flex items-center gap-2 text-2xl"><Lock aria-hidden="true" className="size-6 text-primary" /> {tr("Secure platform")}</h2>
          <p className="max-w-prose text-lg">{tr("This is a closed platform. Trainers see only the learners in their organization. Sign-in is required for every page of the trainer area.")}</p>
        </section>
      </div>
      <div className="mt-12 flex flex-wrap gap-3 border-t-2 border-border-soft pt-8">
        <ButtonLink href="/for-trainers/register" size="lg">{tr("Register as trainer")}</ButtonLink>
        <ButtonLink href="/for-trainers/sign-in" size="lg" variant="secondary">{tr("Sign in")}</ButtonLink>
      </div>
    </>
  );
}
