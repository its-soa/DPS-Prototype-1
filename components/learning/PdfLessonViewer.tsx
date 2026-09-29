"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Download, FileText } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import type { PdfPage } from "@/lib/types";

/**
 * Accessible "PDF viewer". Renders the tagged text of the PDF page by page as real HTML
 * (headings + paragraphs) so screen readers, Braille displays and text resizing all work.
 * The original file is offered as a download.
 */
export function PdfLessonViewer({
  pages, assetUrl, initialPage = 1, onPage,
}: { pages: PdfPage[]; assetUrl: string; initialPage?: number; onPage?: (page: number) => void }) {
  const { announce } = useAnnouncer();
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), pages.length));
  const p = pages[page - 1];

  function go(n: number) {
    setPage(n);
    onPage?.(n);
    announce(`Page ${n} of ${pages.length}. Progress saved.`);
  }

  return (
    <section aria-labelledby="pdf-h" className="space-y-4 rounded-xl border-2 border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="pdf-h" className="flex items-center gap-2 text-2xl"><FileText aria-hidden="true" className="size-6" /> Handbook reader</h2>
        <a href={assetUrl} download className="inline-flex min-h-12 items-center gap-2 font-semibold underline underline-offset-4">
          <Download aria-hidden="true" className="size-5" /> Download the PDF (placeholder)
        </a>
      </div>
      <p className="text-base font-semibold" data-testid="pdf-page-label">Page {page} of {pages.length}</p>
      <article aria-labelledby="pdf-page-h" className="space-y-3 rounded-lg border-2 border-border-soft bg-background p-5">
        <h3 id="pdf-page-h" className="text-xl">{p.title}</h3>
        {p.paragraphs.map((t, i) => <p key={i} className="max-w-prose text-lg">{t}</p>)}
      </article>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" disabled={page === 1} onClick={() => go(page - 1)}>
          <ArrowLeft aria-hidden="true" className="size-5" /> Previous page
        </Button>
        <Button variant="secondary" disabled={page === pages.length} onClick={() => go(page + 1)}>
          Next page <ArrowRight aria-hidden="true" className="size-5" />
        </Button>
      </div>
      <p className="text-sm text-muted">Page reached is saved so you can resume on another device.</p>
    </section>
  );
}
