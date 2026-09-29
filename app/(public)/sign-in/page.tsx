"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageIntro } from "@/components/a11y/PageIntro";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { Button } from "@/components/ui/button";
import { Callout, Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { DEMO_ACCOUNTS, DEVICES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export default function SignInPage() {
  const { signIn, t } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldErr, setFieldErr] = useState<{ email?: string; password?: string }>({});
  const [device, setDevice] = useState<string>(DEVICES.home);
  const [forgot, setForgot] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current!.value;
    const password = passRef.current!.value;
    const fe: typeof fieldErr = {};
    if (!email.trim()) fe.email = "Enter your email address.";
    if (!password) fe.password = "Enter your password.";
    setFieldErr(fe);
    setError(undefined);
    if (fe.email || fe.password) {
      announce("Please complete both fields.", { assertive: true });
      (fe.email ? emailRef : passRef).current?.focus();
      return;
    }
    setBusy(true);
    announce("Signing in. Please wait.");
    const res = await signIn(email, password, device);
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      announce(res.error, { assertive: true });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    announce(res.firstLogin ? "Sign in successful. Starting your orientation." : "Sign in successful. Opening your dashboard.");
    router.push(res.firstLogin ? "/onboarding" : "/dashboard");
  }

  function fill(email: string) {
    emailRef.current!.value = email;
    passRef.current!.value = "Learner#2026";
    announce("Demo account details filled in. Choose Sign in to your training.");
    passRef.current!.focus();
  }

  return (
    <>
      <PageIntro title={t("signin.title")} instructions="Enter your email and password, then choose Sign in to your training." />
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="Sign in">
          {error && (
            <div ref={errorRef} tabIndex={-1} className="rounded-xl border-4 border-danger bg-danger-soft p-4 font-semibold text-danger">
              <span className="sr-only">Error: </span>{error}
            </div>
          )}
          <Field id="email" label="Email address" required error={fieldErr.email}>
            {(a) => <input {...a} ref={emailRef} type="email" autoComplete="username" className={inputClass} />}
          </Field>
          <Field id="password" label="Password" required error={fieldErr.password}>
            {(a) => <input {...a} ref={passRef} type="password" autoComplete="current-password" className={inputClass} />}
          </Field>
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
              {busy ? "Signing you in…" : t("signin.submit")}
            </Button>
            <Button variant="ghost" onClick={() => setForgot((v) => !v)} aria-expanded={forgot} aria-controls="forgot-panel">
              Forgot your password?
            </Button>
          </div>
          {forgot && (
            <Callout tone="info" id="forgot-panel">
              <p className="text-base">Password reset is not part of this prototype. In the full platform, we would email you a secure link, and your training centre could also help you.</p>
            </Callout>
          )}
          <Link href="/" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">Return to information page</Link>
        </form>

        <Card className="space-y-4 self-start">
          <h2 className="text-xl">Demo accounts</h2>
          <p className="text-base text-muted">For reviewers. Password for both: <code className="font-mono font-bold">Learner#2026</code></p>
          <ul className="space-y-3">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.id}>
                <Button variant="secondary" className="w-full !justify-start text-left" onClick={() => fill(a.email)}>
                  <span>
                    <span className="block">{a.id === "user-new" ? "First-time learner" : "Returning learner"}</span>
                    <span className="block text-sm font-normal text-muted">{a.email}</span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 border-t-2 border-border-soft pt-4">
            <label htmlFor="device" className="block text-base font-semibold">Signing in from</label>
            <p id="device-desc" className="text-sm text-muted">Simulates using a different device. The returning learner last worked on the iPad in Clinic Room 2.</p>
            <select id="device" aria-describedby="device-desc" value={device} onChange={(e) => setDevice(e.target.value)} className={inputClass}>
              <option value={DEVICES.home}>{DEVICES.home}</option>
              <option value={DEVICES.clinic}>{DEVICES.clinic}</option>
            </select>
          </div>
        </Card>
      </div>
    </>
  );
}
