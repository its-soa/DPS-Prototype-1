import type { Locale } from "./types";
import { en } from "./i18n/en";
import { de } from "./i18n/de";

/**
 * Interface text (buttons, labels, instructions, announcements).
 * Course content lives in lib/content/* (see lib/localize.ts).
 *
 * - `en` is the source of truth. `de` must contain EVERY key of `en` (enforced by the compiler),
 *   so a missing German string fails the build instead of silently showing English.
 * - Plurals: define `key.one` and `key.other`, call t("key", { count }).
 * - Mock of the `translations(locale, key, value)` table in /supabase/schema.sql.
 */
export type RawKey = keyof typeof en;
export type TKey = RawKey extends infer K ? (K extends `${infer B}.one` | `${infer B}.other` ? B : K) : never;
export type TVars = Record<string, string | number>;

// French stays a visible placeholder. Hidden unless NEXT_PUBLIC_SHOW_PLACEHOLDER_LANG=1.
const showPlaceholder = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_LANG === "1";
export const LOCALES: { code: Locale; label: string; note?: string }[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  ...(showPlaceholder ? [{ code: "fr" as Locale, label: "Français", note: "placeholder translation" }] : []),
];

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  en,
  de,
  fr: { "nav.signIn": "Se connecter", "info.title": "Formation accessible pour les examinateurs tactiles médicaux" },
};

export const INTL_LOCALE: Record<Locale, string> = { en: "en-GB", de: "de-DE", fr: "fr-FR" };

export function translate(locale: Locale, key: TKey, vars?: TVars): string {
  const dict = DICTIONARIES[locale] ?? en;
  let k: string = key;
  if (vars && typeof vars.count === "number") {
    const cat = new Intl.PluralRules(INTL_LOCALE[locale]).select(vars.count);
    const pk = `${key}.${cat === "one" ? "one" : "other"}`;
    if (pk in en) k = pk;
  }
  const raw = dict[k] ?? (en as Record<string, string>)[k] ?? k;
  return vars ? raw.replace(/\{(\w+)\}/g, (_, n) => String(vars[n] ?? "")) : raw;
}
