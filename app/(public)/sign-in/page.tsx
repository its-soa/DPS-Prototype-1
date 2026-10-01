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
    if (!email.trim()) fe.email = t("reg.err.emailMissing");
    if (!password) fe.password = t("signin.err.password");
    setFieldErr(fe);
    setError(undefined);
    if (fe.email || fe.password) {
      announce(t("signin.err.both"), { assertive: true });
      (fe.email ? emailRef : passRef).current?.focus();
      return;
    }
    setBusy(true);
    announce(t("signin.wait"));
    const res = await signIn(email, password, device);
    if (!res.ok) {
      setBusy(false);
      setError(t(res.error));
      announce(t(res.error), { assertive: true });
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    announce(res.firstLogin ? t("signin.okFirst") : t("signin.okReturning"));
    router.push(res.firstLogin ? "/onboarding" : "/dashboard");
  }

  function fill(email: string) {
    emailRef.current!.value = email;
    passRef.current!.value = "Learner#2026";
    announce(t("signin.filled"));
    passRef.current!.focus();
  }

  return (
    <>
      <PageIntro title={t("signin.title")} instructions={t("signin.instructions")} />
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label={t("signin.title")}>
          {error && (
            <div ref={errorRef} tabIndex={-1} className="rounded-xl border-4 border-danger bg-danger-soft p-4 font-semibold text-danger">
              <span className="sr-only">{t("common.error")} </span>{error}
            </div>
          )}
          <Field id="email" label={t("reg.email")} required error={fieldErr.email}>
            {(a) => <input {...a} ref={emailRef} type="email" autoComplete="username" className={inputClass} />}
          </Field>
          <Field id="password" label={t("signin.password")} required error={fieldErr.password}>
            {(a) => <input {...a} ref={passRef} type="password" autoComplete="current-password" className={inputClass} />}
          </Field>
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
              {busy ? t("signin.busy") : t("signin.submit")}
            </Button>
            <Button variant="ghost" onClick={() => setForgot((v) => !v)} aria-expanded={forgot} aria-controls="forgot-panel">
              {t("signin.forgot")}
            </Button>
          </div>
          {forgot && (
            <Callout tone="info" id="forgot-panel">
              <p className="text-base">{t("signin.forgotInfo")}</p>
            </Callout>
          )}
          <Link href="/" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">{t("signin.backInfo")}</Link>
        </form>

        <Card className="space-y-4 self-start">
          <h2 className="text-xl">{t("signin.demo.h")}</h2>
          <p className="text-base text-muted">{t("signin.demo.intro")} <code className="font-mono font-bold">Learner#2026</code></p>
          <ul className="space-y-3">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.id}>
                <Button variant="secondary" className="w-full !justify-start text-left" onClick={() => fill(a.email)}>
                  <span>
                    <span className="block">{a.id === "user-new" ? t("signin.demo.new") : t("signin.demo.returning")}</span>
                    <span className="block text-sm font-normal text-muted">{a.email}</span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 border-t-2 border-border-soft pt-4">
            <label htmlFor="device" className="block text-base font-semibold">{t("signin.device")}</label>
            <p id="device-desc" className="text-sm text-muted">{t("signin.deviceHint")}</p>
            <select id="device" aria-describedby="device-desc" value={device} onChange={(e) => setDevice(e.target.value)} className={inputClass}>
              <option value={DEVICES.home}>{t("device.home")}</option>
              <option value={DEVICES.clinic}>{t("device.clinic")}</option>
            </select>
          </div>
        </Card>
      </div>
    </>
  );
}
