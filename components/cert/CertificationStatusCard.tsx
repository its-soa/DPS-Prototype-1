"use client";

import { Award, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { examState } from "@/lib/progress";
import { useApp } from "@/lib/store";
import type { UserData } from "@/lib/types";

export function CertificationStatusCard({ data, headingLevel: H = "h2" }: { data: UserData; headingLevel?: "h2" | "h3" }) {
  const { t, fmtDate } = useApp();
  const state = examState(data);
  const cert = data.certification;
  const msg = {
    locked: t("cert.card.locked"),
    ready: t("cert.card.ready"),
    "in-progress": t("cert.card.inProgress"),
    "retry-locked": t("cert.card.retryLocked"),
    "retry-ready": t("cert.card.retryReady"),
    passed: "",
  }[state];
  return (
    <Card className="space-y-3">
      <H className="flex items-center gap-2 text-2xl">
        {cert ? <Award aria-hidden="true" className="size-6 text-success" /> : <Lock aria-hidden="true" className="size-6" />}
        {t("dash.certification")}
      </H>
      {cert ? (
        <>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-success bg-success-soft px-3 py-0.5 text-base font-bold text-success">
            ✓ {t("cert.certified")}
          </p>
          <p className="text-base">{t("cert.card.dates", { issued: fmtDate(cert.issuedAt), expires: fmtDate(cert.expiresAt) })}</p>
          <ButtonLink href="/certification" variant="secondary">{t("cert.card.view")}</ButtonLink>
        </>
      ) : (
        <>
          <p className="inline-flex rounded-full border-2 border-border bg-background px-3 py-0.5 text-base font-semibold">{t("cert.notYet")}</p>
          <p className="text-base">{msg}</p>
          {state !== "locked" && <ButtonLink href="/exam" variant="secondary">{t("cert.card.goExam")}</ButtonLink>}
        </>
      )}
    </Card>
  );
}
