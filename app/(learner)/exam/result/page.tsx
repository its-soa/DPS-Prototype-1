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
import { formatDate } from "@/lib/utils";
import { useReduceMotion } from "@/lib/use-motion";

export default function ExamResultPage() {
  const { data } = useLearner();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const reduce = useReduceMotion();
  const attempt = data.examAttempts[data.examAttempts.length - 1];
  const announced = useRef(false);

  useEffect(() => { if (!attempt) router.replace("/exam"); }, [attempt, router]);
  useEffect(() => {
    if (!attempt || announced.current) return;
    announced.current = true;
    announce(
      attempt.passed
        ? "You passed the certification exam. Your certification is now active."
        : "Retry needed. You can review the material and try again. Remediation is ready for you.",
      { assertive: false },
    );
  }, [attempt, announce]);

  if (!attempt) return null;
  const pct = Math.round((attempt.score / attempt.total) * 100);
  const attemptsLeft = MAX_EXAM_ATTEMPTS - data.examAttempts.length;

  if (attempt.passed) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="You passed the certification exam" instructions="Congratulations. Your certification has been issued." />
        <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Callout tone="success" className="space-y-4 text-center">
            <div className="flex justify-center"><SuccessCheck /></div>
            <p className="text-2xl font-bold text-success">Score: {attempt.score} of {attempt.total} ({pct} percent)</p>
            <p className="text-lg">Pass mark: {PASS_MARK_PERCENT} percent. Passed on attempt {attempt.attemptNumber}, {formatDate(attempt.submittedAt)}.</p>
            <ButtonLink href="/certification" size="lg" autoFocus>Continue to your certification</ButtonLink>
          </Callout>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageIntro title="Your exam result: not passed this time" instructions="This is a normal part of learning. You have a clear path to try again." />
      <Callout tone="info" className="space-y-3">
        <p className="text-2xl font-bold">Score: {attempt.score} of {attempt.total} ({pct} percent)</p>
        <p className="text-lg">The pass mark is {PASS_MARK_PERCENT} percent. You were close, and you already know most of this material.</p>
      </Callout>
      <section aria-labelledby="policy-h" className="space-y-2">
        <h2 id="policy-h" className="text-2xl">Retry policy</h2>
        <ul className="list-disc space-y-1.5 pl-6 text-lg">
          <li>Complete a short remediation: an audio recap and two practice questions.</li>
          <li>Your retry unlocks as soon as remediation is finished.</li>
          <li>You have {attemptsLeft} {attemptsLeft === 1 ? "attempt" : "attempts"} remaining.</li>
        </ul>
      </section>
      <Callout tone="success" className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl"><HeartHandshake aria-hidden="true" /> Your next step</h2>
        <p className="text-lg">The remediation focuses on consent, examination pattern, pressure and documentation.</p>
        <ButtonLink href="/exam/remediation" size="lg" autoFocus>Open remediation lesson</ButtonLink>
      </Callout>
      <p className="text-sm text-muted">Prototype note: the first attempt is always set to show the remediation journey, whatever you answer.</p>
    </div>
  );
}
