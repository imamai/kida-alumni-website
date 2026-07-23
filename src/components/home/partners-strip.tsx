import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import type { Partner } from "@/lib/data/content";

export function PartnersStrip({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Working Together" title="Our Partners & Sponsors" align="center" />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 grayscale">
        {partners.map((partner) =>
          partner.logo?.url ? (
            <a
              key={partner.id}
              href={partner.website_url ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="opacity-70 transition-opacity hover:opacity-100"
              aria-label={partner.name}
            >
              <Image src={partner.logo.url} alt={partner.name} width={140} height={56} className="h-12 w-auto object-contain" />
            </a>
          ) : (
            <span key={partner.id} className="text-sm font-medium text-muted-foreground">
              {partner.name}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
