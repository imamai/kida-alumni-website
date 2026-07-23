import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

// Placeholder profiles until kida_profiles has verified, publicly-visible alumni marked as
// featured — swap for a getFeaturedAlumni() query once the directory module ships.
const placeholderAlumni = [
  {
    name: "Dr. Aisha Wanjiru",
    role: "Class of 2004 · Cardiothoracic Surgeon",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Eng. Brian Simiyu",
    role: "Class of 1998 · Infrastructure & Renewable Energy",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Hon. Faith Nekesa",
    role: "Class of 1991 · County Assembly Member",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Michael Otieno",
    role: "Class of 2011 · Founder, AgriTech Startup",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
  },
];

export function FeaturedAlumni() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Distinguished Kibabiians"
        title="Featured Alumni"
        cta={{ label: "View Hall of Fame", href: "/hall-of-fame" }}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderAlumni.map((alum, i) => (
          <Reveal key={alum.name} delay={i * 0.07}>
            <div className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={alum.photo}
                  alt={alum.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-kida-gold text-kida-charcoal">Featured</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-medium">{alum.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{alum.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
