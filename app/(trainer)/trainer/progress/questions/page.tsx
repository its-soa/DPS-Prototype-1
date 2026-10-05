"use client";

import Link from "next/link";
import { PageIntro } from "@/components/a11y/PageIntro";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { DataView } from "@/components/trainer/DataView";
import { AccessibleMetricCard } from "@/components/trainer/MetricCard";
import { QuestionPerformanceReport } from "@/components/trainer/QuestionPerformanceReport";
import { quizScore, quizSummary } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function QuestionPerformancePage() {
  const { state } = useTrainer();
  const qs = quizSummary(state);
  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: tr("Cohort progress"), href: "/trainer/progress" }, { label: tr("Question performance") }]} />
      <PageIntro title={tr("Question performance")} instructions={tr("Questions are ranked by how often learners miss them. Select a question to see the linked lesson, then open its explanation to improve it.")} />
      {qs && (
        <ul className="grid gap-4 sm:grid-cols-3" aria-label={tr("Practice quiz scores")}>
          <li><AccessibleMetricCard label={tr("Average quiz score")} value={`${qs.average}%`} /></li>
          <li><AccessibleMetricCard label={tr("Lowest quiz score")} value={`${qs.lowest.score}%`} hint={qs.lowest.l.fullName} /></li>
          <li><AccessibleMetricCard label={tr("Highest quiz score")} value={`${qs.highest.score}%`} hint={qs.highest.l.fullName} /></li>
        </ul>
      )}
      <section aria-labelledby="rank-h" className="space-y-3">
        <h2 id="rank-h" className="text-2xl">{tr("Most-missed practice questions")}</h2>
        <QuestionPerformanceReport />
      </section>
      <section aria-labelledby="by-h" className="space-y-3">
        <h2 id="by-h" className="text-2xl">{tr("Quiz score by learner")}</h2>
        <DataView id="scores" caption={tr("Practice quiz score by learner")} rows={state.learners.filter((l) => !l.archived && quizScore(l) !== null)} getKey={(l) => l.id} columns={[
          { header: tr("Learner"), rowHeader: true, cell: (l) => <Link href={`/trainer/progress/${l.id}`} className="underline underline-offset-4">{l.fullName}</Link> },
          { header: tr("Score"), cell: (l) => `${quizScore(l)}%` },
          { header: tr("Quizzes taken"), cell: (l) => Object.keys(l.practice).length },
        ]} />
      </section>
    </div>
  );
}
