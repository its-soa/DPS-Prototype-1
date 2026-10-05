"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { DataView } from "@/components/trainer/DataView";
import { AccessibleMetricCard } from "@/components/trainer/MetricCard";
import { StatusPill } from "@/components/trainer/StatusPill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { CERT_LABEL, certStatus, daysLeft, liveLearners, type CertStatus } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { plural, tr } from "@/lib/trainer/tr";
import { formatDate } from "@/lib/utils";

const TONE = { certified: "success", due: "warning", expired: "danger", none: "neutral" } as const;

export default function CertificationsPage() {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const [filter, setFilter] = useState<"all" | CertStatus>("all");
  const [unchecked, setUnchecked] = useState<string[]>([]);
  const all = liveLearners(state);
  const rows = all.filter((l) => filter === "all" || certStatus(l) === filter);
  const count = (s: CertStatus) => all.filter((l) => certStatus(l) === s).length;
  const dueRows = rows.filter((l) => ["due", "expired"].includes(certStatus(l)));
  const chosen = dueRows.filter((l) => !unchecked.includes(l.id));

  function send() {
    if (!chosen.length) { announce(tr("Select at least one learner to remind."), { assertive: true }); return; }
    actions.sendRecertReminders(chosen.map((l) => l.id));
    announce(tr("Recertification reminder sent to {n} {w}: {names}.", { n: chosen.length, w: plural(chosen.length, "learner", "learners"), names: chosen.map((l) => l.fullName).join(", ") }));
  }

  return (
    <div className="space-y-8">
      <PageIntro title={tr("Certifications")} instructions={tr("See who is certified and who is due for recertification. Filter to the learners who are due, then send them a reminder.")} />
      <ul className="grid gap-4 sm:grid-cols-3" aria-label={tr("Certification totals")}>
        <li><AccessibleMetricCard label={tr("Certified")} value={count("certified") + count("due")} /></li>
        <li><AccessibleMetricCard label={tr("Due for recertification")} value={count("due") + count("expired")} tone={count("due") + count("expired") ? "warning" : undefined} /></li>
        <li><AccessibleMetricCard label={tr("Not certified")} value={count("none")} /></li>
      </ul>
      <div className="max-w-sm">
        <Field id="cert-filter" label={tr("Show learners")}>{(a) => (
          <select {...a} value={filter} onChange={(e) => setFilter(e.target.value as "all" | CertStatus)} className={inputClass}>
            <option value="all">{tr("All learners")}</option>
            <option value="certified">{tr("Certified")}</option>
            <option value="due">{tr("Due for recertification")}</option>
            <option value="expired">{tr("Expired")}</option>
            <option value="none">{tr("Not certified")}</option>
          </select>)}</Field>
        <p role="status" className="mt-1 text-sm text-muted">{tr("{n} learners shown.", { n: rows.length })}</p>
      </div>
      <DataView id="certs" caption={tr("Certification status by learner")} rows={rows} getKey={(l) => l.id} columns={[
        { header: tr("Learner"), rowHeader: true, cell: (l) => <Link href={`/trainer/certifications/${l.id}`} className="underline underline-offset-4">{l.fullName}</Link> },
        { header: tr("Status"), cell: (l) => <StatusPill label={tr(CERT_LABEL[certStatus(l)])} tone={TONE[certStatus(l)]} /> },
        { header: tr("Certified on"), cell: (l) => l.certification ? formatDate(l.certification.issuedAt, "en-GB") : "–" },
        { header: tr("Expires on"), cell: (l) => l.certification ? `${formatDate(l.certification.expiresAt, "en-GB")} (${tr("{n} days", { n: daysLeft(l.certification.expiresAt) })})` : "–" },
        { header: tr("Reminders sent"), cell: (l) => l.reminders.length },
      ]} />
      {dueRows.length > 0 && (
        <Card className="space-y-3">
          <fieldset className="space-y-2">
            <legend className="text-2xl font-bold">{tr("Send a recertification reminder")}</legend>
            <p className="text-sm text-muted">{tr("Learners who are due or expired. Untick anyone you do not want to remind.")}</p>
            {dueRows.map((l) => (
              <label key={l.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-2">
                <input type="checkbox" checked={!unchecked.includes(l.id)} onChange={(e) => setUnchecked(e.target.checked ? unchecked.filter((x) => x !== l.id) : [...unchecked, l.id])} />
                <span>{l.fullName} <span className="text-muted">({l.certification ? tr("expires {date}", { date: formatDate(l.certification.expiresAt, "en-GB") }) : ""})</span></span>
              </label>
            ))}
          </fieldset>
          <Button size="lg" onClick={send}><BellRing aria-hidden="true" className="size-5" /> {tr("Send reminder to {n} selected", { n: chosen.length })}</Button>
        </Card>
      )}
    </div>
  );
}
