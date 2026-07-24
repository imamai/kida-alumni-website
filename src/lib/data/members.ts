import { createClient } from "@/lib/supabase/server";

export type MembershipStatus = "pending" | "verified" | "rejected" | "suspended";

export type MemberListItem = {
  id: string;
  full_name: string;
  admission_number: string | null;
  graduation_year: number | null;
  county: string | null;
  country: string;
  membership_status: MembershipStatus;
  avatar_url: string | null;
  created_at: string;
};

export type MemberDetail = MemberListItem & {
  preferred_name: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  profession: string | null;
  employer: string | null;
  industry: string | null;
  skills: string[];
  interests: string[];
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  visibility: "public" | "alumni_only" | "private";
  verified_at: string | null;
  is_mentor_available: boolean;
  is_volunteer_available: boolean;
};

const LIST_COLUMNS =
  "id, full_name, admission_number, graduation_year, county, country, membership_status, avatar_url, created_at";

const DETAIL_COLUMNS = `${LIST_COLUMNS}, preferred_name, phone, city, bio, profession, employer, industry, skills, interests, linkedin_url, github_url, website_url, visibility, verified_at, is_mentor_available, is_volunteer_available`;

export async function getMembers({
  status,
  search,
  page = 1,
  pageSize = 20,
}: {
  status?: MembershipStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: MemberListItem[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("kida_profiles")
      .select(LIST_COLUMNS, { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status) query = query.eq("membership_status", status);
    if (search) query = query.ilike("full_name", `%${search}%`);

    const { data, count, error } = await query;
    if (error) return { items: [], total: 0 };

    return { items: (data ?? []) as unknown as MemberListItem[], total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getMemberById(id: string): Promise<MemberDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_profiles")
      .select(DETAIL_COLUMNS)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as MemberDetail;
  } catch {
    return null;
  }
}

export async function getMembershipStatusCounts(): Promise<Record<MembershipStatus, number>> {
  const statuses: MembershipStatus[] = ["pending", "verified", "rejected", "suspended"];
  const counts: Record<MembershipStatus, number> = { pending: 0, verified: 0, rejected: 0, suspended: 0 };

  try {
    const supabase = await createClient();
    const results = await Promise.all(
      statuses.map((status) =>
        supabase
          .from("kida_profiles")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("membership_status", status),
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
