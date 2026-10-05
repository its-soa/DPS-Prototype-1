"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, LockOpen, ListChecks } from "lucide-react";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, textareaClass } from "@/components/ui/field";
import { useTrainer } from "@/lib/trainer/store";
import { plural, tr } from "@/lib/trainer/tr";
import type { TLearner } from "@/lib/trainer/types";
import { useReduceMotion } from "@/lib/use-motion";
import { formatDate } from "@/lib/utils";

/** Assign remediation material, then unlock the retry. Two clear steps, both announced. */
export function RemediationAssignmentPanel({ learner, suggested }: { learner: TLearner; suggested: string[] }) {
  const { state, actions } = useTrainer();
  const { announce } = useAnnouncer();
  const reduce = useReduceMotion();
  const first = learner.fullName.split(" ")[0];
  const [selected, setSelected] = useState<string[]>(learner.remediation?.lessonIds ?? suggested);
  const [note, setNote] = useState(learner.remediation?.note ?? "");
  const [error, setError] = useState<string>();
  const r = learner.remediation;
  const lessons = state.lessons.filter((l) => l.status !== "archived" && l.status !== "draft");

  function assign() {
    if (!selected.length) { setError(tr("Choose at least one lesson to assign.")); announce(tr("Choose at least one lesson to assign."), { assertive: true }); document.getElementById("rem-lesson-0")?.focus(); return; }
    setError(undefined);
    actions.assignRemediation(learner.id, selected, note.trim());
    announce(tr("Remediation assigned to {name}: {n} {w}.", { name: learner.fullName, n: selected.length, w: plural(selected.length, "lesson", "lessons") }));
  }
  function unlock() {
    actions.unlockRetry(learner.id);
    announce(tr("Retry unlocked for {name}.", { name: learner.fullName }));
  }

  return (
    <section aria-labelledby="rem-h" className="space-y-4">
      <h2 id="rem-h" className="text-2xl">{tr("Remediation and retry")}</h2>
      <Card className="space-y-4">
        <fieldset className="space-y-2" disabled={r?.retryUnlocked}>
          <legend className="text-xl font-bold">1. {tr("Choose remediation material")}</legend>
          <p className="text-sm text-muted">{tr("Lessons linked to the questions {name} missed are already selected.", { name: first })}</p>
          {lessons.map((l, i) => (
            <label key={l.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-border-soft bg-background px-4 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary-soft">
              <input id={`rem-lesson-${i}`} type="checkbox" checked={selected.includes(l.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, l.id] : selected.filter((x) => x !== l.id))} />
              <span>{l.title}{suggested.includes(l.id) && <span className="text-muted"> ({tr("linked to a missed question")})</span>}</span>
            </label>
          ))}
          {error && <p className="font-semibold text-danger"><span aria-hidden="true">⚠ </span><span className="sr-only">{tr("Error:")} </span>{error}</p>}
          <Field id="rem-note" label={tr("Note for {name} (optional)", { name: first })}>{(a) => <textarea {...a} rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={textareaClass} />}</Field>
          <Button onClick={assign}><ListChecks aria-hidden="true" className="size-5" /> {r ? tr("Update remediation") : tr("Assign remediation")}</Button>
        </fieldset>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-xl font-bold">2. {tr("Unlock the retry")}</h3>
        {!r && <p className="text-muted">{tr("Assign remediation first. Then you can unlock the retry.")}</p>}
        {r && !r.retryUnlocked && (
          <>
            <p>{tr("Remediation assigned on {date}. {name} can retry once you unlock it.", { date: formatDate(r.assignedAt, "en-GB"), name: first })}</p>
            <Button size="lg" onClick={unlock}><LockOpen aria-hidden="true" className="size-5" /> {tr("Unlock retry")}</Button>
          </>
        )}
      </Card>

      {r?.retryUnlocked && (
        <motion.div initial={reduce ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} data-testid="retry-confirmation">
          <Callout tone="success" role="status" className="space-y-2">
            <p className="flex items-center gap-2 text-xl font-bold text-success"><CheckCircle2 aria-hidden="true" /> {tr("Remediation assigned and retry unlocked")}</p>
            <ul className="list-disc pl-6">
              <li>{tr("Assigned: {titles}", { titles: r.lessonIds.map((id) => state.lessons.find((l) => l.id === id)?.title).filter(Boolean).join("; ") })}</li>
              <li>{tr("Retry unlocked on {date}.", { date: formatDate(r.retryUnlockedAt, "en-GB") })}</li>
            </ul>
          </Callout>
        </motion.div>
      )}
    </section>
  );
}
