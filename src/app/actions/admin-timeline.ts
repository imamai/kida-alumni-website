"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff } from "@/lib/auth/roles";
import type { MilestoneStatus } from "@/lib/data/admin-timeline";

export type TimelineActionState = { status: "idle" | "error"; message?: string };

const milestoneSchema = z.object({
  year: z.string().trim().min(1),
  title: z.string().trim().min(2),
  description: z.string().trim().min(2),
  sort_order: z.coerce.number().int().min(0),
  status: z.enum(["active", "inactive"]),
});

function parseForm(formData: FormData) {
  return milestoneSchema.safeParse({
    year: formData.get("year"),
    title: formData.get("title"),
    description: formData.get("description"),
    sort_order: formData.get("sort_order") || 0,
    status: formData.get("status"),
  });
}

export async function createMilestone(
  _prevState: TimelineActionState,
  formData: FormData,
): Promise<TimelineActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("kida_timeline_milestones").insert(parsed.data);

  if (error) {
    return { status: "error", message: "Failed to add milestone." };
  }

  revalidatePath("/admin/timeline");
  revalidatePath("/", "layout");
  redirect("/admin/timeline");
}

export async function updateMilestone(
  id: string,
  _prevState: TimelineActionState,
  formData: FormData,
): Promise<TimelineActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("kida_timeline_milestones").update(parsed.data).eq("id", id);

  if (error) {
    return { status: "error", message: "Failed to save changes." };
  }

  revalidatePath("/admin/timeline");
  revalidatePath(`/admin/timeline/${id}`);
  revalidatePath("/", "layout");
  redirect("/admin/timeline");
}

export async function setMilestoneStatus(id: string, status: MilestoneStatus) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_timeline_milestones").update({ status }).eq("id", id);

  revalidatePath("/admin/timeline");
  revalidatePath("/", "layout");
}

export async function deleteMilestone(id: string) {
  if (!(await isStaff())) return;

  const supabase = await createClient();
  await supabase.from("kida_timeline_milestones").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/admin/timeline");
  revalidatePath("/", "layout");
  redirect("/admin/timeline");
}
