import { createClient } from "@/lib/supabase/server";

/** Kept in sync with kida_is_staff() in supabase/migrations/20260723090001_extensions_and_helpers.sql. */
export const STAFF_ROLE_NAMES = [
  "super_admin",
  "administrator",
  "content_manager",
  "membership_officer",
  "finance_officer",
  "event_manager",
  "communications_officer",
] as const;

/** Role granted by the simple "Grant Staff Access" toggle. */
export const DEFAULT_STAFF_ROLE = "administrator";

export type RoleAssignment = { name: string; label: string };

export type MemberRoleRow = {
  id: string;
  full_name: string;
  admission_number: string | null;
  avatar_url: string | null;
  roles: RoleAssignment[];
  is_staff: boolean;
};

export async function getMembersWithRoles({
  search,
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ items: MemberRoleRow[]; total: number }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("kida_profiles")
      .select("id, full_name, admission_number, avatar_url", { count: "exact" })
      .is("deleted_at", null)
      .order("full_name", { ascending: true })
      .range(from, to);

    if (search) query = query.ilike("full_name", `%${search}%`);

    const { data: profiles, count, error } = await query;
    if (error || !profiles) return { items: [], total: 0 };

    const ids = profiles.map((p) => p.id);
    const { data: userRoles } = await supabase
      .from("kida_user_roles")
      .select("user_id, role:kida_roles(name, label)")
      .in("user_id", ids)
      .is("deleted_at", null);

    const rolesByUser = new Map<string, RoleAssignment[]>();
    for (const row of (userRoles ?? []) as unknown as {
      user_id: string;
      role: RoleAssignment | RoleAssignment[] | null;
    }[]) {
      const role = Array.isArray(row.role) ? row.role[0] : row.role;
      if (!role) continue;
      const existing = rolesByUser.get(row.user_id) ?? [];
      existing.push(role);
      rolesByUser.set(row.user_id, existing);
    }

    const items = profiles.map((profile) => {
      const roles = rolesByUser.get(profile.id) ?? [];
      return {
        ...profile,
        roles,
        is_staff: roles.some((r) => (STAFF_ROLE_NAMES as readonly string[]).includes(r.name)),
      };
    });

    return { items, total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}
