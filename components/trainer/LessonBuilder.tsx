"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Save, Send, X } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import type { TLesson } from "@/lib/trainer/types";
import { FilePlaceholder } from "./FilePlaceholder";
import { GlossaryEditor } from "./GlossaryEditor";
import { failForm } from "./form-utils";
import { EntityStatus } from "./StatusPill";

const SECTIONS = ["Lesson details", "Media and transcript", "Glossary", "Supporting materials", "Review and publish"];

export function LessonBuilder({ lesson }: { lesson: TLesson }) {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [title, setTitle] = useState(lesson.title);
  const [explanation, setExplanation] = useState(lesson.explanation);
  const [transcript, setTranscript] = useState(lesson.transcript);
  const [audio, setAudio] = useState(lesson.audio);
  const [pdf, setPdf] = useState(lesson.pdf);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<null | "draft" | "update" | "published">(null);

  const dirty = title !== lesson.title || explanation !== lesson.explanation || transcript !== lesson.transcript || audio !== lesson.audio || pdf !== lesson.pdf;
  const quizzes = state.quizzes.filter((q) => q.lessonId === lesson.id && q.status !== "archived");
  const course = state.courses.find((c) => c.id === lesson.courseId);

  // Arriving from "Open lesson explanation" (#explanation): land on the explanation field.
  useEffect(() => {
    if (window.location.hash === "#explanation") {
      const el = document.getElementById("lesson-explanation");
      el?.scrollIntoView({ block: "center" });
      el?.focus();
    }
  }, []);

  const required = [
    { ok: !!title.trim(), text: tr("Lesson title"), id: "lesson-title" },
    { ok: !!transcript.trim(), text: tr("Transcript"), id: "lesson-transcript" },
  ];
  const optional = [
    { ok: !!explanation.trim(), text: tr("Lesson explanation") },
    { ok: !!audio, text: tr("Audio file") },
    { ok: !!pdf, text: tr("Supporting PDF") },
    { ok: lesson.glossaryIds.length > 0, text: tr("Glossary terms") },
  ];

  function persist() {
    const err: Record<string, string> = {};
    if (!title.trim()) err["lesson-title"] = tr("Enter a lesson title.");
    setErrors(err);
    if (failForm(err, ["lesson-title"], announce)) return false;
    actions.updateLesson(lesson.id, { title: title.trim(), explanation, transcript, audio, pdf });
    return true;
  }
  function save() {
    if (!persist()) return;
    const wasPublished = lesson.status === "published" || lesson.status === "changes-pending";
    setSaved(wasPublished ? "update" : "draft");
    announce(wasPublished ? tr("Lesson explanation updated. Republish to make the change available to learners.") : tr("Lesson saved as a draft."));
  }
  function publish() {
    const err: Record<string, string> = {};
    required.forEach((r) => { if (!r.ok) err[r.id] = r.id === "lesson-title" ? tr("Enter a lesson title.") : tr("Add a transcript before publishing."); });
    setErrors(err);
    if (failForm(err, ["lesson-title", "lesson-transcript"], announce)) return;
    actions.updateLesson(lesson.id, { title: title.trim(), explanation, transcript, audio, pdf });
    actions.publishLesson(lesson.id);
    setSaved("published");
    announce(tr("Lesson published: {title}.", { title: title.trim() }));
  }

  return (
    <div className="space-y-8">
      <nav aria-label={tr("Lesson sections")}>
        <ol className="flex flex-wrap gap-2">
          {SECTIONS.map((s, i) => <li key={s}><a href={`#sec-${i + 1}`} className="inline-flex min-h-12 items-center rounded-lg border-2 border-border-soft bg-surface px-4 font-semibold underline underline-offset-4">{i + 1}. {tr(s)}</a></li>)}
        </ol>
      </nav>
      <div className="flex flex-wrap items-center gap-3">
        <EntityStatus status={lesson.status} />
        {dirty && <span className="font-semibold text-warning">{tr("You have unsaved changes.")}</span>}
      </div>

      {saved === "update" && (
        <Callout tone="warning" role="status" className="space-y-2">
          <p className="text-lg font-bold">{tr("Lesson explanation updated")}</p>
          <p>{tr("Republish to make the change available to learners.")}</p>
          <Button onClick={publish}><Send aria-hidden="true" className="size-5" /> {tr("Republish lesson")}</Button>
        </Callout>
      )}
      {saved === "published" && <Callout tone="success" role="status"><p className="text-lg font-bold">{tr("Lesson published")}</p><p>{tr("Learners can now see the latest version.")}</p></Callout>}
      {saved === "draft" && <Callout tone="info" role="status"><p className="text-lg font-bold">{tr("Lesson saved as a draft")}</p></Callout>}

      <section id="sec-1" aria-labelledby="s1" className="scroll-mt-6 space-y-4">
        <h2 id="s1" className="text-2xl">1. {tr("Lesson details")}</h2>
        <Field id="lesson-title" label={tr("Lesson title")} required error={errors["lesson-title"]}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
        <div id="explanation" className="scroll-mt-6">
          <Field id="lesson-explanation" label={tr("Lesson explanation")} description={tr("The summary learners read after the lesson. Improve it when many learners miss the related questions.")}>
            {(a) => <textarea {...a} rows={5} value={explanation} onChange={(e) => setExplanation(e.target.value)} className={textareaClass} />}
          </Field>
        </div>
      </section>

      <section id="sec-2" aria-labelledby="s2" className="scroll-mt-6 space-y-4">
        <h2 id="s2" className="text-2xl">2. {tr("Media and transcript")}</h2>
        <FilePlaceholder id="lesson-audio" kind="audio" label={tr("Audio file")} hint={tr("MP3 recommended. In this prototype only the file name is recorded.")} accept="audio/*" value={audio} onChange={setAudio} sample={{ name: `${lesson.id}-narration.mp3`, sizeKb: 5120 }} />
        <Field id="lesson-transcript" label={tr("Transcript")} required error={errors["lesson-transcript"]} description={tr("Type or paste the full transcript. Separate paragraphs with a blank line. You can also import a text file.")}>
          {(a) => <textarea {...a} rows={12} value={transcript} onChange={(e) => setTranscript(e.target.value)} className={textareaClass} />}
        </Field>
        <div>
          <label htmlFor="transcript-file" className="mb-1 block font-semibold">{tr("Import transcript from a text file")}</label>
          <input id="transcript-file" type="file" accept=".txt,text/plain" className="block min-h-12 w-full max-w-md rounded-lg border-2 border-border bg-background px-3 py-2"
            onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setTranscript(await f.text()); announce(tr("Transcript imported from {name}.", { name: f.name })); }} />
        </div>
      </section>

      <section id="sec-3" aria-labelledby="s3" className="scroll-mt-6 space-y-4">
        <h2 id="s3" className="text-2xl">3. {tr("Glossary")}</h2>
        <p className="text-sm text-muted">{tr("Glossary changes are saved straight away.")}</p>
        <GlossaryEditor lesson={lesson} />
      </section>

      <section id="sec-4" aria-labelledby="s4" className="scroll-mt-6 space-y-4">
        <h2 id="s4" className="text-2xl">4. {tr("Supporting materials")}</h2>
        <FilePlaceholder id="lesson-pdf" kind="pdf" label={tr("Supporting PDF")} hint={tr("A tagged, accessible PDF works best. In this prototype only the file name is recorded.")} accept="application/pdf" value={pdf} onChange={setPdf} sample={{ name: `${lesson.id}-handbook.pdf`, sizeKb: 420 }} />
      </section>

      <section id="sec-5" aria-labelledby="s5" className="scroll-mt-6 space-y-4">
        <h2 id="s5" className="text-2xl">5. {tr("Review and publish")}</h2>
        <Card className="space-y-3">
          <h3 className="text-xl">{tr("Required before publishing")}</h3>
          <ul className="space-y-1">{required.map((r) => <li key={r.id} className="flex items-center gap-2">{r.ok ? <Check aria-hidden="true" className="size-5 text-success" /> : <X aria-hidden="true" className="size-5 text-danger" />}<span><span className="sr-only">{r.ok ? tr("Done:") : tr("Missing:")} </span>{r.text}</span></li>)}</ul>
          <h3 className="text-xl">{tr("Recommended")}</h3>
          <ul className="space-y-1">{optional.map((r) => <li key={r.text} className="flex items-center gap-2">{r.ok ? <Check aria-hidden="true" className="size-5 text-success" /> : <X aria-hidden="true" className="size-5 text-muted" />}<span><span className="sr-only">{r.ok ? tr("Done:") : tr("Not added:")} </span>{r.text}</span></li>)}</ul>
        </Card>
        <Card className="space-y-2">
          <h3 className="text-xl">{tr("Practice quiz")}</h3>
          {quizzes.length ? <ul className="space-y-1">{quizzes.map((q) => <li key={q.id}><Link href={`/trainer/quizzes/${q.id}`} className="font-semibold underline underline-offset-4">{q.title}</Link> <EntityStatus status={q.status} /></li>)}</ul> : <p className="text-muted">{tr("No practice quiz linked to this lesson yet.")}</p>}
          {!quizzes.length && course && (
            <Button variant="secondary" onClick={() => { const id = actions.createQuiz({ programId: course.programId, lessonId: lesson.id, title: tr("Practice: {title}", { title: lesson.title }) }); announce(tr("Quiz created for this lesson.")); router.push(`/trainer/quizzes/${id}`); }}>{tr("Create a practice quiz for this lesson")}</Button>
          )}
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" variant="secondary" onClick={save}><Save aria-hidden="true" className="size-5" /> {lesson.status === "draft" ? tr("Save draft") : tr("Save changes")}</Button>
          <Button size="lg" onClick={publish}><Send aria-hidden="true" className="size-5" /> {lesson.status === "published" ? tr("Lesson is published") : lesson.status === "changes-pending" ? tr("Republish lesson") : tr("Publish lesson")}</Button>
        </div>
      </section>
    </div>
  );
}
