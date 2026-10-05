import Link from "next/link";
import { cn } from "@/lib/utils";

/** Label first, then value, so a screen reader hears "Total learners, 6". */
export function AccessibleMetricCard({ label, value, hint, href, tone }: { label: string; value: string | number; hint?: string; href?: string; tone?: "warning" | "danger" }) {
  const body = (
    <>
      <p className="text-base font-semibold">{label}</p>
      <p className="text-4xl font-bold tabular-nums">{value}</p>
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </>
  );
  const cls = cn(
    "block rounded-xl border-2 bg-surface p-4",
    tone === "warning" ? "border-warning" : tone === "danger" ? "border-danger" : "border-border-soft",
    href && "hover:bg-surface-strong",
  );
  return href ? <Link href={href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>;
}
