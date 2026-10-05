"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { tr } from "@/lib/trainer/tr";
import { failForm } from "./form-utils";

export function CourseForm({ initial, programOptions, submitLabel, onSubmit, idPrefix = "course" }: {
  initial?: { title: string; description: string; isRequired: boolean; programId?: string };
  programOptions?: { id: string; title: string }[];
  submitLabel: string; idPrefix?: string;
  onSubmit: (v: { title: string; description: string; isRequired: boolean; programId: string }) => void;
}) {
  const { announce } = useAnnouncer();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isRequired, setRequired] = useState(initial?.isRequired ?? true);
  const [programId, setProgramId] = useState(initial?.programId ?? programOptions?.[0]?.id ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const k = (s: string) => `${idPrefix}-${s}`;
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (programOptions && !programId) err[k("program")] = tr("Choose a program for this course.");
    if (!title.trim()) err[k("title")] = tr("Enter a course title.");
    if (!description.trim()) err[k("desc")] = tr("Enter a short course description.");
    setErrors(err);
    if (failForm(err, [k("program"), k("title"), k("desc")], announce)) return;
    onSubmit({ title: title.trim(), description: description.trim(), isRequired, programId });
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-label={submitLabel}>
      {programOptions && (
        <Field id={k("program")} label={tr("Program")} required error={errors[k("program")]}>
          {(a) => <select {...a} value={programId} onChange={(e) => setProgramId(e.target.value)} className={inputClass}>{programOptions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>}
        </Field>
      )}
      <Field id={k("title")} label={tr("Course title")} required error={errors[k("title")]}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
      <Field id={k("desc")} label={tr("Course description")} required error={errors[k("desc")]}>{(a) => <textarea {...a} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={textareaClass} />}</Field>
      <label className="flex min-h-12 cursor-pointer items-center gap-3">
        <input type="checkbox" checked={isRequired} onChange={(e) => setRequired(e.target.checked)} />
        <span className="text-base font-semibold">{tr("This course is required")}</span>
      </label>
      <Button type="submit" size="lg"><Save aria-hidden="true" className="size-5" /> {submitLabel}</Button>
    </form>
  );
}
