"use client";

import { Accessibility, Globe2, Lock, ShieldCheck, Smartphone, Target, UserCheck } from "lucide-react";
import { PageIntro } from "@/components/a11y/PageIntro";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";

export default function InfoPage() {
  const { t } = useApp();
  const sections = [
    { id: "purpose", label: t("info.purpose.h") },
    { id: "accessibility", label: t("info.access.h") },
    { id: "why", label: t("info.why.h") },
    { id: "requirements", label: t("info.req.h") },
    { id: "devices", label: t("info.devices.h") },
    { id: "languages", label: t("info.lang.h") },
    { id: "security", label: t("info.sec.h") },
  ];
  return (
    <>
      <PageIntro title={t("info.title")} instructions={t("info.lead")} />
      <div className="mb-10 flex flex-wrap gap-3">
        <ButtonLink href="/register" size="lg">{t("info.cta.register")}</ButtonLink>
        <ButtonLink href="/sign-in" size="lg" variant="secondary">{t("info.cta.signIn")}</ButtonLink>
      </div>

      <nav aria-label={t("info.onThisPage")} className="mb-10">
        <h2 className="mb-3 text-xl">{t("info.onThisPage")}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex min-h-12 items-center rounded-lg border-2 border-border-soft bg-surface px-4 text-base font-semibold underline underline-offset-4 hover:bg-surface-strong">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        <section id="purpose" aria-labelledby="purpose-h" className="scroll-mt-6 space-y-3">
          <h2 id="purpose-h" className="flex items-center gap-2 text-2xl"><Target aria-hidden="true" className="size-6 text-primary" /> {t("info.purpose.h")}</h2>
          <p className="max-w-prose text-lg">{t("info.purpose.body")}</p>
        </section>

        <section id="accessibility" aria-labelledby="accessibility-h" className="scroll-mt-6">
          <Card className="space-y-4 border-primary bg-primary-soft">
            <h2 id="accessibility-h" className="flex items-center gap-2 text-2xl"><Accessibility aria-hidden="true" className="size-6" /> {t("info.access.h")}</h2>
            <p className="max-w-prose text-lg">{t("info.access.lead")}</p>
            <ul className="list-disc space-y-1.5 pl-6 text-lg">
              <li>{t("info.access.1")}</li>
              <li>{t("info.access.2")}</li>
              <li>{t("info.access.3")}</li>
              <li>{t("info.access.4")}</li>
              <li>{t("info.access.5")}</li>
              <li>{t("info.access.6")}</li>
              <li>{t("info.access.7")}</li>
            </ul>
          </Card>
        </section>

        <section id="why" aria-labelledby="why-h" className="scroll-mt-6 space-y-3">
          <h2 id="why-h" className="flex items-center gap-2 text-2xl"><ShieldCheck aria-hidden="true" className="size-6 text-primary" /> {t("info.why.h")}</h2>
          <p className="max-w-prose text-lg">{t("info.why.body")}</p>
        </section>

        <section id="requirements" aria-labelledby="req-h" className="scroll-mt-6 space-y-3">
          <h2 id="req-h" className="flex items-center gap-2 text-2xl"><UserCheck aria-hidden="true" className="size-6 text-primary" /> {t("info.req.h")}</h2>
          <ul className="list-disc space-y-1.5 pl-6 text-lg">
            <li>{t("info.req.1")}</li>
            <li>{t("info.req.2")}</li>
            <li>{t("info.req.3")}</li>
          </ul>
        </section>

        <section id="devices" aria-labelledby="dev-h" className="scroll-mt-6 space-y-3">
          <h2 id="dev-h" className="flex items-center gap-2 text-2xl"><Smartphone aria-hidden="true" className="size-6 text-primary" /> {t("info.devices.h")}</h2>
          <p className="max-w-prose text-lg">{t("info.devices.body")}</p>
        </section>

        <section id="languages" aria-labelledby="lang-h" className="scroll-mt-6 space-y-3">
          <h2 id="lang-h" className="flex items-center gap-2 text-2xl"><Globe2 aria-hidden="true" className="size-6 text-primary" /> {t("info.lang.h")}</h2>
          <p className="max-w-prose text-lg">{t("info.lang.body")}</p>
        </section>

        <section id="security" aria-labelledby="sec-h" className="scroll-mt-6 space-y-3">
          <h2 id="sec-h" className="flex items-center gap-2 text-2xl"><Lock aria-hidden="true" className="size-6 text-primary" /> {t("info.sec.h")}</h2>
          <p className="max-w-prose text-lg">{t("info.sec.body")}</p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t-2 border-border-soft pt-8">
        <ButtonLink href="/register" size="lg">{t("info.cta.register")}</ButtonLink>
        <ButtonLink href="/sign-in" size="lg" variant="secondary">{t("info.cta.signIn")}</ButtonLink>
      </div>
    </>
  );
}
