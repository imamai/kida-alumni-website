"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { status: "idle" | "error" | "success"; message?: string };

const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional(),
});

export async function signInWithPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: "Incorrect email or password." };
  }

  redirect(parsed.data.next && parsed.data.next.startsWith("/") ? parsed.data.next : "/portal");
}

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  admissionNumber: z.string().trim().optional(),
  graduationYear: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
});

export async function signUpWithPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    admissionNumber: formData.get("admissionNumber") || undefined,
    graduationYear: formData.get("graduationYear") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        admission_number: parsed.data.admissionNumber,
        graduation_year: parsed.data.graduationYear,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message: "Check your email to confirm your account. Your membership is reviewed once you sign in.",
  };
}

export async function signInWithGoogle(next?: string) {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
