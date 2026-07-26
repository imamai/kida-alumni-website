import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { AutoFitImage } from "@/components/site/auto-fit-image";
import { getPublishedNews } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "News & Announcements" };

const PAGE_SIZE = 9;
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop";

const TYPE_TABS: { label: string; value?: "news" | "announcement" | "blog" }[] = [
  { label: "All" },
  { label: "News", value: "news" },
  { label: "Announcements", value: "announcement" },
  { label: "Blog", value: "blog" },
];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const { type: rawType, page: rawPage } = await searchParams;
  const type = TYPE_TABS.some((t) => t.value === rawType) ? (rawType as "news" | "announcement" | "blog") : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const { items, total } = await getPublishedNews({ type, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="Newsroom"
        title="News & Announcements"
        description="Updates, announcements, and stories from across the KIDA community."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {TYPE_TABS.map((tab) => {
            const active = type === tab.value;
            return (
              <Link
                key={tab.label}
                href={`/news${tab.value ? `?type=${tab.value}` : ""}`}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                  active && "bg-kida-purple/10 text-kida-purple",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative overflow-hidden">
                  <AutoFitImage
                    media={item.cover_media}
                    alt={item.title}
                    fallbackUrl={PLACEHOLDER_IMAGE}
                    fallbackWidth={1200}
                    fallbackHeight={750}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                    <p className="mt-3 text-xs text-muted-foreground">
                      {format(new Date(item.published_at), "MMMM d, yyyy")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                nativeButton={false}
                render={
                  <Link href={`/news?${new URLSearchParams({ ...(type ? { type } : {}), page: String(page - 1) })}`} />
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                nativeButton={false}
                render={
                  <Link href={`/news?${new URLSearchParams({ ...(type ? { type } : {}), page: String(page + 1) })}`} />
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
