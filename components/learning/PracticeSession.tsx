"use client";

import { useState } from "react";
import { LessonSegmentDialog } from "./LessonSegmentDialog";
import { PracticeQuestionCard } from "./PracticeQuestionCard";
import { useApp } from "@/lib/store";
import type { PracticeQuestion } from "@/lib/types";

/** Runs a list of practice questions one at a time. Used by lessons and by remediation. */
export function PracticeSession({
  questions, isTimed, speed, onAnswer, onFinish, finishLabel, nextLabel,
}: {
  questions: PracticeQuestion[];
  isTimed: boolean;
  speed?: number;
  onAnswer: (q: PracticeQuestion, selected: string, correct: boolean) => void;
  onFinish: () => void;
  finishLabel: string;
  nextLabel?: string;
}) {
  const { t } = useApp();
  const [index, setIndex] = useState(0);
  const [dialog, setDialog] = useState(false);
  const q = questions[index];
  const last = index === questions.length - 1;
  return (
    <>
      <PracticeQuestionCard
        key={q.id}
        question={q}
        number={index + 1}
        total={questions.length}
        onSubmit={(s, c) => onAnswer(q, s, c)}
        onOpenSegment={() => setDialog(true)}
        onContinue={() => (last ? onFinish() : setIndex(index + 1))}
        continueLabel={last ? finishLabel : nextLabel ?? t("exam.nextShort")}
      />
      <LessonSegmentDialog open={dialog} onClose={() => setDialog(false)} related={q.related} isTimed={isTimed} speed={speed} />
    </>
  );
}
