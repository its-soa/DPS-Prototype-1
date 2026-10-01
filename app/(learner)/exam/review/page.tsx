"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { ConfirmDialog } from "@/components/exam/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useCatalog } from "@/lib/catalog";
import { useLearner } from "@/lib/store";

export default function ExamReviewPage() {
  const { data, submitExam, t } = useLearner();
  const { exam: EXAM_QUESTIONS } = useCatalog();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const draft = data.examDraft;
  const submitting = useRef(false); // submitting clears the draft; don't bounce back to /exam while navigating to the result

  useEffect(() => { if (!draft && !submitting.current) router.replace("/exam"); }, [draft, router]);
  if (!draft) return null;

  const unanswered = EXAM_QUESTIONS.filter((q) => !draft.answers[q.id]);

  function submit() {
    submitting.current = true;
    submitExam();
    announce(t("review.submitted"));
    router.push("/exam/result");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageIntro
        title={t("review.title")}
        instructions={t("review.instructions")}
      />
      {unanswered.length > 0 && (
        <Callout tone="warning" className="space-y-1" role="alert">
          <p className="flex items-center gap-2 text-lg font-bold"><AlertTriangle aria-hidden="true" /> {t("review.unanswered", { count: unanswered.length })}</p>
          <p className="text-base">{t("review.unansweredNote")}</p>
        </Callout>
      )}
      <ol className="space-y-3">
        {EXAM_QUESTIONS.map((q, i) => {
          const a = q.choices.find((c) => c.id === draft.answers[q.id]);
          return (
            <li key={q.id} className="rounded-xl border-2 border-border-soft bg-surface p-4">
              <p className="text-base font-semibold">{t("exam.qOf", { n: i + 1, total: EXAM_QUESTIONS.length })}: {q.text}</p>
              <p className="mt-1 text-lg">{a ? <>{t("review.saved")} <strong>{a.label}</strong></> : <strong className="text-danger">{t("review.notAnswered")}</strong>}</p>
              <Link href={`/exam/question/${i + 1}`} className="mt-1 inline-flex min-h-12 items-center font-semibold underline underline-offset-4">
                {a ? t("review.change", { n: i + 1 }) : t("review.answer", { n: i + 1 })}
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap gap-3 border-t-2 border-border-soft pt-5">
        <Button variant="secondary" size="lg" onClick={() => router.push(`/exam/question/${EXAM_QUESTIONS.length}`)}>{t("review.toLast")}</Button>
        <Button size="lg" onClick={() => setConfirm(true)}>{t("review.submit")}</Button>
      </div>
      <ConfirmDialog
        open={confirm}
        title={t("review.confirm.title")}
        confirmLabel={t("review.confirm.yes")}
        cancelLabel={t("review.confirm.no")}
        onConfirm={() => { setConfirm(false); submit(); }}
        onCancel={() => setConfirm(false)}
      >
        <p>{t("review.confirm.count", { answered: EXAM_QUESTIONS.length - unanswered.length, total: EXAM_QUESTIONS.length })}</p>
        <p><strong>{t("review.confirm.warning")}</strong></p>
      </ConfirmDialog>
    </div>
  );
}
