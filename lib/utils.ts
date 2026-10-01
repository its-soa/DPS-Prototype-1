import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 312 -> "5:12" */
export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatDate(iso: string | null | undefined, intlLocale = "en-GB") {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" });
}

export function daysBetween(fromIso: string, to = new Date()) {
  return Math.floor((to.getTime() - new Date(fromIso).getTime()) / 86_400_000);
}

export function addMonths(iso: string, months: number) {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}
export function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** Stored device names are English keys of the mock data; map them to translation keys for display. */
export function deviceKey(device: string | undefined) {
  if (device === "iPad in Clinic Room 2") return "device.clinic" as const;
  if (device === "iPad at home") return "device.home" as const;
  return null;
}
