"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrainerPageShell } from "@/components/trainer/TrainerPageShell";
import { useApp } from "@/lib/store";
import { TrainerProvider, useTrainer } from "@/lib/trainer/store";
import { tr } from "@/lib/trainer/tr";

function Frame({ children }: { children: React.ReactNode }) {
  const { actions, ready } = useTrainer();
  return (
    <TrainerPageShell onReset={actions.reset}>
      {ready ? children : <p role="status" className="text-lg">{tr("Loading your workspace…")}</p>}
    </TrainerPageShell>
  );
}

/**
 * Role guard for the whole trainer area. Prototype: checks the mock session role.
 * Production: Supabase session + RLS (see /supabase/trainer.sql).
 */
export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, account } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!hydrated) return;
    if (!account) router.replace("/for-trainers/sign-in");
    else if (account.role !== "trainer") router.replace("/dashboard");
  }, [hydrated, account, router]);

  if (!hydrated || !account || account.role !== "trainer") {
    return <TrainerPageShell variant="public"><p role="status" className="text-lg">{tr("Loading your workspace…")}</p></TrainerPageShell>;
  }
  return <TrainerProvider><Frame>{children}</Frame></TrainerProvider>;
}
