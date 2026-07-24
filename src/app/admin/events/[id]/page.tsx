import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/event-form";
import { getEventById } from "@/lib/data/admin-events";

export const metadata: Metadata = { title: "Edit Event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Events
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">Edit Event</h1>
        <p className="mt-1 text-sm text-muted-foreground">{event.title}</p>
      </div>

      <EventForm event={event} />
    </div>
  );
}
