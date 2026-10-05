"use client";

import { useParams } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { LessonBuilder } from "@/components/trainer/LessonBuilder";
import { ButtonLink } from "@/components/ui/button";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state } = useTrainer();
  const lesson = state.lessons.find((l) => l.id === lessonId && l.status !== "archived");
  if (!lesson) return <><PageIntro title={tr("Lesson not found")} /><ButtonLink href="/trainer/courses">{tr("Back to courses")}</ButtonLink></>;
  const course = state.courses.find((c) => c.id === lesson.courseId);
  return (
    <>
      <Breadcrumbs items={[{ label: tr("Courses"), href: "/trainer/courses" }, { label: course?.title ?? "", href: course ? `/trainer/courses/${course.id}` : undefined }, { label: lesson.title }]} />
      <PageIntro title={tr("Lesson builder")} eyebrow={lesson.title} instructions={tr("Work through the five sections. Save a draft at any time, and publish when the lesson is ready.")} />
      {/* key resets the form when navigating between lessons */}
      <LessonBuilder key={lesson.id} lesson={lesson} />
    </>
  );
}
