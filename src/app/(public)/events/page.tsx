import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { AutoFitImage } from "@/components/site/auto-fit-image";
import { getPublishedEvents } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Events" };

const PAGE_SIZE = 9;
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop";

const WHEN_TABS: { label: string; value: "upcoming" | "past" }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ when?: string; page?: string }>;
}) {
  const { when: rawWhen, page: rawPage } = await searchParams;
  const when = rawWhen === "past" ? "past" : "upcoming";
  const page = Math.max(1, Number(rawPage) || 1);

  const { items, total } = await getPublishedEvents({ when, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="Save the Date"
        title="Events"
        description="AGMs, homecomings, chapter meetups, and reunions across the KIDA community."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {WHEN_TABS.map((tab) => {
            const active = when === tab.value;
            return (
              <Link
                key={tab.value}
                href={`/events?when=${tab.value}`}
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
          <p className="mt-10 text-center text-muted-foreground">
            {when === "upcoming" ? "No upcoming events yet — check back soon." : "No past events to show."}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((event, i) => {
              const start = new Date(event.start_at);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative overflow-hidden">
                    <AutoFitImage
                      media={event.cover_media}
                      alt={event.title}
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
                      {event.category.replace("_", " ")}
                    </Badge>
                    <h3 className="mt-3 font-heading text-lg font-medium text-balance group-hover:text-kida-purple">
                      {event.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0" />
                      {format(start, "EEEE, MMM d 'at' h:mm a")}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {event.is_virtual ? <Video className="size-3.5 shrink-0" /> : <MapPin className="size-3.5 shrink-0" />}
                      {event.is_virtual ? "Virtual Event" : (event.location_name ?? "Location TBA")}
                    </p>
                  </div>
                </Link>
              );
            })}
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
                render={<Link href={`/events?${new URLSearchParams({ when, page: String(page - 1) })}`} />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                nativeButton={false}
                render={<Link href={`/events?${new URLSearchParams({ when, page: String(page + 1) })}`} />}
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
