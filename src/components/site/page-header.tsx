export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border bg-kida-ivory">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        {eyebrow && <p className="text-xs font-semibold tracking-widest text-kida-maroon uppercase">{eyebrow}</p>}
        <h1 className="mt-2 font-heading text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 text-lg text-muted-foreground text-pretty">{description}</p>}
      </div>
    </div>
  );
}
