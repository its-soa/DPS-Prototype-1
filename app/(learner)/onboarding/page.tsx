"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { AccessibilitySettingsPanel } from "@/components/a11y/AccessibilitySettingsPanel";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import type { TKey } from "@/lib/i18n";
import { rich } from "@/lib/rich";
import { useLearner } from "@/lib/store";
import { useReduceMotion } from "@/lib/use-motion";

const STEPS = ["welcome", "audio", "navigation", "lessons", "saving", "finish"] as const;
const stepTitle = (k: (typeof STEPS)[number]) => `onb.${k}.title` as TKey;
const stepSpoken = (k: (typeof STEPS)[number]) => `onb.${k}.spoken` as TKey;

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
  const { account, state, setSettings, completeOnboarding, t } = useLearner();
  const { announce, speak } = useAnnouncer();
  const reduce = useReduceMotion();
  const [step, setStep] = useState(0);
  const [audioChosen, setAudioChosen] = useState(false);
  const [done, setDone] = useState(false);
  const focusNext = useRef<"step" | "confirm" | null>(null); // which heading should take focus when it mounts
  const firstRender = useRef(true);
  const audioOn = state.settings.audioGuidance;

  const key = STEPS[step];
  const next = STEPS[step + 1];
  const title = t(stepTitle(key));

  // Update the page title and (if enabled) speak the step. Focus is handled by the heading refs below.
  useEffect(() => {
    document.title = `${t("onb.pageTitle", { step: step + 1, total: STEPS.length, title })} · ${t("brand.name")}`;
    if (firstRender.current) { firstRender.current = false; return; }
    speak(`${title}. ${t(stepSpoken(key), { name: account.fullName })}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, state.language]);

  function enableAudio() {
    setSettings({ audioGuidance: true });
    setAudioChosen(true);
    announce(t("audio.enabledMessage"));
    speak(t("audio.enabledMessage"), true); // learner just consented, so speaking is allowed straight away
    focusNext.current = "confirm"; // focus moves to the confirmation heading as it expands
  }
  function skipAudio() {
    setSettings({ audioGuidance: false });
    setAudioChosen(true);
    announce(t("onb.audio.stayOffMessage"));
    focusNext.current = "confirm";
  }
  function finish() {
    completeOnboarding();
    setDone(true);
    announce(t("onb.doneMessage"));
    speak(t("onb.doneMessage"));
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
        <PageIntro title={t("onb.done.title")} />
        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <Callout tone="success" className="max-w-xl space-y-4">
            <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> {t("onb.done.allSet")}</p>
            <p className="text-lg">{t("onb.done.body")}</p>
            <ButtonLink href="/dashboard" size="lg" autoFocus>{t("onb.done.cta")}</ButtonLink>
          </Callout>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <PageIntro title={t("onb.title")} instructions={t("onb.instructions")} focus={false} />
      <p className="mb-4 text-lg font-semibold" aria-hidden="true">{t("onb.stepOf", { step: step + 1, total: STEPS.length })}</p>

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
            <span className="sr-only">{t("onb.stepOf", { step: step + 1, total: STEPS.length })}: </span>{title}
          </h2>

          {step === 0 && (
            <>
              <p className="text-lg">{t("onb.welcome.p1", { name: account.fullName })}</p>
              <p className="text-lg">{t("onb.welcome.p2")}</p>
            </>
          )}

          {step === 1 && (
            <>
              {!audioChosen && (
                <>
                  <p className="text-lg">{t("onb.audio.intro")}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button size="lg" onClick={enableAudio} className="h-auto py-4"><Volume2 aria-hidden="true" /> {t("onb.audio.enable")}</Button>
                    <Button size="lg" variant="secondary" onClick={skipAudio} className="h-auto py-4"><VolumeX aria-hidden="true" /> {t("onb.audio.skip")}</Button>
                  </div>
                  <details className="rounded-xl border-2 border-border-soft p-4">
                    <summary className="min-h-12 cursor-pointer text-base font-semibold">{t("onb.audio.moreSettings")}</summary>
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
                    <h3 ref={confirmFocusRef} tabIndex={-1} className="text-xl font-bold">{audioOn ? t("onb.audio.isOn") : t("onb.audio.isOff")}</h3>
                    {audioOn && <Waveform />}
                    <p className="text-lg">{audioOn ? t("onb.audio.isOnBody") : t("onb.audio.isOffBody")}</p>
                  </Callout>
                </motion.div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-lg">{t("onb.nav.lead")}</p>
              <ul className="list-disc space-y-2 pl-6 text-lg">
                <li>{rich(t("onb.nav.1"))}</li>
                <li>{rich(t("onb.nav.2"))}</li>
                <li>{t("onb.nav.3")}</li>
                <li>{rich(t("onb.nav.4"))}</li>
                <li>{t("onb.nav.5")}</li>
              </ul>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-lg">{t("onb.lessons.lead")}</p>
              <ul className="list-disc space-y-2 pl-6 text-lg">
                <li>{t("onb.lessons.1")}</li>
                <li>{rich(t("onb.lessons.2"))}</li>
                <li>{t("onb.lessons.3")}</li>
              </ul>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-lg">{t("onb.saving.p1")}</p>
              <p className="text-lg">{t("onb.saving.p2")}</p>
              <Callout tone="info"><p className="text-base">{t("onb.saving.note")}</p></Callout>
            </>
          )}

          {step === 5 && (
            <>
              <p className="text-lg">{t("onb.finish.p1")}</p>
              <p className="text-base text-muted">{t("onb.finish.p2")}</p>
            </>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t-2 border-border-soft pt-6">
            {step > 0 && (
              <Button variant="secondary" size="lg" onClick={() => { focusNext.current = "step"; setStep(step - 1); }}>
                <ArrowLeft aria-hidden="true" /> {t("onb.backTo", { title: t(stepTitle(STEPS[step - 1])) })}
              </Button>
            )}
            {step === 5 ? (
              <Button size="lg" onClick={finish}><CheckCircle2 aria-hidden="true" /> {t("onb.finish.cta")}</Button>
            ) : (
              <Button
                size="lg"
                disabled={step === 1 && !audioChosen}
                onClick={() => { focusNext.current = "step"; setStep(step + 1); }}
                className={showAudioResult && audioOn ? "px-10 ring-4 ring-primary/30" : ""}
              >
                {t("onb.continueTo", { title: t(stepTitle(next)) })} <ArrowRight aria-hidden="true" />
              </Button>
            )}
            {step === 1 && !audioChosen && <p className="text-sm text-muted">{t("onb.audio.choose")}</p>}
          </div>
        </motion.section>
      </AnimatePresence>
    </>
  );
}
