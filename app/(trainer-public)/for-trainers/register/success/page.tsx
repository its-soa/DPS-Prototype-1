"use client";

import { MailCheck } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { tr } from "@/lib/trainer/tr";

export default function TrainerRegisterSuccess() {
  return (
    <div className="max-w-xl space-y-6">
      <PageIntro title={tr("Your trainer account is ready")} instructions={tr("Registration is complete. Choose Continue to sign in.")} />
      <Callout tone="success" className="flex items-start gap-3">
        <MailCheck aria-hidden="true" className="mt-1 size-7 shrink-0 text-success" />
        <p className="text-lg">{tr("Thank you for registering. Sign in with the email and password you just created. A short orientation follows your first sign-in.")}</p>
      </Callout>
      <ButtonLink href="/for-trainers/sign-in" size="lg">{tr("Continue to sign in")}</ButtonLink>
    </div>
  );
}
