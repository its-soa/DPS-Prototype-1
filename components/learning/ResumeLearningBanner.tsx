"use client";

import { PlayCircle } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useCatalog } from "@/lib/catalog";
import { useApp } from "@/lib/store";
import { deviceKey, formatClock } from "@/lib/utils";

export function ResumeLearningBanner({
  lesson, position, device, updatedAt,
}: { lesson: Lesson; position: number; device?: string; updatedAt?: string }) {
  const { t, spoken, fmtDate } = useApp();
  const { courseById } = useCatalog();
  const timed = lesson.kind === "audio" || lesson.kind === "video";
  const course = courseById(lesson.courseId)!;
  const dk = deviceKey(device);
  return (
    <Callout tone="info" className="space-y-3" aria-labelledby="resume-h" role="region">
      <h2 id="resume-h" className="text-2xl">{t("dash.resume")}</h2>
      <p className="text-lg">{t("resume.where", { course: course.title, n: lesson.order, lesson: lesson.title })}</p>
      {timed && position > 0 && (
        <p className="text-base">
          <span aria-hidden="true">{t("resume.savedAt", { time: formatClock(position) })}</span>
          <span className="sr-only">{t("resume.savedAt", { time: spoken(position) })}</span>
          {dk && <> {t("resume.onDevice", { device: t(dk) })}</>}
          {updatedAt && <>, {fmtDate(updatedAt)}</>}.
        </p>
      )}
      <ButtonLink href={`/courses/${lesson.courseId}/lessons/${lesson.id}`} size="lg">
        <PlayCircle aria-hidden="true" className="size-6" />
        {timed && position > 0 ? t("resume.cta", { time: formatClock(position) }) : t("resume.openLesson", { n: lesson.order })}
      </ButtonLink>
    </Callout>
  );
}
