"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { useCatalog } from "@/lib/catalog";
import { KIND_META } from "@/lib/lesson-meta";
import { courseLessonsDone, courseProgressPercent, courseStatus, lessonStatus } from "@/lib/progress";
import { useLearner } from "@/lib/store";
import { formatClock } from "@/lib/utils";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data, t } = useLearner();
  const { courses, courseById, lessonsForCourse } = useCatalog();
  const course = courseById(courseId);

  if (!course) {
    return (
      <>
        <PageIntro title={t("course.notFound")} instructions={t("course.notFoundBody")} />
        <ButtonLink href="/dashboard">{t("common.returnOverview")}</ButtonLink>
      </>
    );
  }

  const status = courseStatus(data, course);
  const lessons = lessonsForCourse(course.id);
  const nextUp = lessons.find((l) => lessonStatus(data, l) !== "complete" && lessonStatus(data, l) !== "locked");
  const nextStatus = nextUp ? lessonStatus(data, nextUp) : null;
  const started = lessons.some((l) => data.lessons[l.id]);
  const resuming = nextStatus === "in-progress" || nextStatus === "practice-pending" || (started && !!nextStatus);

  if (status === "locked") {
    const prev = courses.find((c) => c.order === course.order - 1)!;
    return (
      <>
        <PageIntro title={course.title} instructions={t("course.lockedInstructions")} />
        <Callout tone="warning" className="space-y-3">
          <p className="flex items-center gap-2 text-lg font-semibold"><Lock aria-hidden="true" /> {t("course.completeFirst", { title: prev.title })}</p>
          <ButtonLink href={`/courses/${prev.id}`}>{t("course.goTo", { title: prev.title })}</ButtonLink>
        </Callout>
      </>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <nav aria-label={t("nav.breadcrumb")}>
        <ol className="flex flex-wrap gap-2 text-base">
          <li><Link href="/dashboard" className="underline underline-offset-4">{t("nav.overview")}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{t("course.nOf3", { n: course.order })}</li>
        </ol>
      </nav>
      <PageIntro title={course.title} instructions={t("course.instructions")} />
      <Card className="space-y-3">
        <p className="text-lg">{course.description}</p>
        <p className="text-base text-muted">{t("course.outcome", { outcome: course.outcome })}</p>
        <p className="text-base">{t("course.lessonsCompleted", { done: courseLessonsDone(data, course.id), total: lessons.length })}</p>
        <ProgressBar value={courseProgressPercent(data, course.id)} label={t("course.progressLabel", { title: course.title, pct: courseProgressPercent(data, course.id) })} />
      </Card>

      {nextUp ? (
        <ButtonLink href={`/courses/${course.id}/lessons/${nextUp.id}`} size="lg">
          {resuming ? t("course.resumeLesson", { n: nextUp.order, title: nextUp.title }) : t("course.startLesson", { n: nextUp.order, title: nextUp.title })}
        </ButtonLink>
      ) : (
        <Callout tone="success"><p className="text-lg font-semibold">{t("course.completedAll")}</p></Callout>
      )}

      <section aria-labelledby="lessons-h" className="space-y-4">
        <h2 id="lessons-h" className="text-2xl">{t("course.lessonsH")}</h2>
        <ol className="space-y-3">
          {lessons.map((l) => {
            const s = lessonStatus(data, l);
            const { labelKey, Icon } = KIND_META[l.kind];
            const timed = l.kind === "audio" || l.kind === "video";
            return (
              <li key={l.id} className="rounded-xl border-2 border-border-soft bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-xl">{t("lesson.n", { n: l.order })}: {l.title}</h3>
                  <StatusBadge status={s} />
                </div>
                <p className="mt-1 text-base">{l.description}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-muted">
                  <span className="inline-flex items-center gap-1.5"><Icon aria-hidden="true" className="size-5" /> {t(labelKey)}</span>
                  <span>{timed ? t("lesson.durationMin", { time: formatClock(l.durationSeconds) }) : t("lesson.readMin", { min: Math.round(l.durationSeconds / 60) })}</span>
                </p>
                <p className="mt-2 text-base italic text-muted">{l.transcriptPreview}</p>
                <div className="mt-3">
                  {s === "locked" ? (
                    <p className="flex items-center gap-2 text-base font-semibold text-muted"><Lock aria-hidden="true" className="size-5" /> {t("lesson.unlockHint", { n: l.order - 1 })}</p>
                  ) : (
                    <ButtonLink href={`/courses/${course.id}/lessons/${l.id}`} variant={s === "complete" ? "secondary" : "primary"}>
                      {s === "complete" ? t("lesson.review", { n: l.order }) : s === "not-started" ? t("lesson.start", { n: l.order }) : t("lesson.resume", { n: l.order })}
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
