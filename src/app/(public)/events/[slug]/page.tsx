import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, CalendarDays, MapPin, Video, Users, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEventBySlug } from "@/lib/data/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const start = new Date(event.start_at);
  const end = event.end_at ? new Date(event.end_at) : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Events
      </Link>

      <Badge variant="secondary" className="mt-6 bg-kida-gold/15 text-kida-charcoal capitalize">
        {event.category.replace("_", " ")}
      </Badge>

      <h1 className="mt-4 font-heading text-3xl font-semibold text-balance sm:text-4xl">{event.title}</h1>
      {event.description && <p className="mt-3 text-lg text-muted-foreground text-pretty">{event.description}</p>}

      {event.cover_media?.url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={event.cover_media.url} alt={event.cover_media.alt_text ?? ""} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 size-5 shrink-0 text-kida-purple" />
          <div>
            <p className="text-sm font-medium">{format(start, "EEEE, MMMM d, yyyy")}</p>
            <p className="text-sm text-muted-foreground">
              {format(start, "h:mm a")}
              {end ? ` – ${format(end, "h:mm a")}` : ""} ({event.timezone})
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {event.is_virtual ? (
            <Video className="mt-0.5 size-5 shrink-0 text-kida-purple" />
          ) : (
            <MapPin className="mt-0.5 size-5 shrink-0 text-kida-purple" />
          )}
          <div>
            {event.is_virtual ? (
              <>
                <p className="text-sm font-medium">Virtual Event</p>
                {event.virtual_link && (
                  <a href={event.virtual_link} target="_blank" rel="noreferrer" className="text-sm text-kida-purple hover:underline">
                    Join link
                  </a>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-medium">{event.location_name ?? "Location TBA"}</p>
                {(event.address || event.county) && (
                  <p className="text-sm text-muted-foreground">{[event.address, event.county, event.country].filter(Boolean).join(", ")}</p>
                )}
              </>
            )}
          </div>
        </div>

        {event.requires_registration && (
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-5 shrink-0 text-kida-purple" />
            <div>
              <p className="text-sm font-medium">Registration required</p>
              {event.capacity && <p className="text-sm text-muted-foreground">Limited to {event.capacity} attendees</p>}
            </div>
          </div>
        )}

        {event.ticket_price > 0 && (
          <div className="flex items-start gap-3">
            <Ticket className="mt-0.5 size-5 shrink-0 text-kida-purple" />
            <div>
              <p className="text-sm font-medium">
                {event.currency} {event.ticket_price.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Per attendee</p>
            </div>
          </div>
        )}
      </div>

      {event.content_text && <div className="mt-8 space-y-4 text-base whitespace-pre-wrap text-foreground">{event.content_text}</div>}

      {event.requires_registration && (
        <div className="mt-8 rounded-2xl border border-kida-purple/20 bg-kida-purple/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Registration for this event is managed by the KIDA secretariat.{" "}
            <Link href="/contact" className="font-medium text-kida-purple hover:underline">
              Contact us
            </Link>{" "}
            to reserve your spot.
          </p>
        </div>
      )}
    </article>
  );
}
