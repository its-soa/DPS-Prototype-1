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
import { EXAM_QUESTIONS } from "@/lib/mock-data";
import { useLearner } from "@/lib/store";

export default function ExamReviewPage() {
  const { data, submitExam } = useLearner();
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
    announce("Exam submitted. Opening your result.");
    router.push("/exam/result");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageIntro
        title="Review and submit your exam"
        instructions="Check your answers. Select a question to change its answer. When you are ready, choose Submit exam."
      />
      {unanswered.length > 0 && (
        <Callout tone="warning" className="space-y-1" role="alert">
          <p className="flex items-center gap-2 text-lg font-bold"><AlertTriangle aria-hidden="true" /> {unanswered.length} {unanswered.length === 1 ? "question has" : "questions have"} no saved answer</p>
          <p className="text-base">Unanswered questions are marked as incorrect.</p>
        </Callout>
      )}
      <ol className="space-y-3">
        {EXAM_QUESTIONS.map((q, i) => {
          const a = q.choices.find((c) => c.id === draft.answers[q.id]);
          return (
            <li key={q.id} className="rounded-xl border-2 border-border-soft bg-surface p-4">
              <p className="text-base font-semibold">Question {i + 1} of {EXAM_QUESTIONS.length}: {q.text}</p>
              <p className="mt-1 text-lg">{a ? <>Your saved answer: <strong>{a.label}</strong></> : <strong className="text-danger">Not answered</strong>}</p>
              <Link href={`/exam/question/${i + 1}`} className="mt-1 inline-flex min-h-12 items-center font-semibold underline underline-offset-4">
                {a ? "Change" : "Answer"} question {i + 1}
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap gap-3 border-t-2 border-border-soft pt-5">
        <Button variant="secondary" size="lg" onClick={() => router.push(`/exam/question/${EXAM_QUESTIONS.length}`)}>Return to last question</Button>
        <Button size="lg" onClick={() => setConfirm(true)}>Submit exam</Button>
      </div>
      <ConfirmDialog
        open={confirm}
        title="Submit your exam?"
        confirmLabel="Yes, submit exam"
        cancelLabel="No, go back to review"
        onConfirm={() => { setConfirm(false); submit(); }}
        onCancel={() => setConfirm(false)}
      >
        <p>You have answered {EXAM_QUESTIONS.length - unanswered.length} of {EXAM_QUESTIONS.length} questions.</p>
        <p><strong>You cannot change your answers after you submit.</strong></p>
      </ConfirmDialog>
    </div>
  );
}
