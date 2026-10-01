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
import { addDays } from "@/lib/utils";

export default function CertificationPage() {
  const { data, account, t, fmtDate } = useLearner();
  const { announce } = useAnnouncer();
  const cert = data.certification;
  const state = examState(data);

  if (!cert) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title={t("nav.certification")} instructions={t("cert.none.instructions")} />
        <Callout tone="info" className="space-y-3">
          <p className="text-lg">
            {state === "locked" ? t("cert.none.locked") : t("cert.none.ready")}
          </p>
          <ButtonLink href={state === "locked" ? "/dashboard" : "/exam"}>{state === "locked" ? t("common.returnOverview") : t("cert.card.goExam")}</ButtonLink>
        </Callout>
      </div>
    );
  }

  function download() {
    const text = t("cert.file.text", { name: account.fullName, issued: fmtDate(cert!.issuedAt), expires: fmtDate(cert!.expiresAt) });
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mtu-certificate-placeholder.txt";
    a.click();
    URL.revokeObjectURL(url);
    announce(t("cert.downloaded"));
  }

  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro title={t("cert.title")} instructions={t("cert.instructions")} />

      <Callout tone="success" className="flex flex-wrap items-center gap-5">
        <SuccessCheck />
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-2xl font-bold text-success"><Award aria-hidden="true" /> {t("cert.achieved")}</p>
          <p className="inline-flex rounded-full border-2 border-success bg-background px-3 py-0.5 text-base font-bold text-success">{t("cert.status")}</p>
        </div>
      </Callout>

      <Card className="space-y-3">
        <h2 className="text-2xl">{t("cert.details")}</h2>
        <dl className="grid gap-x-6 gap-y-1 text-lg sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">{t("cert.name")}</dt><dd>{account.fullName}</dd>
          <dt className="font-semibold">{t("cert.certifiedOn")}</dt><dd>{fmtDate(cert.issuedAt)}</dd>
          <dt className="font-semibold">{t("cert.expiresOn")}</dt><dd>{fmtDate(cert.expiresAt)}</dd>
        </dl>
        <Button variant="secondary" onClick={download}><Download aria-hidden="true" className="size-5" /> {t("cert.download")}</Button>
      </Card>

      <RecertificationReminderCard data={data} />

      <section id="recertification" aria-labelledby="recert-h" className="scroll-mt-6 space-y-3">
        <h2 id="recert-h" className="text-2xl">{t("cert.recert.h")}</h2>
        <p className="max-w-prose text-lg">{t("cert.recert.body")}</p>
        <h3 className="text-xl">{t("cert.recert.schedule")}</h3>
        <ul className="space-y-1 text-lg">
          {REMINDER_OFFSETS.map((d) => <li key={d}>{t("cert.recert.line", { days: d, date: fmtDate(addDays(cert.expiresAt, -d)) })}</li>)}
        </ul>
        <Button variant="secondary" onClick={() => announce(t("cert.recert.notProto"))}>{t("cert.recert.cta")}</Button>
      </section>
    </div>
  );
}
