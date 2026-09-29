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
import { REMEDIATION } from "@/lib/mock-data";
import { useLearner } from "@/lib/store";

export default function RemediationPage() {
  const { data, state, setRecapDone } = useLearner();
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
        title="Remediation lesson: audio recap"
        instructions="A short recap of the key ideas, followed by two practice questions. Then your exam retry unlocks."
      />
      <Callout tone="info"><p className="text-lg">Take your time. This is a chance to strengthen what you already know. There is no penalty for spending as long as you need.</p></Callout>

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
      <TranscriptPanel segments={REMEDIATION.segments} position={position} onJump={(s) => { setPosition(s); announce(`Moved to ${s} seconds.`); }} />

      <section aria-labelledby="next-h" className="space-y-3">
        <h2 id="next-h" className="text-2xl">Next step</h2>
        {done ? (
          <Callout tone="success" className="space-y-3">
            <p className="flex items-center gap-2 text-lg font-bold"><CheckCircle2 aria-hidden="true" /> Recap complete</p>
            <ButtonLink href="/exam/remediation/practice" size="lg">Continue to remediation practice</ButtonLink>
          </Callout>
        ) : (
          <>
            <p className="text-base">Finish the audio, or read the transcript above, then confirm.</p>
            <Button
              size="lg" variant="secondary"
              onClick={() => { setRecapDone(); announce("Recap marked as complete. You can now continue to remediation practice."); router.push("/exam/remediation/practice"); }}
            >
              I have reviewed the recap. Continue to remediation practice
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
