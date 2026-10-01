"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { Course } from "@/lib/types";
import type { CourseStatus } from "@/lib/progress";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CourseSequenceCard({
  course, status, percent, lessonsDone, lessonsTotal, headingLevel: H = "h3",
}: {
  course: Course; status: CourseStatus; percent: number; lessonsDone: number; lessonsTotal: number;
  headingLevel?: "h2" | "h3";
}) {
  const { t } = useApp();
  const locked = status === "locked";
  const cta = status === "complete" ? t("course.review") : status === "in-progress" ? t("course.resume") : t("course.start");
  return (
    <Card className={cn("space-y-3", locked && "opacity-90")}>
      <p className="text-base font-semibold text-muted">{t("course.requiredOf", { n: course.order })}</p>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <H className="text-xl sm:text-2xl">{course.title}</H>
        <StatusBadge status={status} />
      </div>
      <p className="max-w-prose text-base">{course.description}</p>
      <p className="text-base text-muted">{t("course.lessonsDone", { done: lessonsDone, total: lessonsTotal })}</p>
      <ProgressBar value={percent} label={t("course.progressLabel", { title: course.title, pct: percent })} />
      {locked ? (
        <p className="flex items-center gap-2 text-base font-semibold text-muted">
          <Lock aria-hidden="true" className="size-5" />
          {t("course.unlockHint", { n: course.order - 1 })}
        </p>
      ) : (
        <Link href={`/courses/${course.id}`} className={buttonVariants({ variant: status === "complete" ? "secondary" : "primary" })}>
          {cta} {course.title}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      )}
    </Card>
  );
}
