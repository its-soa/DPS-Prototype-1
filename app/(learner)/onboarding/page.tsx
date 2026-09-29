"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { AccessibilitySettingsPanel } from "@/components/a11y/AccessibilitySettingsPanel";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useLearner } from "@/lib/store";
import { useReduceMotion } from "@/lib/use-motion";

const ENABLED_MESSAGE =
  "Audio guidance enabled. This platform will provide spoken orientation and accessible navigation support.";

const STEPS = [
  { key: "welcome", title: "Welcome" },
  { key: "audio", title: "Choose audio guidance" },
  { key: "navigation", title: "How navigation works" },
  { key: "lessons", title: "Lesson audio and transcripts" },
  { key: "saving", title: "Your progress is saved" },
  { key: "finish", title: "Finish orientation" },
] as const;

function Waveform() {
  return (
    <div aria-hidden="true" className="flex h-10 items-center gap-1.5">
      {[0.2, 0.6, 1, 0.5, 0.8, 0.35, 0.9, 0.45, 0.7].map((h, i) => (
        <span key={i} className="wave-bar block w-1.5 rounded-full bg-primary" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const { account, state, setSettings, completeOnboarding } = useLearner();
  const { announce, speak } = useAnnouncer();
  const reduce = useReduceMotion();
  const [step, setStep] = useState(0);
  const [audioChosen, setAudioChosen] = useState(false);
  const [done, setDone] = useState(false);
  const focusNext = useRef<"step" | "confirm" | null>(null); // which heading should take focus when it mounts
  const firstRender = useRef(true);
  const audioOn = state.settings.audioGuidance;

  const current = STEPS[step];
  const next = STEPS[step + 1];

  const bodyText: Record<string, string> = {
    welcome: `Welcome, ${account.fullName}. This short orientation takes about three minutes. You can replay it at any time from your dashboard.`,
    audio: "Choose whether you want spoken guidance. You can change this at any time in the page header.",
    navigation: "Every page has a skip link, a main menu, and one main heading. Use Repeat page instructions to hear what to do on any page.",
    lessons: "Lessons use audio, video with audio description, formatted text or PDF. Every lesson has a full transcript. Audio never starts by itself.",
    saving: "Your progress is saved automatically. Sign in on another device and you can resume exactly where you stopped.",
    finish: "You are ready to begin. Choose Finish orientation to go to your course overview.",
  };

  // Move focus to each new step heading; update the page title and (if enabled) speak the step.
  useEffect(() => {
    document.title = `Orientation, step ${step + 1} of ${STEPS.length}: ${current.title} · MTU Training Platform`;
    if (firstRender.current) { firstRender.current = false; return; }
    speak(`${current.title}. ${bodyText[current.key]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function enableAudio() {
    setSettings({ audioGuidance: true });
    setAudioChosen(true);
    announce(ENABLED_MESSAGE);
    speak(ENABLED_MESSAGE, true); // learner just consented, so speaking is allowed straight away
    focusNext.current = "confirm"; // focus moves to the confirmation heading as it expands
  }
  function skipAudio() {
    setSettings({ audioGuidance: false });
    setAudioChosen(true);
    announce("Audio guidance stays off. You can turn it on at any time from the page header.");
    focusNext.current = "confirm";
  }
  function finish() {
    completeOnboarding();
    setDone(true);
    announce("Onboarding complete. You can now go to your course overview.");
    speak("Onboarding complete. You can now go to your course overview.");
  }

  const stepFocusRef = useCallback((el: HTMLElement | null) => {
    if (el && focusNext.current === "step") { focusNext.current = null; el.focus(); }
  }, []);
  const confirmFocusRef = useCallback((el: HTMLElement | null) => {
    if (el && focusNext.current === "confirm") { focusNext.current = null; el.focus(); }
  }, []);
  const y = reduce ? 0 : 6;
  const showAudioResult = step === 1 && audioChosen;

  if (done) {
    return (
      <>
        <PageIntro title="Orientation complete" />
        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <Callout tone="success" className="max-w-xl space-y-4">
            <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> You are all set</p>
            <p className="text-lg">Your first required course is waiting. You can replay this orientation from your dashboard at any time.</p>
            <ButtonLink href="/dashboard" size="lg" autoFocus>Go to course overview</ButtonLink>
          </Callout>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <PageIntro
        title="Orientation"
        instructions="Six short steps. Use the buttons at the bottom of each step to move forward or back."
        focus={false}
      />
      <p className="mb-4 text-lg font-semibold" aria-hidden="true">Step {step + 1} of {STEPS.length}</p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={step}
          aria-labelledby="step-heading"
          initial={{ opacity: 0, y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -y }}
          transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <h2 id="step-heading" ref={stepFocusRef} tabIndex={-1} className="text-2xl sm:text-3xl">
            <span className="sr-only">Step {step + 1} of {STEPS.length}: </span>{current.title}
          </h2>

          {step === 0 && (
            <>
              <p className="text-lg">Welcome, {account.fullName}. This platform was built for you: blind and low-vision medical examiners.</p>
              <p className="text-lg">This orientation takes about three minutes. It explains how to move around, how lessons work, and how your progress is saved.</p>
            </>
          )}

          {step === 1 && (
            <>
              {!audioChosen && (
                <>
                  <p className="text-lg">Audio guidance gives you spoken orientation and navigation help. It only speaks when you ask, and it never plays lesson audio by itself.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button size="lg" onClick={enableAudio} className="h-auto py-4"><Volume2 aria-hidden="true" /> Enable audio guidance</Button>
                    <Button size="lg" variant="secondary" onClick={skipAudio} className="h-auto py-4"><VolumeX aria-hidden="true" /> Continue without audio guidance</Button>
                  </div>
                  <details className="rounded-xl border-2 border-border-soft p-4">
                    <summary className="min-h-12 cursor-pointer text-base font-semibold">Adjust other accessibility settings</summary>
                    <div className="mt-4"><AccessibilitySettingsPanel /></div>
                  </details>
                </>
              )}
              {showAudioResult && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                  className="overflow-hidden"
                >
                  <Callout tone={audioOn ? "success" : "info"} className="space-y-4">
                    <h3 ref={confirmFocusRef} tabIndex={-1} className="text-xl font-bold">{audioOn ? "Audio guidance is on" : "Audio guidance is off"}</h3>
                    {audioOn && <Waveform />}
                    <p className="text-lg">
                      {audioOn
                        ? "This platform will provide spoken orientation and accessible navigation support."
                        : "You can turn audio guidance on at any time with the switch in the page header."}
                    </p>
                  </Callout>
                </motion.div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-lg">You always know where you are. On every page:</p>
              <ul className="list-disc space-y-2 pl-6 text-lg">
                <li>The first item is <strong>Skip to main content</strong>.</li>
                <li>The <strong>main menu</strong> is a list of links: Dashboard, My progress, Certification exam, Certification and Accessibility settings.</li>
                <li>There is one main heading, and focus moves to it when a page opens.</li>
                <li><strong>Repeat page instructions</strong> in the header tells you what to do on the current page.</li>
                <li>In lessons and exams you always hear your place, for example &ldquo;Question 2 of 10&rdquo;.</li>
              </ul>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-lg">Lessons come in four formats: audio, video with audio description, formatted text, and PDF handbooks with a page reader.</p>
              <ul className="list-disc space-y-2 pl-6 text-lg">
                <li>Audio and video have play and pause, back 15 seconds, forward 30 seconds and speed controls.</li>
                <li>A full <strong>transcript</strong> sits directly under the player.</li>
                <li>Nothing plays until you choose Play.</li>
              </ul>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-lg">Your place is saved automatically: playback position, practice answers and exam answers.</p>
              <p className="text-lg">If you sign in on another device, your course shows a &ldquo;Resume&rdquo; button that takes you to the exact moment you stopped.</p>
              <Callout tone="info"><p className="text-base">You will hear &ldquo;Progress saved&rdquo; when you pause or leave a lesson.</p></Callout>
            </>
          )}

          {step === 5 && (
            <>
              <p className="text-lg">That is everything. Next you will see your course overview with your three required courses.</p>
              <p className="text-base text-muted">You can change accessibility settings at any time, and replay this orientation from the dashboard.</p>
            </>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t-2 border-border-soft pt-6">
            {step > 0 && (
              <Button variant="secondary" size="lg" onClick={() => { focusNext.current = "step"; setStep(step - 1); }}>
                <ArrowLeft aria-hidden="true" /> Back to {STEPS[step - 1].title.toLowerCase()}
              </Button>
            )}
            {step === 5 ? (
              <Button size="lg" onClick={finish}><CheckCircle2 aria-hidden="true" /> Finish orientation</Button>
            ) : (
              <Button
                size="lg"
                disabled={step === 1 && !audioChosen}
                onClick={() => { focusNext.current = "step"; setStep(step + 1); }}
                className={showAudioResult && audioOn ? "px-10 ring-4 ring-primary/30" : ""}
              >
                Continue to {next?.title.toLowerCase()} <ArrowRight aria-hidden="true" />
              </Button>
            )}
            {step === 1 && !audioChosen && <p className="text-sm text-muted">Choose an option above to continue.</p>}
          </div>
        </motion.section>
      </AnimatePresence>
    </>
  );
}
