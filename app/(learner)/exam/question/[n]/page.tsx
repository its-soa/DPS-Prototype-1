"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { AnswerSavedToast } from "@/components/exam/AnswerSavedToast";
import { ExamQuestionNavigator } from "@/components/exam/ExamQuestionNavigator";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { useCatalog } from "@/lib/catalog";
import { useLearner } from "@/lib/store";

export default function ExamQuestionPage() {
  const { n } = useParams<{ n: string }>();
  const number = Number(n);
  const { data, saveExamAnswer, t } = useLearner();
  const { exam: EXAM_QUESTIONS } = useCatalog();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const total = EXAM_QUESTIONS.length;
  const q = EXAM_QUESTIONS[number - 1];
  const draft = data.examDraft;
  const savedAnswer = q && draft ? draft.answers[q.id] : undefined;
  const [selected, setSelected] = useState<string>(savedAnswer ?? "");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { if (!draft) router.replace("/exam"); }, [draft, router]);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!q || !draft) return null;

  const isSaved = !!savedAnswer && savedAnswer === selected;
  const last = number === total;

  function save() {
    if (!selected) {
      setError(t("exam.err.choose"));
      announce(t("exam.err.choose"), { assertive: true });
      return;
    }
    setError(undefined);
    saveExamAnswer(q.id, selected);
    announce(t("exam.saved.announce", { n: number, total }));
    setToast(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(false), 4000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageIntro title={t("exam.qOf", { n: number, total })} eyebrow={t("exam.attemptEyebrow", { n: draft.attemptNumber })} />
      <ProgressBar value={Math.round(((number - 1) / total) * 100)} label={t("exam.progressLabel", { n: number, total })} />

      <form onSubmit={(e) => { e.preventDefault(); save(); }} noValidate className="space-y-5" aria-label={t("exam.formLabel", { n: number })}>
        <fieldset className="space-y-3" aria-describedby={error ? "exam-error" : undefined}>
          <legend className="mb-3 text-2xl font-bold">{q.text}</legend>
          {q.choices.map((c) => (
            <label key={c.id} className="flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border-2 border-border bg-background px-4 py-3 has-[:checked]:border-4 has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
              <input type="radio" name={`exam-${q.id}`} value={c.id} checked={selected === c.id} onChange={() => { setSelected(c.id); setError(undefined); }} />
              <span className="text-lg">{c.label}</span>
            </label>
          ))}
        </fieldset>
        {error && <p id="exam-error" className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">{t("common.error")} </span>{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg"><Save aria-hidden="true" className="size-5" /> {savedAnswer ? t("exam.update") : t("exam.save")}</Button>
          {isSaved && (
            <p className="flex items-center gap-2 text-lg font-bold text-success" data-testid="saved-inline">
              <CheckCircle2 aria-hidden="true" className="size-6" /> {t("exam.saved")}
            </p>
          )}
          {savedAnswer && !isSaved && <p className="text-base font-semibold text-muted">{t("exam.changed")}</p>}
        </div>

        <div className="flex flex-wrap gap-3 border-t-2 border-border-soft pt-5">
          {number > 1 && (
            <Button variant="secondary" size="lg" onClick={() => router.push(`/exam/question/${number - 1}`)}>
              <ArrowLeft aria-hidden="true" className="size-5" /> {t("exam.prev")}
            </Button>
          )}
          {isSaved ? (
            <Button size="lg" onClick={() => router.push(last ? "/exam/review" : `/exam/question/${number + 1}`)}>
              {last ? t("exam.toReview") : t("exam.next", { n: number + 1, total })} <ArrowRight aria-hidden="true" className="size-5" />
            </Button>
          ) : (
            <p className="self-center text-base text-muted">{t("exam.saveToContinue")}</p>
          )}
        </div>
      </form>

      <ExamQuestionNavigator current={number} answers={draft.answers} />
      <AnswerSavedToast show={toast} message={t("exam.saved")} />
    </div>
  );
}
