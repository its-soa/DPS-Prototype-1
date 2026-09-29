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
  const { validateAccessCode, register, emailExists } = useApp();
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
    if (!fullName) next.fullName = "Enter your full name.";
    if (!email) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter an email address in the form name@example.org.";
    else if (emailExists(email)) next.email = "An account with this email already exists. Try signing in instead.";
    const missing = validatePassword(password);
    if (!password) next.password = "Create a password.";
    else if (missing.length) next.password = `Your password needs ${missing.join(", ")}.`;
    if (!code) next.code = "Enter the access code from your training centre.";
    else {
      const r = validateAccessCode(code);
      if (r === "unknown") next.code = "We do not recognise this access code. Check it and try again. The demo code is MTU-2026-DEMO.";
      if (r === "expired") next.code = "This access code has expired. Ask your training centre for a new one.";
      if (r === "used") next.code = "This access code has already been used.";
    }
    if (!consent) next.consent = "Please agree to the terms to create your account.";

    setErrors(next);
    const keys = Object.keys(next);
    if (keys.length) {
      announce(`Your registration has ${keys.length} ${keys.length === 1 ? "problem" : "problems"}. Please review the list at the top of the page.`, { assertive: true });
      // wait for the summary to render, then move focus to it
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    register({ fullName, email, password, code });
    announce("Registration complete. Your account has been created.");
    router.push("/register/success");
  }

  const order: (keyof Errors)[] = ["fullName", "email", "password", "code", "consent"];
  const ids: Record<keyof Errors, string> = { fullName: "fullName", email: "email", password: "password", code: "code", consent: "consent" };
  const errorList = order.filter((k) => errors[k]);

  return (
    <>
      <PageIntro
        title="Register with your access code"
        instructions="Fill in the five items below and choose Create account. Your access code comes from your training centre."
      />
      <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-xl space-y-6" aria-label="Registration">
        {errorList.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border-4 border-danger bg-danger-soft p-4">
            <h2 className="text-xl text-danger">There {errorList.length === 1 ? "is 1 problem" : `are ${errorList.length} problems`} with your registration</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {errorList.map((k) => (
                <li key={k}><a href={`#${ids[k]}`} className="font-semibold underline">{errors[k]}</a></li>
              ))}
            </ul>
          </div>
        )}

        <Field id="fullName" label="Full name" required error={errors.fullName}>
          {(a) => <input {...a} name="fullName" type="text" autoComplete="name" className={inputClass} />}
        </Field>
        <Field id="email" label="Email address" required error={errors.email} description="We use this to sign you in.">
          {(a) => <input {...a} name="email" type="email" autoComplete="email" className={inputClass} />}
        </Field>
        <Field
          id="password" label="Password" required error={errors.password}
          description="Use at least 10 characters, with upper and lower case letters and at least one number."
        >
          {(a) => <input {...a} name="password" type="password" autoComplete="new-password" className={inputClass} />}
        </Field>
        <Field
          id="code" label="Access or invitation code" required error={errors.code}
          description="For this prototype, use MTU-2026-DEMO."
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
            <span className="text-base">I agree that my training progress and results are stored on this closed platform and visible to my training centre.</span>
          </label>
          {errors.consent && (
            <p id="consent-err" className="flex gap-2 font-semibold text-danger"><span aria-hidden="true">⚠</span><span><span className="sr-only">Error: </span>{errors.consent}</span></p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={busy} aria-busy={busy}>
            {busy ? "Creating your account…" : "Create account"}
          </Button>
          <Link href="/" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">Back to information page</Link>
        </div>
        <Callout tone="info">
          <p className="text-base">Already registered? <Link href="/sign-in" className="font-semibold underline">Go to sign in</Link>.</p>
        </Callout>
      </form>
    </>
  );
}
