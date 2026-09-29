"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import type { PracticeQuestion } from "@/lib/types";

type Result = { selected: string; correct: boolean } | null;

/**
 * One practice question. Native radio group inside a fieldset/legend.
 * Feedback appears directly after the Submit button and is announced politely.
 */
export function PracticeQuestionCard({
  question, number, total, onSubmit, onOpenSegment, onContinue, continueLabel,
}: {
  question: PracticeQuestion;
  number: number;
  total: number;
  onSubmit: (selected: string, correct: boolean) => void;
  onOpenSegment: () => void;
  onContinue: () => void;
  continueLabel: string;
}) {
  const { announce } = useAnnouncer();
  const [selected, setSelected] = useState<string>("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string>();
  const legendRef = useRef<HTMLLegendElement>(null);
  const name = `q-${question.id}`;

  useEffect(() => { legendRef.current?.focus(); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError("Choose one answer before you submit.");
      announce("Choose one answer before you submit.", { assertive: true });
      return;
    }
    setError(undefined);
    const correct = selected === question.correct;
    setResult({ selected, correct });
    onSubmit(selected, correct);
    announce(correct ? "Answer submitted. Correct." : "Answer submitted. Try again after reviewing the lesson segment.");
  }

  function tryAgain() {
    setResult(null);
    setSelected("");
    announce("Choose a new answer.");
    requestAnimationFrame(() => legendRef.current?.focus());
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6" aria-label={`Practice question ${number} of ${total}`}>
      <p className="text-base font-semibold text-muted">Question {number} of {total}</p>
      <fieldset className="space-y-3" aria-describedby={error ? "practice-error" : undefined} disabled={!!result}>
        <legend ref={legendRef} tabIndex={-1} className="mb-3 text-2xl font-bold">
          {question.text}
        </legend>
        <div className="space-y-3">
          {question.choices.map((c) => (
            <label
              key={c.id}
              className="flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border-2 border-border bg-background px-4 py-3 has-[:checked]:border-4 has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
            >
              <input
                type="radio" name={name} value={c.id}
                checked={selected === c.id}
                onChange={() => { setSelected(c.id); setError(undefined); }}
              />
              <span className="text-lg">{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p id="practice-error" className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">Error: </span>{error}</p>}

      {!result?.correct && (
        <Button type="submit" size="lg" disabled={!!result && !result.correct}>Submit answer</Button>
      )}

      {result && (
        <div data-testid="feedback">
          {result.correct ? (
            <Callout tone="success" className="space-y-3">
              <h2 className="flex items-center gap-2 text-xl text-success"><CheckCircle2 aria-hidden="true" /> Correct</h2>
              <p className="text-lg">{question.explanation}</p>
              <Button size="lg" onClick={onContinue}>{continueLabel} <ArrowRight aria-hidden="true" className="size-5" /></Button>
            </Callout>
          ) : (
            <Callout tone="warning" className="space-y-3">
              <h2 className="text-xl">Not quite yet</h2>
              <p className="text-lg">{question.hint}</p>
              <p className="text-lg">You can review the related lesson segment before trying again.</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={onOpenSegment}><BookOpen aria-hidden="true" className="size-5" /> Review related lesson segment</Button>
                <Button variant="secondary" onClick={tryAgain}><RotateCcw aria-hidden="true" className="size-5" /> Try again</Button>
              </div>
            </Callout>
          )}
        </div>
      )}
    </form>
  );
}
