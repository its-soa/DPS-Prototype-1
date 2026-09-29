import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { Course } from "@/lib/types";
import type { CourseStatus } from "@/lib/progress";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function CourseSequenceCard({
  course, status, percent, lessonsDone, lessonsTotal, headingLevel: H = "h3",
}: {
  course: Course; status: CourseStatus; percent: number; lessonsDone: number; lessonsTotal: number;
  headingLevel?: "h2" | "h3";
}) {
  const locked = status === "locked";
  const cta =
    status === "complete" ? "Review" : status === "in-progress" ? "Resume" : "Start";
  return (
    <Card className={cn("space-y-3", locked && "opacity-90")}>
      <p className="text-base font-semibold text-muted">Required course {course.order} of 3</p>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <H className="text-xl sm:text-2xl">{course.title}</H>
        <StatusBadge status={status} />
      </div>
      <p className="max-w-prose text-base">{course.description}</p>
      <p className="text-base text-muted">{lessonsDone} of {lessonsTotal} lessons completed</p>
      <ProgressBar value={percent} label={`${course.title}: ${percent} percent complete`} />
      {locked ? (
        <p className="flex items-center gap-2 text-base font-semibold text-muted">
          <Lock aria-hidden="true" className="size-5" />
          Complete course {course.order - 1} to unlock this course.
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
