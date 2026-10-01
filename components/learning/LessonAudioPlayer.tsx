"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, Video } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { deviceKey, formatClock } from "@/lib/utils";

export const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

/**
 * Accessible media player for audio AND video lessons.
 *
 * PROTOTYPE: playback is simulated with a timer so the whole progress-saving journey
 * can be tested without media files. In production, swap the timer for an
 * <audio>/<video> element bound to `assetUrl`; the controls, announcements and
 * progress-saving contract stay identical.
 *
 * All controls are native buttons / range / select. No drag, no hover-only UI, no autoplay.
 */
export function LessonAudioPlayer({
  kind, title, durationSeconds, assetUrl, initialPosition = 0, defaultSpeed = 1,
  savedFrom, onSave, onComplete, position: controlled, onPositionChange, audioDescription,
}: {
  kind: "audio" | "video";
  title: string;
  durationSeconds: number;
  assetUrl: string;
  initialPosition?: number;
  defaultSpeed?: number;
  savedFrom?: string;
  /** Called on pause, every few seconds while playing, and on unmount. */
  onSave?: (position: number) => void;
  onComplete?: () => void;
  /** Optional: let the parent read/seek the position (used by the transcript). */
  position?: number;
  onPositionChange?: (p: number) => void;
  audioDescription?: string;
}) {
  const { announce } = useAnnouncer();
  const { t, spoken } = useApp();
  const [internalPos, setInternalPos] = useState(Math.min(initialPosition, durationSeconds));
  const position = controlled ?? internalPos;
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [savedAt, setSavedAt] = useState<number | null>(initialPosition > 0 ? initialPosition : null);
  const posRef = useRef(position);
  const lastSaved = useRef(position);
  const completed = useRef(false);

  const setPos = useCallback((p: number) => {
    const v = Math.max(0, Math.min(p, durationSeconds));
    posRef.current = v;
    setInternalPos(v);
    onPositionChange?.(v);
  }, [durationSeconds, onPositionChange]);
  useEffect(() => { posRef.current = position; }, [position]);

  const save = useCallback(() => {
    onSave?.(posRef.current);
    lastSaved.current = posRef.current;
    setSavedAt(posRef.current);
  }, [onSave]);

  // simulated playback clock
  useEffect(() => {
    if (!playing) return;
    const tick = 250;
    const id = setInterval(() => {
      const next = posRef.current + (tick / 1000) * speed;
      if (next >= durationSeconds) {
        setPos(durationSeconds);
        setPlaying(false);
        save();
        if (!completed.current) {
          completed.current = true;
          announce(kind === "video" ? t("player.finishedVideo") : t("player.finishedAudio"));
          onComplete?.();
        }
        return;
      }
      setPos(next);
      if (next - lastSaved.current >= 5) save();
    }, tick);
    return () => clearInterval(id);
  }, [playing, speed, durationSeconds, setPos, save, announce, kind, onComplete, t]);

  // save on leave
  useEffect(() => () => { if (posRef.current !== lastSaved.current) onSave?.(posRef.current); }, [onSave]);

  function toggle() {
    if (playing) {
      setPlaying(false);
      save();
      announce(t("player.paused", { time: spoken(posRef.current) }));
    } else {
      if (posRef.current >= durationSeconds) setPos(0);
      setPlaying(true);
      announce(t("player.playingFrom", { time: spoken(posRef.current) }));
    }
  }
  function skip(delta: number) {
    setPos(posRef.current + delta);
    announce(t(delta > 0 ? "player.forwardDone" : "player.backDone", { seconds: Math.abs(delta), time: spoken(posRef.current) }));
    save();
  }

  const pct = durationSeconds ? (position / durationSeconds) * 100 : 0;
  const resumed = initialPosition > 0 && initialPosition < durationSeconds;

  return (
    <section aria-labelledby="player-h" className="space-y-4 rounded-xl border-2 border-border bg-surface p-4 sm:p-6">
      <h2 id="player-h" className="text-2xl">{kind === "video" ? t("player.videoH") : t("player.audioH")}</h2>

      {kind === "video" && (
        <div role="img" aria-label={t("player.videoPlaceholderAria")} className="flex aspect-video items-center justify-center rounded-lg border-2 border-border bg-surface-strong">
          <div className="space-y-2 text-center">
            <Video aria-hidden="true" className="mx-auto size-12 text-primary" />
            <p className="text-base font-semibold">{t("player.videoPlaceholder")}</p>
          </div>
        </div>
      )}

      {resumed && (
        <Callout tone="info" className="space-y-2">
          <p className="text-base">
            <strong>{t("player.savedPosition", { time: formatClock(initialPosition) })}</strong>
            <span className="sr-only"> ({spoken(initialPosition)})</span>
            {savedFrom && deviceKey(savedFrom) && <> {t("player.fromDevice", { device: t(deviceKey(savedFrom)!) })}</>}. {t("player.readyHint")}
          </p>
          <Button variant="secondary" onClick={() => { setPos(0); save(); announce(t("player.restarted")); }}>
            <RotateCcw aria-hidden="true" className="size-5" /> {t("player.restart")}
          </Button>
        </Callout>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={toggle} aria-label={playing ? t("player.pauseTitle", { title }) : t("player.playTitle", { title })} className="min-w-40">
          {playing ? <Pause aria-hidden="true" className="size-6" /> : <Play aria-hidden="true" className="size-6" />}
          {playing ? t("player.pause") : position > 0 && position < durationSeconds ? t("player.resume") : t("player.play")}
        </Button>
        <Button variant="secondary" onClick={() => skip(-15)}><SkipBack aria-hidden="true" className="size-5" /> {t("player.back15")}</Button>
        <Button variant="secondary" onClick={() => skip(30)}>{t("player.forward30")} <SkipForward aria-hidden="true" className="size-5" /></Button>
        {playing && (
          <div aria-hidden="true" className="flex h-8 items-center gap-1">
            {[0.4, 1, 0.6, 0.9, 0.5].map((h, i) => (
              <span key={i} className="wave-bar block w-1.5 rounded-full bg-primary" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="seek" className="block text-base font-semibold">{t("player.position")}</label>
        <input
          id="seek" type="range" min={0} max={durationSeconds} step={5} value={Math.floor(position)}
          onChange={(e) => setPos(Number(e.target.value))}
          onBlur={save}
          aria-valuetext={t("player.valueText", { current: spoken(position), total: spoken(durationSeconds) })}
        />
        <p className="flex justify-between text-base font-semibold tabular-nums">
          <span><span className="sr-only">{t("player.currentTime")} </span>{formatClock(position)}</span>
          <span><span className="sr-only">{t("player.totalTime")} </span>{formatClock(durationSeconds)}</span>
        </p>
        <span className="sr-only">{t("player.percentPlayed", { pct: Math.round(pct) })}</span>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-1">
          <label htmlFor="speed" className="block text-base font-semibold">{t("player.speed")}</label>
          <select
            id="speed" value={speed}
            onChange={(e) => { const s = Number(e.target.value); setSpeed(s); announce(t("player.speedSet", { speed: s })); }}
            className="min-h-12 rounded-lg border-2 border-border bg-background px-4 text-base"
          >
            {SPEEDS.map((s) => <option key={s} value={s}>{s}× {s === 1 ? t("player.normal") : ""}</option>)}
          </select>
        </div>
        <a href="#transcript" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{t("player.jumpTranscript")}</a>
        <Button
          variant="ghost"
          onClick={() => { setPlaying(false); setPos(durationSeconds - 1); setPlaying(true); }}
          aria-describedby="skip-note"
        >
          {t("player.skipEnd")}
        </Button>
      </div>
      <p id="skip-note" className="text-sm text-muted">{t("player.skipNote")}</p>

      <p className="flex items-center gap-2 text-base font-semibold text-success" data-testid="saved-indicator">
        <span aria-hidden="true">✓</span>
        {savedAt === null ? t("player.willSave") : t("player.savedAtTime", { time: formatClock(savedAt) })}
      </p>

      {kind === "video" && audioDescription && (
        <section aria-labelledby="ad-h" className="space-y-1 rounded-lg border-2 border-border-soft bg-background p-4">
          <h3 id="ad-h" className="text-lg">{t("player.adH")}</h3>
          <p className="text-base">{audioDescription}</p>
        </section>
      )}
      <p className="text-sm text-muted">{t("player.protoMedia")} <code>{assetUrl}</code></p>
    </section>
  );
}
