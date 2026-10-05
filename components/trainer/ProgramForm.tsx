"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Field, inputClass, textareaClass } from "@/components/ui/field";
import { tr } from "@/lib/trainer/tr";
import { failForm } from "./form-utils";

export function ProgramForm({ initial, submitLabel, onSubmit, idPrefix = "program" }: {
  initial?: { title: string; description: string }; submitLabel: string; idPrefix?: string;
  onSubmit: (v: { title: string; description: string }) => void;
}) {
  const { announce } = useAnnouncer();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!title.trim()) err[`${idPrefix}-title`] = tr("Enter a program title.");
    if (!description.trim()) err[`${idPrefix}-desc`] = tr("Enter a short program description.");
    setErrors(err);
    if (failForm(err, [`${idPrefix}-title`, `${idPrefix}-desc`], announce)) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-label={submitLabel}>
      <Field id={`${idPrefix}-title`} label={tr("Program title")} required error={errors[`${idPrefix}-title`]}>{(a) => <input {...a} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />}</Field>
      <Field id={`${idPrefix}-desc`} label={tr("Program description")} required error={errors[`${idPrefix}-desc`]}>{(a) => <textarea {...a} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={textareaClass} />}</Field>
      <Button type="submit" size="lg"><Save aria-hidden="true" className="size-5" /> {submitLabel}</Button>
    </form>
  );
}
