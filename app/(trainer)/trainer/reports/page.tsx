"use client";

import { PageIntro } from "@/components/a11y/PageIntro";
import { ExportRecordsDialog } from "@/components/trainer/ExportRecordsDialog";
import { AccessibleMetricCard } from "@/components/trainer/MetricCard";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { certStatus, courseProgress, liveLearners, quizSummary } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function ReportsPage() {
  const { state } = useTrainer();
  const { account } = useApp();
  const learners = liveLearners(state);
  const courses = state.courses.filter((c) => c.isRequired && c.status !== "archived").sort((a, b) => a.order - b.order);
  const avgCourse = (id: string) => {
    const vals = learners.map((l) => courseProgress(state, l).find((c) => c.course.id === id)?.percent ?? 0);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };
  const qs = quizSummary(state);
  const attempted = learners.filter((l) => l.attempts.length);
  const passedL = attempted.filter((l) => l.attempts.some((a) => a.passed));
  const firstScores = attempted.map((l) => Math.round((l.attempts[0].score / l.attempts[0].total) * 100));
  const avgFirst = firstScores.length ? Math.round(firstScores.reduce((a, b) => a + b, 0) / firstScores.length) : 0;
  const c = (s: ReturnType<typeof certStatus>) => learners.filter((l) => certStatus(l) === s).length;

  return (
    <div className="space-y-10">
      <PageIntro title={tr("Reports")} instructions={tr("A summary of content completion, quiz and exam performance, and certification across all learners. Export the records at the bottom.")} />

      <section aria-labelledby="content-h" className="space-y-3">
        <h2 id="content-h" className="text-2xl">{tr("Content completion")}</h2>
        <p className="text-muted">{tr("Average completion of each required course across {n} learners.", { n: learners.length })}</p>
        <ul className="space-y-3">{courses.map((cc) => <li key={cc.id}><p className="mb-1 font-semibold">{cc.title}</p><ProgressBar value={avgCourse(cc.id)} label={tr("{title}: {pct} percent average completion", { title: cc.title, pct: avgCourse(cc.id) })} /></li>)}</ul>
      </section>

      <section aria-labelledby="quiz-h" className="space-y-3">
        <h2 id="quiz-h" className="text-2xl">{tr("Quiz performance")}</h2>
        {qs ? (
          <ul className="grid gap-4 sm:grid-cols-3">
            <li><AccessibleMetricCard label={tr("Average score")} value={`${qs.average}%`} /></li>
            <li><AccessibleMetricCard label={tr("Lowest score")} value={`${qs.lowest.score}%`} hint={qs.lowest.l.fullName} /></li>
            <li><AccessibleMetricCard label={tr("Highest score")} value={`${qs.highest.score}%`} hint={qs.highest.l.fullName} /></li>
          </ul>
        ) : <p className="text-muted">{tr("No quiz results yet.")}</p>}
      </section>

      <section aria-labelledby="exam-h" className="space-y-3">
        <h2 id="exam-h" className="text-2xl">{tr("Exam performance")}</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          <li><AccessibleMetricCard label={tr("Learners who took the exam")} value={attempted.length} /></li>
          <li><AccessibleMetricCard label={tr("Learners who passed")} value={passedL.length} hint={attempted.length ? tr("{pct} percent of those who took it", { pct: Math.round((passedL.length / attempted.length) * 100) }) : undefined} /></li>
          <li><AccessibleMetricCard label={tr("Average first-attempt score")} value={`${avgFirst}%`} /></li>
        </ul>
      </section>

      <section aria-labelledby="cert-h" className="space-y-3">
        <h2 id="cert-h" className="text-2xl">{tr("Certification status")}</h2>
        <ul className="grid gap-4 sm:grid-cols-4">
          <li><AccessibleMetricCard label={tr("Certified")} value={c("certified")} /></li>
          <li><AccessibleMetricCard label={tr("Due for recertification")} value={c("due")} /></li>
          <li><AccessibleMetricCard label={tr("Expired")} value={c("expired")} /></li>
          <li><AccessibleMetricCard label={tr("Not certified")} value={c("none")} /></li>
        </ul>
      </section>

      <Card className="space-y-4">
        <h2 className="text-2xl">{tr("Export records")}</h2>
        <ExportRecordsDialog requestedBy={account?.fullName ?? "Trainer"} />
      </Card>
    </div>
  );
}
