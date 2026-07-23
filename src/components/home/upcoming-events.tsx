import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Video } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { EventItem } from "@/lib/data/content";

export function UpcomingEvents({ events }: { events: EventItem[] }) {
  if (events.length === 0) return null;

  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Save the Date" title="Upcoming Events" cta={{ label: "View all events", href: "/events" }} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {events.map((event, i) => {
            const start = new Date(event.start_at);
            return (
              <Reveal key={event.id} delay={i * 0.08}>
                <Link
                  href={`/events/${event.slug}`}
                  className="group flex gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-kida-gold"
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-kida-purple text-white">
                    <span className="text-xs font-medium uppercase">{format(start, "MMM")}</span>
                    <span className="font-heading text-xl font-semibold leading-none">{format(start, "d")}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-base font-medium text-balance group-hover:text-kida-purple">
                      {event.title}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0" />
                      {format(start, "EEEE, MMM d 'at' h:mm a")}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {event.is_virtual ? <Video className="size-3.5 shrink-0" /> : <MapPin className="size-3.5 shrink-0" />}
                      {event.is_virtual ? "Virtual Event" : (event.location_name ?? "Location TBA")}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
