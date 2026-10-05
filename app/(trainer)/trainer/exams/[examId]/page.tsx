"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { failForm } from "@/components/trainer/form-utils";
import { QuestionList } from "@/components/trainer/QuestionList";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { coursesOf, lessonsOf } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const exam = state.exams.find((e) => e.id === examId && e.status !== "archived");
  const [title, setTitle] = useState(exam?.title ?? "");
  const [instructions, setInstructions] = useState(exam?.instructions ?? "");
  const [passing, setPassing] = useState(String(exam?.passingScore ?? 70));
  const [retries, setRetries] = useState(String(exam?.retryLimit ?? 3));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedOk, setSavedOk] = useState(false);
  if (!exam) return <><PageIntro title={tr("Exam not found")} /><ButtonLink href="/trainer/programs">{tr("Back to programs")}</ButtonLink></>;
  const program = state.programs.find((p) => p.id === exam.programId);
  const lessons = coursesOf(state, exam.programId).flatMap((c) => lessonsOf(state, c.id));

  function save(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    const p = Number(passing), r = Number(retries);
    if (!title.trim()) err["exam-title"] = tr("Enter an exam title.");
    if (!instructions.trim()) err["exam-instructions"] = tr("Enter the exam instructions learners will hear first.");
    if (!Number.isFinite(p) || p < 1 || p > 100) err["exam-passing"] = tr("Enter a passing score between 1 and 100 percent.");
    if (!Number.isInteger(r) || r < 1 || r > 10) err["exam-retries"] = tr("Enter a retry limit between 1 and 10.");
    if (!exam!.questions.length) err["new-q-text"] = tr("Add at least one question before saving the exam.");
    setErrors(err); setSavedOk(false);
    if (failForm(err, ["exam-title", "exam-instructions", "exam-passing", "exam-retries", "new-q-text"], announce)) return;
    actions.updateExam(exam!.id, { title: title.trim(), instructions: instructions.trim(), passingScore: p, retryLimit: r });
    actions.saveExam(exam!.id);
    setSavedOk(true);
    announce(tr("Exam saved. It is now available for learning path assignment."));
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: tr("Programs"), href: "/trainer/programs" }, { label: program?.title ?? "", href: program ? `/trainer/programs/${program.id}` : undefined }, { label: exam.title }]} />
      <PageIntro title={exam.title} eyebrow={tr("Final exam")} instructions={tr("Set the instructions, passing score and retry limit, add questions, then save. A saved exam can be added to a learning path.")} />
      <EntityStatus status={exam.status} />
      <Card>
        <form onSubmit={save} noValidate className="space-y-5" aria-label={tr("Exam settings")}>
          <h2 className="text-2xl">{tr("Exam settings")}</h2>
          <Field id="exam-title" label={tr("Exam title")} required error={errors["exam-title"]}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
          <Field id="exam-instructions" label={tr("Exam instructions")} required error={errors["exam-instructions"]}>{(a) => <textarea {...a} rows={4} value={instructions} onChange={(e) => setInstructions(e.target.value)} className={textareaClass} />}</Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="exam-passing" label={tr("Passing score (percent)")} required error={errors["exam-passing"]}>{(a) => <input {...a} inputMode="numeric" value={passing} onChange={(e) => setPassing(e.target.value)} className={inputClass} />}</Field>
            <Field id="exam-retries" label={tr("Retry limit (attempts)")} required error={errors["exam-retries"]}>{(a) => <input {...a} inputMode="numeric" value={retries} onChange={(e) => setRetries(e.target.value)} className={inputClass} />}</Field>
          </div>
          {errors["new-q-text"] && <p className="font-semibold text-danger"><span aria-hidden="true">⚠ </span>{errors["new-q-text"]}</p>}
          <Button type="submit" size="lg"><Save aria-hidden="true" className="size-5" /> {tr("Save exam")}</Button>
          {savedOk && <Callout tone="success" role="status"><p className="font-bold">{tr("Exam saved")}</p><p>{tr("It is now available for learning path assignment.")}</p></Callout>}
        </form>
      </Card>
      <QuestionList noun={tr("exam")} questions={exam.questions} lessonOptions={lessons.map((l) => ({ id: l.id, title: l.title }))}
        onSave={(q) => actions.saveExamQuestion(exam.id, q)} onRemove={(id) => actions.removeExamQuestion(exam.id, id)} onMove={(id, d) => actions.moveExamQuestion(exam.id, id, d)} />
    </div>
  );
}
