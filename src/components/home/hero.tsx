import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroSettings } from "@/lib/data/settings";

export function Hero({ hero }: { hero: HeroSettings }) {
  return (
    <section className="relative isolate overflow-hidden bg-kida-charcoal text-white">
      <div className="absolute inset-0">
        <Image
          src={hero.media_url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kida-charcoal via-kida-charcoal/80 to-kida-purple/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-kida-charcoal/90 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-28 sm:px-6 lg:px-8">
        <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-kida-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-kida-gold uppercase backdrop-blur">
          {hero.eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-6xl">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/75 text-pretty">{hero.subheadline}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            className="bg-kida-gold text-kida-charcoal hover:bg-kida-gold-light"
            nativeButton={false}
            render={<Link href={hero.primary_cta_href} />}
          >
            {hero.primary_cta_label}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            nativeButton={false}
            render={<Link href={hero.secondary_cta_href} />}
          >
            {hero.secondary_cta_label}
          </Button>
        </div>
      </div>
    </section>
  );
}
