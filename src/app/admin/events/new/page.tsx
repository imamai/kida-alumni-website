import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = { title: "New Event" };

export default function NewEventPage() {
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
        <h1 className="font-heading text-2xl font-semibold">New Event</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create an AGM, reunion, chapter meeting, or other event.</p>
      </div>

      <EventForm />
    </div>
  );
}
