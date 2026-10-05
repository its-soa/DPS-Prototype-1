"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Link2, Send } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { failForm } from "@/components/trainer/form-utils";
import { QuestionList } from "@/components/trainer/QuestionList";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { lessonsOf, coursesOf } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const quiz = state.quizzes.find((q) => q.id === quizId && q.status !== "archived");
  const [title, setTitle] = useState(quiz?.title ?? "");
  const [lessonId, setLessonId] = useState(quiz?.lessonId ?? "");
  const [err, setErr] = useState<string>();
  const [needQ, setNeedQ] = useState(false);
  if (!quiz) return <><PageIntro title={tr("Quiz not found")} /><ButtonLink href="/trainer/programs">{tr("Back to programs")}</ButtonLink></>;
  const program = state.programs.find((p) => p.id === quiz.programId);
  const lessons = coursesOf(state, quiz.programId).flatMap((c) => lessonsOf(state, c.id));
  const linked = state.lessons.find((l) => l.id === quiz.lessonId);

  function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = title.trim() ? {} : { "quiz-title": tr("Enter a quiz title.") };
    setErr(errors["quiz-title"]);
    if (failForm(errors, ["quiz-title"], announce)) return;
    actions.updateQuiz(quiz!.id, { title: title.trim(), lessonId: lessonId || undefined });
    announce(tr("Quiz details saved."));
  }
  function publish() {
    if (!quiz!.questions.length) { setNeedQ(true); announce(tr("Add at least one question before publishing."), { assertive: true }); return; }
    setNeedQ(false);
    actions.publishQuiz(quiz!.id);
    announce(tr("Quiz published: {title}.", { title: quiz!.title }));
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: tr("Programs"), href: "/trainer/programs" }, { label: program?.title ?? "", href: program ? `/trainer/programs/${program.id}` : undefined }, { label: quiz.title }]} />
      <PageIntro title={quiz.title} eyebrow={tr("Practice quiz")} instructions={tr("Add questions with three answers each, then publish. Learners see only published quizzes.")} />
      <div className="flex flex-wrap items-center gap-3">
        <EntityStatus status={quiz.status} />
        <Button size="lg" onClick={publish}><Send aria-hidden="true" className="size-5" /> {quiz.status === "published" ? tr("Quiz is published") : tr("Publish quiz")}</Button>
      </div>
      {needQ && <Callout tone="warning" role="alert"><p className="font-semibold">{tr("Add at least one question before publishing.")}</p></Callout>}
      <Callout tone="info" className="flex items-start gap-2">
        <Link2 aria-hidden="true" className="mt-1 size-5 shrink-0" />
        <p>{linked ? <>{tr("Linked lesson:")} <Link className="font-semibold underline underline-offset-4" href={`/trainer/lessons/${linked.id}`}>{linked.title}</Link>. {tr("Learners who miss these questions are sent to this lesson.")}</> : tr("This quiz is not linked to a lesson, so learners get no remediation link.")}</p>
      </Callout>
      <Card>
        <form onSubmit={saveDetails} noValidate className="space-y-4" aria-label={tr("Quiz details")}>
          <h2 className="text-2xl">{tr("Quiz details")}</h2>
          <Field id="quiz-title" label={tr("Quiz title")} required error={err}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
          <Field id="quiz-lesson" label={tr("Linked lesson")}>{(a) => (
            <select {...a} value={lessonId} onChange={(e) => setLessonId(e.target.value)} className={inputClass}>
              <option value="">{tr("Not linked to a lesson")}</option>
              {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>)}</Field>
          <Button type="submit" variant="secondary">{tr("Save quiz details")}</Button>
        </form>
      </Card>
      <QuestionList noun={tr("practice")} withFeedback questions={quiz.questions}
        onSave={(q) => actions.saveQuizQuestion(quiz.id, q)} onRemove={(id) => actions.removeQuizQuestion(quiz.id, id)} onMove={(id, d) => actions.moveQuizQuestion(quiz.id, id, d)} />
    </div>
  );
}
