"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccessiblePageShell } from "@/components/a11y/AccessiblePageShell";
import { useApp } from "@/lib/store";

/**
 * Closed-platform guard. Prototype: checks the mock session.
 * Production: replace with Supabase session check + RLS (see /supabase/rls.sql).
 */
export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, account, data } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !account) router.replace("/sign-in");
  }, [hydrated, account, router]);

  if (!hydrated || !account || !data) {
    return (
      <AccessiblePageShell variant="public">
        <p role="status" className="text-lg">Loading your training…</p>
      </AccessiblePageShell>
    );
  }
  return <AccessiblePageShell variant="learner">{children}</AccessiblePageShell>;
}
