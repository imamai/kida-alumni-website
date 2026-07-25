import { createClient } from "@/lib/supabase/server";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  type: "news" | "announcement" | "blog";
  published_at: string | null;
  cover_media: { url: string; alt_text: string | null } | null;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  location_name: string | null;
  is_virtual: boolean;
  start_at: string;
  end_at: string | null;
  cover_media: { url: string; alt_text: string | null } | null;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_title: string | null;
  quote: string;
  author_photo: { url: string; alt_text: string | null } | null;
};

export type Partner = {
  id: string;
  name: string;
  website_url: string | null;
  tier: string | null;
  logo: { url: string; alt_text: string | null } | null;
};

export type LeadershipMember = {
  id: string;
  full_name: string;
  title: string;
  category: "executive" | "patron" | "committee";
  bio: string | null;
  county: string | null;
  linkedin_url: string | null;
  email: string | null;
  term_start: string | null;
  term_end: string | null;
  photo: { url: string; alt_text: string | null } | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

/** Every fetcher below fails soft to an empty array — the DB may not be migrated/seeded yet. */

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_news")
      .select("id, title, slug, excerpt, type, published_at, cover_media:kida_media(url, alt_text)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as NewsItem[];
  } catch {
    return [];
  }
}

export type NewsListPageItem = NewsItem & { category_name: string | null };

function toPublicListItem(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  type: "news" | "announcement" | "blog";
  published_at: string | null;
  cover_media: { url: string; alt_text: string | null } | { url: string; alt_text: string | null }[] | null;
  category: { name: string } | { name: string }[] | null;
}): NewsListPageItem {
  const cover = Array.isArray(row.cover_media) ? row.cover_media[0] : row.cover_media;
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    type: row.type,
    published_at: row.published_at,
    cover_media: cover ?? null,
    category_name: category?.name ?? null,
  };
}

export async function getPublishedNews({
  type,
  page = 1,
  pageSize = 9,
}: {
  type?: "news" | "announcement" | "blog";
  page?: number;
  pageSize?: number;
} = {}): Promise<{ items: NewsListPageItem[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("kida_news")
      .select(
        "id, title, slug, excerpt, type, published_at, cover_media:kida_media(url, alt_text), category:kida_news_categories(name)",
        { count: "exact" },
      )
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (type) query = query.eq("type", type);

    const { data, count, error } = await query;
    if (error) return { items: [], total: 0 };

    return {
      items: ((data ?? []) as unknown as Parameters<typeof toPublicListItem>[0][]).map(toPublicListItem),
      total: count ?? 0,
    };
  } catch {
    return { items: [], total: 0 };
  }
}

export type NewsDetailPageItem = NewsListPageItem & { tags: string[]; content_text: string };

export async function getNewsBySlug(slug: string): Promise<NewsDetailPageItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_news")
      .select(
        "id, title, slug, excerpt, type, published_at, content, tags, cover_media:kida_media(url, alt_text), category:kida_news_categories(name)",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as Parameters<typeof toPublicListItem>[0] & {
      content: { type: string; data: { text?: string } }[];
      tags: string[];
    };

    return {
      ...toPublicListItem(row),
      tags: row.tags ?? [],
      content_text: row.content?.[0]?.data?.text ?? "",
    };
  } catch {
    return null;
  }
}

export async function getUpcomingEvents(limit = 3): Promise<EventItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_events")
      .select(
        "id, title, slug, category, location_name, is_virtual, start_at, end_at, cover_media:kida_media(url, alt_text)",
      )
      .eq("status", "published")
      .is("deleted_at", null)
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(limit);
    return (data ?? []) as unknown as EventItem[];
  } catch {
    return [];
  }
}

const EVENT_LIST_COLUMNS =
  "id, title, slug, category, location_name, is_virtual, start_at, end_at, cover_media:kida_media(url, alt_text)";

export async function getPublishedEvents({
  when = "upcoming",
  page = 1,
  pageSize = 9,
}: {
  when?: "upcoming" | "past";
  page?: number;
  pageSize?: number;
} = {}): Promise<{ items: EventItem[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const now = new Date().toISOString();

    let query = supabase
      .from("kida_events")
      .select(EVENT_LIST_COLUMNS, { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null)
      .range(from, to);

    query =
      when === "upcoming"
        ? query.gte("start_at", now).order("start_at", { ascending: true })
        : query.lt("start_at", now).order("start_at", { ascending: false });

    const { data, count, error } = await query;
    if (error) return { items: [], total: 0 };

    return { items: (data ?? []) as unknown as EventItem[], total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export type EventDetailPageItem = EventItem & {
  description: string | null;
  content_text: string;
  address: string | null;
  county: string | null;
  country: string | null;
  virtual_link: string | null;
  timezone: string;
  capacity: number | null;
  requires_registration: boolean;
  ticket_price: number;
  currency: string;
};

export async function getEventBySlug(slug: string): Promise<EventDetailPageItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_events")
      .select(
        `${EVENT_LIST_COLUMNS}, description, content, address, county, country, virtual_link, timezone, capacity, requires_registration, ticket_price, currency`,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as EventItem & {
      description: string | null;
      content: { type: string; data: { text?: string } }[];
      address: string | null;
      county: string | null;
      country: string | null;
      virtual_link: string | null;
      timezone: string;
      capacity: number | null;
      requires_registration: boolean;
      ticket_price: number;
      currency: string;
    };

    return {
      ...row,
      content_text: row.content?.[0]?.data?.text ?? "",
    };
  } catch {
    return null;
  }
}

export type FeaturedAlumniItem = {
  id: string;
  full_name: string;
  role_title: string;
  photo: { url: string; alt_text: string | null } | null;
};

export async function getFeaturedAlumni(limit = 4): Promise<FeaturedAlumniItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_featured_alumni")
      .select("id, full_name, role_title, photo:kida_media(url, alt_text)")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .limit(limit);
    return (data ?? []) as unknown as FeaturedAlumniItem[];
  } catch {
    return [];
  }
}

export type TimelineMilestone = {
  id: string;
  year: string;
  title: string;
  description: string;
};

export async function getTimelineMilestones(): Promise<TimelineMilestone[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_timeline_milestones")
      .select("id, year, title, description")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export type HallOfFameItem = FeaturedAlumniItem & {
  bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
};

export async function getHallOfFame(): Promise<HallOfFameItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_featured_alumni")
      .select("id, full_name, role_title, bio, linkedin_url, website_url, photo:kida_media(url, alt_text)")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    return (data ?? []) as unknown as HallOfFameItem[];
  } catch {
    return [];
  }
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_testimonials")
      .select("id, author_name, author_title, quote, author_photo:kida_media(url, alt_text)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .limit(limit);
    return (data ?? []) as unknown as Testimonial[];
  } catch {
    return [];
  }
}

