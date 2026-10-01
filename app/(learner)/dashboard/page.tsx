"use client";

import Link from "next/link";
import { ClipboardCheck, RotateCcw, Settings, TrendingUp } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { CertificationStatusCard } from "@/components/cert/CertificationStatusCard";
import { RecertificationReminderCard } from "@/components/cert/RecertificationReminderCard";
import { CourseSequenceCard } from "@/components/learning/CourseSequenceCard";
import { ProgressSummary } from "@/components/learning/ProgressSummary";
import { ResumeLearningBanner } from "@/components/learning/ResumeLearningBanner";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { useCatalog } from "@/lib/catalog";
import { courseLessonsDone, courseProgressPercent, courseStatus, examState, nextLesson } from "@/lib/progress";
import { useLearner } from "@/lib/store";

export default function DashboardPage() {
  const { account, data, t } = useLearner();
  const { courses, lessonById, lessonsForCourse } = useCatalog();
  const next = nextLesson(data);
  const resume = next ? lessonById(next.id) : undefined;
  const resumeProgress = resume ? data.lessons[resume.id] : undefined;
  const isResume = !!resume && ((resumeProgress?.position ?? 0) > 0 || resumeProgress?.completed);
  const firstCourse = courses[0];
  const exam = examState(data);
  const quick = "w-full !justify-start";

  return (
    <div className="space-y-10">
      <PageIntro
        title={t("dash.greeting", { name: account.fullName.split(" ")[0] })}
        instructions={t("dash.instructions")}
      />

      {!data.onboardingComplete && (
        <Callout tone="warning" className="space-y-3">
          <p className="text-lg font-semibold">{t("dash.onboardingPending")}</p>
          <ButtonLink href="/onboarding">{t("dash.onboardingCta")}</ButtonLink>
        </Callout>
      )}

      {resume && isResume ? (
        <ResumeLearningBanner lesson={resume} position={resumeProgress?.position ?? 0} device={resumeProgress?.device} updatedAt={resumeProgress?.updatedAt} />
      ) : (
        !data.certification && (
          <Callout tone="info" className="space-y-3" role="region" aria-labelledby="start-h">
            <h2 id="start-h" className="text-2xl">{t("dash.startFirst")}</h2>
            <p className="text-lg">{t("dash.startFirstBody", { title: firstCourse.title })}</p>
            <ButtonLink href={`/courses/${firstCourse.id}`} size="lg">{t("dash.openCourse", { title: firstCourse.title })}</ButtonLink>
          </Callout>
        )
      )}

      <ProgressSummary data={data} />

      <section aria-labelledby="sequence-h" className="space-y-4">
        <h2 id="sequence-h" className="text-2xl">{t("dash.sequence")}</h2>
        <p className="text-base text-muted">{t("dash.sequenceHint")}</p>
        <ol className="space-y-4">
          {courses.map((c) => (
            <li key={c.id}>
              <CourseSequenceCard
                course={c}
                status={courseStatus(data, c)}
                percent={courseProgressPercent(data, c.id)}
                lessonsDone={courseLessonsDone(data, c.id)}
                lessonsTotal={lessonsForCourse(c.id).length}
              />
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cert-h" className="space-y-4">
        <h2 id="cert-h" className="text-2xl">{t("nav.certification")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CertificationStatusCard data={data} headingLevel="h3" />
          <RecertificationReminderCard data={data} headingLevel="h3" />
        </div>
        {exam === "locked" && <p className="text-base text-muted">{t("dash.examLockedHint")}</p>}
      </section>

      <section aria-labelledby="quick-h" className="space-y-4">
        <h2 id="quick-h" className="text-2xl">{t("dash.quick")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li><Link href="/settings" className={buttonVariants({ variant: "secondary", className: quick })}><Settings aria-hidden="true" className="size-5" /> {t("dash.quick.settings")}</Link></li>
          <li><Link href="/progress" className={buttonVariants({ variant: "secondary", className: quick })}><TrendingUp aria-hidden="true" className="size-5" /> {t("dash.quick.progress")}</Link></li>
          <li><Link href="/onboarding" className={buttonVariants({ variant: "secondary", className: quick })}><RotateCcw aria-hidden="true" className="size-5" /> {t("settings.replay")}</Link></li>
          <li><Link href="/exam" className={buttonVariants({ variant: "secondary", className: quick })}><ClipboardCheck aria-hidden="true" className="size-5" /> {t("nav.exam")}</Link></li>
        </ul>
      </section>
    </div>
  );
}
