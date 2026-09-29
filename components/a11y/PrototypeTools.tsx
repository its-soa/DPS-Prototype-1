"use client";

import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useAnnouncer } from "./ScreenReaderAnnouncement";

/** Helpers for partner testing only. Clearly separated from the real learner experience. */
export function PrototypeTools() {
  const { account, unlockAllCourses, resetDemo } = useApp();
  const { announce } = useAnnouncer();
  const router = useRouter();
  return (
    <details className="rounded-xl border-2 border-dashed border-border p-4">
      <summary className="flex min-h-12 cursor-pointer items-center gap-2 text-base font-semibold">
        <Wrench aria-hidden="true" className="size-5" /> Prototype tools (for reviewers only)
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-sm text-muted">
          These shortcuts are not part of the learner experience. They let you reach later steps of the journey quickly.
        </p>
        <div className="flex flex-wrap gap-3">
          {account && (
            <Button
              variant="secondary"
              onClick={() => {
                unlockAllCourses();
                announce("All three required courses marked complete. The certification exam is now available.");
                router.push("/dashboard");
              }}
            >
              Mark all required courses complete
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              if (window.confirm("Reset all demo data on this device and return to the start?")) {
                resetDemo();
                router.push("/");
              }
            }}
          >
            Reset demo data
          </Button>
        </div>
      </div>
    </details>
  );
}
