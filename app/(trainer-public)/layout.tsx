import { TrainerPageShell } from "@/components/trainer/TrainerPageShell";

export default function TrainerPublicLayout({ children }: { children: React.ReactNode }) {
  return <TrainerPageShell variant="public">{children}</TrainerPageShell>;
}
