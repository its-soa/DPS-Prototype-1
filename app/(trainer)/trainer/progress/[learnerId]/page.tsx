"use client";

import { useParams } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { LearnerProgressPanel } from "@/components/trainer/LearnerProgressPanel";
import { ButtonLink } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function LearnerProgressPage() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { state } = useTrainer();
  const { account } = useApp();
  const l = state.learners.find((x) => x.id === learnerId && !x.archived);
  if (!l) return <><PageIntro title={tr("Learner not found")} /><ButtonLink href="/trainer/progress">{tr("Back to cohort progress")}</ButtonLink></>;
  return (
    <>
      <Breadcrumbs items={[{ label: tr("Cohort progress"), href: "/trainer/progress" }, { label: l.fullName }]} />
      <PageIntro title={tr("{name}: progress record", { name: l.fullName })} instructions={tr("See completed and upcoming lessons, practice results and incorrect answers. Send a remediation note when a learner needs support.")} />
      <LearnerProgressPanel learner={l} trainerName={account?.fullName ?? "Trainer"} />
    </>
  );
}
