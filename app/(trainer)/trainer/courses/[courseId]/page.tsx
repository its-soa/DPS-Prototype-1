"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { ConfirmDialog } from "@/components/exam/ConfirmDialog";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { CourseForm } from "@/components/trainer/CourseForm";
import { failForm } from "@/components/trainer/form-utils";
import { MoveButtons } from "@/components/trainer/MoveButtons";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { lessonsOf } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [err, setErr] = useState<string>();
  const [confirm, setConfirm] = useState(false);
  const [needLesson, setNeedLesson] = useState(false);
  const course = state.courses.find((c) => c.id === courseId && c.status !== "archived");
  if (!course) return <><PageIntro title={tr("Course not found")} /><ButtonLink href="/trainer/courses">{tr("Back to courses")}</ButtonLink></>;
  const program = state.programs.find((p) => p.id === course.programId);
  const lessons = lessonsOf(state, course.id);
  const hasPublished = lessons.some((l) => l.status === "published" || l.status === "changes-pending");

  function createLesson(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = title.trim() ? {} : { "lesson-title": tr("Enter a lesson title.") };
    setErr(errors["lesson-title"]);
    if (failForm(errors, ["lesson-title"], announce)) return;
    const id = actions.createLesson(course!.id, title.trim());
    announce(tr("Lesson created: {title}. Opening the lesson builder.", { title: title.trim() }));
    router.push(`/trainer/lessons/${id}`);
  }
  function publish() {
    if (!hasPublished) { setNeedLesson(true); announce(tr("Publish at least one lesson before publishing the course."), { assertive: true }); return; }
    setNeedLesson(false);
    actions.publishCourse(course!.id);
    announce(tr("Course published: {title}.", { title: course!.title }));
  }

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: tr("Programs"), href: "/trainer/programs" }, { label: program?.title ?? "", href: program ? `/trainer/programs/${program.id}` : undefined }, { label: course.title }]} />
      <PageIntro title={course.title} instructions={tr("Edit the course, order its lessons, and publish when it is ready.")} />
      <div className="flex flex-wrap items-center gap-3">
        <EntityStatus status={course.status} /> <EntityStatus status={course.isRequired ? "required" : "optional"} />
        <Button onClick={publish}>{course.status === "published" ? tr("Course is published") : tr("Publish course")}</Button>
      </div>
      {needLesson && <Callout tone="warning" role="alert"><p className="font-semibold">{tr("Publish at least one lesson before publishing the course.")}</p></Callout>}

      <section aria-labelledby="details-h" className="space-y-3">
        <h2 id="details-h" className="text-2xl">{tr("Course details")}</h2>
        <Card><CourseForm idPrefix="edit-course" initial={course} submitLabel={tr("Save course details")} onSubmit={(v) => { actions.updateCourse(course.id, v); announce(tr("Course saved.")); }} /></Card>
      </section>

      <section aria-labelledby="lessons-h" className="space-y-3">
        <h2 id="lessons-h" className="text-2xl">{tr("Lessons in order")}</h2>
        {lessons.length ? (
          <ol className="space-y-3">
            {lessons.map((l, i) => (
              <li key={l.id} className="space-y-2 rounded-xl border-2 border-border-soft bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/trainer/lessons/${l.id}`} className="text-lg font-semibold underline underline-offset-4">{tr("Lesson {n}", { n: i + 1 })}: {l.title}</Link>
                  <EntityStatus status={l.status} />
                </div>
                <MoveButtons label={l.title} index={i} count={lessons.length} onMove={(d) => { actions.moveLesson(l.id, d); announce(tr("{title} moved {dir}. It is now lesson {n}.", { title: l.title, dir: d < 0 ? tr("up") : tr("down"), n: i + 1 + d })); }} />
              </li>
            ))}
          </ol>
        ) : <p className="text-muted">{tr("No lessons yet. Create the first one below.")}</p>}
        <Card>
          <form onSubmit={createLesson} noValidate className="space-y-4" aria-label={tr("Create a lesson")}>
            <h3 className="text-xl">{tr("Create a lesson")}</h3>
            <Field id="lesson-title" label={tr("Lesson title")} required error={err}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
            <Button type="submit">{tr("Create lesson and open builder")}</Button>
          </form>
        </Card>
      </section>

      <Button variant="ghost" onClick={() => setConfirm(true)}>{tr("Archive this course")}</Button>
      <ConfirmDialog open={confirm} title={tr("Archive {title}?", { title: course.title })} confirmLabel={tr("Yes, archive course")} cancelLabel={tr("No, keep course")}
        onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); actions.archiveCourse(course.id); announce(tr("Course archived.")); router.push(`/trainer/programs/${course.programId}`); }}>
        <p>{tr("The course disappears from lists and learning paths. You can ask an administrator to restore it.")}</p>
      </ConfirmDialog>
    </div>
  );
}
