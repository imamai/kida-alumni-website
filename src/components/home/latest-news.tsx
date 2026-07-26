import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { AutoFitImage } from "@/components/site/auto-fit-image";
import type { NewsItem } from "@/lib/data/content";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop";

export function LatestNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Newsroom" title="Latest News & Announcements" cta={{ label: "View all news", href: "/news" }} />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08}>
            <Link href={`/news/${item.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative overflow-hidden">
                <AutoFitImage
                  media={item.cover_media}
                  alt={item.title}
                  fallbackUrl={PLACEHOLDER_IMAGE}
                  fallbackWidth={1200}
                  fallbackHeight={750}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="bg-kida-gold/15 text-kida-charcoal capitalize">
                  {item.type}
                </Badge>
                <h3 className="mt-3 font-heading text-lg font-medium text-balance group-hover:text-kida-purple">
                  {item.title}
                </h3>
                {item.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>}
                {item.published_at && (
                  <p className="mt-3 text-xs text-muted-foreground">{format(new Date(item.published_at), "MMMM d, yyyy")}</p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
