"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import { slugify } from "@/lib/slug";
import type { EventStatus } from "@/lib/data/admin-events";

export type EventActionState = { status: "idle" | "error"; message?: string };

const ALLOWED_COVER_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_COVER_BYTES = 5 * 1024 * 1024;

const CATEGORY_VALUES = [
  "agm",
  "homecoming",
  "reunion",
  "networking",
  "forum",
  "county_meeting",
  "international",
  "other",
] as const;

const eventSchema = z
  .object({
    title: z.string().trim().min(2),
    slug: z.string().trim().min(2),
    category: z.enum(CATEGORY_VALUES),
    description: z.string().trim().optional(),
    content: z.string().trim().optional(),
    location_name: z.string().trim().optional(),
    address: z.string().trim().optional(),
    county: z.string().trim().optional(),
    country: z.string().trim().optional(),
    is_virtual: z.coerce.boolean(),
    virtual_link: z.string().trim().optional(),
    start_at: z.string().trim().min(1),
    end_at: z.string().trim().optional(),
    timezone: z.string().trim().min(1),
    capacity: z.coerce.number().int().min(0).optional(),
    registration_deadline: z.string().trim().optional(),
    requires_registration: z.coerce.boolean(),
    ticket_price: z.coerce.number().min(0),
    currency: z.string().trim().min(1),
    status: z.enum(["draft", "published", "cancelled", "completed"]),
  })
  .transform((data) => ({
    ...data,
    start_at: new Date(data.start_at).toISOString(),
    end_at: data.end_at ? new Date(data.end_at).toISOString() : null,
    registration_deadline: data.registration_deadline ? new Date(data.registration_deadline).toISOString() : null,
  }));

function parseEventForm(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    category: formData.get("category"),
    description: formData.get("description") || undefined,
    content: formData.get("content") || undefined,
    location_name: formData.get("location_name") || undefined,
    address: formData.get("address") || undefined,
    county: formData.get("county") || undefined,
    country: formData.get("country") || undefined,
    is_virtual: formData.get("is_virtual") === "on",
    virtual_link: formData.get("virtual_link") || undefined,
    start_at: formData.get("start_at"),
    end_at: formData.get("end_at") || undefined,
    timezone: formData.get("timezone") || "Africa/Nairobi",
    capacity: formData.get("capacity") || undefined,
    registration_deadline: formData.get("registration_deadline") || undefined,
    requires_registration: formData.get("requires_registration") === "on",
    ticket_price: formData.get("ticket_price") || 0,
    currency: formData.get("currency") || "KES",
    status: formData.get("status"),
  });
}

function toRow(data: z.infer<typeof eventSchema>) {
  return {
    title: data.title,
    slug: data.slug,
    category: data.category,
    description: data.description || null,
    content: data.content ? [{ type: "text", data: { text: data.content } }] : [],
    location_name: data.location_name || null,
    address: data.address || null,
    county: data.county || null,
    country: data.country || "Kenya",
    is_virtual: data.is_virtual,
    virtual_link: data.virtual_link || null,
    start_at: data.start_at,
    end_at: data.end_at,
    timezone: data.timezone,
    capacity: data.capacity ?? null,
    registration_deadline: data.registration_deadline,
    requires_registration: data.requires_registration,
    ticket_price: data.ticket_price,
    currency: data.currency,
    status: data.status,
  };
}

async function uploadCover(formData: FormData): Promise<{ id?: string; error?: string }> {
  const file = formData.get("cover");
  if (!(file instanceof File) || file.size === 0) return {};

  if (!ALLOWED_COVER_TYPES.includes(file.type)) {
    return { error: "Cover image must be a PNG, JPEG, or WebP image." };
  }
  if (file.size > MAX_COVER_BYTES) {
    return { error: "Cover image must be smaller than 5MB." };
  }

  const supabase = await createClient();
  const user = await getCurrentUser();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `events/cover-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("kida-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { error: "Cover image upload failed." };

  const {
    data: { publicUrl },
  } = supabase.storage.from("kida-media").getPublicUrl(path);

  const { data: media, error: mediaError } = await supabase
    .from("kida_media")
    .insert({
      storage_path: path,
      url: publicUrl,
      type: "image",
      mime_type: file.type,
      size_bytes: file.size,
      folder: "events",
      uploaded_by: user?.id,
    })
    .select("id")
    .single();

  if (mediaError || !media) return { error: "Cover image upload failed." };
  return { id: media.id };
}

export async function createEvent(_prevState: EventActionState, formData: FormData): Promise<EventActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const cover = await uploadCover(formData);
  if (cover.error) return { status: "error", message: cover.error };

  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: created, error } = await supabase
    .from("kida_events")
    .insert({
      ...toRow(parsed.data),
      cover_media_id: cover.id ?? null,
      organizer_id: user?.id,
    })
    .select("id")
    .single();

  if (error || !created) {
    return {
      status: "error",
      message: error?.code === "23505" ? "That slug is already in use." : "Failed to create event.",
    };
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/events", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/events");
}

export async function updateEvent(
  id: string,
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const cover = await uploadCover(formData);
  if (cover.error) return { status: "error", message: cover.error };

  const supabase = await createClient();

  const { error } = await supabase
    .from("kida_events")
    .update({
      ...toRow(parsed.data),
      ...(cover.id ? { cover_media_id: cover.id } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to save event.",
    };
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin");
  revalidatePath("/events", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/events");
}

export async function setEventStatus(id: string, status: EventStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_events").update({ status }).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/admin");
  revalidatePath("/events", "layout");
  revalidatePath("/", "layout");
}

export async function deleteEvent(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_events").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/events", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/events");
}
