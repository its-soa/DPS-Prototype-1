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
import { rich } from "@/lib/rich";
import { examState } from "@/lib/progress";
import { useLearner } from "@/lib/store";

export default function ExamIntroPage() {
  const { data, startExam, t, fmtDate } = useLearner();
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
        <PageIntro title={t("nav.exam")} instructions={t("exam.locked.instructions")} />
        <Callout tone="warning" className="space-y-3">
          <p className="flex items-center gap-2 text-lg font-semibold"><Lock aria-hidden="true" /> {t("exam.locked.h")}</p>
          <p className="text-lg">{t("exam.locked.body")}</p>
          <ButtonLink href="/dashboard">{t("common.returnOverview")}</ButtonLink>
        </Callout>
      </div>
    );
  }
  if (state === "passed") {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title={t("exam.passed.title")} instructions={t("exam.passed.instructions")} />
        <ButtonLink href="/certification" size="lg">{t("exam.passed.cta")}</ButtonLink>
      </div>
    );
  }
  if (state === "retry-locked") {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title={t("exam.retryLocked.title")} instructions={t("exam.retryLocked.instructions")} />
        <Callout tone="info" className="space-y-3">
          <p className="text-lg">{t("exam.retryLocked.body")}</p>
          <ButtonLink href="/exam/remediation" size="lg">{t("exam.retryLocked.cta")}</ButtonLink>
        </Callout>
      </div>
    );
  }

  const isRetry = data.examAttempts.length > 0;
  function start() {
    if (!ack && !data.examDraft) {
      setErr(t("exam.ack.err"));
      announce(t("exam.ack.err"), { assertive: true });
      document.getElementById("ack")?.focus();
      return;
    }
    startExam();
    announce(data.examDraft ? t("exam.resumingMessage", { n: Math.min(savedCount + 1, EXAM_QUESTIONS.length) }) : t("exam.startedMessage"));
    router.push(`/exam/question/${data.examDraft ? Math.min(savedCount + 1, EXAM_QUESTIONS.length) : 1}`);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <PageIntro
        title={isRetry ? t("exam.intro.titleRetry", { n: attemptNo }) : t("exam.intro.title")}
        instructions={t("exam.intro.instructions")}
      />
      <Card className="space-y-4">
        <h2 className="text-2xl">{t("exam.how.h")}</h2>
        <ul className="list-disc space-y-2 pl-6 text-lg">
          <li>{t("exam.how.1", { total: EXAM_QUESTIONS.length })}</li>
          <li>{rich(t("exam.how.2"))}</li>
          <li>{rich(t("exam.how.3"))}</li>
          <li>{t("exam.how.4")}</li>
          <li>{rich(t("exam.how.5"))}</li>
        </ul>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-2xl">{t("exam.policy.h")}</h2>
        <ul className="list-disc space-y-2 pl-6 text-lg">
          <li>{t("exam.policy.1", { pct: PASS_MARK_PERCENT })}</li>
          <li>{t("exam.policy.2")}</li>
          <li>{t("exam.policy.3", { max: MAX_EXAM_ATTEMPTS })}</li>
        </ul>
      </Card>

      {data.examAttempts.length > 0 && (
        <section aria-labelledby="history-h" className="space-y-2">
          <h2 id="history-h" className="text-2xl">{t("exam.history.h")}</h2>
          <ul className="space-y-1 text-lg">
            {data.examAttempts.map((a) => (
              <li key={a.attemptNumber}>{t("exam.history.line", { n: a.attemptNumber, score: a.score, total: a.total, result: a.passed ? t("exam.history.passed") : t("exam.history.failed"), date: fmtDate(a.submittedAt) })}</li>
            ))}
          </ul>
        </section>
      )}

      {data.examDraft ? (
        <Callout tone="info" className="space-y-3">
          <p className="text-lg">{t("exam.inProgress", { saved: savedCount, total: EXAM_QUESTIONS.length })}</p>
          <Button size="lg" onClick={start}>{t("exam.resumeCta", { n: Math.min(savedCount + 1, EXAM_QUESTIONS.length) })}</Button>
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
              <span className="text-lg">{t("exam.ack")}</span>
            </label>
            {err && <p id="ack-err" className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">{t("common.error")} </span>{err}</p>}
          </div>
          <Button size="lg" onClick={start}>{isRetry ? t("exam.startRetry", { n: attemptNo }) : t("exam.start")}</Button>
          <p><Link href="/dashboard" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{t("common.returnOverview")}</Link></p>
        </div>
      )}
    </div>
  );
}
