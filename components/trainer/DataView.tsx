"use client";

import { useEffect, useState } from "react";
import { LayoutList, Table2 } from "lucide-react";
import { tr } from "@/lib/trainer/tr";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  /** The first column should be the row header (the row's name). */
  rowHeader?: boolean;
}

/**
 * Every list is offered two ways: a real <table> with caption and header scopes, and a simple list of
 * cards (easier on small screens and for linear screen-reader reading). The learner chooses.
 */
export function DataView<T>({
  caption, rows, columns, getKey, empty, id,
}: { caption: string; rows: T[]; columns: Column<T>[]; getKey: (r: T) => string; empty?: string; id: string }) {
  const [view, setView] = useState<"list" | "table">("list");
  useEffect(() => { if (window.innerWidth >= 1024) setView("table"); }, []);
  if (!rows.length) return <p className="text-base text-muted">{empty ?? tr("Nothing to show yet.")}</p>;
  const head = columns.find((c) => c.rowHeader) ?? columns[0];
  const rest = columns.filter((c) => c !== head);

  return (
    <div className="space-y-3">
      <div role="group" aria-label={tr("Choose how to view {caption}", { caption })} className="flex gap-2">
        {([["list", tr("List view"), LayoutList], ["table", tr("Table view"), Table2]] as const).map(([v, label, Icon]) => (
          <button
            key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
            className={cn("inline-flex min-h-12 items-center gap-2 rounded-lg border-2 px-4 text-base font-semibold", view === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}
          >
            <Icon aria-hidden="true" className="size-5" /> {label}
          </button>
        ))}
      </div>
      {view === "table" ? (
        <div className="overflow-x-auto rounded-xl border-2 border-border-soft">
          <table className="w-full border-collapse text-left text-base" aria-describedby={`${id}-sum`}>
            <caption className="p-3 text-left font-semibold">{caption}</caption>
            <thead className="bg-surface-strong">
              <tr>{columns.map((c) => <th key={c.header} scope="col" className="px-3 py-2 font-bold">{c.header}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={getKey(r)} className="border-t-2 border-border-soft align-top">
                  {columns.map((c) => c === head
                    ? <th key={c.header} scope="row" className="px-3 py-3 font-semibold">{c.cell(r)}</th>
                    : <td key={c.header} className="px-3 py-3">{c.cell(r)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={caption}>
          {rows.map((r) => (
            <li key={getKey(r)} className="rounded-xl border-2 border-border-soft bg-surface p-4">
              <p className="text-lg font-bold">{head.cell(r)}</p>
              <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
                {rest.map((c) => (
                  <div key={c.header} className="contents">
                    <dt className="font-semibold text-muted">{c.header}</dt>
                    <dd>{c.cell(r)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}
      <p id={`${id}-sum`} className="sr-only">{tr("{count} rows.", { count: rows.length })}</p>
    </div>
  );
}
