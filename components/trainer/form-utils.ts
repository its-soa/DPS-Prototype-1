/** Announce form problems and move focus to the first invalid field (ids are field ids, in display order). */
export function failForm(
  errors: Record<string, string>,
  order: string[],
  announce: (m: string, o?: { assertive?: boolean }) => void,
) {
  const keys = order.filter((k) => errors[k]);
  if (!keys.length) return false;
  announce(
    `${keys.length === 1 ? "There is 1 problem" : `There are ${keys.length} problems`} with this form. ${errors[keys[0]]}`,
    { assertive: true },
  );
  requestAnimationFrame(() => document.getElementById(keys[0])?.focus());
  return true;
}
