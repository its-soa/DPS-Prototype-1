"use client";

import Link from "next/link";
import { PageIntro } from "@/components/a11y/PageIntro";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { useCatalog } from "@/lib/catalog";
import { courseLessonsDone, courseProgressPercent, courseStatus, examState, lessonStatus, nextLesson, overallPercent } from "@/lib/progress";
import { useLearner } from "@/lib/store";

export default function ProgressPage() {
  const { data, t, fmtDate } = useLearner();
  const { courses, lessonsForCourse, lessonById } = useCatalog();
  const nl = nextLesson(data);
  const next = nl ? lessonById(nl.id) : undefined;
  const exam = examState(data);
  const pct = overallPercent(data);

  let action: { label: string; href: string; text: string };
  if (data.certification) action = { label: t("prog.act.viewCert"), href: "/certification", text: t("prog.act.viewCertText") };
  else if (exam === "retry-locked") action = { label: t("prog.act.remediation"), href: "/exam/remediation", text: t("prog.act.remediationText") };
  else if (exam === "retry-ready") action = { label: t("prog.act.retry"), href: "/exam", text: t("prog.act.retryText") };
  else if (exam === "ready" || exam === "in-progress") action = { label: t("cert.card.goExam"), href: "/exam", text: t("prog.act.examText") };
  else if (next) action = { label: t("prog.act.lesson", { title: next.title }), href: `/courses/${next.courseId}/lessons/${next.id}`, text: t("prog.act.lessonText") };
  else action = { label: t("nav.dashboard"), href: "/dashboard", text: "" };

  return (
    <div className="max-w-3xl space-y-8">
      <PageIntro title={t("nav.progress")} instructions={t("prog.instructions")} />

      <Card className="space-y-3">
        <h2 className="text-2xl">{t("prog.summary")}</h2>
        <ProgressBar value={pct} label={t("prog.overallLabel", { pct })} />
        <dl className="grid gap-x-6 gap-y-1 text-lg sm:grid-cols-[max-content_1fr]">
          <dt className="font-semibold">{t("prog.overall")}</dt><dd>{t("prog.overallValue", { pct })}</dd>
          <dt className="font-semibold">{t("prog.lastActive")}</dt><dd>{data.lastActive ? fmtDate(data.lastActive) : t("prog.today")}</dd>
        </dl>
      </Card>

      <Callout tone="info" className="space-y-3" role="region" aria-labelledby="next-h">
        <h2 id="next-h" className="text-2xl">{t("prog.next")}</h2>
        {action.text && <p className="text-lg">{action.text}</p>}
        <ButtonLink href={action.href}>{action.label}</ButtonLink>
      </Callout>

      <section aria-labelledby="courses-h" className="space-y-6">
        <h2 id="courses-h" className="text-2xl">{t("prog.coursesH")}</h2>
        {courses.map((c) => (
          <Card key={c.id} className="space-y-3">
            <h3 className="text-xl">{c.order}. {c.title}</h3>
            <p className="flex flex-wrap items-center gap-3 text-base">
              <StatusBadge status={courseStatus(data, c)} />
              <span>{t("prog.courseLine", { pct: courseProgressPercent(data, c.id), done: courseLessonsDone(data, c.id), total: lessonsForCourse(c.id).length })}</span>
            </p>
            <ul className="space-y-2">
              {lessonsForCourse(c.id).map((l) => {
                const s = lessonStatus(data, l);
                return (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-border-soft pt-2">
                    {s === "locked" ? <span className="text-base">{t("lesson.n", { n: l.order })}: {l.title}</span>
                      : <Link href={`/courses/${c.id}/lessons/${l.id}`} className="text-base font-semibold underline underline-offset-4">{t("lesson.n", { n: l.order })}: {l.title}</Link>}
                    <StatusBadge status={s} />
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </section>
    </div>
  );
}
