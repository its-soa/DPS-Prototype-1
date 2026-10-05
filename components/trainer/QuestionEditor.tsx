"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { tr } from "@/lib/trainer/tr";
import type { TQuestion } from "@/lib/trainer/types";
import { failForm } from "./form-utils";

/** Used by both the quiz builder and the exam builder. Three answers, one correct, native radios. */
export function QuestionEditor({
  idPrefix, value, withFeedback, lessonOptions, onSave, onCancel, saveLabel,
}: {
  idPrefix: string;
  value?: TQuestion;
  withFeedback?: boolean;
  lessonOptions?: { id: string; title: string }[];
  onSave: (q: TQuestion) => void;
  onCancel?: () => void;
  saveLabel: string;
}) {
  const { announce } = useAnnouncer();
  const [text, setText] = useState(value?.text ?? "");
  const [answers, setAnswers] = useState<string[]>(value?.answers ?? ["", "", ""]);
  const [correct, setCorrect] = useState<number>(value?.correct ?? -1);
  const [okFb, setOkFb] = useState(value?.correctFeedback ?? "");
  const [badFb, setBadFb] = useState(value?.incorrectFeedback ?? "");
  const [lessonId, setLessonId] = useState(value?.lessonId ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const id = (s: string) => `${idPrefix}-${s}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!text.trim()) err[id("text")] = tr("Enter the question text.");
    answers.forEach((a, i) => { if (!a.trim()) err[id(`a${i}`)] = tr("Enter answer {n}.", { n: i + 1 }); });
    if (correct < 0) err[id("correct0")] = tr("Choose which answer is correct.");
    if (withFeedback && !okFb.trim()) err[id("ok")] = tr("Enter feedback for a correct answer.");
    if (withFeedback && !badFb.trim()) err[id("bad")] = tr("Enter feedback for an incorrect answer.");
    setErrors(err);
    if (failForm(err, [id("text"), id("a0"), id("a1"), id("a2"), id("correct0"), id("ok"), id("bad")], announce)) return;
    onSave({
      id: value?.id ?? `q-${Date.now().toString(36)}`,
      text: text.trim(), answers: answers.map((a) => a.trim()), correct,
      correctFeedback: withFeedback ? okFb.trim() : undefined,
      incorrectFeedback: withFeedback ? badFb.trim() : undefined,
      lessonId: lessonId || undefined,
    });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-label={saveLabel}>
      <Field id={id("text")} label={tr("Question text")} required error={errors[id("text")]}>
        {(a) => <textarea {...a} rows={3} value={text} onChange={(e) => setText(e.target.value)} className={textareaClass} />}
      </Field>
      {answers.map((a, i) => (
        <Field key={i} id={id(`a${i}`)} label={tr("Answer {n}", { n: i + 1 })} required error={errors[id(`a${i}`)]}>
          {(p) => <input {...p} type="text" value={a} onChange={(e) => setAnswers(answers.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />}
        </Field>
      ))}
      <fieldset className="space-y-2" aria-describedby={errors[id("correct0")] ? id("correct-err") : undefined}>
        <legend className="text-base font-semibold">{tr("Correct answer")} <span className="font-normal text-muted">{tr("(required)")}</span></legend>
        {answers.map((a, i) => (
          <label key={i} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
            <input id={id(`correct${i}`)} type="radio" name={id("correct")} checked={correct === i} onChange={() => setCorrect(i)} />
            <span>{tr("Answer {n} is correct", { n: i + 1 })}{a.trim() ? `: ${a.trim()}` : ""}</span>
          </label>
        ))}
        {errors[id("correct0")] && <p id={id("correct-err")} className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">{tr("Error:")} </span>{errors[id("correct0")]}</p>}
      </fieldset>
      {withFeedback && (
        <>
          <Field id={id("ok")} label={tr("Feedback for a correct answer")} required error={errors[id("ok")]}>
            {(p) => <textarea {...p} rows={2} value={okFb} onChange={(e) => setOkFb(e.target.value)} className={textareaClass} />}
          </Field>
          <Field id={id("bad")} label={tr("Feedback for an incorrect answer")} required error={errors[id("bad")]} description={tr("Explain the idea without giving the answer away. Learners can review the linked lesson.")}>
            {(p) => <textarea {...p} rows={2} value={badFb} onChange={(e) => setBadFb(e.target.value)} className={textareaClass} />}
          </Field>
        </>
      )}
      {lessonOptions && (
        <Field id={id("lesson")} label={tr("Linked lesson for remediation")} description={tr("Suggested as remediation when learners miss this question.")}>
          {(p) => (
            <select {...p} value={lessonId} onChange={(e) => setLessonId(e.target.value)} className={inputClass}>
              <option value="">{tr("No linked lesson")}</option>
              {lessonOptions.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          )}
        </Field>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg"><Save aria-hidden="true" className="size-5" /> {saveLabel}</Button>
        {onCancel && <Button variant="secondary" size="lg" onClick={onCancel}>{tr("Cancel")}</Button>}
      </div>
    </form>
  );
}
