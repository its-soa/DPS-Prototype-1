"use client";

import { MailCheck } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useApp } from "@/lib/store";

export default function RegisterSuccessPage() {
  const { t } = useApp();
  return (
    <div className="max-w-xl space-y-6">
      <PageIntro title={t("regok.title")} instructions={t("regok.instructions")} />
      <Callout tone="success" className="flex items-start gap-3">
        <MailCheck aria-hidden="true" className="mt-1 size-7 shrink-0 text-success" />
        <p className="text-lg">{t("regok.body")}</p>
      </Callout>
      <ButtonLink href="/sign-in" size="lg">{t("regok.cta")}</ButtonLink>
    </div>
  );
}
