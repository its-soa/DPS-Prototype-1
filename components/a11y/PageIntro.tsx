"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { useAnnouncer } from "./ScreenReaderAnnouncement";

/**
 * The single <h1> for a page. It:
 *  - updates document.title
 *  - moves focus to the heading after navigation (so screen readers start in the right place)
 *  - registers the text used by "Repeat page instructions"
 */
export function PageIntro({
  title, instructions, eyebrow, children, focus = true,
}: {
  title: string;
  instructions?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  focus?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { setInstructions } = useAnnouncer();
  const { t } = useApp();

  useEffect(() => {
    document.title = `${title} · ${t("brand.name")}`;
  }, [title, t]);

  useEffect(() => {
    setInstructions(`${title}. ${instructions ?? ""}`.trim());
    return () => setInstructions("");
  }, [title, instructions, setInstructions]);

  useEffect(() => {
    if (focus) ref.current?.focus({ preventScroll: false });
  }, [title, focus]);

  return (
    <div className="mb-6 space-y-2">
      {eyebrow && <p className="text-base font-semibold text-muted">{eyebrow}</p>}
      <h1 ref={ref} tabIndex={-1} className="text-3xl sm:text-4xl">{title}</h1>
      {instructions && <p className="max-w-prose text-lg text-muted">{instructions}</p>}
      {children}
    </div>
  );
}
