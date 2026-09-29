import { Check, Circle, CircleDot, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type CourseStatus, type LessonStatus } from "@/lib/progress";

/** Status is always conveyed with an icon AND text, never colour alone. */
export function StatusBadge({ status, className }: { status: LessonStatus | CourseStatus; className?: string }) {
  const Icon = status === "complete" ? Check : status === "locked" ? Lock : status === "in-progress" || status === "practice-pending" ? CircleDot : Circle;
  const tone =
    status === "complete" ? "border-success bg-success-soft text-success"
    : status === "in-progress" || status === "practice-pending" ? "border-primary bg-primary-soft text-primary"
    : "border-border bg-background text-muted";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-0.5 text-sm font-semibold", tone, className)}>
      <Icon aria-hidden="true" className="size-4" />
      {STATUS_LABEL[status]}
    </span>
  );
}
