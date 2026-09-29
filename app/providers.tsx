"use client";

import { MotionConfig } from "framer-motion";
import { ScreenReaderAnnouncement } from "@/components/a11y/ScreenReaderAnnouncement";
import { AppProvider, useApp } from "@/lib/store";

function Motion({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  // "user" honours prefers-reduced-motion; "always" honours the in-app setting.
  return <MotionConfig reducedMotion={state.settings.reduceMotion ? "always" : "user"}>{children}</MotionConfig>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Motion>
        <ScreenReaderAnnouncement>{children}</ScreenReaderAnnouncement>
      </Motion>
    </AppProvider>
  );
}
