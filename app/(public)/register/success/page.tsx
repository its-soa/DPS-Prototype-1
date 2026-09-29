"use client";

import { MailCheck } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";

export default function RegisterSuccessPage() {
  return (
    <div className="max-w-xl space-y-6">
      <PageIntro title="Your account is ready" instructions="Registration is complete. Choose Continue to sign in to start your orientation." />
      <Callout tone="success" className="flex items-start gap-3">
        <MailCheck aria-hidden="true" className="mt-1 size-7 shrink-0 text-success" />
        <p className="text-lg">
          Thank you for registering. There is nothing else to set up. Sign in with the email and password you just created.
        </p>
      </Callout>
      <ButtonLink href="/sign-in" size="lg">Continue to sign in</ButtonLink>
    </div>
  );
}
