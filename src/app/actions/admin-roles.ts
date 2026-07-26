"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin, getCurrentUser } from "@/lib/auth/roles";
import { STAFF_ROLE_NAMES, DEFAULT_STAFF_ROLE } from "@/lib/data/admin-roles";

export type RoleActionState = { status: "idle" | "error" | "success"; message?: string };

export async function grantStaffAccess(userId: string) {
  if (!(await isAdmin())) return;

  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  const { data: role } = await supabase
    .from("kida_roles")
    .select("id")
    .eq("name", DEFAULT_STAFF_ROLE)
    .maybeSingle();
  if (!role) return;

  const { data: existing } = await supabase
    .from("kida_user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role_id", role.id)
    .is("scope", null)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("kida_user_roles")
      .update({ deleted_at: null, assigned_by: currentUser?.id })
      .eq("id", existing.id);
  } else {
    await supabase.from("kida_user_roles").insert({
      user_id: userId,
      role_id: role.id,
      assigned_by: currentUser?.id,
    });
  }

  revalidatePath("/admin/roles");
}

export async function revokeStaffAccess(userId: string) {
  if (!(await isAdmin())) return;

  const currentUser = await getCurrentUser();
  if (currentUser?.id === userId) return; // can't revoke your own access

  const supabase = await createClient();
  const { data: staffRoles } = await supabase.from("kida_roles").select("id").in("name", STAFF_ROLE_NAMES);
  const roleIds = (staffRoles ?? []).map((r) => r.id);
  if (roleIds.length === 0) return;

  await supabase
    .from("kida_user_roles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", userId)
    .in("role_id", roleIds)
    .is("deleted_at", null);

  revalidatePath("/admin/roles");
}
