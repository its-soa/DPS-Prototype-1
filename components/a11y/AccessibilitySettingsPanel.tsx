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
  const { state, setSettings, t } = useApp();
  const { announce } = useAnnouncer();
  const s = state.settings;
  const set = (patch: Partial<AccessibilitySettings>, message: string) => {
    setSettings(patch);
    announce(message);
  };
  const sizeName = { standard: t("settings.size.standard"), large: t("settings.size.large"), xlarge: t("settings.size.xlarge"), xxlarge: t("settings.size.xxlarge") };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()} aria-label={t("settings.title")}>
      <Radios
        legend={t("settings.textSize")} name="text-size" value={s.textSize}
        hint={t("settings.textSizeHint")}
        options={(["standard", "large", "xlarge", "xxlarge"] as const).map((v) => ({ value: v, label: sizeName[v] }))}
        onChange={(v) => set({ textSize: v }, t("settings.textSizeSet", { size: sizeName[v] }))}
      />
      <Radios
        legend={t("settings.contrast")} name="contrast" value={s.contrast}
        options={[{ value: "standard", label: t("settings.contrast.standard") }, { value: "high", label: t("settings.contrast.high") }]}
        onChange={(v) => set({ contrast: v }, v === "high" ? t("settings.contrast.highOn") : t("settings.contrast.standardOn"))}
      />
      <Radios
        legend={t("settings.theme")} name="theme" value={s.theme}
        options={[{ value: "light", label: t("settings.theme.light") }, { value: "dark", label: t("settings.theme.dark") }]}
        onChange={(v) => set({ theme: v }, v === "dark" ? t("settings.theme.darkOn") : t("settings.theme.lightOn"))}
      />
      <fieldset className="space-y-2">
        <legend className="text-lg font-bold">{t("settings.motionAudio")}</legend>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-3">
          <input type="checkbox" checked={s.reduceMotion} onChange={(e) => set({ reduceMotion: e.target.checked }, e.target.checked ? t("settings.reduceMotion.on") : t("settings.reduceMotion.off"))} aria-describedby="rm-desc" />
          <span>
            <span className="block text-base font-semibold">{t("settings.reduceMotion")}</span>
            <span id="rm-desc" className="block text-sm text-muted">{t("settings.reduceMotionHint")}</span>
          </span>
        </label>
        <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-3">
          <input type="checkbox" role="switch" checked={s.audioGuidance} onChange={(e) => set({ audioGuidance: e.target.checked }, e.target.checked ? t("audio.enabledMessage") : t("audio.disabledMessage"))} aria-describedby="ag-desc" />
          <span>
            <span className="block text-base font-semibold">{t("audio.label")}</span>
            <span id="ag-desc" className="block text-sm text-muted">{t("settings.audioHint")}</span>
          </span>
        </label>
      </fieldset>
      <div className="space-y-2">
        <label htmlFor="default-speed" className="block text-lg font-bold">{t("settings.defaultSpeed")}</label>
        <p id="speed-desc" className="text-sm text-muted">{t("settings.defaultSpeedHint")}</p>
        <select
          id="default-speed" aria-describedby="speed-desc" value={s.defaultSpeed}
          onChange={(e) => set({ defaultSpeed: Number(e.target.value) }, t("player.speedSet", { speed: e.target.value }))}
          className="min-h-12 rounded-lg border-2 border-border bg-background px-4 text-base"
        >
          {[0.75, 1, 1.25, 1.5, 2].map((v) => <option key={v} value={v}>{v}× {v === 1 ? t("player.normal") : ""}</option>)}
        </select>
      </div>
    </form>
  );
}
