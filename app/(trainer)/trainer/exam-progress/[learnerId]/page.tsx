"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, X } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { CertificationStatusPanel } from "@/components/trainer/CertificationStatusPanel";
import { RemediationAssignmentPanel } from "@/components/trainer/RemediationAssignmentPanel";
import { StatusPill } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { EXAM_STATUS_LABEL, examStatus } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import { formatDate } from "@/lib/utils";

export default function LearnerExamPage() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const l = state.learners.find((x) => x.id === learnerId && !x.archived);
  const exam = state.exams.find((e) => e.status === "active");
  if (!l) return <><PageIntro title={tr("Learner not found")} /><ButtonLink href="/trainer/exam-progress">{tr("Back to exam progress")}</ButtonLink></>;
  const status = examStatus(state, l);
  const first = l.fullName.split(" ")[0];
  const last = l.attempts[l.attempts.length - 1];
  const missed = last && !last.passed && exam ? exam.questions.filter((q) => last.answers[q.id] !== q.correct) : [];
  const suggested = [...new Set(missed.map((q) => q.lessonId).filter(Boolean) as string[])];
  const needsRemediation = status === "failed" || status === "remediation-assigned" || status === "retry-unlocked";
  const attemptsLeft = exam ? Math.max(0, exam.retryLimit - l.attempts.length) : 0;

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: tr("Exam progress"), href: "/trainer/exam-progress" }, { label: l.fullName }]} />
      <PageIntro title={tr("{name}: exam record", { name: l.fullName })} instructions={tr("Review each attempt. If the learner did not pass, assign remediation and unlock the retry.")} />
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill label={tr(EXAM_STATUS_LABEL[status])} tone={status === "passed" ? "success" : status === "failed" ? "danger" : "neutral"} />
        {exam && <span className="text-lg">{tr("{n} of {max} attempts used. Pass mark {p} percent.", { n: l.attempts.length, max: exam.retryLimit, p: exam.passingScore })}</span>}
      </div>

      {l.attempts.length === 0 && <Callout tone="info"><p>{status === "not-eligible" ? tr("{name} has not finished the required courses yet.", { name: first }) : tr("{name} has not taken the exam yet.", { name: first })}</p></Callout>}

      <section aria-labelledby="att-h" className="space-y-3">
        <h2 id="att-h" className="text-2xl">{tr("Attempts")}</h2>
        {[...l.attempts].reverse().map((a) => (
          <Card key={a.n} className="space-y-3">
            <h3 className="flex flex-wrap items-center gap-3 text-xl">{tr("Attempt {n}", { n: a.n })}: {tr("{score} of {total}", { score: a.score, total: a.total })} ({Math.round((a.score / a.total) * 100)}%)
              <StatusPill label={a.passed ? tr("Passed") : tr("Not passed")} tone={a.passed ? "success" : "danger"} /></h3>
            <p className="text-muted">{tr("Submitted {date}", { date: formatDate(a.submittedAt, "en-GB") })}</p>
            <details className="rounded-xl border-2 border-border-soft p-3">
              <summary className="min-h-12 cursor-pointer font-semibold">{tr("Show question-by-question result")}</summary>
              <ol className="mt-3 space-y-3">
                {exam?.questions.map((q, i) => {
                  const chosen = a.answers[q.id]; const ok = chosen === q.correct;
                  return (
                    <li key={q.id} className="space-y-1">
                      <p className="flex items-start gap-2 font-semibold">{ok ? <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-success" /> : <X aria-hidden="true" className="mt-1 size-5 shrink-0 text-danger" />}<span><span className="sr-only">{ok ? tr("Correct.") : tr("Incorrect.")} </span>{tr("Question {n}", { n: i + 1 })}: {q.text}</span></p>
                      <p className="pl-7">{tr("Answered:")} {q.answers[chosen] ?? "–"}{!ok && <> · {tr("Correct:")} {q.answers[q.correct]}</>}</p>
                      {!ok && q.lessonId && <p className="pl-7"><Link href={`/trainer/lessons/${q.lessonId}`} className="font-semibold underline underline-offset-4">{tr("Open linked lesson")}<span className="sr-only">: {state.lessons.find((x) => x.id === q.lessonId)?.title}</span></Link></p>}
                    </li>
                  );
                })}
              </ol>
            </details>
          </Card>
        ))}
      </section>

      {needsRemediation && attemptsLeft > 0 && <RemediationAssignmentPanel key={`${l.id}-${l.attempts.length}`} learner={l} suggested={suggested} />}
      {needsRemediation && attemptsLeft === 0 && <Callout tone="warning"><p>{tr("No attempts are left. Ask a program administrator to extend the retry limit.")}</p></Callout>}

      {status === "retry-unlocked" && (
        <Card className="space-y-3">
          <h2 className="text-xl">{tr("Waiting for {name}'s retry", { name: first })}</h2>
          <p>{tr("The retry is unlocked. When {name} submits it, the result appears here.", { name: first })}</p>
          <p className="text-sm text-muted">{tr("Prototype helper: this stands in for the learner submitting a passing retry.")}</p>
          <Button variant="secondary" onClick={() => { actions.simulateRetryPass(l.id); announce(tr("Retry submission received from {name}. Passing score. Certification is now active.", { name: l.fullName })); }}>{tr("Simulate {name}'s retry submission", { name: first })}</Button>
        </Card>
      )}

      {status === "passed" && (
        <>
          <Callout tone="success" role="status"><p className="text-lg font-bold">{tr("Passing score reviewed. Certification is active.")}</p></Callout>
          <CertificationStatusPanel learner={l} showLink />
        </>
      )}
    </div>
  );
}
