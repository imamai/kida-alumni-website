"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import type { LeadershipStatus } from "@/lib/data/admin-leadership";

export type LeadershipActionState = { status: "idle" | "error"; message?: string };

const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const leadershipSchema = z.object({
  full_name: z.string().trim().min(2),
  title: z.string().trim().min(2),
  category: z.enum(["executive", "patron", "committee"]),
  bio: z.string().trim().optional(),
  term_start: z.string().trim().optional(),
  term_end: z.string().trim().optional(),
  county: z.string().trim().optional(),
  linkedin_url: z.string().trim().optional(),
  email: z.string().trim().optional(),
  sort_order: z.coerce.number().int().min(0),
  status: z.enum(["active", "inactive"]),
});

function parseForm(formData: FormData) {
  return leadershipSchema.safeParse({
    full_name: formData.get("full_name"),
    title: formData.get("title"),
    category: formData.get("category"),
    bio: formData.get("bio") || undefined,
    term_start: formData.get("term_start") || undefined,
    term_end: formData.get("term_end") || undefined,
    county: formData.get("county") || undefined,
    linkedin_url: formData.get("linkedin_url") || undefined,
    email: formData.get("email") || undefined,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status"),
  });
}

function toRow(data: z.infer<typeof leadershipSchema>) {
  return {
    full_name: data.full_name,
    title: data.title,
    category: data.category,
    bio: data.bio || null,
    term_start: data.term_start || null,
    term_end: data.term_end || null,
    county: data.county || null,
    linkedin_url: data.linkedin_url || null,
    email: data.email || null,
    sort_order: data.sort_order,
    status: data.status,
  };
}

async function uploadPhoto(formData: FormData): Promise<{ id?: string; error?: string }> {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return {};

  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { error: "Photo must be a PNG, JPEG, or WebP image." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { error: "Photo must be smaller than 5MB." };
  }

  const supabase = await createClient();
  const user = await getCurrentUser();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `leadership/photo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("kida-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { error: "Photo upload failed." };

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
      folder: "leadership",
      uploaded_by: user?.id,
    })
    .select("id")
    .single();

  if (mediaError || !media) return { error: "Photo upload failed." };
  return { id: media.id };
}

export async function createLeader(
  _prevState: LeadershipActionState,
  formData: FormData,
): Promise<LeadershipActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const photo = await uploadPhoto(formData);
  if (photo.error) return { status: "error", message: photo.error };

  const supabase = await createClient();
  const { error } = await supabase.from("kida_leadership").insert({
    ...toRow(parsed.data),
    photo_media_id: photo.id ?? null,
  });

  if (error) {
    return { status: "error", message: "Failed to add leader." };
  }

  revalidatePath("/admin/leadership");
  revalidatePath("/about/leadership");
  redirect("/admin/leadership");
}

export async function updateLeader(
  id: string,
  _prevState: LeadershipActionState,
  formData: FormData,
): Promise<LeadershipActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const photo = await uploadPhoto(formData);
  if (photo.error) return { status: "error", message: photo.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("kida_leadership")
    .update({
      ...toRow(parsed.data),
      ...(photo.id ? { photo_media_id: photo.id } : {}),
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Failed to save changes." };
  }

  revalidatePath("/admin/leadership");
  revalidatePath(`/admin/leadership/${id}`);
  revalidatePath("/about/leadership");
  redirect("/admin/leadership");
}

export async function setLeaderStatus(id: string, status: LeadershipStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_leadership").update({ status }).eq("id", id);

  revalidatePath("/admin/leadership");
  revalidatePath("/about/leadership");
}

export async function deleteLeader(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_leadership").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/leadership");
  revalidatePath("/about/leadership");
  redirect("/admin/leadership");
}
