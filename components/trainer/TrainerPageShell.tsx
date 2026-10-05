"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, BookOpen, ClipboardCheck, Ear, FolderKanban, HelpCircle, LayoutDashboard, LogOut, Award, Settings, Users, Wrench } from "lucide-react";
import { AudioGuidanceToggle } from "@/components/a11y/AudioGuidanceToggle";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncement";
import { SkipToContent } from "@/components/a11y/SkipToContent";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { signingOut } from "@/lib/trainer/session";
import { tr } from "@/lib/trainer/tr";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/trainer", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/trainer/programs", label: "Programs", Icon: FolderKanban },
  { href: "/trainer/courses", label: "Courses", Icon: BookOpen },
  { href: "/trainer/learners", label: "Learners", Icon: Users },
  { href: "/trainer/progress", label: "Cohort progress", Icon: BarChart3 },
  { href: "/trainer/exam-progress", label: "Exam progress", Icon: ClipboardCheck },
  { href: "/trainer/certifications", label: "Certifications", Icon: Award },
  { href: "/trainer/reports", label: "Reports", Icon: BarChart3 },
];

/** Trainer pages are English-only for now: tell the browser and screen readers, so the voice matches. */
function useEnglishOnly() {
  const { state } = useApp();
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.forceLang = "en";
    el.lang = "en";
    return () => { delete el.dataset.forceLang; el.lang = state.language; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function TrainerPageShell({
  children, variant = "workspace", onReset,
}: { children: React.ReactNode; variant?: "workspace" | "public"; onReset?: () => void }) {
  const { account, signOut, resetDemo } = useApp();
  const { repeatInstructions, announce } = useAnnouncer();
  const pathname = usePathname();
  const router = useRouter();
  useEnglishOnly();

  const publicNav = [
    { href: "/for-trainers", label: "About the trainer area", exact: true },
    { href: "/for-trainers/sign-in", label: "Sign in" },
    { href: "/for-trainers/register", label: "Register as trainer" },
    { href: "/", label: "Go to the learner area" },
  ];

  return (
    <>
      <SkipToContent label={tr("Skip to main content")} />
      <header className="border-b-2 border-border-soft bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href={variant === "workspace" ? "/trainer" : "/for-trainers"} className="flex items-center gap-2 text-xl font-bold">
            <Ear aria-hidden="true" className="size-7 text-primary" />
            {tr("MTU Training Platform")} <span className="font-normal text-muted">{tr("Trainer area")}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <AudioGuidanceToggle compact />
            <Button variant="secondary" onClick={repeatInstructions}><HelpCircle aria-hidden="true" className="size-5" /> {tr("Repeat page instructions")}</Button>
          </div>
        </div>
        {variant === "public" && (
          <nav aria-label={tr("Trainer public pages")} className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
            <ul className="flex flex-wrap gap-2">
              {publicNav.map((n) => {
                const current = n.exact ? pathname === n.href : pathname.startsWith(n.href) && n.href !== "/";
                return (
                  <li key={n.href}>
                    <Link href={n.href} aria-current={current ? "page" : undefined}
                      className={cn("inline-flex min-h-12 items-center rounded-lg border-2 px-4 text-base font-semibold", current ? "border-primary bg-primary text-primary-foreground" : "border-border-soft bg-background hover:bg-surface-strong")}>
                      {tr(n.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      <div className={cn("mx-auto max-w-6xl px-4 py-6 sm:px-6", variant === "workspace" && "lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-8")}>
        {variant === "workspace" && (
          <nav aria-label={tr("Trainer workspace")} className="mb-6 lg:sticky lg:top-4 lg:mb-0 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {NAV.map(({ href, label, Icon, exact }) => {
                const current = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} aria-current={current ? "page" : undefined}
                      className={cn("flex min-h-12 items-center gap-2 rounded-lg border-2 px-4 text-base font-semibold", current ? "border-primary bg-primary text-primary-foreground" : "border-border-soft bg-background hover:bg-surface-strong")}>
                      <Icon aria-hidden="true" className="size-5 shrink-0" /> {tr(label)}
                    </Link>
                  </li>
                );
              })}
              <li className="lg:mt-4">
                <Link href="/trainer/settings" aria-current={pathname.startsWith("/trainer/settings") ? "page" : undefined}
                  className={cn("flex min-h-12 items-center gap-2 rounded-lg border-2 px-4 text-base font-semibold", pathname.startsWith("/trainer/settings") ? "border-primary bg-primary text-primary-foreground" : "border-border-soft bg-background hover:bg-surface-strong")}>
                  <Settings aria-hidden="true" className="size-5" /> {tr("Accessibility settings")}
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => { signingOut.active = true; signOut(); announce(tr("You have signed out.")); router.push("/for-trainers"); setTimeout(() => { signingOut.active = false; }, 1500); }}
                  className="flex min-h-12 w-full items-center gap-2 rounded-lg border-2 border-border bg-background px-4 text-base font-semibold hover:bg-surface-strong">
                  <LogOut aria-hidden="true" className="size-5" /> {tr("Sign out")}<span className="sr-only"> ({account?.fullName})</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
        <main id="main-content" tabIndex={-1} className="min-h-[60vh] min-w-0 outline-none">{children}</main>
      </div>

      <footer className="border-t-2 border-border-soft bg-surface">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 sm:px-6">
          <p className="text-base text-muted">{tr("Closed training platform for medical tactile examiners. Trainer area prototype with sample data. Nothing is sent to anyone.")}</p>
          <details className="rounded-xl border-2 border-dashed border-border p-4">
            <summary className="flex min-h-12 cursor-pointer items-center gap-2 text-base font-semibold"><Wrench aria-hidden="true" className="size-5" /> {tr("Prototype tools (for reviewers only)")}</summary>
            <div className="mt-3 flex flex-wrap gap-3">
              {onReset && (
                <Button variant="secondary" onClick={() => { if (window.confirm(tr("Reset all trainer demo data on this device?"))) { onReset(); announce(tr("Trainer demo data reset.")); router.push("/trainer"); } }}>
                  {tr("Reset trainer demo data")}
                </Button>
              )}
              <Button variant="secondary" onClick={() => { if (window.confirm(tr("Reset ALL demo data (learner and trainer) and return to the start?"))) { resetDemo(); try { window.localStorage.removeItem("mtu-trainer-v1"); } catch { /* ignore */ } router.push("/for-trainers"); } }}>
                {tr("Reset everything")}
              </Button>
            </div>
          </details>
        </div>
      </footer>
    </>
  );
}
