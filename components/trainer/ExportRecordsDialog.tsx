"use client";

import { useState } from "react";
import { Download, FileDown } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { ConfirmDialog } from "@/components/exam/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { liveLearners } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import type { ExportJob } from "@/lib/trainer/types";
import { formatDate } from "@/lib/utils";

function download(job: ExportJob) {
  const url = URL.createObjectURL(new Blob([job.csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url; a.download = `learner-progress-${job.requestedAt.slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/** Confirm, "generate" a CSV, announce when ready, then offer the download. Past exports stay listed. */
export function ExportRecordsDialog({ requestedBy }: { requestedBy: string }) {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState<ExportJob | null>(null);
  const count = liveLearners(state).length;

  async function run() {
    setOpen(false); setBusy(true); setReady(null);
    announce(tr("Preparing your export."));
    await new Promise((r) => setTimeout(r, 900));
    const job = actions.createExport("Learner progress records", requestedBy);
    setBusy(false); setReady(job);
    announce(tr("Export ready: {n} learner records. Use Download CSV to save the file.", { n: job.rows }));
  }

  return (
    <div className="space-y-4">
      <Button size="lg" onClick={() => setOpen(true)} aria-busy={busy}><FileDown aria-hidden="true" className="size-5" /> {busy ? tr("Preparing export…") : tr("Export learner progress records")}</Button>
      {ready && (
        <Callout tone="success" role="status" className="space-y-3">
          <p className="text-xl font-bold text-success">{tr("Export ready")}</p>
          <p>{tr("{n} learner records, in CSV format, opens in any spreadsheet program.", { n: ready.rows })}</p>
          <Button onClick={() => { download(ready); announce(tr("Download started.")); }}><Download aria-hidden="true" className="size-5" /> {tr("Download CSV")}</Button>
        </Callout>
      )}
      {state.exports.length > 0 && (
        <div>
          <h3 className="mb-2 text-xl">{tr("Previous exports")}</h3>
          <ul className="space-y-2">{state.exports.map((j) => (
            <li key={j.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-2 border-border-soft bg-surface px-3 py-2">
              <span>{j.type}, {formatDate(j.requestedAt, "en-GB")}, {tr("{n} records", { n: j.rows })}</span>
              <Button variant="secondary" onClick={() => download(j)}>{tr("Download again")}<span className="sr-only">: {formatDate(j.requestedAt, "en-GB")}</span></Button>
            </li>))}</ul>
        </div>
      )}
      <ConfirmDialog open={open} title={tr("Export learner progress records?")} confirmLabel={tr("Yes, create export")} cancelLabel={tr("Cancel")} onCancel={() => setOpen(false)} onConfirm={run}>
        <p>{tr("This creates a CSV file with {n} learner records: progress, quiz average, exam status and certification.", { n: count })}</p>
        <p className="text-sm text-muted">{tr("The file contains personal data. Store it securely.")}</p>
      </ConfirmDialog>
    </div>
  );
}
