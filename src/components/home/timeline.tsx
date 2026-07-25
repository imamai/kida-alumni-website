import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { RichText } from "@/components/site/rich-text";
import type { TimelineMilestone } from "@/lib/data/content";

export function Timeline({ milestones }: { milestones: TimelineMilestone[] }) {
  if (milestones.length === 0) return null;

  return (
    <section className="bg-kida-ivory py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Journey" title="Four Decades of Legacy" align="center" />
        <div className="relative mt-14">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-border" aria-hidden />
          <ol className="space-y-10">
            {milestones.map((m, i) => (
              <li key={m.id} className="relative pl-12">
                <Reveal delay={i * 0.05}>
                  <span className="absolute top-1.5 left-[9px] size-3.5 -translate-x-1/2 rounded-full border-2 border-kida-gold bg-background" />
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <span className="font-heading text-lg font-semibold text-kida-purple">{m.year}</span>
                    <h3 className="mt-1 font-medium">{m.title}</h3>
                    <RichText text={m.description} className="mt-1 text-sm text-muted-foreground" />
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
