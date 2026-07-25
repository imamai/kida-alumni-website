import { createClient } from "@/lib/supabase/server";

export type FeaturedAlumniStatus = "active" | "inactive";

export type FeaturedAlumniListItem = {
  id: string;
  full_name: string;
  role_title: string;
  status: FeaturedAlumniStatus;
  sort_order: number;
  photo_url: string | null;
};

export type FeaturedAlumniDetail = FeaturedAlumniListItem & {
  bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
};

const LIST_COLUMNS = "id, full_name, role_title, status, sort_order, photo:kida_media(url)";

function toListItem(row: {
  id: string;
  full_name: string;
  role_title: string;
  status: FeaturedAlumniStatus;
  sort_order: number;
  photo: { url: string } | { url: string }[] | null;
}): FeaturedAlumniListItem {
  const photo = Array.isArray(row.photo) ? row.photo[0] : row.photo;
  return {
    id: row.id,
    full_name: row.full_name,
    role_title: row.role_title,
    status: row.status,
    sort_order: row.sort_order,
    photo_url: photo?.url ?? null,
  };
}

export async function getFeaturedAlumniList(): Promise<FeaturedAlumniListItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_featured_alumni")
      .select(LIST_COLUMNS)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return ((data ?? []) as unknown as Parameters<typeof toListItem>[0][]).map(toListItem);
  } catch {
    return [];
  }
}

export async function getFeaturedAlumniById(id: string): Promise<FeaturedAlumniDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_featured_alumni")
      .select(`${LIST_COLUMNS}, bio, linkedin_url, website_url`)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as Parameters<typeof toListItem>[0] & {
      bio: string | null;
      linkedin_url: string | null;
      website_url: string | null;
    };

    return {
      ...toListItem(row),
      bio: row.bio,
      linkedin_url: row.linkedin_url,
      website_url: row.website_url,
    };
  } catch {
    return null;
  }
}
