"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CERT_LABEL, certStatus, daysLeft } from "@/lib/trainer/selectors";
import { tr } from "@/lib/trainer/tr";
import type { TLearner } from "@/lib/trainer/types";
import { formatDate } from "@/lib/utils";
import { StatusPill } from "./StatusPill";

export function CertificationStatusPanel({ learner, headingLevel: H = "h2", showLink }: { learner: TLearner; headingLevel?: "h2" | "h3"; showLink?: boolean }) {
  const s = certStatus(learner);
  const c = learner.certification;
  const tone = s === "certified" ? "success" : s === "due" ? "warning" : s === "expired" ? "danger" : "neutral";
  const date = (iso: string) => formatDate(iso, "en-GB");
  return (
    <Card className="space-y-3">
      <H className="flex items-center gap-2 text-2xl"><Award aria-hidden="true" className="size-6" /> {tr("Certification")}</H>
      <StatusPill label={tr(CERT_LABEL[s])} tone={tone} />
      {c ? (
        <dl className="grid gap-x-6 gap-y-1 text-lg sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">{tr("Certified on")}</dt><dd>{date(c.issuedAt)}</dd>
          <dt className="font-semibold">{tr("Expires on")}</dt><dd>{date(c.expiresAt)}</dd>
          <dt className="font-semibold">{tr("Time left")}</dt><dd>{daysLeft(c.expiresAt) < 0 ? tr("Expired") : tr("{n} days", { n: daysLeft(c.expiresAt) })}</dd>
          <dt className="font-semibold">{tr("Reminders sent")}</dt><dd>{learner.reminders.length ? learner.reminders.map(date).join(", ") : tr("None yet")}</dd>
        </dl>
      ) : <p className="text-lg">{tr("{name} has not passed the exam yet.", { name: learner.fullName })}</p>}
      {showLink && <Link href={`/trainer/certifications/${learner.id}`} className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{tr("Open certification record")}</Link>}
    </Card>
  );
}
