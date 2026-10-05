"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Send } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, textareaClass } from "@/components/ui/field";
import { ProgressBar } from "@/components/ui/progress";
import { courseProgress, lessonsOf, overallPercent } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import type { TLearner } from "@/lib/trainer/types";
import { formatDate } from "@/lib/utils";
import { failForm } from "./form-utils";
import { StatusPill } from "./StatusPill";

export function LearnerProgressPanel({ learner, trainerName }: { learner: TLearner; trainerName: string }) {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const [note, setNote] = useState("");
  const [err, setErr] = useState<string>();
  const progress = courseProgress(state, learner);
  const pct = overallPercent(state, learner);
  const first = learner.fullName.split(" ")[0];

  const results = state.quizzes.filter((q) => learner.practice[q.id]).map((q) => {
    const r = learner.practice[q.id];
    return { quiz: q, score: r.total - r.missed.length, total: r.total, missed: r.missed };
  });
  const incorrect = results.flatMap((r) => r.missed.map((id) => ({ q: r.quiz.questions.find((x) => x.id === id), quiz: r.quiz }))).filter((x) => x.q);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = note.trim() ? {} : { "note-text": tr("Write a short note for {name}.", { name: first }) };
    setErr(errors["note-text"]);
    if (failForm(errors, ["note-text"], announce)) return;
    actions.sendNote(learner.id, note.trim(), trainerName);
    announce(tr("Remediation note sent to {name}.", { name: learner.fullName }));
    setNote("");
  }

  return (
    <div className="space-y-8">
      <Card className="space-y-3">
        <h2 className="text-2xl">{tr("Overall progress")}</h2>
        <ProgressBar value={pct} label={tr("{name}: {pct} percent of lessons complete", { name: learner.fullName, pct })} />
        <p className="text-lg">{learner.lastActive ? tr("Last active {date}.", { date: formatDate(learner.lastActive, "en-GB") }) : tr("Has not signed in yet.")}</p>
      </Card>

      <section aria-labelledby="seq-h" className="space-y-3">
        <h2 id="seq-h" className="text-2xl">{tr("Courses and lessons")}</h2>
        {progress.map((c) => (
          <Card key={c.course.id} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl">{c.course.order}. {c.course.title}</h3>
              <StatusPill label={c.status === "complete" ? tr("Completed") : c.status === "in-progress" ? tr("In progress") : tr("Upcoming")} tone={c.status === "complete" ? "success" : c.status === "in-progress" ? "info" : "neutral"} />
            </div>
            <ul className="space-y-1">
              {lessonsOf(state, c.course.id).filter((l) => l.countsForProgress && l.status !== "draft").map((l) => {
                const st = learner.lessonStatus[l.id];
                return (
                  <li key={l.id} className="flex flex-wrap items-center gap-2">
                    {st === "complete" ? <Check aria-hidden="true" className="size-5 text-success" /> : <span aria-hidden="true" className="inline-block size-5" />}
                    <Link href={`/trainer/lessons/${l.id}`} className="underline underline-offset-4">{l.title}</Link>
                    <span className="text-muted">({st === "complete" ? tr("completed") : st === "in-progress" ? tr("in progress") : tr("not started")})</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </section>

      <section aria-labelledby="quiz-h" className="space-y-3">
        <h2 id="quiz-h" className="text-2xl">{tr("Practice quiz results")}</h2>
        {results.length ? (
          <ul className="space-y-1">{results.map((r) => <li key={r.quiz.id} className="flex flex-wrap justify-between gap-2 rounded-lg border-2 border-border-soft bg-surface px-3 py-2"><span>{r.quiz.title}</span><strong>{tr("{score} of {total} correct", { score: r.score, total: r.total })}</strong></li>)}</ul>
        ) : <p className="text-muted">{tr("No practice quizzes completed yet.")}</p>}
      </section>

      <section aria-labelledby="inc-h" className="space-y-3">
        <h2 id="inc-h" className="text-2xl">{tr("Incorrect practice answers")} ({incorrect.length})</h2>
        {incorrect.length ? (
          <ul className="space-y-3">
            {incorrect.map(({ q, quiz }) => (
              <li key={q!.id} className="space-y-1 rounded-xl border-2 border-warning bg-warning-soft p-4">
                <p className="text-lg font-semibold">{q!.text}</p>
                <p>{tr("Correct answer:")} {q!.answers[q!.correct]}</p>
                {quiz.lessonId && <Link href={`/trainer/lessons/${quiz.lessonId}`} className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{tr("Open linked lesson material")}<span className="sr-only">: {state.lessons.find((l) => l.id === quiz.lessonId)?.title}</span></Link>}
              </li>
            ))}
          </ul>
        ) : <p className="text-muted">{tr("No incorrect answers recorded.")}</p>}
      </section>

      <section aria-labelledby="note-h" className="space-y-3">
        <h2 id="note-h" className="text-2xl">{tr("Remediation note")}</h2>
        <Card>
          <form onSubmit={send} noValidate className="space-y-4" aria-label={tr("Send a remediation note")}>
            <Field id="note-text" label={tr("Note for {name}", { name: first })} required error={err} description={tr("For example: which lesson to revisit and what to focus on.")}>
              {(a) => <textarea {...a} rows={4} value={note} onChange={(e) => setNote(e.target.value)} className={textareaClass} />}
            </Field>
            <Button type="submit"><Send aria-hidden="true" className="size-5" /> {tr("Send remediation note")}</Button>
          </form>
        </Card>
        {learner.notes.length > 0 && (
          <ul className="space-y-2" aria-label={tr("Notes already sent")}>{learner.notes.map((n) => <li key={n.at} className="rounded-xl border-2 border-border-soft bg-surface p-3"><p>{n.text}</p><p className="text-sm text-muted">{n.by}, {formatDate(n.at, "en-GB")}</p></li>)}</ul>
        )}
      </section>
    </div>
  );
}
