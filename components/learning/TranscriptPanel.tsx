"use client";

import { formatClock, spokenTime } from "@/lib/utils";
import type { TranscriptSegment } from "@/lib/types";

/** Full transcript, always visible and directly under the player. Each block can be used to jump the player. */
export function TranscriptPanel({
  segments, position = 0, onJump, heading = "Transcript",
}: {
  segments: TranscriptSegment[];
  position?: number;
  onJump?: (seconds: number) => void;
  heading?: string;
}) {
  return (
    <section id="transcript" aria-labelledby="transcript-h" className="scroll-mt-6 space-y-3 rounded-xl border-2 border-border-soft p-4 sm:p-6">
      <h2 id="transcript-h" className="text-2xl">{heading}</h2>
      <ol className="space-y-4">
        {segments.map((s) => {
          const active = position >= s.start && position < s.end;
          return (
            <li key={s.start} aria-current={active ? "true" : undefined} className={`rounded-lg p-3 ${active ? "border-2 border-primary bg-primary-soft" : "border-2 border-transparent"}`}>
              <p className="text-lg">
                <span className="sr-only">Starts at {spokenTime(s.start)}. </span>
                {s.text}
                {active && <span className="sr-only"> (currently playing)</span>}
              </p>
              {onJump && (
                <button
                  type="button"
                  onClick={() => onJump(s.start)}
                  className="mt-1 inline-flex min-h-12 items-center font-semibold underline underline-offset-4"
                >
                  Play from {formatClock(s.start)}
                  <span className="sr-only">: {s.text.slice(0, 40)}…</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
