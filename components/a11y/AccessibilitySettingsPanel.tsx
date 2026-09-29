"use client";

import { useApp } from "@/lib/store";
import type { AccessibilitySettings } from "@/lib/types";
import { useAnnouncer } from "./ScreenReaderAnnouncement";

function Radios<T extends string>({
  legend, name, value, options, onChange, hint,
}: {
  legend: string; name: string; value: T; hint?: string;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-lg font-bold">{legend}</legend>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="text-base">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Changes apply immediately and are announced. There is no "save" step to miss. */
export function AccessibilitySettingsPanel() {
  const { state, setSettings } = useApp();
  const { announce } = useAnnouncer();
  const s = state.settings;
  const set = (patch: Partial<AccessibilitySettings>, message: string) => {
    setSettings(patch);
    announce(message);
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()} aria-label="Accessibility settings">
      <Radios
        legend="Text size" name="text-size" value={s.textSize}
        hint="Everything on the page scales with this setting."
        options={[
          { value: "standard", label: "Standard" },
          { value: "large", label: "Large" },
          { value: "xlarge", label: "Extra large" },
          { value: "xxlarge", label: "Largest" },
        ]}
        onChange={(v) => set({ textSize: v }, `Text size set to ${v === "xlarge" ? "extra large" : v === "xxlarge" ? "largest" : v}.`)}
      />
      <Radios
        legend="Contrast" name="contrast" value={s.contrast}
        options={[{ value: "standard", label: "Standard contrast" }, { value: "high", label: "High contrast" }]}
        onChange={(v) => set({ contrast: v }, `${v === "high" ? "High" : "Standard"} contrast on.`)}
      />
      <Radios
        legend="Colour theme" name="theme" value={s.theme}
        options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
        onChange={(v) => set({ theme: v }, `${v === "dark" ? "Dark" : "Light"} theme on.`)}
      />
      <fieldset className="space-y-2">
        <legend className="text-lg font-bold">Motion and audio</legend>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-3">
          <input type="checkbox" checked={s.reduceMotion} onChange={(e) => set({ reduceMotion: e.target.checked }, `Reduced motion ${e.target.checked ? "on" : "off"}.`)} aria-describedby="rm-desc" />
          <span>
            <span className="block text-base font-semibold">Reduce motion</span>
            <span id="rm-desc" className="block text-sm text-muted">Removes fades and movement. Your device setting is always respected too.</span>
          </span>
        </label>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-3">
          <input type="checkbox" role="switch" checked={s.audioGuidance} onChange={(e) => set({ audioGuidance: e.target.checked }, e.target.checked ? "Audio guidance enabled. This platform will provide spoken orientation and accessible navigation support." : "Audio guidance disabled.")} aria-describedby="ag-desc" />
          <span>
            <span className="block text-base font-semibold">Audio guidance</span>
            <span id="ag-desc" className="block text-sm text-muted">Speaks page instructions when you ask for them, and during orientation. Audio never starts by itself.</span>
          </span>
        </label>
      </fieldset>
      <div className="space-y-2">
        <label htmlFor="default-speed" className="block text-lg font-bold">Default playback speed</label>
        <p id="speed-desc" className="text-sm text-muted">Used when you open a lesson with audio or video.</p>
        <select
          id="default-speed" aria-describedby="speed-desc" value={s.defaultSpeed}
          onChange={(e) => set({ defaultSpeed: Number(e.target.value) }, `Default playback speed set to ${e.target.value} times.`)}
          className="min-h-12 rounded-lg border-2 border-border bg-background px-4 text-base"
        >
          {[0.75, 1, 1.25, 1.5, 2].map((v) => <option key={v} value={v}>{v}× {v === 1 ? "(normal)" : ""}</option>)}
        </select>
      </div>
    </form>
  );
}
