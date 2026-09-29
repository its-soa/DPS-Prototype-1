import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border-2 border-border-soft bg-surface p-5 sm:p-6", className)} {...props} />;
}

type Tone = "info" | "success" | "warning" | "danger";
const tones: Record<Tone, string> = {
  info: "border-primary bg-primary-soft",
  success: "border-success bg-success-soft",
  warning: "border-warning bg-warning-soft",
  danger: "border-danger bg-danger-soft",
};
export function Callout({
  tone = "info", className, ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return <div className={cn("rounded-xl border-2 p-4 sm:p-5", tones[tone], className)} {...props} />;
}
