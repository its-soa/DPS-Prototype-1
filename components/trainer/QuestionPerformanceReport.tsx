"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { questionStats } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import { useReduceMotion } from "@/lib/use-motion";
import { cn } from "@/lib/utils";

/** Ranked list of most-missed practice questions. Selecting one reveals miss rate, lesson and learners. */
export function QuestionPerformanceReport() {
  const { state } = useTrainer();
  const reduce = useReduceMotion();
  const stats = questionStats(state);
  const [open, setOpen] = useState<string | null>(stats[0]?.question.id ?? null);
  if (!stats.length) return <p className="text-muted">{tr("No practice results yet.")}</p>;
  return (
    <ol className="space-y-3" aria-label={tr("Practice questions ranked by how often they are missed")}>
      {stats.map((s, i) => {
        const id = s.question.id;
        const isOpen = open === id;
        const lesson = state.lessons.find((l) => l.id === s.lessonId);
        return (
          <li key={id} className={cn("rounded-xl border-2 bg-surface", isOpen ? "border-primary" : "border-border-soft")}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`qp-${id}`} onClick={() => setOpen(isOpen ? null : id)}
                className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left">
                <span>
                  <span className="block text-sm font-semibold text-muted">{tr("Rank {n}", { n: i + 1 })} · {tr("missed by {rate} percent", { rate: s.rate })}</span>
                  <span className="block text-lg font-bold">{s.question.text}</span>
                </span>
                <ChevronDown aria-hidden="true" className={cn("size-6 shrink-0 transition-transform", isOpen && "rotate-180")} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`qp-${id}`} role="region" aria-label={tr("Details for rank {n}", { n: i + 1 })}
                  initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}
                  className="space-y-3 border-t-2 border-border-soft px-4 py-4">
                  <ProgressBar value={s.rate} label={tr("Miss rate {rate} percent", { rate: s.rate })} />
                  <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[max-content_1fr]">
                    <dt className="font-semibold">{tr("Miss rate")}</dt><dd>{tr("{missed} of {taken} learners ({rate} percent)", { missed: s.missed, taken: s.taken, rate: s.rate })}</dd>
                    <dt className="font-semibold">{tr("Correct answer")}</dt><dd>{s.question.answers[s.question.correct]}</dd>
                    <dt className="font-semibold">{tr("Linked lesson")}</dt><dd>{lesson?.title ?? tr("None")}</dd>
                    <dt className="font-semibold">{tr("Affected learners")}</dt>
                    <dd>{s.learners.length ? s.learners.map((l, k) => <span key={l.id}>{k > 0 && ", "}<Link href={`/trainer/progress/${l.id}`} className="underline underline-offset-4">{l.fullName}</Link></span>) : tr("None")}</dd>
                  </dl>
                  {lesson && <Link href={`/trainer/lessons/${lesson.id}#explanation`} className="inline-flex min-h-12 items-center rounded-lg border-2 border-primary bg-primary px-5 font-semibold text-primary-foreground">{tr("Open lesson explanation")}<span className="sr-only">: {lesson.title}</span></Link>}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
