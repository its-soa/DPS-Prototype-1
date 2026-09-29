import { PlayCircle } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { courseById } from "@/lib/mock-data";
import { formatClock, formatDate, spokenTime } from "@/lib/utils";

export function ResumeLearningBanner({
  lesson, position, device, updatedAt,
}: { lesson: Lesson; position: number; device?: string; updatedAt?: string }) {
  const timed = lesson.kind === "audio" || lesson.kind === "video";
  const course = courseById(lesson.courseId)!;
  return (
    <Callout tone="info" className="space-y-3" aria-labelledby="resume-h" role="region">
      <h2 id="resume-h" className="text-2xl">Resume where you left off</h2>
      <p className="text-lg">
        <strong>{course.title}</strong>, lesson {lesson.order}: {lesson.title}.
      </p>
      {timed && position > 0 && (
        <p className="text-base">
          Saved at <span aria-hidden="true">{formatClock(position)}</span>
          <span className="sr-only">{spokenTime(position)}</span>
          {device && <> on the {device}</>}
          {updatedAt && <>, {formatDate(updatedAt)}</>}.
        </p>
      )}
      <ButtonLink href={`/courses/${lesson.courseId}/lessons/${lesson.id}`} size="lg">
        <PlayCircle aria-hidden="true" className="size-6" />
        {timed && position > 0 ? `Resume lesson from ${formatClock(position)}` : `Open lesson ${lesson.order}`}
      </ButtonLink>
    </Callout>
  );
}
