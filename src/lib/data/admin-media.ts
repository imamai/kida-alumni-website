import { createClient } from "@/lib/supabase/server";

export type MediaType = "image" | "video" | "document";

export type MediaListItem = {
  id: string;
  url: string;
  type: MediaType;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  folder: string;
  created_at: string;
};

const COLUMNS =
  "id, url, type, mime_type, size_bytes, width, height, alt_text, caption, folder, created_at";

export async function getMediaList({
  folder,
  type,
  search,
  page = 1,
  pageSize = 24,
}: {
  folder?: string;
  type?: MediaType;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: MediaListItem[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("kida_media")
      .select(COLUMNS, { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (folder) query = query.eq("folder", folder);
    if (type) query = query.eq("type", type);
    if (search) query = query.or(`alt_text.ilike.%${search}%,caption.ilike.%${search}%,storage_path.ilike.%${search}%`);

    const { data, count, error } = await query;
    if (error) return { items: [], total: 0 };

    return { items: (data ?? []) as unknown as MediaListItem[], total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getMediaById(id: string): Promise<MediaListItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_media")
      .select(COLUMNS)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as MediaListItem;
  } catch {
    return null;
  }
}

export async function getMediaFolders(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("kida_media").select("folder").is("deleted_at", null);
    if (error) return [];
    return Array.from(new Set((data ?? []).map((row) => row.folder))).sort();
  } catch {
    return [];
  }
}
