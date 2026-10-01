"use client";

import { COURSES } from "@/lib/mock-data";
import { courseStatus, overallPercent } from "@/lib/progress";
import { useApp } from "@/lib/store";
import type { UserData } from "@/lib/types";
import { ProgressBar } from "@/components/ui/progress";

export function ProgressSummary({ data }: { data: UserData }) {
  const { t } = useApp();
  const statuses = COURSES.map((c) => courseStatus(data, c));
  const completed = statuses.filter((s) => s === "complete").length;
  const inProgress = statuses.filter((s) => s === "in-progress").length;
  const upcoming = statuses.length - completed - inProgress;
  const pct = overallPercent(data);
  return (
    <section aria-labelledby="summary-h" className="space-y-3">
      <h2 id="summary-h" className="text-2xl">{t("summary.h")}</h2>
      <ProgressBar value={pct} label={t("summary.overall", { pct })} />
      <ul className="grid gap-3 sm:grid-cols-3">
        {[
          { n: completed, l: t("summary.completed", { count: completed }) },
          { n: inProgress, l: t("summary.inProgress", { count: inProgress }) },
          { n: upcoming, l: t("summary.upcoming", { count: upcoming }) },
        ].map((x) => (
          <li key={x.l} className="rounded-xl border-2 border-border-soft bg-surface p-4">
            <span className="block text-3xl font-bold">{x.n}</span>
            <span className="text-base font-semibold">{x.l}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
