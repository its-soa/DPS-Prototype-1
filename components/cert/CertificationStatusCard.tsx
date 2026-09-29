import { Award, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { examState } from "@/lib/progress";
import type { UserData } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function CertificationStatusCard({ data, headingLevel: H = "h2" }: { data: UserData; headingLevel?: "h2" | "h3" }) {
  const state = examState(data);
  const cert = data.certification;
  return (
    <Card className="space-y-3">
      <H className="flex items-center gap-2 text-2xl">
        {cert ? <Award aria-hidden="true" className="size-6 text-success" /> : <Lock aria-hidden="true" className="size-6" />}
        Certification status
      </H>
      {cert ? (
        <>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-success bg-success-soft px-3 py-0.5 text-base font-bold text-success">
            ✓ Certified
          </p>
          <p className="text-base">Issued {formatDate(cert.issuedAt)}. Expires {formatDate(cert.expiresAt)}.</p>
          <ButtonLink href="/certification" variant="secondary">View certification details</ButtonLink>
        </>
      ) : (
        <>
          <p className="inline-flex rounded-full border-2 border-border bg-background px-3 py-0.5 text-base font-semibold">Not yet certified</p>
          <p className="text-base">
            {state === "locked" && "Complete all three required courses to unlock the certification exam."}
            {state === "ready" && "You have completed all required courses. The certification exam is ready."}
            {state === "in-progress" && "You have an exam in progress. Your saved answers are kept."}
            {state === "retry-locked" && "Complete the short remediation to unlock your exam retry."}
            {state === "retry-ready" && "Remediation complete. You can retry the exam when you are ready."}
          </p>
          {state !== "locked" && <ButtonLink href="/exam" variant="secondary">Go to the certification exam</ButtonLink>}
        </>
      )}
    </Card>
  );
}
