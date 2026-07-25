import { createClient } from "@/lib/supabase/server";
import type { EventCategory } from "@/lib/event-categories";

export type { EventCategory } from "@/lib/event-categories";
export { EVENT_CATEGORIES } from "@/lib/event-categories";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export type EventListItem = {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  status: EventStatus;
  start_at: string;
  end_at: string | null;
  location_name: string | null;
  is_virtual: boolean;
  cover_url: string | null;
  created_at: string;
};

export type EventDetail = EventListItem & {
  description: string | null;
  content_text: string;
  address: string | null;
  county: string | null;
  country: string | null;
  virtual_link: string | null;
  timezone: string;
  capacity: number | null;
  registration_deadline: string | null;
  requires_registration: boolean;
  ticket_price: number;
  currency: string;
};

const LIST_COLUMNS =
  "id, title, slug, category, status, start_at, end_at, location_name, is_virtual, created_at, cover_media:kida_media(url)";

function toListItem(row: {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  status: EventStatus;
  start_at: string;
  end_at: string | null;
  location_name: string | null;
  is_virtual: boolean;
  created_at: string;
  cover_media: { url: string } | { url: string }[] | null;
}): EventListItem {
  const cover = Array.isArray(row.cover_media) ? row.cover_media[0] : row.cover_media;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    status: row.status,
    start_at: row.start_at,
    end_at: row.end_at,
    location_name: row.location_name,
    is_virtual: row.is_virtual,
    created_at: row.created_at,
    cover_url: cover?.url ?? null,
  };
}

export async function getEventsList({
  status,
  search,
  page = 1,
  pageSize = 20,
}: {
  status?: EventStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: EventListItem[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("kida_events")
      .select(LIST_COLUMNS, { count: "exact" })
      .is("deleted_at", null)
      .order("start_at", { ascending: false })
      .range(from, to);

    if (status) query = query.eq("status", status);
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

export async function getEventById(id: string): Promise<EventDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_events")
      .select(
        `${LIST_COLUMNS}, description, content, address, county, country, virtual_link, timezone, capacity, registration_deadline, requires_registration, ticket_price, currency`,
      )
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as Parameters<typeof toListItem>[0] & {
      description: string | null;
      content: { type: string; data: { text?: string } }[];
      address: string | null;
      county: string | null;
      country: string | null;
      virtual_link: string | null;
      timezone: string;
      capacity: number | null;
      registration_deadline: string | null;
      requires_registration: boolean;
      ticket_price: number;
      currency: string;
    };

    return {
      ...toListItem(row),
      description: row.description,
      content_text: row.content?.[0]?.data?.text ?? "",
      address: row.address,
      county: row.county,
      country: row.country,
      virtual_link: row.virtual_link,
      timezone: row.timezone,
      capacity: row.capacity,
      registration_deadline: row.registration_deadline,
      requires_registration: row.requires_registration,
      ticket_price: row.ticket_price,
      currency: row.currency,
    };
  } catch {
    return null;
  }
}

export async function getEventStatusCounts(): Promise<Record<EventStatus, number>> {
  const statuses: EventStatus[] = ["draft", "published", "cancelled", "completed"];
  const counts: Record<EventStatus, number> = { draft: 0, published: 0, cancelled: 0, completed: 0 };

  try {
    const supabase = await createClient();
    const results = await Promise.all(
      statuses.map((status) =>
        supabase
          .from("kida_events")
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
