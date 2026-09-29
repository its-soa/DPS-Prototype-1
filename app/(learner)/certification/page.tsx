"use client";

import { Award, Download } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { REMINDER_OFFSETS, RecertificationReminderCard } from "@/components/cert/RecertificationReminderCard";
import { SuccessCheck } from "@/components/cert/SuccessCheck";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { examState } from "@/lib/progress";
import { useLearner } from "@/lib/store";
import { addDays, formatDate } from "@/lib/utils";

export default function CertificationPage() {
  const { data, account } = useLearner();
  const { announce } = useAnnouncer();
  const cert = data.certification;
  const state = examState(data);

  if (!cert) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="Certification" instructions="You are not certified yet. Your certificate appears here after you pass the exam." />
        <Callout tone="info" className="space-y-3">
          <p className="text-lg">
            {state === "locked" ? "Complete all three required courses to unlock the exam." : "The certification exam is ready when you are."}
          </p>
          <ButtonLink href={state === "locked" ? "/dashboard" : "/exam"}>{state === "locked" ? "Return to course overview" : "Go to the certification exam"}</ButtonLink>
        </Callout>
      </div>
    );
  }

  function download() {
    const text = `CERTIFICATE (PLACEHOLDER)\n\nThis certifies that ${account.fullName} has passed the MTU certification exam.\nIssued: ${formatDate(cert!.issuedAt)}\nExpires: ${formatDate(cert!.expiresAt)}\n\nPrototype file. Not a real certificate.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mtu-certificate-placeholder.txt";
    a.click();
    URL.revokeObjectURL(url);
    announce("Placeholder certificate downloaded.");
  }

  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro title="Your certification" instructions="You passed the certification exam. Here are your dates and what happens next." />

      <Callout tone="success" className="flex flex-wrap items-center gap-5">
        <SuccessCheck />
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-2xl font-bold text-success"><Award aria-hidden="true" /> Certification achieved</p>
          <p className="inline-flex rounded-full border-2 border-success bg-background px-3 py-0.5 text-base font-bold text-success">Status: Certified</p>
        </div>
      </Callout>

      <Card className="space-y-3">
        <h2 className="text-2xl">Certificate details</h2>
        <dl className="grid gap-x-6 gap-y-1 text-lg sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">Name</dt><dd>{account.fullName}</dd>
          <dt className="font-semibold">Certified on</dt><dd>{formatDate(cert.issuedAt)}</dd>
          <dt className="font-semibold">Your certification expires on</dt><dd>{formatDate(cert.expiresAt)}</dd>
        </dl>
        <Button variant="secondary" onClick={download}><Download aria-hidden="true" className="size-5" /> Download certificate (placeholder)</Button>
      </Card>

      <RecertificationReminderCard data={data} />

      <section id="recertification" aria-labelledby="recert-h" className="scroll-mt-6 space-y-3">
        <h2 id="recert-h" className="text-2xl">Recertification guidance</h2>
        <p className="max-w-prose text-lg">Recertification keeps your skills current. It uses the same accessible platform: a short refresher and a shorter exam.</p>
        <h3 className="text-xl">Reminder schedule</h3>
        <ul className="space-y-1 text-lg">
          {REMINDER_OFFSETS.map((d) => <li key={d}>{d} days before expiry: {formatDate(addDays(cert.expiresAt, -d))}</li>)}
        </ul>
        <Button variant="secondary" onClick={() => announce("Recertification refresher is not part of this prototype.")}>Start recertification refresher (placeholder)</Button>
      </section>
    </div>
  );
}
