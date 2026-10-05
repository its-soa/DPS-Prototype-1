"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Breadcrumbs } from "@/components/trainer/Breadcrumbs";
import { failForm } from "@/components/trainer/form-utils";
import { MoveButtons } from "@/components/trainer/MoveButtons";
import { EntityStatus } from "@/components/trainer/StatusPill";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { coursesOf } from "@/lib/trainer/selectors";
import { useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

export default function LearningPathPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const path = state.paths.find((p) => p.id === pathId && p.status !== "archived");
  const [title, setTitle] = useState(path?.title ?? "");
  const [pick, setPick] = useState("");
  const [pos, setPos] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedOk, setSavedOk] = useState(false);
  if (!path) return <><PageIntro title={tr("Learning path not found")} /><ButtonLink href="/trainer/programs">{tr("Back to programs")}</ButtonLink></>;
  const program = state.programs.find((p) => p.id === path.programId);
  const items = [...path.items].sort((a, b) => a.position - b.position);
  const nameOf = (it: (typeof items)[number]) => it.type === "course" ? state.courses.find((c) => c.id === it.refId)?.title ?? "" : state.exams.find((e) => e.id === it.refId)?.title ?? "";
  const courseOptions = coursesOf(state, path.programId).filter((c) => !items.some((i) => i.type === "course" && i.refId === c.id));
  const examOptions = state.exams.filter((e) => e.programId === path.programId && e.status === "active" && !items.some((i) => i.type === "exam"));
  const options = [...courseOptions.map((c) => ({ value: `course:${c.id}`, label: `${tr("Course")}: ${c.title}` })), ...examOptions.map((e) => ({ value: `exam:${e.id}`, label: `${tr("Final exam")}: ${e.title}` }))];

  function add() {
    if (!pick) { setErrors({ "path-add": tr("Choose a course or the final exam to add.") }); announce(tr("Choose a course or the final exam to add."), { assertive: true }); document.getElementById("path-add")?.focus(); return; }
    setErrors({}); setSavedOk(false);
    const [type, ref] = pick.split(":");
    actions.addPathItem(path!.id, type as "course" | "exam", ref);
    announce(tr("Added to position {n}.", { n: items.length + 1 }));
    setPick("");
  }
  function save() {
    const err: Record<string, string> = {};
    if (!title.trim()) err["path-title"] = tr("Enter a learning path title.");
    else if (!items.length) err["path-add"] = tr("Add at least one course before saving.");
    setErrors(err);
    if (failForm(err, ["path-title", "path-add"], announce)) return;
    if (title.trim() !== path!.title) actions.updatePathTitle(path!.id, title.trim());
    actions.savePath(path!.id);
    setSavedOk(true);
    announce(tr("Learning path saved. It is now ready to assign to learners."));
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: tr("Programs"), href: "/trainer/programs" }, { label: program?.title ?? "", href: program ? `/trainer/programs/${program.id}` : undefined }, { label: path.title }]} />
      <PageIntro title={path.title} eyebrow={tr("Learning path")} instructions={tr("Choose the courses and the exam, set their order with the Move buttons or a position number, and decide what stays locked until the previous item is complete.")} />
      <EntityStatus status={path.status} />
      <Card>
        <Field id="path-title" label={tr("Learning path title")} required error={errors["path-title"]}>{(a) => <input {...a} value={title} onChange={(e) => { setTitle(e.target.value); setSavedOk(false); }} className={inputClass} />}</Field>
      </Card>

      <section aria-labelledby="items-h" className="space-y-3">
        <h2 id="items-h" className="text-2xl">{tr("Sequence")} ({items.length})</h2>
        {items.length === 0 && <p className="text-muted">{tr("Nothing in this path yet. Add a course below.")}</p>}
        <ol className="space-y-3">
          {items.map((it, i) => (
            <li key={it.id} className="space-y-3 rounded-xl border-2 border-border-soft bg-surface p-4">
              <p className="text-lg font-bold">{tr("Position {n}", { n: it.position })}: {nameOf(it)} <span className="font-normal text-muted">({it.type === "exam" ? tr("final exam") : tr("course")})</span></p>
              <div className="flex flex-wrap items-end gap-4">
                <MoveButtons label={nameOf(it)} index={i} count={items.length} onMove={(d) => { actions.movePathItem(path.id, it.id, d); setSavedOk(false); announce(tr("{name} moved to position {n}.", { name: nameOf(it), n: it.position + d })); }} />
                <div className="flex items-end gap-2">
                  <Field id={`pos-${it.id}`} label={tr("Position number for {name}", { name: nameOf(it) })}>{(a) => <input {...a} inputMode="numeric" className={`${inputClass} !w-24`} value={pos[it.id] ?? ""} placeholder={String(it.position)} onChange={(e) => setPos({ ...pos, [it.id]: e.target.value })} />}</Field>
                  <Button variant="secondary" onClick={() => {
                    const n = Number(pos[it.id]);
                    if (!Number.isFinite(n) || n < 1) { announce(tr("Enter a position number from 1 to {max}.", { max: items.length }), { assertive: true }); return; }
                    actions.setPathPosition(path.id, it.id, n); setPos({ ...pos, [it.id]: "" }); setSavedOk(false);
                    announce(tr("{name} is now at position {n}.", { name: nameOf(it), n: Math.min(Math.max(Math.round(n), 1), items.length) }));
                  }}>{tr("Set position")}</Button>
                </div>
              </div>
              <label className="flex min-h-12 cursor-pointer items-center gap-3">
                <input type="checkbox" checked={it.locked} disabled={i === 0} aria-describedby={`lock-${it.id}`}
                  onChange={(e) => { actions.setPathLock(path.id, it.id, e.target.checked); setSavedOk(false); announce(e.target.checked ? tr("{name} is locked until the previous item is complete.", { name: nameOf(it) }) : tr("{name} is unlocked.", { name: nameOf(it) })); }} />
                <span><span className="font-semibold">{tr("Locked until the previous item is complete")}</span><span id={`lock-${it.id}`} className="block text-sm text-muted">{i === 0 ? tr("The first item is always open.") : tr("Learners cannot open this until they finish the item before it.")}</span></span>
              </label>
              <Button variant="ghost" onClick={() => { actions.removePathItem(path.id, it.id); setSavedOk(false); announce(tr("{name} removed from the path.", { name: nameOf(it) })); }}>{tr("Remove from path")}<span className="sr-only"> {nameOf(it)}</span></Button>
            </li>
          ))}
        </ol>
      </section>

      <Card className="space-y-4">
        <h2 className="text-2xl">{tr("Add to the path")}</h2>
        {options.length ? (
          <>
            <Field id="path-add" label={tr("Course or final exam")} error={errors["path-add"]}>{(a) => (
              <select {...a} value={pick} onChange={(e) => setPick(e.target.value)} className={inputClass}>
                <option value="">{tr("Choose an item")}</option>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>)}</Field>
            <Button variant="secondary" onClick={add}><Plus aria-hidden="true" className="size-5" /> {tr("Add to path")}</Button>
          </>
        ) : <p className="text-muted">{tr("All available courses and the exam are already in this path. An exam appears here once it is saved as active.")}</p>}
      </Card>

      <div className="space-y-3">
        <Button size="lg" onClick={save}><Save aria-hidden="true" className="size-5" /> {tr("Save learning path")}</Button>
        {savedOk && <Callout tone="success" role="status"><p className="font-bold">{tr("Learning path saved")}</p><p>{tr("It can now be assigned to learners from their profile.")}</p></Callout>}
      </div>
    </div>
  );
}
