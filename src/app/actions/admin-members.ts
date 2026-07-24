"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";
import type { MembershipStatus } from "@/lib/data/members";

export async function updateMembershipStatus(id: string, status: MembershipStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  const user = await getCurrentUser();

  await supabase
    .from("kida_profiles")
    .update({
      membership_status: status,
      verified_at: status === "verified" ? new Date().toISOString() : null,
      verified_by: status === "verified" ? user?.id : null,
    })
    .eq("id", id);

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}`);
  revalidatePath("/admin");
}
