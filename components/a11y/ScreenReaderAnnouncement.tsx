"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/store";

interface Announcer {
  /** Politely announce a status message (or assertively for errors). */
  announce: (message: string, opts?: { assertive?: boolean }) => void;
  /** Spoken guidance via the browser voice. Only runs when the learner has turned Audio Guidance on. */
  speak: (text: string, force?: boolean) => void;
  setInstructions: (text: string) => void;
  repeatInstructions: () => void;
  hasInstructions: boolean;
}

const Ctx = createContext<Announcer | null>(null);

/**
 * Mounts two persistent live regions (polite + assertive). Live regions must exist
 * before their content changes, so they live at the root and never unmount.
 */
export function ScreenReaderAnnouncement({ children }: { children: React.ReactNode }) {
  const { state, t } = useApp();
  const guidanceOn = state.settings.audioGuidance;
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  const [instructions, setInstr] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const announce = useCallback((message: string, opts?: { assertive?: boolean }) => {
    const set = opts?.assertive ? setAssertive : setPolite;
    set("");
    clearTimeout(timer.current);
    // brief gap so repeated identical messages are announced again
    timer.current = setTimeout(() => set(message), 60);
  }, []);

  const speak = useCallback(
    (text: string, force = false) => {
      if ((!guidanceOn && !force) || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = state.language;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    },
    [guidanceOn, state.language],
  );

  useEffect(() => {
    if (!guidanceOn && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [guidanceOn]);

  const value = useMemo<Announcer>(
    () => ({
      announce,
      speak,
      setInstructions: setInstr,
      repeatInstructions: () => {
        const text = instructions || t("a11y.noInstructions");
        announce(text);
        speak(text);
      },
      hasInstructions: true,
    }),
    [announce, speak, instructions, t],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" role="status" className="sr-only" data-testid="live-polite">{polite}</div>
      <div aria-live="assertive" aria-atomic="true" role="alert" className="sr-only" data-testid="live-assertive">{assertive}</div>
    </Ctx.Provider>
  );
}

export function useAnnouncer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAnnouncer must be used inside ScreenReaderAnnouncement");
  return v;
}
