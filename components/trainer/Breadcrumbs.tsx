import Link from "next/link";
import { tr } from "@/lib/trainer/tr";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label={tr("Breadcrumb")} className="mb-3">
      <ol className="flex flex-wrap gap-2 text-base">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? <Link href={it.href} className="underline underline-offset-4">{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
