"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const subscribeSchema = z.object({
  email: z.string().trim().email(),
  source: z.string().optional(),
});

export type SubscribeState = { status: "idle" | "success" | "error"; message?: string };

export async function subscribeToNewsletter(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") ?? undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("kida_newsletter_subscribers").upsert(
    {
      email: parsed.data.email.toLowerCase(),
      source: parsed.data.source ?? "website",
      status: "subscribed",
    },
    { onConflict: "email" },
  );

  if (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "You're subscribed — welcome to the KIDA community." };
}
