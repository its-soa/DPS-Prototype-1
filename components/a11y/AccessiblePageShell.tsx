"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Ear, HelpCircle, LogOut, Settings } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AudioGuidanceToggle } from "./AudioGuidanceToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PrototypeTools } from "./PrototypeTools";
import { useAnnouncer } from "./ScreenReaderAnnouncement";
import { SkipToContent } from "./SkipToContent";

export function AccessiblePageShell({
  children, variant = "public",
}: { children: React.ReactNode; variant?: "public" | "learner" }) {
  const { t, account, signOut } = useApp();
  const { repeatInstructions, announce } = useAnnouncer();
  const pathname = usePathname();
  const router = useRouter();

  const learnerNav = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/progress", label: t("nav.progress") },
    { href: "/exam", label: t("nav.exam") },
    { href: "/certification", label: t("nav.certification") },
    { href: "/settings", label: t("nav.settings") },
  ];
  const publicNav = [
    { href: "/", label: t("nav.about") },
    { href: "/sign-in", label: t("nav.signIn") },
    { href: "/register", label: t("nav.register") },
  ];
  const nav = variant === "learner" ? learnerNav : publicNav;

  return (
    <>
      <SkipToContent label={t("shell.skip")} />
      <header className="border-b-2 border-border-soft bg-surface">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href={variant === "learner" ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-bold">
              <Ear aria-hidden="true" className="size-7 text-primary" />
              {t("brand.name")}
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <LanguageSwitcher />
              <AudioGuidanceToggle compact />
              <Button variant="secondary" onClick={repeatInstructions}>
                <HelpCircle aria-hidden="true" className="size-5" />
                {t("shell.repeat")}
              </Button>
            </div>
          </div>
          <nav aria-label={variant === "learner" ? t("nav.main") : t("nav.public")}>
            <ul className="flex flex-wrap items-center gap-2">
              {nav.map((n) => {
                const current = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-12 items-center gap-2 rounded-lg border-2 px-4 text-base font-semibold",
                        current ? "border-primary bg-primary text-primary-foreground" : "border-border-soft bg-background hover:bg-surface-strong",
                      )}
                    >
                      {n.href === "/settings" && <Settings aria-hidden="true" className="size-5" />}
                      {n.label}
                    </Link>
                  </li>
                );
              })}
              {variant === "learner" && account && (
                <li className="ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      announce(t("nav.signedOut"));
                      router.push("/");
                    }}
                    className="inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-border bg-background px-4 text-base font-semibold hover:bg-surface-strong"
                  >
                    <LogOut aria-hidden="true" className="size-5" />
                    {t("nav.signOut")}
                    <span className="sr-only"> ({account.fullName})</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto min-h-[60vh] max-w-5xl px-4 py-8 outline-none sm:px-6">
        {children}
      </main>

      <footer className="border-t-2 border-border-soft bg-surface">
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6">
          <p className="text-base text-muted">{t("footer.text")}</p>
          <PrototypeTools />
        </div>
      </footer>
    </>
  );
}
