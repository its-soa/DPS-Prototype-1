"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { ConfirmDialog } from "@/components/exam/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tr } from "@/lib/trainer/tr";
import type { TQuestion } from "@/lib/trainer/types";
import { MoveButtons } from "./MoveButtons";
import { QuestionEditor } from "./QuestionEditor";

/** Saved questions (edit / remove / reorder) plus the editor for a new question. Shared by quizzes and exams. */
export function QuestionList({ questions, withFeedback, lessonOptions, onSave, onRemove, onMove, noun }: {
  questions: TQuestion[]; withFeedback?: boolean; lessonOptions?: { id: string; title: string }[]; noun: string;
  onSave: (q: TQuestion) => void; onRemove: (id: string) => void; onMove: (id: string, dir: -1 | 1) => void;
}) {
  const { announce } = useAnnouncer();
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<TQuestion | null>(null);
  const [formKey, setFormKey] = useState(0);

  return (
    <div className="space-y-6">
      <section aria-labelledby="qs-h" className="space-y-3">
        <h2 id="qs-h" className="text-2xl">{tr("Questions")} ({questions.length})</h2>
        {questions.length === 0 && <p className="text-muted">{tr("No questions yet. Add the first one below.")}</p>}
        <ol className="space-y-3">
          {questions.map((q, i) => (
            <li key={q.id} className="space-y-3 rounded-xl border-2 border-border-soft bg-surface p-4">
              {editing === q.id ? (
                <QuestionEditor idPrefix={`edit-${q.id}`} value={q} withFeedback={withFeedback} lessonOptions={lessonOptions} saveLabel={tr("Save changes to question {n}", { n: i + 1 })}
                  onCancel={() => setEditing(null)} onSave={(nq) => { onSave(nq); setEditing(null); announce(tr("Question {n} saved.", { n: i + 1 })); }} />
              ) : (
                <>
                  <p className="text-lg font-bold">{tr("Question {n}", { n: i + 1 })}: {q.text}</p>
                  <ul className="list-disc pl-6">
                    {q.answers.map((a, j) => <li key={j}>{a}{j === q.correct && <strong> ({tr("correct answer")})</strong>}</li>)}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => setEditing(q.id)}><Pencil aria-hidden="true" className="size-5" /> {tr("Edit")}<span className="sr-only"> {tr("question {n}", { n: i + 1 })}</span></Button>
                    <Button variant="secondary" onClick={() => setRemoving(q)}><Trash2 aria-hidden="true" className="size-5" /> {tr("Remove")}<span className="sr-only"> {tr("question {n}", { n: i + 1 })}</span></Button>
                    <MoveButtons label={tr("question {n}", { n: i + 1 })} index={i} count={questions.length} onMove={(d) => { onMove(q.id, d); announce(tr("Question {n} moved {dir}.", { n: i + 1, dir: d < 0 ? tr("up") : tr("down") })); }} />
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>
      <Card>
        <h2 className="mb-4 text-2xl">{tr("Add a {noun} question", { noun })}</h2>
        <QuestionEditor key={formKey} idPrefix="new-q" withFeedback={withFeedback} lessonOptions={lessonOptions} saveLabel={tr("Save question")}
          onSave={(q) => { onSave(q); announce(tr("Question {n} saved. You can add the next question.", { n: questions.length + 1 })); setFormKey((k) => k + 1); requestAnimationFrame(() => document.getElementById("new-q-text")?.focus()); }} />
      </Card>
      <ConfirmDialog open={!!removing} title={tr("Remove this question?")} confirmLabel={tr("Yes, remove question")} cancelLabel={tr("No, keep it")}
        onCancel={() => setRemoving(null)} onConfirm={() => { if (removing) { onRemove(removing.id); announce(tr("Question removed.")); } setRemoving(null); }}>
        <p>{removing?.text}</p>
      </ConfirmDialog>
    </div>
  );
}
