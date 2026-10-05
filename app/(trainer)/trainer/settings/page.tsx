"use client";

import { PageIntro } from "@/components/a11y/PageIntro";
import { AccessibilitySettingsPanel } from "@/components/a11y/AccessibilitySettingsPanel";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tr } from "@/lib/trainer/tr";

export default function TrainerSettings() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageIntro title={tr("Accessibility settings")} instructions={tr("Changes apply straight away and are remembered on this device.")} />
      <Card><AccessibilitySettingsPanel /></Card>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/trainer/onboarding" variant="secondary">{tr("Replay orientation")}</ButtonLink>
        <ButtonLink href="/trainer">{tr("Return to the workspace")}</ButtonLink>
      </div>
    </div>
  );
}
