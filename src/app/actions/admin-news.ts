"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import { slugify } from "@/lib/slug";
import type { NewsStatus } from "@/lib/data/admin-news";

export type NewsActionState = { status: "idle" | "error"; message?: string };

const ALLOWED_COVER_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_COVER_BYTES = 5 * 1024 * 1024;

const newsSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  type: z.enum(["news", "announcement", "blog"]),
  category_id: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

function parseNewsForm(formData: FormData) {
  return newsSchema.safeParse({
    title: formData.get("title"),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    type: formData.get("type"),
    category_id: formData.get("category_id") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    tags: formData.get("tags") || undefined,
    status: formData.get("status"),
  });
}

function toRow(data: z.infer<typeof newsSchema>) {
  return {
    title: data.title,
    slug: data.slug,
    type: data.type,
    category_id: data.category_id || null,
    excerpt: data.excerpt || null,
    content: data.content ? [{ type: "text", data: { text: data.content } }] : [],
    tags: data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
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
  const path = `news/cover-${Date.now()}.${ext}`;

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
      folder: "news",
      uploaded_by: user?.id,
    })
    .select("id")
    .single();

  if (mediaError || !media) return { error: "Cover image upload failed." };
  return { id: media.id };
}

export async function createNews(_prevState: NewsActionState, formData: FormData): Promise<NewsActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseNewsForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const cover = await uploadCover(formData);
  if (cover.error) return { status: "error", message: cover.error };

  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: created, error } = await supabase
    .from("kida_news")
    .insert({
      ...toRow(parsed.data),
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
      cover_media_id: cover.id ?? null,
      author_id: user?.id,
    })
    .select("id")
    .single();

  if (error || !created) {
    return {
      status: "error",
      message: error?.code === "23505" ? "That slug is already in use." : "Failed to create post.",
    };
  }

  revalidatePath("/admin/news");
  revalidatePath("/admin");
  revalidatePath("/news", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/news");
}

export async function updateNews(
  id: string,
  _prevState: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseNewsForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const cover = await uploadCover(formData);
  if (cover.error) return { status: "error", message: cover.error };

  const supabase = await createClient();

  const { data: existing } = await supabase.from("kida_news").select("status").eq("id", id).maybeSingle();
  const wasPublished = existing?.status === "published";
  const isPublished = parsed.data.status === "published";

  const { error } = await supabase
    .from("kida_news")
    .update({
      ...toRow(parsed.data),
      // Only stamp published_at on the transition into "published" — editing an already-published
      // post shouldn't bump its publish date and reorder it in public listings.
      ...(isPublished !== wasPublished ? { published_at: isPublished ? new Date().toISOString() : null } : {}),
      ...(cover.id ? { cover_media_id: cover.id } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to save post.",
    };
  }

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}`);
  revalidatePath("/admin");
  revalidatePath("/news", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/news");
}

export async function setNewsStatus(id: string, status: NewsStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  const { data: existing } = await supabase.from("kida_news").select("status").eq("id", id).maybeSingle();
  const wasPublished = existing?.status === "published";
  const isPublished = status === "published";

  await supabase
    .from("kida_news")
    .update({
      status,
      ...(isPublished !== wasPublished ? { published_at: isPublished ? new Date().toISOString() : null } : {}),
    })
    .eq("id", id);

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}`);
  revalidatePath("/admin");
  revalidatePath("/news", "layout");
  revalidatePath("/", "layout");
}

export async function deleteNews(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_news").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/news");
  revalidatePath("/admin");
  revalidatePath("/news", "layout");
  revalidatePath("/", "layout");
  redirect("/admin/news");
}
