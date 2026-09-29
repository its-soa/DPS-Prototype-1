"use client";

import { Languages } from "lucide-react";
import { LOCALES } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { Locale } from "@/lib/types";
import { useAnnouncer } from "./ScreenReaderAnnouncement";

export function LanguageSwitcher() {
  const { state, setLanguage, t } = useApp();
  const { announce } = useAnnouncer();
  return (
    <div className="flex items-center gap-2">
      <Languages aria-hidden="true" className="size-5" />
      <label htmlFor="language-select" className="text-base font-semibold">{t("shell.language")}</label>
      <select
        id="language-select"
        value={state.language}
        onChange={(e) => {
          const l = e.target.value as Locale;
          setLanguage(l);
          const item = LOCALES.find((x) => x.code === l)!;
          announce(`Language changed to ${item.label}${item.note ? `, ${item.note}` : ""}.`);
        }}
        className="min-h-12 rounded-lg border-2 border-border bg-background px-3 text-base"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}{l.note ? ` (${l.note})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
