import Link from "next/link";
import { Check } from "lucide-react";
import { EXAM_QUESTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Numbered list of links: any question can be reached directly, and saved status is text, not colour only. */
export function ExamQuestionNavigator({ current, answers }: { current?: number; answers: Record<string, string> }) {
  const saved = EXAM_QUESTIONS.filter((q) => answers[q.id]).length;
  return (
    <nav aria-label="Exam questions">
      <details className="rounded-xl border-2 border-border-soft bg-surface p-4">
        <summary className="min-h-12 cursor-pointer text-base font-semibold">
          Question list: {saved} of {EXAM_QUESTIONS.length} saved
        </summary>
        <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {EXAM_QUESTIONS.map((q, i) => {
            const isSaved = !!answers[q.id];
            return (
              <li key={q.id}>
                <Link
                  href={`/exam/question/${i + 1}`}
                  aria-current={current === i + 1 ? "step" : undefined}
                  className={cn(
                    "flex min-h-12 items-center justify-center gap-1.5 rounded-lg border-2 px-2 text-base font-semibold",
                    current === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                  )}
                >
                  {isSaved && <Check aria-hidden="true" className="size-4" />}
                  <span>Question {i + 1}</span>
                  <span className="sr-only">, {isSaved ? "answer saved" : "not answered"}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </nav>
  );
}
