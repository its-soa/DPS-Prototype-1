"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { useApp } from "@/lib/store";
import { validatePassword } from "@/lib/validation";

type Errors = Partial<Record<"fullName" | "email" | "password" | "code" | "consent", string>>;

export default function RegisterPage() {
  const { validateAccessCode, register, emailExists, t } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const fullName = String(f.get("fullName") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const code = String(f.get("code") ?? "").trim();
    const consent = f.get("consent") === "on";

    const next: Errors = {};
    if (!fullName) next.fullName = t("reg.err.name");
    if (!email) next.email = t("reg.err.emailMissing");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t("reg.err.emailFormat");
    else if (emailExists(email)) next.email = t("reg.err.emailExists");
    const missing = validatePassword(password);
    if (!password) next.password = t("reg.err.passwordMissing");
    else if (missing.length) next.password = t("reg.err.passwordRules", { missing: missing.map((m) => t(m)).join(", ") });
    if (!code) next.code = t("reg.err.codeMissing");
    else {
      const r = validateAccessCode(code);
      if (r === "unknown") next.code = t("reg.err.codeUnknown");
      if (r === "expired") next.code = t("reg.err.codeExpired");
      if (r === "used") next.code = t("reg.err.codeUsed");
    }
    if (!consent) next.consent = t("reg.err.consent");

    setErrors(next);
    const keys = Object.keys(next);
    if (keys.length) {
      announce(t("reg.err.announce", { count: keys.length }), { assertive: true });
      // wait for the summary to render, then move focus to it
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    register({ fullName, email, password, code });
    announce(t("reg.doneMessage"));
    router.push("/register/success");
  }

  const order: (keyof Errors)[] = ["fullName", "email", "password", "code", "consent"];
  const ids: Record<keyof Errors, string> = { fullName: "fullName", email: "email", password: "password", code: "code", consent: "consent" };
  const errorList = order.filter((k) => errors[k]);

  return (
    <>
      <PageIntro
        title={t("reg.title")}
        instructions={t("reg.instructions")}
      />
      <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-xl space-y-6" aria-label={t("reg.formLabel")}>
        {errorList.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border-4 border-danger bg-danger-soft p-4">
            <h2 className="text-xl text-danger">{t("reg.summary", { count: errorList.length })}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {errorList.map((k) => (
                <li key={k}><a href={`#${ids[k]}`} className="font-semibold underline">{errors[k]}</a></li>
              ))}
            </ul>
          </div>
        )}

        <Field id="fullName" label={t("reg.name")} required error={errors.fullName}>
          {(a) => <input {...a} name="fullName" type="text" autoComplete="name" className={inputClass} />}
        </Field>
        <Field id="email" label={t("reg.email")} required error={errors.email} description={t("reg.emailHint")}>
          {(a) => <input {...a} name="email" type="email" autoComplete="email" className={inputClass} />}
        </Field>
        <Field
          id="password" label={t("reg.password")} required error={errors.password}
          description={t("reg.passwordHint")}
        >
          {(a) => <input {...a} name="password" type="password" autoComplete="new-password" className={inputClass} />}
        </Field>
        <Field
          id="code" label={t("reg.code")} required error={errors.code}
          description={t("reg.codeHint")}
        >
          {(a) => <input {...a} name="code" type="text" autoComplete="off" autoCapitalize="characters" className={inputClass} />}
        </Field>

        <div className="space-y-1.5">
          <label className="flex min-h-12 cursor-pointer items-start gap-3">
            <input
              id="consent" name="consent" type="checkbox"
              aria-required="true"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "consent-err" : undefined}
              className="mt-1"
            />
            <span className="text-base">{t("reg.consent")}</span>
          </label>
          {errors.consent && (
            <p id="consent-err" className="flex gap-2 font-semibold text-danger"><span aria-hidden="true">⚠</span><span><span className="sr-only">{t("common.error")} </span>{errors.consent}</span></p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
            {busy ? t("reg.creating") : t("reg.submit")}
          </Button>
          <Link href="/" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{t("reg.backInfo")}</Link>
        </div>
        <Callout tone="info">
          <p className="text-base">{t("reg.already")} <Link href="/sign-in" className="font-semibold underline">{t("reg.goSignIn")}</Link></p>
        </Callout>
      </form>
    </>
  );
}
