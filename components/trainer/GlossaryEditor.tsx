"use client";

import { useState } from "react";
import { Link2, Plus } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";
import type { TLesson } from "@/lib/trainer/types";
import { failForm } from "./form-utils";

/** Create glossary terms and link them to a lesson. Changes apply immediately. */
export function GlossaryEditor({ lesson }: { lesson: TLesson }) {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const [term, setTerm] = useState("");
  const [def, setDef] = useState("");
  const [pick, setPick] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const linked = lesson.glossaryIds.map((id) => state.glossary.find((g) => g.id === id)).filter(Boolean) as typeof state.glossary;
  const available = state.glossary.filter((g) => !lesson.glossaryIds.includes(g.id));

  function create(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!term.trim()) err["g-term"] = tr("Enter the term.");
    if (!def.trim()) err["g-def"] = tr("Enter a definition.");
    setErrors(err);
    if (failForm(err, ["g-term", "g-def"], announce)) return;
    actions.addGlossaryTerm(term.trim(), def.trim(), lesson.id);
    announce(tr("Glossary term added and linked: {term}.", { term: term.trim() }));
    setTerm(""); setDef("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xl">{tr("Terms linked to this lesson")}</h3>
        {linked.length ? (
          <ul className="space-y-2">
            {linked.map((g) => (
              <li key={g.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border-2 border-border-soft bg-background p-3">
                <p><strong>{g.term}</strong>: {g.definition}</p>
                <Button variant="secondary" onClick={() => { actions.unlinkGlossary(lesson.id, g.id); announce(tr("{term} unlinked from this lesson.", { term: g.term })); }} aria-label={tr("Unlink {term}", { term: g.term })}>{tr("Unlink")}</Button>
              </li>
            ))}
          </ul>
        ) : <p className="text-muted">{tr("No glossary terms linked yet.")}</p>}
      </div>
      {available.length > 0 && (
        <div className="space-y-3">
          <Field id="g-pick" label={tr("Link an existing term")}>{(a) => (
            <select {...a} value={pick} onChange={(e) => setPick(e.target.value)} className={inputClass}>
              <option value="">{tr("Choose a term")}</option>
              {available.map((g) => <option key={g.id} value={g.id}>{g.term}</option>)}
            </select>)}</Field>
          <Button variant="secondary" onClick={() => {
            if (!pick) { announce(tr("Choose a term to link."), { assertive: true }); document.getElementById("g-pick")?.focus(); return; }
            const g = state.glossary.find((x) => x.id === pick)!;
            actions.linkGlossary(lesson.id, pick); announce(tr("{term} linked to this lesson.", { term: g.term })); setPick("");
          }}><Link2 aria-hidden="true" className="size-5" /> {tr("Link term to lesson")}</Button>
        </div>
      )}
      <form onSubmit={create} noValidate className="space-y-4" aria-label={tr("Create a glossary term")}>
        <h3 className="text-xl">{tr("Create a new term")}</h3>
        <Field id="g-term" label={tr("Term")} required error={errors["g-term"]}>{(a) => <input {...a} value={term} onChange={(e) => setTerm(e.target.value)} className={inputClass} />}</Field>
        <Field id="g-def" label={tr("Definition")} required error={errors["g-def"]}>{(a) => <textarea {...a} rows={2} value={def} onChange={(e) => setDef(e.target.value)} className={textareaClass} />}</Field>
        <Button type="submit"><Plus aria-hidden="true" className="size-5" /> {tr("Add term and link it")}</Button>
      </form>
    </div>
  );
}
