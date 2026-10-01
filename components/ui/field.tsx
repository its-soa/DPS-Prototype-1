"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: (a11y: { id: string; "aria-describedby"?: string; "aria-invalid"?: true; "aria-required"?: true }) => React.ReactNode;
  required?: boolean;
  className?: string;
}

/** Label + description + error wiring in one place, so every form field is consistent. */
export function Field({ id, label, description, error, children, required, className }: FieldProps) {
  const { t } = useApp();
  const describedBy = [description ? `${id}-desc` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-base font-semibold">
        {label}
        {required && <span className="font-normal text-muted"> {t("common.required")}</span>}
      </label>
      {description && <p id={`${id}-desc`} className="text-sm text-muted">{description}</p>}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined, "aria-required": required ? true : undefined })}
      {error && (
        <p id={`${id}-err`} className="flex items-start gap-2 text-base font-semibold text-danger">
          <span aria-hidden="true">⚠</span>
          <span><span className="sr-only">{t("common.error")} </span>{error}</span>
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "min-h-12 w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-base aria-[invalid=true]:border-danger aria-[invalid=true]:border-4";
