"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { DataView } from "@/components/trainer/DataView";
import { ProgramForm } from "@/components/trainer/ProgramForm";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { coursesOf, isLive } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function ProgramsPage() {
  const { state, actions } = useTrainer();
  const { account } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const programs = state.programs.filter(isLive);
  return (
    <div className="space-y-8">
      <PageIntro title={tr("Programs")} instructions={tr("A program holds the courses, quizzes, exam, learning path and learners for one qualification.")} />
      <section aria-labelledby="list-h" className="space-y-3">
        <h2 id="list-h" className="text-2xl">{tr("Your programs")}</h2>
        <DataView id="programs" caption={tr("Training programs")} rows={programs} getKey={(p) => p.id} columns={[
          { header: tr("Program"), rowHeader: true, cell: (p) => <Link href={`/trainer/programs/${p.id}`} className="underline underline-offset-4">{p.title}</Link> },
          { header: tr("Status"), cell: (p) => <EntityStatus status={p.status} /> },
          { header: tr("Courses"), cell: (p) => coursesOf(state, p.id).length },
          { header: tr("Learning paths"), cell: (p) => state.paths.filter((x) => x.programId === p.id && isLive(x)).length },
        ]} />
      </section>
      <Card>
        <h2 className="mb-4 text-2xl">{tr("Create a new training program")}</h2>
        <ProgramForm idPrefix="new-program" submitLabel={tr("Create program")} onSubmit={(v) => {
          const id = actions.createProgram({ ...v, by: account?.id ?? "trainer" });
          announce(tr("Program saved: {title}. Opening the program.", { title: v.title }));
          router.push(`/trainer/programs/${id}`);
        }} />
      </Card>
    </div>
  );
}
