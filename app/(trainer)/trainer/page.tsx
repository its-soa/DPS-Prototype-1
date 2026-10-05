"use client";

import Link from "next/link";
import { AlertTriangle, BarChart3, BookOpen, Download, FolderPlus, UserPlus, ClipboardCheck } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { AccessibleMetricCard } from "@/components/trainer/MetricCard";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { certStatus, cohortMetrics, draftItems, examStatus, liveLearners, questionStats } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { plural, tr } from "@/lib/trainer/tr";

export default function TrainerDashboard() {
  const { account } = useApp();
  const { state } = useTrainer();
  const m = cohortMetrics(state);
  const failed = liveLearners(state).filter((l) => ["failed", "remediation-assigned"].includes(examStatus(state, l)));
  const drafts = draftItems(state);
  const worst = questionStats(state)[0];
  const due = liveLearners(state).filter((l) => ["due", "expired"].includes(certStatus(l)));
  const quick = [
    { href: "/trainer/programs", label: "Create a training program", Icon: FolderPlus },
    { href: "/trainer/courses", label: "Create a course", Icon: BookOpen },
    { href: "/trainer/learners", label: "Add a learner", Icon: UserPlus },
    { href: "/trainer/progress", label: "Review cohort progress", Icon: BarChart3 },
    { href: "/trainer/exam-progress", label: "Review exam progress", Icon: ClipboardCheck },
    { href: "/trainer/reports", label: "Export records", Icon: Download },
  ];

  return (
    <div className="space-y-10">
      <PageIntro title={tr("Hello, {name}", { name: account?.fullName.split(" ")[0] ?? "" })}
        instructions={tr("This is your workspace. Start with the items that need attention, or choose a task below.")} />

      <section aria-labelledby="attention-h" className="space-y-4">
        <h2 id="attention-h" className="text-2xl">{tr("Needs your attention")}</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          <li>
            <Card className="h-full space-y-2 border-danger">
              <h3 className="flex items-center gap-2 text-xl"><AlertTriangle aria-hidden="true" className="size-5" /> {tr("Learners with a failed exam")}</h3>
              {failed.length ? (
                <ul className="space-y-1">{failed.map((l) => <li key={l.id}><Link href={`/trainer/exam-progress/${l.id}`} className="font-semibold underline underline-offset-4">{l.fullName}</Link></li>)}</ul>
              ) : <p>{tr("None right now.")}</p>}
            </Card>
          </li>
          <li>
            <Card className="h-full space-y-2">
              <h3 className="text-xl">{tr("Unpublished drafts")}</h3>
              {drafts.length ? (
                <ul className="space-y-1">{drafts.slice(0, 4).map((d) => <li key={d.href}><Link href={d.href} className="font-semibold underline underline-offset-4">{d.title}</Link> <span className="text-muted">({tr(d.kind)})</span></li>)}</ul>
              ) : <p>{tr("Everything is published.")}</p>}
            </Card>
          </li>
          <li>
            <Card className="h-full space-y-2">
              <h3 className="text-xl">{tr("Most-missed question")}</h3>
              {worst ? (
                <>
                  <p>“{worst.question.text}”</p>
                  <p className="text-muted">{tr("Missed by {missed} of {taken} learners ({rate} percent).", { missed: worst.missed, taken: worst.taken, rate: worst.rate })}</p>
                  <Link href="/trainer/progress/questions" className="font-semibold underline underline-offset-4">{tr("Open question performance")}</Link>
                </>
              ) : <p>{tr("No practice results yet.")}</p>}
            </Card>
          </li>
          <li>
            <Card className="h-full space-y-2">
              <h3 className="text-xl">{tr("Recertification")}</h3>
              <p>{tr("{count} {noun} due for recertification.", { count: due.length, noun: plural(due.length, "learner is", "learners are") })}</p>
              <Link href="/trainer/certifications" className="font-semibold underline underline-offset-4">{tr("Review certifications")}</Link>
            </Card>
          </li>
        </ul>
      </section>

      <section aria-labelledby="cohort-h" className="space-y-4">
        <h2 id="cohort-h" className="text-2xl">{tr("Your cohort")}</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total learners", value: m.total, href: "/trainer/learners" },
            { label: "Active learners", value: m.active, hint: "Signed in within 30 days", href: "/trainer/progress" },
            { label: "Started training", value: m.started, href: "/trainer/progress" },
            { label: "Completed first course", value: m.firstCourse, href: "/trainer/progress" },
            { label: "Completed all required courses", value: m.allRequired, href: "/trainer/progress" },
            { label: "Awaiting remediation", value: m.awaitingRemediation, href: "/trainer/exam-progress", tone: m.awaitingRemediation ? "warning" as const : undefined },
            { label: "Due for recertification", value: m.dueRecert, href: "/trainer/certifications", tone: m.dueRecert ? "warning" as const : undefined },
          ].map((c) => <li key={c.label}><AccessibleMetricCard label={tr(c.label)} value={c.value} hint={c.hint ? tr(c.hint) : undefined} href={c.href} tone={c.tone} /></li>)}
        </ul>
      </section>

      <section aria-labelledby="quick-h" className="space-y-4">
        <h2 id="quick-h" className="text-2xl">{tr("Quick actions")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map(({ href, label, Icon }) => (
            <li key={href}><Link href={href} className={buttonVariants({ variant: "secondary", className: "w-full !justify-start" })}><Icon aria-hidden="true" className="size-5" /> {tr(label)}</Link></li>
          ))}
        </ul>
      </section>
      <ButtonLink href="/trainer/onboarding" variant="ghost">{tr("Replay orientation")}</ButtonLink>
    </div>
  );
}
