"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { PracticeSession } from "@/components/learning/PracticeSession";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { REMEDIATION } from "@/lib/mock-data";
import { useLearner } from "@/lib/store";

export default function RemediationPracticePage() {
  const { state, answerRemediation, finishRemediationPractice } = useLearner();
  const { announce } = useAnnouncer();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="Remediation complete" instructions="Your exam retry is now unlocked." />
        <Callout tone="success" className="space-y-4">
          <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> Retry unlocked</p>
          <p className="text-lg">Well done. You can start your second attempt whenever you feel ready.</p>
          <ButtonLink href="/exam" size="lg" autoFocus>Continue to exam retry instructions</ButtonLink>
        </Callout>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageIntro
        title="Remediation practice"
        instructions="Two questions. If an answer is not right, you can review the recap segment and try again."
        focus={false}
      />
      <PracticeSession
        questions={REMEDIATION.questions}
        isTimed
        speed={state.settings.defaultSpeed}
        onAnswer={(q, s, c) => answerRemediation(q.id, s, c)}
        onFinish={() => {
          finishRemediationPractice();
          setDone(true);
          announce("Remediation complete. Your exam retry is now unlocked.");
        }}
        finishLabel="Finish remediation and unlock retry"
      />
    </div>
  );
}
