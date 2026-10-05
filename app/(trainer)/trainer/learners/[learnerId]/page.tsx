"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Route } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { ConfirmDialog } from "@/components/exam/ConfirmDialog";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { EntityStatus, StatusPill } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { CERT_LABEL, EXAM_STATUS_LABEL, certStatus, courseProgress, examStatus, overallPercent } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";


export default function LearnerDetail() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state, actions } = useTrainer();

  const { announce } = useAnnouncer();
  const router = useRouter();
  const l = state.learners.find((x) => x.id === learnerId && !x.archived);
  const [pathId, setPathId] = useState(l?.pathId ?? "");
  const [confirm, setConfirm] = useState(false);
  const [pathErr, setPathErr] = useState<string>();

  if (!l) return <><PageIntro title={tr("Learner not found")} /><ButtonLink href="/trainer/learners">{tr("Back to learners")}</ButtonLink></>;
  const assigned = state.paths.find((p) => p.id === l.pathId);
  const readyPaths = state.paths.filter((p) => p.status === "saved");

  function assign() {
    if (!pathId) { setPathErr(tr("Choose a learning path to assign.")); announce(tr("Choose a learning path to assign."), { assertive: true }); document.getElementById("path")?.focus(); return; }
    setPathErr(undefined);
    actions.assignPath(l!.id, pathId);
    announce(tr("Learning path assigned to {name}.", { name: l!.fullName }));
  }
  function invite() {
    actions.sendInvitation(l!.id);
    announce(tr("Invitation sent to {email}.", { email: l!.email }));
  }

  return (
    <div className="max-w-3xl space-y-8">
      <Breadcrumbs items={[{ label: tr("Learners"), href: "/trainer/learners" }, { label: l.fullName }]} />
      <PageIntro title={l.fullName} instructions={tr("Review this learner's sequence and exam, assign a learning path, and send or resend the invitation.")} />

      <Card className="space-y-3">
        <h2 className="text-2xl">{tr("Profile")}</h2>
        <dl className="grid gap-x-6 gap-y-1 text-lg sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">{tr("Email")}</dt><dd>{l.email}</dd>
          <dt className="font-semibold">{tr("Invitation")}</dt><dd><EntityStatus status={l.invitation} /></dd>
          <dt className="font-semibold">{tr("Overall progress")}</dt><dd>{tr("{pct} percent", { pct: overallPercent(state, l) })}</dd>
          <dt className="font-semibold">{tr("Exam")}</dt><dd>{tr(EXAM_STATUS_LABEL[examStatus(state, l)])}</dd>
          <dt className="font-semibold">{tr("Certification")}</dt><dd>{tr(CERT_LABEL[certStatus(l)])}</dd>
        </dl>
        <Button onClick={invite} variant={l.invitation === "not-sent" ? "primary" : "secondary"}>
          <Mail aria-hidden="true" className="size-5" /> {l.invitation === "not-sent" ? tr("Send invitation") : tr("Resend invitation")}
        </Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl">{tr("Learning path")}</h2>
        {assigned ? <p className="text-lg">{tr("Assigned: {title}", { title: assigned.title })}</p> : <p className="text-lg">{tr("No learning path assigned yet.")}</p>}
        <Field id="path" label={tr("Choose a learning path")} error={pathErr} description={readyPaths.length ? undefined : tr("No saved learning paths yet. Build one under Programs first.")}>
          {(a) => (
            <select {...a} value={pathId} onChange={(e) => setPathId(e.target.value)} className={inputClass}>
              <option value="">{tr("Select a path")}</option>
              {readyPaths.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          )}
        </Field>
        <Button onClick={assign}><Route aria-hidden="true" className="size-5" /> {tr("Assign learning path")}</Button>
      </Card>

      <section aria-labelledby="seq-h" className="space-y-3">
        <h2 id="seq-h" className="text-2xl">{tr("Course sequence and assigned exam")}</h2>
        <ol className="space-y-2">
          {courseProgress(state, l).map((c) => (
            <li key={c.course.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border-soft bg-surface p-4">
              <span className="text-lg font-semibold">{c.course.order}. {c.course.title}</span>
              <span className="flex items-center gap-3">
                <span>{tr("{done} of {total} lessons", { done: c.done, total: c.total })}</span>
                <StatusPill label={c.status === "complete" ? tr("Completed") : c.status === "in-progress" ? tr("In progress") : tr("Upcoming")} tone={c.status === "complete" ? "success" : c.status === "in-progress" ? "info" : "neutral"} />
              </span>
            </li>
          ))}
          <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border-soft bg-surface p-4">
            <span className="text-lg font-semibold">{tr("Final exam")}: {state.exams.find((e) => e.status === "active")?.title ?? tr("Not set")}</span>
            <StatusPill label={tr(EXAM_STATUS_LABEL[examStatus(state, l)])} tone={examStatus(state, l) === "passed" ? "success" : "neutral"} />
          </li>
        </ol>
        <p className="flex flex-wrap gap-4">
          <Link href={`/trainer/progress/${l.id}`} className="font-semibold underline underline-offset-4">{tr("Open progress record")}</Link>
          <Link href={`/trainer/exam-progress/${l.id}`} className="font-semibold underline underline-offset-4">{tr("Open exam record")}</Link>
        </p>
      </section>

      {l.notes.length > 0 && (
        <section aria-labelledby="notes-h" className="space-y-2">
          <h2 id="notes-h" className="text-2xl">{tr("Notes sent to this learner")}</h2>
          <ul className="space-y-2">{l.notes.map((n) => <li key={n.at} className="rounded-xl border-2 border-border-soft bg-surface p-3"><p>{n.text}</p><p className="text-sm text-muted">{n.by}, {new Date(n.at).toLocaleDateString("en-GB")}</p></li>)}</ul>
        </section>
      )}

      <Button variant="ghost" onClick={() => setConfirm(true)}>{tr("Archive this learner")}</Button>
      <ConfirmDialog open={confirm} title={tr("Archive {name}?", { name: l.fullName })} confirmLabel={tr("Yes, archive learner")} cancelLabel={tr("No, keep learner")}
        onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); actions.archiveLearner(l.id); announce(tr("{name} archived.", { name: l.fullName })); router.push("/trainer/learners"); }}>
        <p>{tr("The learner disappears from your lists. Their records are kept.")}</p>
      </ConfirmDialog>
    </div>
  );
}
