"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { CourseForm } from "@/components/trainer/CourseForm";
import { DataView } from "@/components/trainer/DataView";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Card } from "@/components/ui/card";
import { isLive, lessonsOf } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function CoursesPage() {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const courses = state.courses.filter(isLive).sort((a, b) => a.programId.localeCompare(b.programId) || a.order - b.order);
  const programs = state.programs.filter(isLive);
  return (
    <div className="space-y-8">
      <PageIntro title={tr("Courses")} instructions={tr("All courses across your programs. Open a course to add and order its lessons.")} />
      <DataView id="courses" caption={tr("Courses")} rows={courses} getKey={(c) => c.id} columns={[
        { header: tr("Course"), rowHeader: true, cell: (c) => <Link href={`/trainer/courses/${c.id}`} className="underline underline-offset-4">{c.title}</Link> },
        { header: tr("Program"), cell: (c) => programs.find((p) => p.id === c.programId)?.title ?? "" },
        { header: tr("Required"), cell: (c) => <EntityStatus status={c.isRequired ? "required" : "optional"} /> },
        { header: tr("Status"), cell: (c) => <EntityStatus status={c.status} /> },
        { header: tr("Lessons"), cell: (c) => lessonsOf(state, c.id).length },
      ]} />
      <Card>
        <h2 className="mb-4 text-2xl">{tr("Create a course")}</h2>
        {programs.length ? (
          <CourseForm idPrefix="new-course" programOptions={programs} submitLabel={tr("Create course")} onSubmit={(v) => {
            const id = actions.createCourse(v);
            announce(tr("Course saved: {title}. Opening the course so you can add lessons.", { title: v.title }));
            router.push(`/trainer/courses/${id}`);
          }} />
        ) : <p>{tr("Create a program first, then add courses to it.")}</p>}
      </Card>
    </div>
  );
}
