"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { COURSES, courseById, lessonsForCourse } from "@/lib/mock-data";
import { courseLessonsDone, courseProgressPercent, courseStatus, lessonStatus } from "@/lib/progress";
import { useLearner } from "@/lib/store";
import { KIND_META } from "@/lib/lesson-meta";
import { formatClock } from "@/lib/utils";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data } = useLearner();
  const course = courseById(courseId);

  if (!course) {
    return (
      <>
        <PageIntro title="Course not found" instructions="This course does not exist." />
        <ButtonLink href="/dashboard">Return to course overview</ButtonLink>
      </>
    );
  }

  const status = courseStatus(data, course);
  const lessons = lessonsForCourse(course.id);
  const nextUp = lessons.find((l) => lessonStatus(data, l) !== "complete" && lessonStatus(data, l) !== "locked");
  const nextStatus = nextUp ? lessonStatus(data, nextUp) : null;
  const started = lessons.some((l) => data.lessons[l.id]);
  const ctaVerb = nextStatus === "in-progress" || nextStatus === "practice-pending" || (started && nextStatus) ? "Resume" : "Start";

  if (status === "locked") {
    const prev = COURSES.find((c) => c.order === course.order - 1)!;
    return (
      <>
        <PageIntro title={course.title} instructions="This course is locked until the previous required course is complete." />
        <Callout tone="warning" className="space-y-3">
          <p className="flex items-center gap-2 text-lg font-semibold"><Lock aria-hidden="true" /> Complete &ldquo;{prev.title}&rdquo; first.</p>
          <ButtonLink href={`/courses/${prev.id}`}>Go to {prev.title}</ButtonLink>
        </Callout>
      </>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2 text-base">
          <li><Link href="/dashboard" className="underline underline-offset-4">Course overview</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Course {course.order} of 3</li>
        </ol>
      </nav>
      <PageIntro
        title={course.title}
        instructions="Complete the lessons in order. After each lesson there is a short practice session."
      />
      <Card className="space-y-3">
        <p className="text-lg">{course.description}</p>
        <p className="text-base text-muted">Outcome: {course.outcome}</p>
        <p className="text-base">{courseLessonsDone(data, course.id)} of {lessons.length} lessons completed.</p>
        <ProgressBar value={courseProgressPercent(data, course.id)} label={`Course progress ${courseProgressPercent(data, course.id)} percent`} />
      </Card>

      {nextUp ? (
        <ButtonLink href={`/courses/${course.id}/lessons/${nextUp.id}`} size="lg">
          {ctaVerb} lesson {nextUp.order}: {nextUp.title}
        </ButtonLink>
      ) : (
        <Callout tone="success"><p className="text-lg font-semibold">You have completed this course.</p></Callout>
      )}

      <section aria-labelledby="lessons-h" className="space-y-4">
        <h2 id="lessons-h" className="text-2xl">Lessons (required order)</h2>
        <ol className="space-y-3">
          {lessons.map((l) => {
            const s = lessonStatus(data, l);
            const { label, Icon } = KIND_META[l.kind];
            const timed = l.kind === "audio" || l.kind === "video";
            return (
              <li key={l.id} className="rounded-xl border-2 border-border-soft bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-xl">Lesson {l.order}: {l.title}</h3>
                  <StatusBadge status={s} />
                </div>
                <p className="mt-1 text-base">{l.description}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-muted">
                  <span className="inline-flex items-center gap-1.5"><Icon aria-hidden="true" className="size-5" /> {label}</span>
                  <span>{timed ? `${formatClock(l.durationSeconds)} minutes` : `About ${Math.round(l.durationSeconds / 60)} minutes to read`}</span>
                </p>
                <p className="mt-2 text-base italic text-muted">{l.transcriptPreview}</p>
                <div className="mt-3">
                  {s === "locked" ? (
                    <p className="flex items-center gap-2 text-base font-semibold text-muted"><Lock aria-hidden="true" className="size-5" /> Finish lesson {l.order - 1} and its practice to unlock.</p>
                  ) : (
                    <ButtonLink href={`/courses/${course.id}/lessons/${l.id}`} variant={s === "complete" ? "secondary" : "primary"}>
                      {s === "complete" ? "Review" : s === "not-started" ? "Start" : "Resume"} lesson {l.order}
                    </ButtonLink>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
