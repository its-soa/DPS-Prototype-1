"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check, CircleDot, FileEdit, Mail, Archive } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "@/lib/use-motion";
import { tr } from "@/lib/trainer/tr";

type Tone = "success" | "info" | "warning" | "neutral" | "danger";
const TONES: Record<Tone, string> = {
  success: "border-success bg-success-soft text-success",
  info: "border-primary bg-primary-soft text-primary",
  warning: "border-warning bg-warning-soft text-warning",
  danger: "border-danger bg-danger-soft text-danger",
  neutral: "border-border bg-background text-muted",
};

/** Status is always icon + text. A change of label gets one calm pulse (skipped for reduced motion). */
export function StatusPill({ label, tone = "neutral", icon, className }: { label: string; tone?: Tone; icon?: React.ReactNode; className?: string }) {
  const reduce = useReduceMotion();
  const prev = useRef(label);
  const changed = prev.current !== label;
  useEffect(() => { prev.current = label; }, [label]);
  return (
    <motion.span
      key={label}
      initial={false}
      animate={changed && !reduce ? { scale: [1, 1.08, 1] } : undefined}
      transition={{ duration: 0.6 }}
      className={cn("inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-0.5 text-sm font-semibold", TONES[tone], className)}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </motion.span>
  );
}

const MAP: Record<string, { label: string; tone: Tone; icon: React.ReactNode }> = {
  draft: { label: "Draft", tone: "neutral", icon: <FileEdit className="size-4" /> },
  published: { label: "Published", tone: "success", icon: <Check className="size-4" /> },
  "changes-pending": { label: "Update not yet republished", tone: "warning", icon: <AlertTriangle className="size-4" /> },
  active: { label: "Active", tone: "success", icon: <Check className="size-4" /> },
  saved: { label: "Saved", tone: "success", icon: <Check className="size-4" /> },
  archived: { label: "Archived", tone: "neutral", icon: <Archive className="size-4" /> },
  "not-sent": { label: "Invitation not sent", tone: "neutral", icon: <Mail className="size-4" /> },
  sent: { label: "Invitation sent", tone: "info", icon: <Mail className="size-4" /> },
  accepted: { label: "Invitation accepted", tone: "success", icon: <Check className="size-4" /> },
  required: { label: "Required", tone: "info", icon: <CircleDot className="size-4" /> },
  optional: { label: "Optional", tone: "neutral", icon: <CircleDot className="size-4" /> },
};
export function EntityStatus({ status }: { status: string }) {
  const m = MAP[status] ?? { label: status, tone: "neutral" as Tone, icon: null };
  return <StatusPill label={tr(m.label)} tone={m.tone} icon={m.icon} />;
}
