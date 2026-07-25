import { createClient } from "@/lib/supabase/server";

export type MilestoneStatus = "active" | "inactive";

export type MilestoneItem = {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
  status: MilestoneStatus;
};

const COLUMNS = "id, year, title, description, sort_order, status";

export async function getMilestonesList(): Promise<MilestoneItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_timeline_milestones")
      .select(COLUMNS)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getMilestoneById(id: string): Promise<MilestoneItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kida_timeline_milestones")
      .select(COLUMNS)
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}
