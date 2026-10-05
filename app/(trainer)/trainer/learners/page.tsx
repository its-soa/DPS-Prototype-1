"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { DataView } from "@/components/trainer/DataView";
import { failForm } from "@/components/trainer/form-utils";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { liveLearners, overallPercent } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function LearnersPage() {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const learners = liveLearners(state);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.lname = tr("Enter the learner's name.");
    if (!email.trim()) err.lemail = tr("Enter the learner's email address.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) err.lemail = tr("Enter an email address in the form name@example.org.");
    else if (state.learners.some((l) => l.email === email.trim().toLowerCase())) err.lemail = tr("A learner with this email already exists.");
    setErrors(err);
    if (failForm(err, ["lname", "lemail"], announce)) return;
    const id = actions.addLearner({ fullName: name.trim(), email: email.trim() });
    announce(tr("Learner {name} added. Next, assign a learning path and send the invitation.", { name: name.trim() }));
    router.push(`/trainer/learners/${id}`);
  }

  return (
    <div className="space-y-8">
      <PageIntro title={tr("Learners")} instructions={tr("Add a learner, then open their profile to assign a learning path and send the invitation.")} />
      <section aria-labelledby="list-h" className="space-y-3">
        <h2 id="list-h" className="text-2xl">{tr("All learners")} ({learners.length})</h2>
        <DataView id="learners" caption={tr("Learners and their invitation status")} rows={learners} getKey={(l) => l.id} columns={[
          { header: tr("Name"), rowHeader: true, cell: (l) => <Link href={`/trainer/learners/${l.id}`} className="underline underline-offset-4">{l.fullName}</Link> },
          { header: tr("Email"), cell: (l) => l.email },
          { header: tr("Invitation"), cell: (l) => <EntityStatus status={l.invitation} /> },
          { header: tr("Learning path"), cell: (l) => state.paths.find((p) => p.id === l.pathId)?.title ?? tr("Not assigned") },
          { header: tr("Progress"), cell: (l) => `${overallPercent(state, l)}%` },
        ]} />
      </section>
      <Card>
        <form onSubmit={add} noValidate className="space-y-5" aria-labelledby="add-h">
          <h2 id="add-h" className="text-2xl">{tr("Add a learner")}</h2>
          <Field id="lname" label={tr("Full name")} required error={errors.lname}>{(a) => <input {...a} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" className={inputClass} />}</Field>
          <Field id="lemail" label={tr("Email address")} required error={errors.lemail}>{(a) => <input {...a} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" className={inputClass} />}</Field>
          <Button type="submit" size="lg"><UserPlus aria-hidden="true" className="size-5" /> {tr("Save learner profile")}</Button>
        </form>
      </Card>
    </div>
  );
}
