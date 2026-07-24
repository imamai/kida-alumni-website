"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEvent, updateEvent, type EventActionState } from "@/app/actions/admin-events";
import { slugify } from "@/lib/slug";
import { EVENT_CATEGORIES, type EventDetail } from "@/lib/data/admin-events";

const initialState: EventActionState = { status: "idle" };

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: { event?: EventDetail }) {
  const action = event ? updateEvent.bind(null, event.id) : createEvent;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event));
  const [isVirtual, setIsVirtual] = useState(event?.is_virtual ?? false);
  const [requiresRegistration, setRequiresRegistration] = useState(event?.requires_registration ?? true);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={event?.title}
          required
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={event?.category ?? "networking"}>
          <SelectTrigger id="category" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENT_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Short Description</Label>
        <Textarea id="description" name="description" defaultValue={event?.description ?? ""} rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Full Details</Label>
        <Textarea id="content" name="content" defaultValue={event?.content_text ?? ""} rows={8} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="start_at">Starts</Label>
          <Input
            id="start_at"
            name="start_at"
            type="datetime-local"
            defaultValue={toLocalInputValue(event?.start_at ?? null)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_at">Ends</Label>
          <Input id="end_at" name="end_at" type="datetime-local" defaultValue={toLocalInputValue(event?.end_at ?? null)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="timezone">Timezone</Label>
        <Input id="timezone" name="timezone" defaultValue={event?.timezone ?? "Africa/Nairobi"} className="w-full sm:w-64" required />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_virtual"
          checked={isVirtual}
          onChange={(e) => setIsVirtual(e.target.checked)}
          className="size-4 rounded border-input"
        />
        This is a virtual event
      </label>

      {isVirtual ? (
        <div className="space-y-1.5">
          <Label htmlFor="virtual_link">Virtual Link</Label>
          <Input id="virtual_link" name="virtual_link" type="url" defaultValue={event?.virtual_link ?? ""} placeholder="https://meet.google.com/…" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="location_name">Venue</Label>
            <Input id="location_name" name="location_name" defaultValue={event?.location_name ?? ""} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={event?.address ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="county">County</Label>
            <Input id="county" name="county" defaultValue={event?.county ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={event?.country ?? "Kenya"} />
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="requires_registration"
          checked={requiresRegistration}
          onChange={(e) => setRequiresRegistration(e.target.checked)}
          className="size-4 rounded border-input"
        />
        Requires registration
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" min={0} defaultValue={event?.capacity ?? ""} placeholder="Unlimited" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ticket_price">Ticket Price</Label>
          <Input id="ticket_price" name="ticket_price" type="number" min={0} step="0.01" defaultValue={event?.ticket_price ?? 0} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={event?.currency ?? "KES"} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="registration_deadline">Registration Deadline</Label>
        <Input
          id="registration_deadline"
          name="registration_deadline"
          type="datetime-local"
          defaultValue={toLocalInputValue(event?.registration_deadline ?? null)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover">Cover Image</Label>
        {(preview ?? event?.cover_url) && (
          <div className="mb-2 h-32 w-56 overflow-hidden rounded-lg border border-border bg-muted/40">
            <Image
              src={preview ?? event!.cover_url!}
              alt=""
              width={224}
              height={128}
              className="h-full w-full object-cover"
              unoptimized={Boolean(preview)}
            />
          </div>
        )}
        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={event?.status ?? "draft"}>
          <SelectTrigger id="status" className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <div>
        <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
          {pending ? "Saving…" : event ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
