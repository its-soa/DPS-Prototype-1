"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

/** Native <dialog>: focus trapped, Escape cancels, focus restored to the opener. */
export function ConfirmDialog({
  open, title, children, confirmLabel, cancelLabel, onConfirm, onCancel,
}: {
  open: boolean; title: string; children: React.ReactNode;
  confirmLabel: string; cancelLabel: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { opener.current = document.activeElement; d.showModal(); }
    if (!open && d.open) d.close();
  }, [open]);

  function cancel() {
    ref.current?.close();
    onCancel();
    (opener.current as HTMLElement | null)?.focus?.();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-h"
      onCancel={(e) => { e.preventDefault(); cancel(); }}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-xl border-4 border-border bg-background p-0 text-foreground backdrop:bg-black/60"
    >
      <div className="space-y-4 p-5 sm:p-6">
        <h2 id="confirm-h" className="text-2xl">{title}</h2>
        <div className="space-y-2 text-lg">{children}</div>
        <div className="flex flex-wrap gap-3 border-t-2 border-border-soft pt-4">
          <Button size="lg" variant="secondary" onClick={cancel} autoFocus>{cancelLabel}</Button>
          <Button size="lg" onClick={() => { ref.current?.close(); onConfirm(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  );
}
