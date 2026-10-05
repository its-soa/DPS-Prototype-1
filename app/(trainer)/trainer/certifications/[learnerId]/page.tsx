"use client";

import { useParams } from "next/navigation";
import { BellRing } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { CertificationStatusPanel } from "@/components/trainer/CertificationStatusPanel";
import { Button, ButtonLink } from "@/components/ui/button";
import { certStatus } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function LearnerCertification() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const l = state.learners.find((x) => x.id === learnerId && !x.archived);
  if (!l) return <><PageIntro title={tr("Learner not found")} /><ButtonLink href="/trainer/certifications">{tr("Back to certifications")}</ButtonLink></>;
  const due = ["due", "expired"].includes(certStatus(l));
  return (
    <div className="max-w-3xl space-y-6">
      <Breadcrumbs items={[{ label: tr("Certifications"), href: "/trainer/certifications" }, { label: l.fullName }]} />
      <PageIntro title={tr("{name}: certification", { name: l.fullName })} instructions={tr("Review the certification date and expiry. Send a reminder when recertification is due.")} />
      <CertificationStatusPanel learner={l} />
      {l.certification && (
        <Button size="lg" variant={due ? "primary" : "secondary"} onClick={() => { actions.sendRecertReminders([l.id]); announce(tr("Recertification reminder sent to {name}.", { name: l.fullName })); }}>
          <BellRing aria-hidden="true" className="size-5" /> {tr("Send recertification reminder")}
        </Button>
      )}
    </div>
  );
}
