"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { PracticeSession } from "@/components/learning/PracticeSession";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useCatalog } from "@/lib/catalog";
import { useLearner } from "@/lib/store";

export default function RemediationPracticePage() {
  const { state, answerRemediation, finishRemediationPractice, t } = useLearner();
  const { remediation: REMEDIATION } = useCatalog();
  const { announce } = useAnnouncer();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title={t("rem.done.title")} instructions={t("rem.done.instructions")} />
        <Callout tone="success" className="space-y-4">
          <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> {t("rem.done.unlocked")}</p>
          <p className="text-lg">{t("rem.done.body")}</p>
          <ButtonLink href="/exam" size="lg" autoFocus>{t("rem.done.cta")}</ButtonLink>
        </Callout>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageIntro
        title={t("rem.practice.title")}
        instructions={t("rem.practice.instructions")}
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
          announce(t("rem.done.message"));
        }}
        finishLabel={t("rem.practice.finish")}
      />
    </div>
  );
}
