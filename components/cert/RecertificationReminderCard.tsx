"use client";

import { BellRing } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import type { UserData } from "@/lib/types";
import { addDays } from "@/lib/utils";

export const REMINDER_OFFSETS = [90, 30, 7];

export function RecertificationReminderCard({ data, headingLevel: H = "h2" }: { data: UserData; headingLevel?: "h2" | "h3" }) {
  const { t, fmtDate } = useApp();
  const cert = data.certification;
  if (!cert) {
    return (
      <Callout tone="info" className="space-y-2">
        <H className="flex items-center gap-2 text-2xl"><BellRing aria-hidden="true" className="size-6" /> {t("dash.recert")}</H>
        <p className="text-base">{t("recert.none")}</p>
      </Callout>
    );
  }
  return (
    <Callout tone="warning" className="space-y-3">
      <H className="flex items-center gap-2 text-2xl"><BellRing aria-hidden="true" className="size-6" /> {t("recert.h")}</H>
      <p className="text-lg font-bold">{t("recert.banner")}</p>
      <p className="text-base">{t("recert.body", { expires: fmtDate(cert.expiresAt), first: fmtDate(addDays(cert.expiresAt, -90)) })}</p>
      <p className="text-sm">{t("recert.protoNote")}</p>
      <ButtonLink href="/certification#recertification" variant="secondary">{t("recert.guidance")}</ButtonLink>
    </Callout>
  );
}
