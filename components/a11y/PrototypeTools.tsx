"use client";

import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useAnnouncer } from "./ScreenReaderAnnouncement";

/** Helpers for partner testing only. Clearly separated from the real learner experience. */
export function PrototypeTools() {
  const { account, unlockAllCourses, resetDemo, t } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  return (
    <details className="rounded-xl border-2 border-dashed border-border p-4">
      <summary className="flex min-h-12 cursor-pointer items-center gap-2 text-base font-semibold">
        <Wrench aria-hidden="true" className="size-5" /> {t("tools.title")}
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-sm text-muted">
          {t("tools.intro")}
        </p>
        <div className="flex flex-wrap gap-3">
          {account && (
            <Button
              variant="secondary"
              onClick={() => {
                unlockAllCourses();
                announce(t("tools.unlockedMessage"));
                router.push("/dashboard");
              }}
            >
              {t("tools.unlockAll")}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              if (window.confirm(t("tools.resetConfirm"))) {
                resetDemo();
                router.push("/");
              }
            }}
          >
            {t("tools.reset")}
          </Button>
        </div>
      </div>
    </details>
  );
}
