import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  cta,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-kida-maroon uppercase">{eyebrow}</p>
        )}
        <h2 className="mt-2 font-heading text-3xl font-semibold text-balance sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-muted-foreground text-pretty">{description}</p>}
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-kida-purple hover:text-kida-purple-dark"
        >
          {cta.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
