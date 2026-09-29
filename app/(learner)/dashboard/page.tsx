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
import { COURSES, lessonsForCourse } from "@/lib/mock-data";
import { courseLessonsDone, courseProgressPercent, courseStatus, examState, nextLesson } from "@/lib/progress";
import { useLearner } from "@/lib/store";

export default function DashboardPage() {
  const { account, data, t } = useLearner();
  const resume = nextLesson(data);
  const resumeProgress = resume ? data.lessons[resume.id] : undefined;
  const isResume = !!resume && (resumeProgress?.position ?? 0) > 0 || (resume && data.lessons[resume.id]?.completed);
  const firstCourse = COURSES[0];
  const exam = examState(data);

  return (
    <div className="space-y-10">
      <PageIntro
        title={t("dash.greeting", { name: account.fullName.split(" ")[0] })}
        instructions="This is your course overview. Your next step is first, then your three required courses, then certification."
      />

      {!data.onboardingComplete && (
        <Callout tone="warning" className="space-y-3">
          <p className="text-lg font-semibold">You have not finished your orientation yet.</p>
          <ButtonLink href="/onboarding">Continue to orientation</ButtonLink>
        </Callout>
      )}

      {resume && isResume ? (
        <ResumeLearningBanner lesson={resume} position={resumeProgress?.position ?? 0} device={resumeProgress?.device} updatedAt={resumeProgress?.updatedAt} />
      ) : (
        !data.certification && (
          <Callout tone="info" className="space-y-3" role="region" aria-labelledby="start-h">
            <h2 id="start-h" className="text-2xl">Start your first required course</h2>
            <p className="text-lg">{firstCourse.title} is where every learner begins. It has three lessons, each followed by a short practice session.</p>
            <ButtonLink href={`/courses/${firstCourse.id}`} size="lg">Open {firstCourse.title}</ButtonLink>
          </Callout>
        )
      )}

      <ProgressSummary data={data} />

      <section aria-labelledby="sequence-h" className="space-y-4">
        <h2 id="sequence-h" className="text-2xl">{t("dash.sequence")}</h2>
        <p className="text-base text-muted">Complete the courses in order. Each course unlocks when the one before it is finished.</p>
        <ol className="space-y-4">
          {COURSES.map((c) => (
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
        <h2 id="cert-h" className="text-2xl">Certification</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CertificationStatusCard data={data} headingLevel="h3" />
          <RecertificationReminderCard data={data} headingLevel="h3" />
        </div>
        {exam === "locked" && <p className="text-base text-muted">The certification exam unlocks when all three courses are complete.</p>}
      </section>

      <section aria-labelledby="quick-h" className="space-y-4">
        <h2 id="quick-h" className="text-2xl">{t("dash.quick")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li><Link href="/settings" className={buttonVariants({ variant: "secondary", className: "w-full !justify-start" })}><Settings aria-hidden="true" className="size-5" /> Open accessibility settings</Link></li>
          <li><Link href="/progress" className={buttonVariants({ variant: "secondary", className: "w-full !justify-start" })}><TrendingUp aria-hidden="true" className="size-5" /> View my progress</Link></li>
          <li><Link href="/onboarding" className={buttonVariants({ variant: "secondary", className: "w-full !justify-start" })}><RotateCcw aria-hidden="true" className="size-5" /> Replay orientation</Link></li>
          <li><Link href="/exam" className={buttonVariants({ variant: "secondary", className: "w-full !justify-start" })}><ClipboardCheck aria-hidden="true" className="size-5" /> Certification exam</Link></li>
        </ul>
      </section>
    </div>
  );
}
