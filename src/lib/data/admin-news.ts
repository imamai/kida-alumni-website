import { createClient } from "@/lib/supabase/server";

export type NewsStatus = "draft" | "published" | "archived";
export type NewsType = "news" | "announcement" | "blog";

export type NewsListItem = {
  id: string;
  title: string;
  slug: string;
  type: NewsType;
  status: NewsStatus;
  category_name: string | null;
  published_at: string | null;
  created_at: string;
  cover_url: string | null;
};

export type NewsDetail = NewsListItem & {
  excerpt: string | null;
  content_text: string;
  tags: string[];
};

const LIST_COLUMNS =
  "id, title, slug, type, status, published_at, created_at, category:kida_news_categories(name), cover_media:kida_media(url)";

function toListItem(row: {
  id: string;
  title: string;
  slug: string;
  type: NewsType;
  status: NewsStatus;
  published_at: string | null;
  created_at: string;
  category: { name: string } | { name: string }[] | null;
  cover_media: { url: string } | { url: string }[] | null;
}): NewsListItem {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const cover = Array.isArray(row.cover_media) ? row.cover_media[0] : row.cover_media;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    status: row.status,
    published_at: row.published_at,
    created_at: row.created_at,
    category_name: category?.name ?? null,
    cover_url: cover?.url ?? null,
  };
}

export async function getNewsList({
  status,
  type,
  search,
  page = 1,
  pageSize = 20,
}: {
  status?: NewsStatus;
  type?: NewsType;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: NewsListItem[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("kida_news")
      .select(LIST_COLUMNS, { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("type", type);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, count, error } = await query;
    if (error) return { items: [], total: 0 };

    return {
      items: ((data ?? []) as unknown as Parameters<typeof toListItem>[0][]).map(toListItem),
      total: count ?? 0,
    };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getNewsStatusCounts(): Promise<Record<NewsStatus, number>> {
  const statuses: NewsStatus[] = ["draft", "published", "archived"];
  const counts: Record<NewsStatus, number> = { draft: 0, published: 0, archived: 0 };

  try {
    const supabase = await createClient();
    const results = await Promise.all(
      statuses.map((status) =>
        supabase
          .from("kida_news")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("status", status),
      ),
    );
    results.forEach((result, i) => {
      counts[statuses[i]] = result.count ?? 0;
    });
    return counts;
  } catch {
    return counts;
  }
}

export type NewsCategory = { id: string; name: string; slug: string };

export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("kida_news_categories").select("id, name, slug").order("name");
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getNewsById(id: string): Promise<NewsDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_news")
      .select(`${LIST_COLUMNS}, excerpt, content, tags`)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as Parameters<typeof toListItem>[0] & {
      excerpt: string | null;
      content: { type: string; data: { text?: string } }[];
      tags: string[];
    };

    return {
      ...toListItem(row),
      excerpt: row.excerpt,
      content_text: row.content?.[0]?.data?.text ?? "",
      tags: row.tags ?? [],
    };
  } catch {
    return null;
  }
}
