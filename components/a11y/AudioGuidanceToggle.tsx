"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useApp } from "@/lib/store";
import { useAnnouncer } from "./ScreenReaderAnnouncement";

/** A native checkbox with role="switch": works with keyboard, touch and VoiceOver. */
export function AudioGuidanceToggle({ id = "audio-guidance-toggle", compact = false }: { id?: string; compact?: boolean }) {
  const { state, setSettings } = useApp();
  const { announce } = useAnnouncer();
  const on = state.settings.audioGuidance;

  return (
    <label htmlFor={id} className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-border bg-background px-4 py-2 text-base font-semibold">
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={on}
        onChange={(e) => {
          setSettings({ audioGuidance: e.target.checked });
          announce(
            e.target.checked
              ? "Audio guidance enabled. This platform will provide spoken orientation and accessible navigation support."
              : "Audio guidance disabled.",
          );
        }}
      />
      {on ? <Volume2 aria-hidden="true" className="size-5" /> : <VolumeX aria-hidden="true" className="size-5" />}
      <span>{compact ? "Audio guidance" : `Audio guidance: ${on ? "on" : "off"}`}</span>
    </label>
  );
}
