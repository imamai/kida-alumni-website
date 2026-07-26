import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Defense in depth: proxy.ts already gates /admin and /portal by session, this re-checks role server-side. */
export async function isStaff(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("kida_is_staff");
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}

/** Top-tier only: Super Admin or Administrator. Required for role/permission management. */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("kida_is_admin");
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
