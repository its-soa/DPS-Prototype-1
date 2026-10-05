"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { failForm } from "@/components/trainer/form-utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { DEMO_TRAINERS, DEVICES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { tr } from "@/lib/trainer/tr";

// Reviewer convenience: opens with the primary demo trainer filled in. Remove before a real launch.
const PREFILL = DEMO_TRAINERS[0];

export default function TrainerSignIn() {
  const { signIn } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const [forgot, setForgot] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailRef.current!.value, password = passRef.current!.value;
    const fe: Record<string, string> = {};
    if (!email.trim()) fe.email = tr("Enter your email address.");
    if (!password) fe.password = tr("Enter your password.");
    setFieldErr(fe); setError(undefined);
    if (failForm(fe, ["email", "password"], announce)) return;
    setBusy(true);
    announce(tr("Signing in. Please wait."));
    const res = await signIn(email, password, DEVICES.home, "trainer");
    if (!res.ok) {
      setBusy(false);
      const msg = res.error === "signin.error.wrongRole"
        ? tr("This is not a trainer account. Learners sign in on the learner sign-in page.")
        : tr("We could not sign you in with that email and password. Check both and try again.");
      setError(msg); announce(msg, { assertive: true });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    announce(res.firstLogin ? tr("Sign in successful. Starting your orientation.") : tr("Sign in successful. Opening your workspace."));
    router.push(res.firstLogin ? "/trainer/onboarding" : "/trainer");
  }

  return (
    <>
      <PageIntro title={tr("Trainer sign in")} instructions={tr("The demo trainer, Alex Meier, is already filled in. Choose Sign in to your workspace, or change the details to use another account.")} />
      <form onSubmit={submit} noValidate className="max-w-xl space-y-6" aria-label={tr("Trainer sign in")}>
        {error && <div ref={errorRef} tabIndex={-1} className="rounded-xl border-4 border-danger bg-danger-soft p-4 font-semibold text-danger"><span className="sr-only">{tr("Error:")} </span>{error}</div>}
        <Field id="email" label={tr("Email address")} required error={fieldErr.email}>{(a) => <input {...a} ref={emailRef} type="email" autoComplete="username" defaultValue={PREFILL.email} className={inputClass} />}</Field>
        <Field id="password" label={tr("Password")} required error={fieldErr.password}>{(a) => <input {...a} ref={passRef} type="password" autoComplete="current-password" defaultValue={PREFILL.password} className={inputClass} />}</Field>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>{busy ? tr("Signing you in…") : tr("Sign in to your workspace")}</Button>
          <Button variant="ghost" onClick={() => setForgot((v) => !v)} aria-expanded={forgot} aria-controls="forgot-panel">{tr("Forgot your password?")}</Button>
        </div>
        {forgot && <Callout tone="info" id="forgot-panel"><p>{tr("Password reset is not part of this prototype.")}</p></Callout>}
        <p className="space-y-1">
          <Link href="/for-trainers" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{tr("Return to the trainer information page")}</Link>
        </p>
        <p className="text-base text-muted">{tr("Demo trainers: alex.trainer@example.org (primary) and priya.trainer@example.org. Password for both: Trainer#2026")}</p>
      </form>
    </>
  );
}
