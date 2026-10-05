"use client";

import Link from "next/link";
import { PageIntro } from "@/components/a11y/PageIntro";
import { DataView } from "@/components/trainer/DataView";
import { AccessibleMetricCard } from "@/components/trainer/MetricCard";
import { StatusPill } from "@/components/trainer/StatusPill";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { cohortMetrics, courseProgress, currentCourse, liveLearners, overallPercent, quizScore, quizSummary } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import { formatDate } from "@/lib/utils";

export default function CohortProgress() {
  const { state } = useTrainer();
  const m = cohortMetrics(state);
  const qs = quizSummary(state);
  const learners = liveLearners(state);
  return (
    <div className="space-y-8">
      <PageIntro title={tr("Cohort progress")} instructions={tr("Totals first, then each learner. Open a learner to see their lessons, incorrect practice answers and the lesson to revisit.")} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={tr("Cohort totals")}>
        <li><AccessibleMetricCard label={tr("Active learners")} value={m.active} hint={tr("Signed in within 30 days")} /></li>
        <li><AccessibleMetricCard label={tr("Started training")} value={m.started} /></li>
        <li><AccessibleMetricCard label={tr("Completed first course")} value={m.firstCourse} /></li>
        <li><AccessibleMetricCard label={tr("Completed all required courses")} value={m.allRequired} /></li>
      </ul>
      {qs && (
        <p className="text-lg">{tr("Practice quiz average: {avg} percent. Lowest: {lo} percent ({lname}). Highest: {hi} percent ({hname}).", { avg: qs.average, lo: qs.lowest.score, lname: qs.lowest.l.fullName, hi: qs.highest.score, hname: qs.highest.l.fullName })} <Link href="/trainer/progress/questions" className="font-semibold underline underline-offset-4">{tr("See question performance")}</Link></p>
      )}
      <section aria-labelledby="l-h" className="space-y-3">
        <h2 id="l-h" className="text-2xl">{tr("Learners")}</h2>
        <DataView id="cohort" caption={tr("Learner progress")} rows={learners} getKey={(l) => l.id} columns={[
          { header: tr("Learner"), rowHeader: true, cell: (l) => <Link href={`/trainer/progress/${l.id}`} className="underline underline-offset-4">{l.fullName}</Link> },
          { header: tr("Current course"), cell: (l) => { const c = currentCourse(state, l); const all = courseProgress(state, l); return c ? c.course.title : all.every((x) => x.status === "complete") ? tr("All required courses done") : tr("Not started"); } },
          { header: tr("Overall progress"), cell: (l) => <span className="block min-w-40"><ProgressBar value={overallPercent(state, l)} label={tr("{name}: {pct} percent", { name: l.fullName, pct: overallPercent(state, l) })} /></span> },
          { header: tr("Quiz average"), cell: (l) => quizScore(l) === null ? "–" : `${quizScore(l)}%` },
          { header: tr("Last active"), cell: (l) => l.lastActive ? formatDate(l.lastActive, "en-GB") : <StatusPill label={tr("Not started")} /> },
        ]} />
      </section>
      <ButtonLink href="/trainer/progress/questions" variant="secondary">{tr("Open question performance")}</ButtonLink>
    </div>
  );
}
