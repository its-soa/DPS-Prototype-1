"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { SuccessCheck } from "@/components/cert/SuccessCheck";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { MAX_EXAM_ATTEMPTS, PASS_MARK_PERCENT } from "@/lib/mock-data";
import { useLearner } from "@/lib/store";
import { useReduceMotion } from "@/lib/use-motion";

export default function ExamResultPage() {
  const { data, t, fmtDate } = useLearner();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const reduce = useReduceMotion();
  const attempt = data.examAttempts[data.examAttempts.length - 1];
  const announced = useRef(false);

  useEffect(() => { if (!attempt) router.replace("/exam"); }, [attempt, router]);
  useEffect(() => {
    if (!attempt || announced.current) return;
    announced.current = true;
    announce(attempt.passed ? t("result.passMessage") : t("result.failMessage"), { assertive: false });
  }, [attempt, announce, t]);

  if (!attempt) return null;
  const pct = Math.round((attempt.score / attempt.total) * 100);
  const attemptsLeft = MAX_EXAM_ATTEMPTS - data.examAttempts.length;

  if (attempt.passed) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title={t("exam.passed.title")} instructions={t("result.pass.instructions")} />
        <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Callout tone="success" className="space-y-4 text-center">
            <div className="flex justify-center"><SuccessCheck /></div>
            <p className="text-2xl font-bold text-success">{t("result.score", { score: attempt.score, total: attempt.total, pct })}</p>
            <p className="text-lg">{t("result.passLine", { pass: PASS_MARK_PERCENT, n: attempt.attemptNumber, date: fmtDate(attempt.submittedAt) })}</p>
            <ButtonLink href="/certification" size="lg" autoFocus>{t("result.pass.cta")}</ButtonLink>
          </Callout>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageIntro title={t("result.fail.title")} instructions={t("result.fail.instructions")} />
      <Callout tone="info" className="space-y-3">
        <p className="text-2xl font-bold">{t("result.score", { score: attempt.score, total: attempt.total, pct })}</p>
        <p className="text-lg">{t("result.fail.body", { pass: PASS_MARK_PERCENT })}</p>
      </Callout>
      <section aria-labelledby="policy-h" className="space-y-2">
        <h2 id="policy-h" className="text-2xl">{t("result.policy.h")}</h2>
        <ul className="list-disc space-y-1.5 pl-6 text-lg">
          <li>{t("result.policy.1")}</li>
          <li>{t("result.policy.2")}</li>
          <li>{t("result.policy.3", { count: attemptsLeft })}</li>
        </ul>
      </section>
      <Callout tone="success" className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl"><HeartHandshake aria-hidden="true" /> {t("result.next.h")}</h2>
        <p className="text-lg">{t("result.next.body")}</p>
        <ButtonLink href="/exam/remediation" size="lg" autoFocus>{t("result.next.cta")}</ButtonLink>
      </Callout>
      <p className="text-sm text-muted">{t("result.protoNote")}</p>
    </div>
  );
}
