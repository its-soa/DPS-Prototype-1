"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import type { PracticeQuestion } from "@/lib/types";
import { useApp } from "@/lib/store";
import { formatClock } from "@/lib/utils";

/**
 * Related lesson segment in a native <dialog>: focus is trapped while open, Escape closes it,
 * and focus returns to the button that opened it.
 */
export function LessonSegmentDialog({
  open, onClose, related, speed = 1, isTimed,
}: {
  open: boolean;
  onClose: () => void;
  related: PracticeQuestion["related"];
  speed?: number;
  isTimed: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const { announce } = useAnnouncer();
  const { t, spoken } = useApp();
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const length = related.start !== undefined && related.end !== undefined ? related.end - related.start : 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
      announce(t("seg.opened"));
    }
    if (!open && d.open) d.close();
  }, [open, announce, t]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        const n = e + 0.25 * speed;
        if (n >= length) {
          setPlaying(false);
          announce(t("seg.finished"));
          return length;
        }
        return n;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing, length, speed, announce, t]);

  function close() {
    setPlaying(false);
    setElapsed(0);
    ref.current?.close();
    onClose();
    (opener.current as HTMLElement | null)?.focus?.();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="segment-h"
      onCancel={(e) => { e.preventDefault(); close(); }}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-xl border-4 border-border bg-background p-0 text-foreground backdrop:bg-black/60"
    >
      <div className="space-y-4 p-5 sm:p-6">
        <h2 id="segment-h" className="text-2xl">{t("seg.h")}</h2>
        <p className="text-base font-semibold text-muted">{related.label}</p>
        <blockquote className="border-l-4 border-primary pl-4 text-lg">{related.excerpt}</blockquote>

        {isTimed && length > 0 && (
          <div className="space-y-2 rounded-lg border-2 border-border-soft bg-surface p-4">
            <p className="text-base font-semibold">
              {t("seg.snippet", { from: formatClock(related.start!), to: formatClock(related.end!) })}
              <span className="sr-only"> ({t("seg.snippetSpoken", { from: spoken(related.start!), to: spoken(related.end!) })})</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  if (!playing && elapsed >= length) setElapsed(0);
                  setPlaying((p) => !p);
                }}
              >
                {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
                {playing ? t("seg.pause") : elapsed > 0 && elapsed < length ? t("seg.resume") : t("seg.replay")}
              </Button>
              <progress value={elapsed} max={length} aria-label={t("seg.progress")} className="h-3 flex-1" />
            </div>
            <p className="text-sm text-muted">{t("seg.protoNote")}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t-2 border-border-soft pt-4">
          <Button size="lg" onClick={close} autoFocus>
            <X aria-hidden="true" className="size-5" /> {t("practice.return")}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
