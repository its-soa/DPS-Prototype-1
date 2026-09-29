import type { TextSection } from "@/lib/types";

/** Formatted text lesson: real headings so screen-reader users can jump between sections. */
export function TextLesson({ sections }: { sections: TextSection[] }) {
  return (
    <article aria-labelledby="text-lesson-h" className="space-y-6 rounded-xl border-2 border-border bg-surface p-4 sm:p-6">
      <h2 id="text-lesson-h" className="text-2xl">Lesson text</h2>
      {sections.map((s) => (
        <section key={s.heading} className="space-y-2">
          <h3 className="text-xl">{s.heading}</h3>
          {s.paragraphs.map((p, i) => <p key={i} className="max-w-prose text-lg">{p}</p>)}
        </section>
      ))}
    </article>
  );
}
