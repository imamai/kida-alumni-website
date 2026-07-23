import { AnimatedNumber } from "@/components/ui/animated-number";
import { Reveal } from "@/components/ui/reveal";
import type { ImpactStat } from "@/lib/data/settings";

export function ImpactStats({ stats }: { stats: ImpactStat[] }) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <div className="font-heading text-4xl font-semibold text-kida-purple sm:text-5xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
