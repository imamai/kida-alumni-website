import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { AutoFitImage } from "@/components/site/auto-fit-image";
import type { FeaturedAlumniItem } from "@/lib/data/content";

const PLACEHOLDER_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop";

export function FeaturedAlumni({ alumni }: { alumni: FeaturedAlumniItem[] }) {
  if (alumni.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Distinguished Kibabiians"
        title="Featured Alumni"
        cta={{ label: "View Hall of Fame", href: "/hall-of-fame" }}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {alumni.map((alum, i) => (
          <Reveal key={alum.id} delay={i * 0.07}>
            <div className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative overflow-hidden">
                <AutoFitImage
                  media={alum.photo}
                  alt={alum.full_name}
                  fallbackUrl={PLACEHOLDER_PHOTO}
                  fallbackWidth={600}
                  fallbackHeight={750}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-kida-gold text-kida-charcoal">Featured</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-medium">{alum.full_name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{alum.role_title}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
