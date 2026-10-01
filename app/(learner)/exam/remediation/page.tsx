"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { LessonAudioPlayer } from "@/components/learning/LessonAudioPlayer";
import { TranscriptPanel } from "@/components/learning/TranscriptPanel";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useCatalog } from "@/lib/catalog";
import { useLearner } from "@/lib/store";

export default function RemediationPage() {
  const { data, state, setRecapDone, t, spoken } = useLearner();
  const { remediation: REMEDIATION } = useCatalog();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [position, setPosition] = useState(0);
  const noopSave = useCallback(() => {}, []);
  const done = data.remediation.recapDone;

  const finish = useCallback(() => {
    setRecapDone();
  }, [setRecapDone]);

  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro
        title={t("rem.title")}
        instructions={t("rem.instructions")}
      />
      <Callout tone="info"><p className="text-lg">{t("rem.calm")}</p></Callout>

      <LessonAudioPlayer
        kind="audio"
        title={REMEDIATION.title}
        durationSeconds={REMEDIATION.durationSeconds}
        assetUrl="/media/placeholder-remediation.mp3"
        defaultSpeed={state.settings.defaultSpeed}
        position={position}
        onPositionChange={setPosition}
        onSave={noopSave}
        onComplete={finish}
      />
      <TranscriptPanel segments={REMEDIATION.segments} position={position} onJump={(s) => { setPosition(s); announce(t("lesson.moved", { time: spoken(s) })); }} />

      <section aria-labelledby="next-h" className="space-y-3">
        <h2 id="next-h" className="text-2xl">{t("rem.next")}</h2>
        {done ? (
          <Callout tone="success" className="space-y-3">
            <p className="flex items-center gap-2 text-lg font-bold"><CheckCircle2 aria-hidden="true" /> {t("rem.recapDone")}</p>
            <ButtonLink href="/exam/remediation/practice" size="lg">{t("rem.toPractice")}</ButtonLink>
          </Callout>
        ) : (
          <>
            <p className="text-base">{t("rem.finishHint")}</p>
            <Button
              size="lg" variant="secondary"
              onClick={() => { setRecapDone(); announce(t("rem.recapMessage")); router.push("/exam/remediation/practice"); }}
            >
              {t("rem.confirmCta")}
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
