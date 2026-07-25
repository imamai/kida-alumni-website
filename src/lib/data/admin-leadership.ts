import { createClient } from "@/lib/supabase/server";

export type LeadershipStatus = "active" | "inactive";
export type LeadershipCategory = "executive" | "patron" | "committee";

export type LeadershipListItem = {
  id: string;
  full_name: string;
  title: string;
  category: LeadershipCategory;
  status: LeadershipStatus;
  sort_order: number;
  photo_url: string | null;
};

export type LeadershipDetail = LeadershipListItem & {
  bio: string | null;
  term_start: string | null;
  term_end: string | null;
  county: string | null;
  linkedin_url: string | null;
  email: string | null;
};

const LIST_COLUMNS = "id, full_name, title, category, status, sort_order, photo:kida_media(url)";

function toListItem(row: {
  id: string;
  full_name: string;
  title: string;
  category: LeadershipCategory;
  status: LeadershipStatus;
  sort_order: number;
  photo: { url: string } | { url: string }[] | null;
}): LeadershipListItem {
  const photo = Array.isArray(row.photo) ? row.photo[0] : row.photo;
  return {
    id: row.id,
    full_name: row.full_name,
    title: row.title,
    category: row.category,
    status: row.status,
    sort_order: row.sort_order,
    photo_url: photo?.url ?? null,
  };
}

export async function getLeadershipList(): Promise<LeadershipListItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_leadership")
      .select(LIST_COLUMNS)
      .is("deleted_at", null)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) return [];
    return ((data ?? []) as unknown as Parameters<typeof toListItem>[0][]).map(toListItem);
  } catch {
    return [];
  }
}

export async function getLeadershipById(id: string): Promise<LeadershipDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_leadership")
      .select(`${LIST_COLUMNS}, bio, term_start, term_end, county, linkedin_url, email`)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as Parameters<typeof toListItem>[0] & {
      bio: string | null;
      term_start: string | null;
      term_end: string | null;
      county: string | null;
      linkedin_url: string | null;
      email: string | null;
    };

    return {
      ...toListItem(row),
      bio: row.bio,
      term_start: row.term_start,
      term_end: row.term_end,
      county: row.county,
      linkedin_url: row.linkedin_url,
      email: row.email,
    };
  } catch {
    return null;
  }
}
