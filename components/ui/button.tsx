import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 px-5 py-2.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-primary-foreground hover:brightness-110",
        secondary: "border-border bg-background text-foreground hover:bg-surface-strong",
        ghost: "border-transparent bg-transparent text-foreground underline underline-offset-4 hover:bg-surface-strong",
        danger: "border-danger bg-danger text-background hover:brightness-110",
      },
      size: { md: "", lg: "min-h-14 px-7 text-lg" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export function Button({
  className, variant, size, type = "button", ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & Variants) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function ButtonLink({
  className, variant, size, ...props
}: React.ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
