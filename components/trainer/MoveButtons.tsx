"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tr } from "@/lib/trainer/tr";

/** Explicit ordering controls. Drag-and-drop is never the only way to reorder. */
export function MoveButtons({ label, index, count, onMove }: { label: string; index: number; count: number; onMove: (dir: -1 | 1) => void }) {
  return (
    <span className="inline-flex gap-2">
      <Button variant="secondary" disabled={index === 0} onClick={() => onMove(-1)} aria-label={tr("Move {label} up", { label })}>
        <ArrowUp aria-hidden="true" className="size-5" /> {tr("Move up")}
      </Button>
      <Button variant="secondary" disabled={index === count - 1} onClick={() => onMove(1)} aria-label={tr("Move {label} down", { label })}>
        <ArrowDown aria-hidden="true" className="size-5" /> {tr("Move down")}
      </Button>
    </span>
  );
}
