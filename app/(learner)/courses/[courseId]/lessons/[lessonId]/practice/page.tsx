"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { PracticeSession } from "@/components/learning/PracticeSession";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useCatalog } from "@/lib/catalog";
import { isCourseComplete } from "@/lib/progress";
import { useLearner } from "@/lib/store";

export default function PracticePage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { data, state, answerPractice, finishPractice, t } = useLearner();
  const { lessonById, courseById, lessonsForCourse, practiceForLesson } = useCatalog();
  const { announce } = useAnnouncer();
  const [done, setDone] = useState(false);
  const lesson = lessonById(lessonId);
  const course = courseById(courseId);
  const questions = practiceForLesson(lessonId);

  if (!lesson || !course) return <PageIntro title={t("practice.notFound")} />;

  if (!data.lessons[lessonId]?.completed) {
    return (
      <>
        <PageIntro title={t("practice.lockedTitle")} instructions={t("practice.lockedBody")} />
        <ButtonLink href={`/courses/${courseId}/lessons/${lessonId}`}>{t("practice.backToLesson", { n: lesson.order })}</ButtonLink>
      </>
    );
  }

  const nextLesson = lessonsForCourse(course.id).find((l) => l.order === lesson.order + 1);
  const courseDone = isCourseComplete(data, course.id);

  if (done) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title={t("practice.doneTitle")} instructions={t("practice.doneBody", { title: lesson.title })} />
        <Callout tone="success" className="space-y-4">
          <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> {t("practice.lessonDone", { n: lesson.order })}</p>
          {courseDone && <p className="text-lg">{t("practice.courseDone", { title: course.title })}</p>}
          <div className="flex flex-wrap gap-3">
            {nextLesson ? (
              <ButtonLink href={`/courses/${course.id}/lessons/${nextLesson.id}`} size="lg">{t("practice.continueLesson", { n: nextLesson.order, title: nextLesson.title })}</ButtonLink>
            ) : (
              <ButtonLink href="/dashboard" size="lg">{t("common.returnOverview")}</ButtonLink>
            )}
            <ButtonLink href="/progress" variant="secondary">{t("dash.quick.progress")}</ButtonLink>
          </div>
        </Callout>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <nav aria-label={t("nav.breadcrumb")}>
        <ol className="flex flex-wrap gap-2 text-base">
          <li><Link href={`/courses/${course.id}`} className="underline underline-offset-4">{course.title}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="underline underline-offset-4">{t("lesson.n", { n: lesson.order })}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{t("practice.crumb")}</li>
        </ol>
      </nav>
      <PageIntro
        title={t("practice.title", { title: lesson.title })}
        instructions={t("practice.instructions", { count: questions.length })}
        focus={false}
      />
      <PracticeSession
        questions={questions}
        isTimed={lesson.kind === "audio" || lesson.kind === "video"}
        speed={state.settings.defaultSpeed}
        onAnswer={(q, s, c) => answerPractice(q.id, s, c)}
        onFinish={() => {
          finishPractice(lessonId);
          setDone(true);
          announce(t("practice.doneMessage"));
        }}
        finishLabel={t("practice.finish")}
      />
    </div>
  );
}
