"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import type { MediaType } from "@/lib/data/admin-media";

export type MediaActionState = { status: "idle" | "error" | "success"; message?: string };

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
];
const MAX_BYTES = 20 * 1024 * 1024;

function mediaTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

export async function uploadMedia(_prevState: MediaActionState, formData: FormData): Promise<MediaActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a file to upload." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { status: "error", message: "That file type isn't supported." };
  }
  if (file.size > MAX_BYTES) {
    return { status: "error", message: "File must be smaller than 20MB." };
  }

  const folder = (formData.get("folder") || "general").toString().trim() || "general";
  const altText = formData.get("alt_text")?.toString().trim() || null;

  const supabase = await createClient();
  const user = await getCurrentUser();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/upload-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("kida-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    return { status: "error", message: "Upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("kida-media").getPublicUrl(path);

  const { error } = await supabase.from("kida_media").insert({
    storage_path: path,
    url: publicUrl,
    type: mediaTypeFromMime(file.type),
    mime_type: file.type,
    size_bytes: file.size,
    alt_text: altText,
    folder,
    uploaded_by: user?.id,
  });

  if (error) {
    return { status: "error", message: "Upload saved to storage but failed to save its record." };
  }

  revalidatePath("/admin/media");

  return { status: "success", message: "File uploaded." };
}

const updateSchema = z.object({
  alt_text: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  folder: z.string().trim().min(1),
});

export async function updateMedia(
  id: string,
  _prevState: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = updateSchema.safeParse({
    alt_text: formData.get("alt_text") || undefined,
    caption: formData.get("caption") || undefined,
    folder: formData.get("folder"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("kida_media")
    .update({
      alt_text: parsed.data.alt_text || null,
      caption: parsed.data.caption || null,
      folder: parsed.data.folder,
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Failed to save changes." };
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}`);

  return { status: "success", message: "Changes saved." };
}

export async function deleteMedia(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_media").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/media");
  redirect("/admin/media");
}
