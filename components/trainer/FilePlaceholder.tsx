"use client";

import { FileAudio, FileText, Paperclip } from "lucide-react";
import { useRef } from "react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { tr } from "@/lib/trainer/tr";
import type { FileMeta } from "@/lib/trainer/types";

/**
 * Upload placeholder: records file name and size only. Nothing is uploaded (no storage backend in the
 * prototype). "Use a sample file" lets reviewers test without finding a file on their device.
 */
export function FilePlaceholder({ id, label, hint, accept, sample, value, onChange, kind }: {
  id: string; label: string; hint: string; accept: string; sample: FileMeta; value?: FileMeta; kind: "audio" | "pdf";
  onChange: (v: FileMeta | undefined) => void;
}) {
  const { announce } = useAnnouncer();
  const input = useRef<HTMLInputElement>(null);
  const Icon = kind === "audio" ? FileAudio : FileText;
  return (
    <div className="space-y-3 rounded-xl border-2 border-border-soft bg-background p-4">
      <p id={`${id}-label`} className="text-lg font-bold">{label}</p>
      <p id={`${id}-hint`} className="text-sm text-muted">{hint}</p>
      <p className="flex items-center gap-2 text-base" data-testid={`${id}-status`}>
        <Icon aria-hidden="true" className="size-5" />
        {value ? tr("Attached: {name} ({size} KB)", { name: value.name, size: value.sizeKb }) : tr("No file attached yet.")}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={id} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border-2 border-border bg-background px-5 font-semibold hover:bg-surface-strong">
          <Paperclip aria-hidden="true" className="size-5" /> {value ? tr("Replace file") : tr("Choose file")}
          <span className="sr-only"> {label}</span>
        </label>
        <input ref={input} id={id} type="file" accept={accept} aria-describedby={`${id}-hint`} className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { onChange({ name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) }); announce(tr("File attached: {name}.", { name: f.name })); } }} />
        <Button variant="secondary" onClick={() => { onChange(sample); announce(tr("Sample file attached: {name}.", { name: sample.name })); }}>{tr("Use a sample file")}</Button>
        {value && <Button variant="ghost" onClick={() => { onChange(undefined); announce(tr("File removed.")); }}>{tr("Remove file")}</Button>}
      </div>
    </div>
  );
}
