"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import type { FeaturedAlumniStatus } from "@/lib/data/admin-featured-alumni";

export type FeaturedAlumniActionState = { status: "idle" | "error"; message?: string };

const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const featuredAlumniSchema = z.object({
  full_name: z.string().trim().min(2),
  role_title: z.string().trim().min(2),
  bio: z.string().trim().optional(),
  linkedin_url: z.string().trim().optional(),
  website_url: z.string().trim().optional(),
  sort_order: z.coerce.number().int().min(0),
  status: z.enum(["active", "inactive"]),
});

function parseForm(formData: FormData) {
  return featuredAlumniSchema.safeParse({
    full_name: formData.get("full_name"),
    role_title: formData.get("role_title"),
    bio: formData.get("bio") || undefined,
    linkedin_url: formData.get("linkedin_url") || undefined,
    website_url: formData.get("website_url") || undefined,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status"),
  });
}

function toRow(data: z.infer<typeof featuredAlumniSchema>) {
  return {
    full_name: data.full_name,
    role_title: data.role_title,
    bio: data.bio || null,
    linkedin_url: data.linkedin_url || null,
    website_url: data.website_url || null,
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
  const path = `featured-alumni/photo-${Date.now()}.${ext}`;

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
      folder: "featured-alumni",
      uploaded_by: user?.id,
    })
    .select("id")
    .single();

  if (mediaError || !media) return { error: "Photo upload failed." };
  return { id: media.id };
}

export async function createFeaturedAlumni(
  _prevState: FeaturedAlumniActionState,
  formData: FormData,
): Promise<FeaturedAlumniActionState> {
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
  const { error } = await supabase.from("kida_featured_alumni").insert({
    ...toRow(parsed.data),
    photo_media_id: photo.id ?? null,
  });

  if (error) {
    return { status: "error", message: "Failed to add featured alumnus." };
  }

  revalidatePath("/admin/featured-alumni");
  revalidatePath("/", "layout");
  redirect("/admin/featured-alumni");
}

export async function updateFeaturedAlumni(
  id: string,
  _prevState: FeaturedAlumniActionState,
  formData: FormData,
): Promise<FeaturedAlumniActionState> {
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
    .from("kida_featured_alumni")
    .update({
      ...toRow(parsed.data),
      ...(photo.id ? { photo_media_id: photo.id } : {}),
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Failed to save changes." };
  }

  revalidatePath("/admin/featured-alumni");
  revalidatePath(`/admin/featured-alumni/${id}`);
  revalidatePath("/", "layout");
  redirect("/admin/featured-alumni");
}

export async function setFeaturedAlumniStatus(id: string, status: FeaturedAlumniStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_featured_alumni").update({ status }).eq("id", id);

  revalidatePath("/admin/featured-alumni");
  revalidatePath("/", "layout");
}

export async function deleteFeaturedAlumni(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_featured_alumni").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/featured-alumni");
  revalidatePath("/", "layout");
  redirect("/admin/featured-alumni");
}
