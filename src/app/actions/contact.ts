"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)."),
});

export type ContactState = { status: "idle" | "success" | "error"; message?: string };

export async function submitContactForm(_prevState: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("kida_contact_submissions").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "Thank you — the KIDA team will get back to you shortly." };
}
