"use client";

import Link from "next/link";
import { PageIntro } from "@/components/a11y/PageIntro";
import { AccessibilitySettingsPanel } from "@/components/a11y/AccessibilitySettingsPanel";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";

export default function SettingsPage() {
  const { t } = useApp();
  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro title={t("settings.title")} instructions={t("settings.instructions")} />
      <Card><AccessibilitySettingsPanel /></Card>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/onboarding" variant="secondary">{t("settings.replay")}</ButtonLink>
        <ButtonLink href="/dashboard">{t("common.returnOverview")}</ButtonLink>
      </div>
      <p className="text-base"><Link href="/" className="font-semibold underline">{t("settings.aboutLink")}</Link></p>
    </div>
  );
}
