import { COURSES } from "@/lib/mock-data";
import { courseStatus, overallPercent } from "@/lib/progress";
import type { UserData } from "@/lib/types";
import { ProgressBar } from "@/components/ui/progress";

export function ProgressSummary({ data }: { data: UserData }) {
  const statuses = COURSES.map((c) => courseStatus(data, c));
  const completed = statuses.filter((s) => s === "complete").length;
  const inProgress = statuses.filter((s) => s === "in-progress").length;
  const upcoming = statuses.length - completed - inProgress;
  const pct = overallPercent(data);
  return (
    <section aria-labelledby="summary-h" className="space-y-3">
      <h2 id="summary-h" className="text-2xl">Status overview</h2>
      <ProgressBar value={pct} label={`Overall progress: ${pct} percent of lessons completed`} />
      <ul className="grid gap-3 sm:grid-cols-3">
        {[
          { n: completed, l: "Completed" },
          { n: inProgress, l: "In progress" },
          { n: upcoming, l: "Upcoming" },
        ].map((x) => (
          <li key={x.l} className="rounded-xl border-2 border-border-soft bg-surface p-4">
            <span className="block text-3xl font-bold">{x.n}</span>
            <span className="text-base font-semibold">{x.l} {x.n === 1 ? "course" : "courses"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
