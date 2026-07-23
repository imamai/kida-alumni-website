import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/site/section-heading";

const milestones = [
  { year: "1985", title: "Kibabii High School Founded", copy: "The institution opens its doors in Bungoma County, setting the foundation for generations of leaders." },
  { year: "1998", title: "KIDA Established", copy: "Alumni formally organize as the Kibabiians Development Association to support their alma mater." },
  { year: "2006", title: "First Scholarship Fund", copy: "KIDA launches its first bursary programme for needy students at Kibabii High School." },
  { year: "2014", title: "County & Diaspora Chapters", copy: "Regional and international chapters form, extending the KIDA network across Kenya and abroad." },
  { year: "2026", title: "The Digital KIDA Platform", copy: "A world-class alumni portal launches — networking, mentorship, and giving in one place." },
];

export function Timeline() {
  return (
    <section className="bg-kida-ivory py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Journey" title="Four Decades of Legacy" align="center" />
        <div className="relative mt-14">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-border" aria-hidden />
          <ol className="space-y-10">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative pl-12">
                <Reveal delay={i * 0.05}>
                  <span className="absolute top-1.5 left-[9px] size-3.5 -translate-x-1/2 rounded-full border-2 border-kida-gold bg-background" />
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <span className="font-heading text-lg font-semibold text-kida-purple">{m.year}</span>
                    <h3 className="mt-1 font-medium">{m.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.copy}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
