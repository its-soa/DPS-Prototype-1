"use client";

import Link from "next/link";
import { PageIntro } from "@/components/a11y/PageIntro";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { COURSES, lessonsForCourse } from "@/lib/mock-data";
import { courseLessonsDone, courseProgressPercent, courseStatus, examState, lessonStatus, nextLesson, overallPercent } from "@/lib/progress";
import { useLearner } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function ProgressPage() {
  const { data } = useLearner();
  const next = nextLesson(data);
  const exam = examState(data);
  const pct = overallPercent(data);

  let action: { label: string; href: string; text: string };
  if (data.certification) action = { label: "View my certification", href: "/certification", text: "You are certified. Review your certificate and recertification guidance." };
  else if (exam === "retry-locked") action = { label: "Continue remediation", href: "/exam/remediation", text: "Complete the short remediation to unlock your exam retry." };
  else if (exam === "retry-ready") action = { label: "Retry the certification exam", href: "/exam", text: "Remediation is done. Retry the exam when you are ready." };
  else if (exam === "ready" || exam === "in-progress") action = { label: "Go to the certification exam", href: "/exam", text: "All required courses are complete." };
  else if (next) action = { label: `Open lesson: ${next.title}`, href: `/courses/${next.courseId}/lessons/${next.id}`, text: "This is the next lesson in your required order." };
  else action = { label: "Go to dashboard", href: "/dashboard", text: "" };

  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro title="My progress" instructions="A summary of your courses and lessons. Each course is a heading with its lessons listed below." />

      <Card className="space-y-3">
        <h2 className="text-2xl">Summary</h2>
        <ProgressBar value={pct} label={`Overall progress ${pct} percent`} />
        <dl className="grid gap-x-6 gap-y-1 text-lg sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">Overall progress</dt><dd>{pct} percent of lessons completed</dd>
          <dt className="font-semibold">Last active</dt><dd>{data.lastActive ? formatDate(data.lastActive) : "Today, on your first visit"}</dd>
        </dl>
      </Card>

      <Callout tone="info" className="space-y-3" role="region" aria-labelledby="next-h">
        <h2 id="next-h" className="text-2xl">Next recommended action</h2>
        {action.text && <p className="text-lg">{action.text}</p>}
        <ButtonLink href={action.href}>{action.label}</ButtonLink>
      </Callout>

      <section aria-labelledby="courses-h" className="space-y-6">
        <h2 id="courses-h" className="text-2xl">Courses and lessons</h2>
        {COURSES.map((c) => (
          <Card key={c.id} className="space-y-3">
            <h3 className="text-xl">{c.order}. {c.title}</h3>
            <p className="flex flex-wrap items-center gap-3 text-base">
              <StatusBadge status={courseStatus(data, c)} />
              <span>{courseProgressPercent(data, c.id)} percent · {courseLessonsDone(data, c.id)} of {lessonsForCourse(c.id).length} lessons complete</span>
            </p>
            <ul className="space-y-2">
              {lessonsForCourse(c.id).map((l) => {
                const s = lessonStatus(data, l);
                return (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-border-soft pt-2">
                    {s === "locked" ? <span className="text-base">Lesson {l.order}: {l.title}</span>
                      : <Link href={`/courses/${c.id}/lessons/${l.id}`} className="text-base font-semibold underline underline-offset-4">Lesson {l.order}: {l.title}</Link>}
                    <StatusBadge status={s} />
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </section>
    </div>
  );
}
