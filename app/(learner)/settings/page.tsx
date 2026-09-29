"use client";

import Link from "next/link";
import { PageIntro } from "@/components/a11y/PageIntro";
import { AccessibilitySettingsPanel } from "@/components/a11y/AccessibilitySettingsPanel";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro
        title="Accessibility settings"
        instructions="Changes apply straight away and are remembered on this device. There is no save button."
      />
      <Card><AccessibilitySettingsPanel /></Card>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/onboarding" variant="secondary">Replay orientation</ButtonLink>
        <ButtonLink href="/dashboard">Return to course overview</ButtonLink>
      </div>
      <p className="text-base"><Link href="/" className="font-semibold underline">About this training</Link></p>
    </div>
  );
}
