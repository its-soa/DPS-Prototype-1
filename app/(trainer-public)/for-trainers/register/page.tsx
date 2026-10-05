"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { failForm } from "@/components/trainer/form-utils";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { useApp } from "@/lib/store";
import { tr } from "@/lib/trainer/tr";
import { validatePassword } from "@/lib/validation";

export default function TrainerRegisterPage() {
  const { registerTrainer, emailExists, t } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (!v("fullName")) err.fullName = tr("Enter your full name.");
    if (!v("email")) err.email = tr("Enter your email address.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) err.email = tr("Enter an email address in the form name@example.org.");
    else if (emailExists(v("email"))) err.email = tr("An account with this email already exists. Try signing in instead.");
    const missing = validatePassword(String(f.get("password") ?? ""));
    if (!f.get("password")) err.password = tr("Create a password.");
    else if (missing.length) err.password = tr("Your password needs {missing}.", { missing: missing.map((m) => t(m)).join(", ") });
    if (!v("organization")) err.organization = tr("Enter your training organization.");
    if (v("code") && v("code").toUpperCase() !== "TRAINER-2026-DEMO") err.code = tr("We do not recognise this access code. Leave it empty, or use TRAINER-2026-DEMO.");
    setErrors(err);
    if (failForm(err, ["fullName", "email", "password", "organization", "code"], announce)) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    registerTrainer({ fullName: v("fullName"), email: v("email"), password: String(f.get("password")), organization: v("organization") });
    announce(tr("Registration complete. Your trainer account has been created."));
    router.push("/for-trainers/register/success");
  }

  return (
    <>
      <PageIntro title={tr("Register as a trainer")} instructions={tr("Fill in the form and choose Create trainer account. The access code is optional.")} />
      <form onSubmit={submit} noValidate className="max-w-xl space-y-6" aria-label={tr("Trainer registration")}>
        <Field id="fullName" label={tr("Full name")} required error={errors.fullName}>{(a) => <input {...a} name="fullName" autoComplete="name" className={inputClass} />}</Field>
        <Field id="email" label={tr("Email address")} required error={errors.email}>{(a) => <input {...a} name="email" type="email" autoComplete="email" className={inputClass} />}</Field>
        <Field id="password" label={tr("Password")} required error={errors.password} description={tr("Use at least 10 characters, with upper and lower case letters and at least one number.")}>{(a) => <input {...a} name="password" type="password" autoComplete="new-password" className={inputClass} />}</Field>
        <Field id="organization" label={tr("Training organization name")} required error={errors.organization}>{(a) => <input {...a} name="organization" autoComplete="organization" className={inputClass} />}</Field>
        <Field id="code" label={tr("Access code")} error={errors.code} description={tr("Optional. For this prototype you can use TRAINER-2026-DEMO.")}>{(a) => <input {...a} name="code" autoComplete="off" className={inputClass} />}</Field>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>{busy ? tr("Creating your account…") : tr("Create trainer account")}</Button>
          <Link href="/for-trainers" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{tr("Back to the trainer information page")}</Link>
        </div>
      </form>
    </>
  );
}
