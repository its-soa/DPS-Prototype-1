"use client";

import Link from "next/link";
import { useState } from "react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { DataView } from "@/components/trainer/DataView";
import { StatusPill } from "@/components/trainer/StatusPill";
import { Field, inputClass } from "@/components/ui/field";
import { EXAM_STATUS_LABEL, examStatus, liveLearners, type ExamStatus } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import { formatDate } from "@/lib/utils";

const TONE: Record<ExamStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  "not-eligible": "neutral", ready: "info", failed: "danger", "remediation-assigned": "warning", "retry-unlocked": "info", passed: "success",
};

export default function ExamProgressPage() {
  const { state } = useTrainer();
  const [filter, setFilter] = useState<"all" | ExamStatus>("all");
  const all = liveLearners(state);
  const rows = all.filter((l) => filter === "all" || examStatus(state, l) === filter);
  const exam = state.exams.find((e) => e.status === "active");
  return (
    <div className="space-y-8">
      <PageIntro title={tr("Exam progress")} instructions={tr("See who is ready, who has failed and needs remediation, and who has passed. Open a learner to review their exam.")} />
      {exam && <p className="text-lg">{tr("{title}: pass mark {p} percent, up to {r} attempts.", { title: exam.title, p: exam.passingScore, r: exam.retryLimit })}</p>}
      <div className="max-w-sm">
        <Field id="exam-filter" label={tr("Show learners")}>{(a) => (
          <select {...a} value={filter} onChange={(e) => setFilter(e.target.value as "all" | ExamStatus)} className={inputClass}>
            <option value="all">{tr("All learners")}</option>
            {(Object.keys(EXAM_STATUS_LABEL) as ExamStatus[]).map((s) => <option key={s} value={s}>{tr(EXAM_STATUS_LABEL[s])}</option>)}
          </select>)}</Field>
        <p className="mt-1 text-sm text-muted" role="status">{tr("{n} learners shown.", { n: rows.length })}</p>
      </div>
      <DataView id="exams" caption={tr("Exam status by learner")} rows={rows} getKey={(l) => l.id} empty={tr("No learners match this filter.")} columns={[
        { header: tr("Learner"), rowHeader: true, cell: (l) => <Link href={`/trainer/exam-progress/${l.id}`} className="underline underline-offset-4">{l.fullName}</Link> },
        { header: tr("Status"), cell: (l) => <StatusPill label={tr(EXAM_STATUS_LABEL[examStatus(state, l)])} tone={TONE[examStatus(state, l)]} /> },
        { header: tr("Attempts"), cell: (l) => l.attempts.length },
        { header: tr("Latest score"), cell: (l) => l.attempts.length ? `${l.attempts[l.attempts.length - 1].score} / ${l.attempts[l.attempts.length - 1].total}` : "–" },
        { header: tr("Last attempt"), cell: (l) => l.attempts.length ? formatDate(l.attempts[l.attempts.length - 1].submittedAt, "en-GB") : "–" },
      ]} />
    </div>
  );
}