export async function getActivePartners(): Promise<Partner[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_partners")
      .select("id, name, website_url, tier, logo:kida_media(url, alt_text)")
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    return (data ?? []) as unknown as Partner[];
  } catch {
    return [];
  }
}

export type GalleryAlbumSummary = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_media: { url: string; alt_text: string | null } | null;
  item_count: number;
};

export async function getPublishedAlbums({
  page = 1,
  pageSize = 12,
}: { page?: number; pageSize?: number } = {}): Promise<{ items: GalleryAlbumSummary[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("kida_gallery_albums")
      .select(
        "id, title, slug, description, cover_media:kida_media(url, alt_text), items:kida_gallery_items(count)",
        { count: "exact" },
      )
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .range(from, to);

    if (error) return { items: [], total: 0 };

    const items = (
      data as unknown as {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        cover_media: { url: string; alt_text: string | null } | { url: string; alt_text: string | null }[] | null;
        items: { count: number }[];
      }[]
    ).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      cover_media: Array.isArray(row.cover_media) ? (row.cover_media[0] ?? null) : row.cover_media,
      item_count: row.items?.[0]?.count ?? 0,
    }));

    return { items, total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export type GalleryPhoto = {
  id: string;
  caption: string | null;
  url: string;
  alt_text: string | null;
};

export type GalleryAlbumWithPhotos = GalleryAlbumSummary & { photos: GalleryPhoto[] };

export async function getAlbumBySlug(slug: string): Promise<GalleryAlbumWithPhotos | null> {
  try {
    const supabase = await createClient();
    const { data: album, error } = await supabase
      .from("kida_gallery_albums")
      .select("id, title, slug, description, cover_media:kida_media(url, alt_text)")
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !album) return null;

    const { data: items } = await supabase
      .from("kida_gallery_items")
      .select("id, caption, media:kida_media(url, alt_text)")
      .eq("album_id", (album as { id: string }).id)
      .order("sort_order", { ascending: true });

    const row = album as unknown as {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      cover_media: { url: string; alt_text: string | null } | { url: string; alt_text: string | null }[] | null;
    };

    const photos = (
      (items ?? []) as unknown as {
        id: string;
        caption: string | null;
        media: { url: string; alt_text: string | null } | { url: string; alt_text: string | null }[] | null;
      }[]
    ).map((item) => {
      const media = Array.isArray(item.media) ? item.media[0] : item.media;
      return { id: item.id, caption: item.caption, url: media?.url ?? "", alt_text: media?.alt_text ?? null };
    });

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      cover_media: Array.isArray(row.cover_media) ? (row.cover_media[0] ?? null) : row.cover_media,
      item_count: photos.length,
      photos,
    };
  } catch {
    return null;
  }
}

export async function getGalleryPreview(limit = 6): Promise<GalleryPhoto[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_gallery_items")
      .select("id, caption, media:kida_media(url, alt_text), album:kida_gallery_albums!inner(status)")
      .eq("album.status", "published")
      .is("album.deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];

    return (
      (data ?? []) as unknown as {
        id: string;
        caption: string | null;
        media: { url: string; alt_text: string | null } | { url: string; alt_text: string | null }[] | null;
      }[]
    ).map((item) => {
      const media = Array.isArray(item.media) ? item.media[0] : item.media;
      return { id: item.id, caption: item.caption, url: media?.url ?? "", alt_text: media?.alt_text ?? null };
    });
  } catch {
    return [];
  }
}

export async function getLeadership(category?: "executive" | "patron" | "committee"): Promise<LeadershipMember[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kida_leadership")
      .select(
        "id, full_name, title, category, bio, county, linkedin_url, email, term_start, term_end, photo:kida_media(url, alt_text)",
      )
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    return (data ?? []) as unknown as LeadershipMember[];
  } catch {
    return [];
  }
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kida_faqs")
      .select("id, question, answer, category")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    return (data ?? []) as unknown as Faq[];
  } catch {
    return [];
  }
}

export type PublicDocument = {
  id: string;
  url: string;
  caption: string | null;
  size_bytes: number | null;
  folder: string;
  created_at: string;
};

/** Documents uploaded via the Media Library (type = 'document'), used by /downloads and governance links. */
export async function getDocuments(folder?: string): Promise<PublicDocument[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kida_media")
      .select("id, url, caption, size_bytes, folder, created_at")
      .eq("type", "document")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (folder) query = query.eq("folder", folder);
    const { data, error } = await query;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
