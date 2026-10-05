"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { CourseForm } from "@/components/trainer/CourseForm";
import { failForm } from "@/components/trainer/form-utils";
import { ProgramForm } from "@/components/trainer/ProgramForm";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { coursesOf, isLive, lessonsOf } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { plural, tr } from "@/lib/trainer/tr";

function MiniCreate({ id, label, submit, extra, onSubmit }: { id: string; label: string; submit: string; extra?: React.ReactNode; onSubmit: (title: string) => void }) {
  const { announce } = useAnnouncer();
  const [title, setTitle] = useState("");
  const [err, setErr] = useState<string>();
  return (
    <form noValidate className="space-y-4" aria-label={submit} onSubmit={(e) => {
      e.preventDefault();
      const errors: Record<string, string> = title.trim() ? {} : { [id]: tr("Enter a title.") };
      setErr(errors[id]);
      if (failForm(errors, [id], announce)) return;
      onSubmit(title.trim());
    }}>
      <Field id={id} label={label} required error={err}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
      {extra}
      <Button type="submit">{submit}</Button>
    </form>
  );
}

export default function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const program = state.programs.find((p) => p.id === programId && isLive(p));
  const [quizLesson, setQuizLesson] = useState("");
  if (!program) return <><PageIntro title={tr("Program not found")} /><ButtonLink href="/trainer/programs">{tr("Back to programs")}</ButtonLink></>;

  const courses = coursesOf(state, program.id);
  const lessons = courses.flatMap((c) => lessonsOf(state, c.id));
  const quizzes = state.quizzes.filter((q) => q.programId === program.id && isLive(q));
  const exams = state.exams.filter((e) => e.programId === program.id && isLive(e));
  const paths = state.paths.filter((p) => p.programId === program.id && isLive(p));
  const learners = state.learners.filter((l) => !l.archived && paths.some((p) => p.id === l.pathId));
  const setup = [
    { ok: courses.length > 0, text: tr("{n} courses", { n: courses.length }) },
    { ok: courses.some((c) => c.status === "published"), text: tr("At least one published course") },
    { ok: quizzes.some((q) => q.status === "published"), text: tr("At least one published practice quiz") },
    { ok: exams.some((e) => e.status === "active"), text: tr("An active final exam") },
    { ok: paths.some((p) => p.status === "saved"), text: tr("A saved learning path") },
    { ok: learners.length > 0, text: tr("Learners assigned") },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: tr("Programs"), href: "/trainer/programs" }, { label: program.title }]} />
      <PageIntro title={program.title} instructions={tr("This program holds its courses, quizzes, exam, learning path and learners. Work through the sections in order.")} />
      <ul aria-label={tr("Setup checklist")} className="grid gap-2 sm:grid-cols-2">
        {setup.map((s) => <li key={s.text} className="flex items-center gap-2 rounded-lg border-2 border-border-soft bg-surface px-3 py-2">{s.ok ? <Check aria-hidden="true" className="size-5 text-success" /> : <X aria-hidden="true" className="size-5 text-muted" />}<span><span className="sr-only">{s.ok ? tr("Done:") : tr("Not yet:")} </span>{s.text}</span></li>)}
      </ul>

      <section aria-labelledby="details-h" className="space-y-3">
        <h2 id="details-h" className="text-2xl">{tr("Program details")}</h2>
        <Card><ProgramForm idPrefix="edit-program" initial={program} submitLabel={tr("Save program details")} onSubmit={(v) => { actions.updateProgram(program.id, v); announce(tr("Program saved.")); }} /></Card>
      </section>

      <section aria-labelledby="courses-h" className="space-y-3">
        <h2 id="courses-h" className="text-2xl">{tr("Courses")}</h2>
        {courses.length ? (
          <ul className="space-y-2">{courses.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border-soft bg-surface p-4">
              <Link href={`/trainer/courses/${c.id}`} className="text-lg font-semibold underline underline-offset-4">{c.order}. {c.title}</Link>
              <span className="flex flex-wrap gap-2"><EntityStatus status={c.isRequired ? "required" : "optional"} /><EntityStatus status={c.status} /></span>
            </li>))}</ul>
        ) : <p className="text-muted">{tr("No courses yet.")}</p>}
        <Card>
          <h3 className="mb-3 text-xl">{tr("Create a course")}</h3>
          <CourseForm idPrefix="prog-course" submitLabel={tr("Create course")} onSubmit={(v) => {
            const id = actions.createCourse({ programId: program.id, title: v.title, description: v.description, isRequired: v.isRequired });
            announce(tr("Course saved: {title}. Opening the course so you can add lessons.", { title: v.title }));
            router.push(`/trainer/courses/${id}`);
          }} />
        </Card>
      </section>

      <section aria-labelledby="quizzes-h" className="space-y-3">
        <h2 id="quizzes-h" className="text-2xl">{tr("Practice quizzes")}</h2>
        {quizzes.length ? <ul className="space-y-2">{quizzes.map((q) => (
          <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border-soft bg-surface p-4">
            <Link href={`/trainer/quizzes/${q.id}`} className="font-semibold underline underline-offset-4">{q.title}</Link>
            <span className="flex items-center gap-3"><span className="text-muted">{tr("{n} {q}", { n: q.questions.length, q: plural(q.questions.length, "question", "questions") })}</span><EntityStatus status={q.status} /></span>
          </li>))}</ul> : <p className="text-muted">{tr("No quizzes yet.")}</p>}
        <Card>
          <h3 className="mb-3 text-xl">{tr("Create a practice quiz")}</h3>
          <MiniCreate id="quiz-title" label={tr("Quiz title")} submit={tr("Create quiz")}
            extra={<Field id="quiz-lesson" label={tr("Linked lesson")} description={tr("Learners who miss questions are sent to this lesson.")}>{(a) => (
              <select {...a} value={quizLesson} onChange={(e) => setQuizLesson(e.target.value)} className={inputClass}>
                <option value="">{tr("Not linked to a lesson")}</option>
                {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>)}</Field>}
            onSubmit={(title) => { const id = actions.createQuiz({ programId: program.id, title, lessonId: quizLesson || undefined }); announce(tr("Quiz created. Add your first question.")); router.push(`/trainer/quizzes/${id}`); }} />
        </Card>
      </section>

      <section aria-labelledby="exam-h" className="space-y-3">
        <h2 id="exam-h" className="text-2xl">{tr("Final exam")}</h2>
        {exams.length ? <ul className="space-y-2">{exams.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border-soft bg-surface p-4">
            <Link href={`/trainer/exams/${e.id}`} className="font-semibold underline underline-offset-4">{e.title}</Link>
            <span className="flex items-center gap-3"><span className="text-muted">{tr("{n} questions, pass mark {p} percent", { n: e.questions.length, p: e.passingScore })}</span><EntityStatus status={e.status} /></span>
          </li>))}</ul> : <p className="text-muted">{tr("No exam yet.")}</p>}
        <Card>
          <h3 className="mb-3 text-xl">{tr("Create a final exam")}</h3>
          <MiniCreate id="exam-title" label={tr("Exam title")} submit={tr("Create exam")} onSubmit={(title) => { const id = actions.createExam({ programId: program.id, title }); announce(tr("Exam created. Add instructions and questions.")); router.push(`/trainer/exams/${id}`); }} />
        </Card>
      </section>

      <section aria-labelledby="paths-h" className="space-y-3">
        <h2 id="paths-h" className="text-2xl">{tr("Learning paths")}</h2>
        {paths.length ? <ul className="space-y-2">{paths.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-border-soft bg-surface p-4">
            <Link href={`/trainer/learning-paths/${p.id}`} className="font-semibold underline underline-offset-4">{p.title}</Link>
            <span className="flex items-center gap-3"><span className="text-muted">{tr("{n} items", { n: p.items.length })}</span><EntityStatus status={p.status} /></span>
          </li>))}</ul> : <p className="text-muted">{tr("No learning paths yet.")}</p>}
        <Card>
          <h3 className="mb-3 text-xl">{tr("Create a learning path")}</h3>
          <MiniCreate id="path-title" label={tr("Learning path title")} submit={tr("Create learning path")} onSubmit={(title) => { const id = actions.createPath({ programId: program.id, title }); announce(tr("Learning path created. Add courses and the exam.")); router.push(`/trainer/learning-paths/${id}`); }} />
        </Card>
      </section>

      <section aria-labelledby="learners-h" className="space-y-3">
        <h2 id="learners-h" className="text-2xl">{tr("Learners in this program")}</h2>
        {learners.length ? <ul className="space-y-1">{learners.map((l) => <li key={l.id}><Link href={`/trainer/learners/${l.id}`} className="font-semibold underline underline-offset-4">{l.fullName}</Link></li>)}</ul> : <p className="text-muted">{tr("No learners assigned yet.")}</p>}
        <ButtonLink href="/trainer/learners" variant="secondary">{tr("Go to learners")}</ButtonLink>
      </section>
    </div>
  );
}
