import type { TKey } from "./i18n";

/** Returns translation keys for each unmet rule (empty array = password is valid). */
export function validatePassword(pw: string): TKey[] {
  const missing: TKey[] = [];
  if (pw.length < 10) missing.push("reg.rule.length");
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw)) missing.push("reg.rule.case");
  if (!/\d/.test(pw)) missing.push("reg.rule.number");
  return missing;
}
