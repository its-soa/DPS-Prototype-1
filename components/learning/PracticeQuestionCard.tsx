"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useApp } from "@/lib/store";
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
  const { t } = useApp();
  const [selected, setSelected] = useState<string>("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string>();
  const legendRef = useRef<HTMLLegendElement>(null);
  const name = `q-${question.id}`;

  useEffect(() => { legendRef.current?.focus(); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError(t("practice.err.choose"));
      announce(t("practice.err.choose"), { assertive: true });
      return;
    }
    setError(undefined);
    const correct = selected === question.correct;
    setResult({ selected, correct });
    onSubmit(selected, correct);
    announce(correct ? t("practice.announce.correct") : t("practice.announce.retry"));
  }

  function tryAgain() {
    setResult(null);
    setSelected("");
    announce(t("practice.announce.new"));
    requestAnimationFrame(() => legendRef.current?.focus());
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6" aria-label={t("practice.aria", { n: number, total })}>
      <p className="text-base font-semibold text-muted">{t("exam.qOf", { n: number, total })}</p>
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
      {error && <p id="practice-error" className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">{t("common.error")} </span>{error}</p>}

      {!result?.correct && (
        <Button type="submit" size="lg" disabled={!!result && !result.correct}>{t("practice.submit")}</Button>
      )}

      {result && (
        <div data-testid="feedback">
          {result.correct ? (
            <Callout tone="success" className="space-y-3">
              <h2 className="flex items-center gap-2 text-xl text-success"><CheckCircle2 aria-hidden="true" /> {t("practice.correct")}</h2>
              <p className="text-lg">{question.explanation}</p>
              <Button size="lg" onClick={onContinue}>{continueLabel} <ArrowRight aria-hidden="true" className="size-5" /></Button>
            </Callout>
          ) : (
            <Callout tone="warning" className="space-y-3">
              <h2 className="text-xl">{t("practice.notYet")}</h2>
              <p className="text-lg">{question.hint}</p>
              <p className="text-lg">{t("practice.reviewHint")}</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={onOpenSegment}><BookOpen aria-hidden="true" className="size-5" /> {t("practice.reviewSegment")}</Button>
                <Button variant="secondary" onClick={tryAgain}><RotateCcw aria-hidden="true" className="size-5" /> {t("practice.tryAgain")}</Button>
              </div>
            </Callout>
          )}
        </div>
      )}
    </form>
  );
}
