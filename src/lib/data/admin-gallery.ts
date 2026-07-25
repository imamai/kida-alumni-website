import { createClient } from "@/lib/supabase/server";

export type GalleryAlbumStatus = "draft" | "published" | "archived";

export type GalleryAlbumListItem = {
  id: string;
  title: string;
  slug: string;
  status: GalleryAlbumStatus;
  sort_order: number;
  cover_url: string | null;
  item_count: number;
};

export type GalleryItem = {
  id: string;
  media_id: string;
  url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
};

export type GalleryAlbumDetail = Omit<GalleryAlbumListItem, "item_count"> & {
  description: string | null;
  cover_media_id: string | null;
  items: GalleryItem[];
};

function toCoverUrl(cover: { url: string } | { url: string }[] | null) {
  return (Array.isArray(cover) ? cover[0] : cover)?.url ?? null;
}

export async function getAlbumsList(): Promise<GalleryAlbumListItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_gallery_albums")
      .select("id, title, slug, status, sort_order, cover_media:kida_media(url), items:kida_gallery_items(count)")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (error) return [];

    return (
      data as unknown as {
        id: string;
        title: string;
        slug: string;
        status: GalleryAlbumStatus;
        sort_order: number;
        cover_media: { url: string } | { url: string }[] | null;
        items: { count: number }[];
      }[]
    ).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      sort_order: row.sort_order,
      cover_url: toCoverUrl(row.cover_media),
      item_count: row.items?.[0]?.count ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getAlbumById(id: string): Promise<GalleryAlbumDetail | null> {
  try {
    const supabase = await createClient();
    const { data: album, error } = await supabase
      .from("kida_gallery_albums")
      .select("id, title, slug, description, status, sort_order, cover_media_id, cover_media:kida_media(url)")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !album) return null;

    const { data: items } = await supabase
      .from("kida_gallery_items")
      .select("id, media_id, caption, sort_order, media:kida_media(url, alt_text)")
      .eq("album_id", id)
      .order("sort_order", { ascending: true });

    const row = album as unknown as {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      status: GalleryAlbumStatus;
      sort_order: number;
      cover_media_id: string | null;
      cover_media: { url: string } | { url: string }[] | null;
    };

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      status: row.status,
      sort_order: row.sort_order,
      cover_media_id: row.cover_media_id,
      cover_url: toCoverUrl(row.cover_media),
      items: (
        (items ?? []) as unknown as {
          id: string;
          media_id: string;
          caption: string | null;
          sort_order: number;
          media: { url: string; alt_text: string | null } | { url: string; alt_text: string | null }[] | null;
        }[]
      ).map((item) => {
        const media = Array.isArray(item.media) ? item.media[0] : item.media;
        return {
          id: item.id,
          media_id: item.media_id,
          url: media?.url ?? "",
          alt_text: media?.alt_text ?? null,
          caption: item.caption,
          sort_order: item.sort_order,
        };
      }),
    };
  } catch {
    return null;
  }
}

export type PickableMedia = { id: string; url: string; alt_text: string | null };

export async function getPickableImages({
  excludeMediaIds,
  limit = 24,
}: {
  excludeMediaIds?: string[];
  limit?: number;
} = {}): Promise<PickableMedia[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kida_media")
      .select("id, url, alt_text")
      .eq("type", "image")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (excludeMediaIds && excludeMediaIds.length > 0) {
      query = query.not("id", "in", `(${excludeMediaIds.join(",")})`);
    }

    const { data, error } = await query;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
