import { AccessiblePageShell } from "@/components/a11y/AccessiblePageShell";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AccessiblePageShell variant="public">{children}</AccessiblePageShell>;
}
