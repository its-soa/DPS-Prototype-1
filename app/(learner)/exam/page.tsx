"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { EXAM_QUESTIONS, MAX_EXAM_ATTEMPTS, PASS_MARK_PERCENT } from "@/lib/mock-data";
import { examState } from "@/lib/progress";
import { useLearner } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function ExamIntroPage() {
  const { data, startExam } = useLearner();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [ack, setAck] = useState(false);
  const [err, setErr] = useState<string>();
  const state = examState(data);
  const attemptNo = data.examDraft?.attemptNumber ?? data.examAttempts.length + 1;
  const savedCount = data.examDraft ? Object.keys(data.examDraft.answers).length : 0;

  if (state === "locked") {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="Certification exam" instructions="The exam unlocks after you complete all three required courses." />
        <Callout tone="warning" className="space-y-3">
          <p className="flex items-center gap-2 text-lg font-semibold"><Lock aria-hidden="true" /> Not available yet</p>
          <p className="text-lg">Finish all three required courses and their practice sessions. Then come back here.</p>
          <ButtonLink href="/dashboard">Return to course overview</ButtonLink>
        </Callout>
      </div>
    );
  }
  if (state === "passed") {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="You passed the certification exam" instructions="Your certification is active." />
        <ButtonLink href="/certification" size="lg">View certification status</ButtonLink>
      </div>
    );
  }
  if (state === "retry-locked") {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="Retry locked until remediation is complete" instructions="A short remediation helps you strengthen the areas to review. It takes about ten minutes." />
        <Callout tone="info" className="space-y-3">
          <p className="text-lg">Your next attempt unlocks as soon as you finish the audio recap and two practice questions.</p>
          <ButtonLink href="/exam/remediation" size="lg">Continue to remediation</ButtonLink>
        </Callout>
      </div>
    );
  }

  const isRetry = data.examAttempts.length > 0;
  function start() {
    if (!ack && !data.examDraft) {
      setErr("Please confirm that you have read the instructions.");
      announce("Please confirm that you have read the instructions.", { assertive: true });
      document.getElementById("ack")?.focus();
      return;
    }
    startExam();
    announce(data.examDraft ? `Resuming exam at question ${Math.min(savedCount + 1, EXAM_QUESTIONS.length)}.` : "Exam started. Question 1.");
    router.push(`/exam/question/${data.examDraft ? Math.min(savedCount + 1, EXAM_QUESTIONS.length) : 1}`);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <PageIntro
        title={isRetry ? `Certification exam: attempt ${attemptNo}` : "Certification exam instructions"}
        instructions="Read these instructions, confirm you have read them, then choose Start exam. Take your time. There is no time limit."
      />
      <Card className="space-y-4">
        <h2 className="text-2xl">How the exam works</h2>
        <ul className="list-disc space-y-2 pl-6 text-lg">
          <li>{EXAM_QUESTIONS.length} multiple-choice questions, one question on each screen.</li>
          <li>Choose one answer, then select <strong>Save answer</strong>. You will hear and see &ldquo;Answer saved&rdquo;.</li>
          <li>Select <strong>Next question</strong> to continue. You can also return to any earlier question.</li>
          <li>After the last question you will see a review screen listing all of your answers.</li>
          <li>There is <strong>no time limit</strong>. Your saved answers are kept if you leave and come back.</li>
        </ul>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-2xl">Pass mark and retry policy</h2>
        <ul className="list-disc space-y-2 pl-6 text-lg">
          <li>The pass mark is {PASS_MARK_PERCENT} percent.</li>
          <li>If you do not pass, you complete a short remediation (audio recap and two practice questions), and then you can retry.</li>
          <li>You can attempt the exam up to {MAX_EXAM_ATTEMPTS} times.</li>
        </ul>
      </Card>

      {data.examAttempts.length > 0 && (
        <section aria-labelledby="history-h" className="space-y-2">
          <h2 id="history-h" className="text-2xl">Previous attempts</h2>
          <ul className="space-y-1 text-lg">
            {data.examAttempts.map((a) => (
              <li key={a.attemptNumber}>Attempt {a.attemptNumber}: {a.score} of {a.total}, {a.passed ? "passed" : "not passed"} ({formatDate(a.submittedAt)})</li>
            ))}
          </ul>
        </section>
      )}

      {data.examDraft ? (
        <Callout tone="info" className="space-y-3">
          <p className="text-lg">You have an exam in progress with {savedCount} of {EXAM_QUESTIONS.length} answers saved.</p>
          <Button size="lg" onClick={start}>Resume exam at question {Math.min(savedCount + 1, EXAM_QUESTIONS.length)}</Button>
        </Callout>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex min-h-12 cursor-pointer items-start gap-3">
              <input
                id="ack" type="checkbox" checked={ack}
                aria-invalid={err ? true : undefined} aria-describedby={err ? "ack-err" : undefined}
                onChange={(e) => { setAck(e.target.checked); setErr(undefined); }}
                className="mt-1"
              />
              <span className="text-lg">I have read the instructions and I am ready to begin.</span>
            </label>
            {err && <p id="ack-err" className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">Error: </span>{err}</p>}
          </div>
          <Button size="lg" onClick={start}>{isRetry ? "Start exam attempt " + attemptNo : "Start exam: go to question 1"}</Button>
          <p><Link href="/dashboard" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">Return to course overview</Link></p>
        </div>
      )}
    </div>
  );
}
