/**
 * Trainer-area text. English is the source and the lookup key (gettext style), so every user-facing
 * string in the trainer portal is wrapped in tr("..."). To translate later, fill TRAINER_TRANSLATIONS
 * (keyed by the English text) and read the locale here: no page needs to change.
 */
const TRAINER_TRANSLATIONS: Record<string, Record<string, string>> = { de: {} };

export function tr(source: string, vars?: Record<string, string | number>, locale = "en"): string {
  const text = TRAINER_TRANSLATIONS[locale]?.[source] ?? source;
  return vars ? text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "")) : text;
}

export const plural = (n: number, one: string, other: string) => (n === 1 ? one : other);
