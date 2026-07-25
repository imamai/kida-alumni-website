"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type VerifyMembershipState = {
  status: "idle" | "error" | "not_found" | "found";
  message?: string;
  result?: { full_name: string; graduation_year: number | null };
};

const verifySchema = z.object({
  admission_number: z.string().trim().min(1),
});

export async function verifyMembership(
  _prevState: VerifyMembershipState,
  formData: FormData,
): Promise<VerifyMembershipState> {
  const parsed = verifySchema.safeParse({ admission_number: formData.get("admission_number") });
  if (!parsed.success) {
    return { status: "error", message: "Enter an admission number." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("kida_verify_membership", {
      p_admission_number: parsed.data.admission_number,
    });

    if (error) {
      return { status: "error", message: "Something went wrong. Please try again." };
    }

    const match = data?.[0];
    if (!match) {
      return { status: "not_found" };
    }

    return { status: "found", result: { full_name: match.full_name, graduation_year: match.graduation_year } };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
