"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { LessonAudioPlayer } from "@/components/learning/LessonAudioPlayer";
import { PdfLessonViewer } from "@/components/learning/PdfLessonViewer";
import { TextLesson } from "@/components/learning/TextLesson";
import { TranscriptPanel } from "@/components/learning/TranscriptPanel";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { courseById, lessonById, lessonsForCourse } from "@/lib/mock-data";
import { lessonStatus } from "@/lib/progress";
import { useLearner } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { KIND_META } from "@/lib/lesson-meta";

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { data, state, saveLesson } = useLearner();
  const { announce } = useAnnouncer();
  const lesson = lessonById(lessonId);
  const course = courseById(courseId);

  // Position/page as it was when this page opened (used to resume; not updated while playing)
  const [initial] = useState(() => data.lessons[lessonId]);
  const [position, setPosition] = useState(initial?.position ?? 0);
  const [readAll, setReadAll] = useState(false);

  const save = useCallback((p: number) => saveLesson(lessonId, p), [saveLesson, lessonId]);
  const complete = useCallback(() => {
    if (lesson) saveLesson(lessonId, lesson.durationSeconds, true);
  }, [saveLesson, lessonId, lesson]);

  // Opening a text lesson counts as starting it.
  useEffect(() => {
    if (lesson && (lesson.kind === "text") && !data.lessons[lessonId]) saveLesson(lessonId, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lesson || !course || lesson.courseId !== course.id) {
    return (<><PageIntro title="Lesson not found" /><ButtonLink href="/dashboard">Return to course overview</ButtonLink></>);
  }

  const status = lessonStatus(data, lesson);
  if (status === "locked") {
    return (
      <>
        <PageIntro title={lesson.title} instructions="This lesson is locked until the previous lesson and its practice are complete." />
        <Callout tone="warning" className="space-y-3">
          <p className="flex items-center gap-2 text-lg font-semibold"><Lock aria-hidden="true" /> Finish the previous lesson and its practice first.</p>
          <ButtonLink href={`/courses/${course.id}`}>Back to {course.title}</ButtonLink>
        </Callout>
      </>
    );
  }

  const siblings = lessonsForCourse(course.id);
  const isCompleted = !!data.lessons[lessonId]?.completed;
  const practiceDone = !!data.practiceDone[lessonId];
  const nextLesson = siblings.find((l) => l.order === lesson.order + 1);
  const { label: kindLabel } = KIND_META[lesson.kind];
  const timed = lesson.kind === "audio" || lesson.kind === "video";
  const otherDevice = initial && initial.device !== state.device && !initial.completed;

  const canFinishReading = lesson.kind === "text" || (lesson.kind === "pdf" && readAll);

  return (
    <div className="max-w-3xl space-y-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2 text-base">
          <li><Link href="/dashboard" className="underline underline-offset-4">Course overview</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/courses/${course.id}`} className="underline underline-offset-4">{course.title}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Lesson {lesson.order} of {siblings.length}</li>
        </ol>
      </nav>

      <PageIntro
        eyebrow={`Course ${course.order} of 3 · Lesson ${lesson.order} of ${siblings.length} · ${kindLabel}`}
        title={lesson.title}
        instructions={lesson.description}
      />

      {otherDevice && (
        <Callout tone="info" role="region" aria-label="Saved position from another device">
          <p className="text-base">
            You last worked on this lesson on the <strong>{initial.device}</strong> on {formatDate(initial.updatedAt)}.
            {timed ? " Your position is ready below." : lesson.kind === "pdf" ? ` The reader is open at page ${Math.max(1, initial.position)}.` : ""}
          </p>
        </Callout>
      )}

      {timed && lesson.segments && (
        <>
          <LessonAudioPlayer
            kind={lesson.kind as "audio" | "video"}
            title={lesson.title}
            durationSeconds={lesson.durationSeconds}
            assetUrl={lesson.assetUrl}
            initialPosition={initial?.completed ? 0 : initial?.position ?? 0}
            defaultSpeed={state.settings.defaultSpeed}
            savedFrom={otherDevice ? initial.device : undefined}
            position={position}
            onPositionChange={setPosition}
            onSave={save}
            onComplete={complete}
            audioDescription={lesson.audioDescription}
          />
          <TranscriptPanel segments={lesson.segments} position={position} onJump={(s) => { setPosition(s); save(s); announce(`Moved to ${Math.floor(s / 60)} minutes ${s % 60} seconds.`); }} />
        </>
      )}

      {lesson.kind === "text" && lesson.sections && <TextLesson sections={lesson.sections} />}

      {lesson.kind === "pdf" && lesson.pages && (
        <PdfLessonViewer
          pages={lesson.pages}
          assetUrl={lesson.assetUrl}
          initialPage={initial?.position && initial.position > 0 && !initial.completed ? initial.position : 1}
          onPage={(n) => { save(n); if (n === lesson.pages!.length) setReadAll(true); }}
        />
      )}

      {(lesson.kind === "text" || lesson.kind === "pdf") && !isCompleted && (
        <Card className="space-y-3">
          <h2 className="text-2xl">Finish this lesson</h2>
          {canFinishReading ? (
            <>
              <p className="text-base">When you have read everything, mark the lesson as finished to unlock practice.</p>
              <Button size="lg" onClick={() => { complete(); announce("Lesson marked as finished. Practice is now unlocked."); }}>
                <CheckCircle2 aria-hidden="true" className="size-6" /> Mark lesson as finished
              </Button>
            </>
          ) : (
            <p className="text-base">Read to the last page of the handbook, then this button appears.</p>
          )}
        </Card>
      )}

      <section aria-labelledby="summary-h" className="space-y-2">
        <h2 id="summary-h" className="text-2xl">Lesson summary</h2>
        <p className="max-w-prose text-lg">{lesson.summary}</p>
      </section>

      <section aria-labelledby="materials-h" className="space-y-2">
        <h2 id="materials-h" className="text-2xl">Related materials</h2>
        <ul className="space-y-2">
          {lesson.materials.map((m) => (
            <li key={m.title} className="rounded-lg border-2 border-border-soft bg-surface p-3">
              <p className="text-base font-semibold">{m.title} <span className="font-normal text-muted">({m.kind})</span></p>
              <p className="text-sm text-muted">{m.description} Placeholder download.</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practice-h" className="space-y-3">
        <h2 id="practice-h" className="text-2xl">Practice</h2>
        {isCompleted ? (
          <Callout tone="success" className="space-y-3">
            <p className="flex items-center gap-2 text-lg font-semibold"><CheckCircle2 aria-hidden="true" /> {practiceDone ? "Lesson and practice complete." : "Lesson complete. Practice is unlocked."}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/courses/${course.id}/lessons/${lesson.id}/practice`} size="lg">
                {practiceDone ? "Repeat practice session" : "Start practice session"}
              </ButtonLink>
              {practiceDone && nextLesson && <ButtonLink href={`/courses/${course.id}/lessons/${nextLesson.id}`} variant="secondary">Continue to lesson {nextLesson.order}</ButtonLink>}
            </div>
          </Callout>
        ) : (
          <p className="text-base text-muted">Practice unlocks when you finish this lesson.</p>
        )}
      </section>
    </div>
  );
}
