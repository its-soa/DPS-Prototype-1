import type { Locale } from "./types";

/**
 * Mock of the `translations(locale, key, value)` table.
 * English is complete for the prototype; German covers the shell, info page hero,
 * sign-in and dashboard headings; French is a visible placeholder to show the pattern.
 */
export const LOCALES: { code: Locale; label: string; note?: string }[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français", note: "placeholder translation" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "brand.name": "MTU Training Platform",
  "nav.dashboard": "Dashboard",
  "nav.progress": "My progress",
  "nav.exam": "Certification exam",
  "nav.certification": "Certification",
  "nav.settings": "Accessibility settings",
  "nav.signOut": "Sign out",
  "nav.about": "About the training",
  "nav.signIn": "Sign in",
  "nav.register": "Register with access code",
  "shell.repeat": "Repeat page instructions",
  "shell.language": "Language",
  "shell.skip": "Skip to main content",
  "footer.text": "Closed training platform for medical tactile examiners. Prototype with sample content.",
  "info.title": "Accessible training for medical tactile examiners",
  "info.lead": "A calm, secure, audio-first platform for qualification, recertification and continuing education, designed for blind and low-vision examiners.",
  "info.cta.register": "Register with access code",
  "info.cta.signIn": "Sign in",
  "dash.greeting": "Hello, {name}",
  "dash.sequence": "Your required courses",
  "dash.resume": "Resume where you left off",
  "dash.certification": "Certification status",
  "dash.recert": "Recertification",
  "dash.quick": "Quick access",
  "signin.title": "Sign in",
  "signin.submit": "Sign in to your training",
};

const de: Dict = {
  "brand.name": "MTU-Trainingsplattform",
  "nav.dashboard": "Übersicht",
  "nav.progress": "Mein Fortschritt",
  "nav.exam": "Zertifizierungsprüfung",
  "nav.certification": "Zertifizierung",
  "nav.settings": "Einstellungen zur Barrierefreiheit",
  "nav.signOut": "Abmelden",
  "nav.about": "Über die Schulung",
  "nav.signIn": "Anmelden",
  "nav.register": "Mit Zugangscode registrieren",
  "shell.repeat": "Seitenanleitung wiederholen",
  "shell.language": "Sprache",
  "shell.skip": "Zum Hauptinhalt springen",
  "footer.text": "Geschlossene Trainingsplattform für medizinische Tastuntersucher. Prototyp mit Beispielinhalten.",
  "info.title": "Barrierefreie Schulung für medizinische Tastuntersucher",
  "info.lead": "Eine ruhige, sichere Plattform mit Audio im Mittelpunkt für Qualifizierung, Rezertifizierung und Weiterbildung, entwickelt für blinde und sehbehinderte Untersucher.",
  "info.cta.register": "Mit Zugangscode registrieren",
  "info.cta.signIn": "Anmelden",
  "dash.greeting": "Hallo, {name}",
  "dash.sequence": "Ihre Pflichtkurse",
  "dash.resume": "Dort weitermachen, wo Sie aufgehört haben",
  "dash.certification": "Zertifizierungsstatus",
  "dash.recert": "Rezertifizierung",
  "dash.quick": "Schnellzugriff",
  "signin.title": "Anmelden",
  "signin.submit": "Bei der Schulung anmelden",
};

const fr: Dict = {
  "nav.signIn": "Se connecter",
  "info.title": "Formation accessible pour les examinateurs tactiles médicaux",
};

export const DICTIONARIES: Record<Locale, Dict> = { en, de, fr };

export function translate(locale: Locale, key: string, vars?: Record<string, string>) {
  const raw = DICTIONARIES[locale]?.[key] ?? en[key] ?? key;
  return vars ? raw.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : raw;
}
