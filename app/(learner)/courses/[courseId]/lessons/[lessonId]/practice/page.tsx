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
import { courseById, lessonById, lessonsForCourse, practiceForLesson } from "@/lib/mock-data";
import { isCourseComplete } from "@/lib/progress";
import { useLearner } from "@/lib/store";

export default function PracticePage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { data, state, answerPractice, finishPractice } = useLearner();
  const { announce } = useAnnouncer();
  const [done, setDone] = useState(false);
  const lesson = lessonById(lessonId);
  const course = courseById(courseId);
  const questions = practiceForLesson(lessonId);

  if (!lesson || !course) return <PageIntro title="Practice not found" />;

  if (!data.lessons[lessonId]?.completed) {
    return (
      <>
        <PageIntro title="Practice is locked" instructions="Finish the lesson first. Practice unlocks when the lesson is complete." />
        <ButtonLink href={`/courses/${courseId}/lessons/${lessonId}`}>Back to lesson {lesson.order}</ButtonLink>
      </>
    );
  }

  const nextLesson = lessonsForCourse(course.id).find((l) => l.order === lesson.order + 1);
  const courseDone = isCourseComplete(data, course.id);

  if (done) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageIntro title="Practice complete" instructions={`You answered every question in ${lesson.title}.`} />
        <Callout tone="success" className="space-y-4">
          <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> Lesson {lesson.order} complete</p>
          {courseDone && <p className="text-lg">You have completed {course.title}.</p>}
          <div className="flex flex-wrap gap-3">
            {nextLesson ? (
              <ButtonLink href={`/courses/${course.id}/lessons/${nextLesson.id}`} size="lg">Continue to lesson {nextLesson.order}: {nextLesson.title}</ButtonLink>
            ) : (
              <ButtonLink href="/dashboard" size="lg">Return to course overview</ButtonLink>
            )}
            <ButtonLink href="/progress" variant="secondary">View my progress</ButtonLink>
          </div>
        </Callout>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2 text-base">
          <li><Link href={`/courses/${course.id}`} className="underline underline-offset-4">{course.title}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="underline underline-offset-4">Lesson {lesson.order}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Practice</li>
        </ol>
      </nav>
      <PageIntro
        title={`Practice: ${lesson.title}`}
        instructions={`${questions.length} questions. Choose one answer, then Submit answer. If you are not right the first time, you can review the lesson and try again.`}
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
          announce("Practice complete. Lesson finished.");
        }}
        finishLabel="Finish practice"
      />
    </div>
  );
}
