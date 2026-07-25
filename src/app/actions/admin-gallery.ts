"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import { slugify } from "@/lib/slug";
import type { GalleryAlbumStatus } from "@/lib/data/admin-gallery";

export type GalleryActionState = { status: "idle" | "error" | "success"; message?: string };

const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS_PER_UPLOAD = 20;

const albumSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().optional(),
  sort_order: z.coerce.number().int().min(0),
  status: z.enum(["draft", "published", "archived"]),
});

function parseAlbumForm(formData: FormData) {
  return albumSchema.safeParse({
    title: formData.get("title"),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    description: formData.get("description") || undefined,
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status"),
  });
}

export async function createAlbum(_prevState: GalleryActionState, formData: FormData): Promise<GalleryActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseAlbumForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("kida_gallery_albums")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      sort_order: parsed.data.sort_order,
      status: parsed.data.status,
    })
    .select("id")
    .single();

  if (error || !created) {
    return {
      status: "error",
      message: error?.code === "23505" ? "That slug is already in use." : "Failed to create album.",
    };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");
  redirect(`/admin/gallery/${created.id}`);
}

export async function updateAlbum(
  id: string,
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseAlbumForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("kida_gallery_albums")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      sort_order: parsed.data.sort_order,
      status: parsed.data.status,
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to save album.",
    };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");

  return { status: "success", message: "Album saved." };
}

export async function setAlbumStatus(id: string, status: GalleryAlbumStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_gallery_albums").update({ status }).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");
}

export async function deleteAlbum(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_gallery_albums").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/gallery");
}

export async function uploadGalleryPhotos(
  albumId: string,
  _prevState: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { status: "error", message: "Choose at least one photo to upload." };
  }
  if (files.length > MAX_PHOTOS_PER_UPLOAD) {
    return { status: "error", message: `Upload at most ${MAX_PHOTOS_PER_UPLOAD} photos at a time.` };
  }
  for (const file of files) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return { status: "error", message: "Photos must be PNG, JPEG, or WebP images." };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { status: "error", message: "Each photo must be smaller than 8MB." };
    }
  }

  const supabase = await createClient();
  const user = await getCurrentUser();

  const [{ count: existingCount }, { data: album }] = await Promise.all([
    supabase.from("kida_gallery_items").select("id", { count: "exact", head: true }).eq("album_id", albumId),
    supabase.from("kida_gallery_albums").select("cover_media_id").eq("id", albumId).maybeSingle(),
  ]);

  let nextSortOrder = existingCount ?? 0;
  const mediaIds: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `gallery/photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("kida-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) continue;

    const {
      data: { publicUrl },
    } = supabase.storage.from("kida-media").getPublicUrl(path);

    const { data: media } = await supabase
      .from("kida_media")
      .insert({
        storage_path: path,
        url: publicUrl,
        type: "image",
        mime_type: file.type,
        size_bytes: file.size,
        folder: "gallery",
        uploaded_by: user?.id,
      })
      .select("id")
      .single();

    if (media) {
      mediaIds.push(media.id);
      await supabase.from("kida_gallery_items").insert({
        album_id: albumId,
        media_id: media.id,
        sort_order: nextSortOrder++,
      });
    }
  }

  if (mediaIds.length === 0) {
    return { status: "error", message: "Upload failed. Please try again." };
  }

  if (!album?.cover_media_id) {
    await supabase.from("kida_gallery_albums").update({ cover_media_id: mediaIds[0] }).eq("id", albumId);
  }

  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");

  return { status: "success", message: `${mediaIds.length} photo${mediaIds.length === 1 ? "" : "s"} added.` };
}

export async function addExistingMediaToAlbum(albumId: string, mediaId: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  const [{ count: existingCount }, { data: album }] = await Promise.all([
    supabase.from("kida_gallery_items").select("id", { count: "exact", head: true }).eq("album_id", albumId),
    supabase.from("kida_gallery_albums").select("cover_media_id").eq("id", albumId).maybeSingle(),
  ]);

  await supabase.from("kida_gallery_items").insert({
    album_id: albumId,
    media_id: mediaId,
    sort_order: existingCount ?? 0,
  });

  if (!album?.cover_media_id) {
    await supabase.from("kida_gallery_albums").update({ cover_media_id: mediaId }).eq("id", albumId);
  }

  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");
}

export async function updateGalleryItem(itemId: string, albumId: string, formData: FormData) {
  if (!(await isStaff())) return;

  const caption = formData.get("caption")?.toString().trim() || null;
  const sortOrder = Number(formData.get("sort_order")) || 0;

  const supabase = await createClient();
  await supabase.from("kida_gallery_items").update({ caption, sort_order: sortOrder }).eq("id", itemId);

  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/gallery", "layout");
}

export async function removeGalleryItem(itemId: string, albumId: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_gallery_items").delete().eq("id", itemId);

  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");
}

export async function setAlbumCover(albumId: string, mediaId: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_gallery_albums").update({ cover_media_id: mediaId }).eq("id", albumId);

  revalidatePath(`/admin/gallery/${albumId}`);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery", "layout");
  revalidatePath("/", "layout");
}
