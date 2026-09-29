import { BellRing } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import type { UserData } from "@/lib/types";
import { addDays, formatDate } from "@/lib/utils";

export const REMINDER_OFFSETS = [90, 30, 7];

export function RecertificationReminderCard({ data, headingLevel: H = "h2" }: { data: UserData; headingLevel?: "h2" | "h3" }) {
  const cert = data.certification;
  if (!cert) {
    return (
      <Callout tone="info" className="space-y-2">
        <H className="flex items-center gap-2 text-2xl"><BellRing aria-hidden="true" className="size-6" /> Recertification</H>
        <p className="text-base">Recertification reminders start after you pass the certification exam.</p>
      </Callout>
    );
  }
  return (
    <Callout tone="warning" className="space-y-3">
      <H className="flex items-center gap-2 text-2xl"><BellRing aria-hidden="true" className="size-6" /> Recertification reminder</H>
      <p className="text-lg font-bold">Recertification recommended in 90 days</p>
      <p className="text-base">
        Your certification expires on {formatDate(cert.expiresAt)}. We remind you 90, 30 and 7 days before it expires.
        Your first reminder is on {formatDate(addDays(cert.expiresAt, -90))}.
      </p>
      <p className="text-sm">This banner shows the prototype reminder as it will look 90 days before expiry.</p>
      <ButtonLink href="/certification#recertification" variant="secondary">Read recertification guidance</ButtonLink>
    </Callout>
  );
}
