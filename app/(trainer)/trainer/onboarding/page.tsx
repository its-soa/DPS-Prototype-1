"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AccessibilitySettingsPanel } from "@/components/a11y/AccessibilitySettingsPanel";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { tr } from "@/lib/trainer/tr";
import { useReduceMotion } from "@/lib/use-motion";

const STEPS = [
  { title: "How training is structured", body: ["A **program** holds everything for one qualification: its courses, practice quizzes, the final exam and the learning path.", "Learners follow the **learning path**, which sets the order and what unlocks next."] },
  { title: "Setting up content", body: ["Start with a program, then add courses. Inside each course, create lessons with audio, a transcript, a supporting PDF and glossary terms.", "Add a practice quiz to a lesson, then build the final exam. Publish when each item is ready. Learners only see published content."] },
  { title: "Managing learners", body: ["Add a learner, assign a learning path, and send the invitation. The learner list shows who has accepted.", "Open a learner to see their sequence and assigned exam."] },
  { title: "Following progress", body: ["Cohort progress shows who has started and who has finished. Open a learner to see incorrect practice answers and the lesson to revisit.", "Question performance shows the questions many learners miss, so you can improve the lesson behind them."] },
  { title: "Finish orientation", body: ["You are ready. Your workspace opens with a summary of your cohort and the things that need attention.", "You can replay this orientation and change accessibility settings at any time."] },
];
const rich = (s: string) => s.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));

export default function TrainerOnboarding() {
  const { account, completeOnboarding } = useApp();
  const { announce } = useAnnouncer();
  const reduce = useReduceMotion();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const focus = useRef(false);
  const headingRef = useCallback((el: HTMLElement | null) => { if (el && focus.current) { focus.current = false; el.focus(); } }, []);
  const last = step === STEPS.length - 1;
  const s = STEPS[step];
  const go = (n: number) => { focus.current = true; setStep(n); };

  return (
    <>
      <PageIntro title={tr("Trainer orientation")} instructions={tr("Welcome, {name}. Five short steps. Use the buttons at the bottom to move forward or back.", { name: account?.fullName.split(" ")[0] ?? "" })} focus={false} />
      <p className="mb-4 text-lg font-semibold" aria-hidden="true">{tr("Step {n} of {total}", { n: step + 1, total: STEPS.length })}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.section key={step} aria-labelledby="ob-h" initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }} className="max-w-2xl space-y-5">
          <h2 id="ob-h" ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl">
            <span className="sr-only">{tr("Step {n} of {total}", { n: step + 1, total: STEPS.length })}: </span>{tr(s.title)}
          </h2>
          {s.body.map((p) => <p key={p} className="text-lg">{rich(tr(p))}</p>)}
          {last && (
            <details className="rounded-xl border-2 border-border-soft p-4">
              <summary className="min-h-12 cursor-pointer font-semibold">{tr("Adjust accessibility settings")}</summary>
              <div className="mt-4"><AccessibilitySettingsPanel /></div>
            </details>
          )}
          <div className="flex flex-wrap gap-3 border-t-2 border-border-soft pt-5">
            {step > 0 && <Button variant="secondary" size="lg" onClick={() => go(step - 1)}><ArrowLeft aria-hidden="true" /> {tr("Back to {title}", { title: tr(STEPS[step - 1].title).toLowerCase() })}</Button>}
            {last ? (
              <Button size="lg" onClick={() => { completeOnboarding(); announce(tr("Orientation complete. Opening your workspace.")); router.push("/trainer"); }}><CheckCircle2 aria-hidden="true" /> {tr("Finish orientation and open workspace")}</Button>
            ) : (
              <Button size="lg" onClick={() => go(step + 1)}>{tr("Continue to {title}", { title: tr(STEPS[step + 1].title).toLowerCase() })} <ArrowRight aria-hidden="true" /></Button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </>
  );
}
