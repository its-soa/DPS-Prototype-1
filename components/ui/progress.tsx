import { cn } from "@/lib/utils";

/** Native <progress> keeps semantics simple for screen readers. */
export function ProgressBar({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <progress
        value={value}
        max={100}
        aria-label={label}
        className="h-4 w-full flex-1 appearance-none overflow-hidden rounded-full border-2 border-border bg-background [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-background [&::-webkit-progress-value]:bg-primary"
      />
      <span className="w-14 text-right text-base font-semibold tabular-nums" aria-hidden="true">{value}%</span>
    </div>
  );
}
