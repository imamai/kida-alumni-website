"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isStaff, getCurrentUser } from "@/lib/auth/roles";

export type SettingsActionState = { status: "idle" | "success" | "error"; message?: string };

const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_LOGO_BYTES = 5 * 1024 * 1024;

export async function uploadLogo(_prevState: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose an image file to upload." };
  }
  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    return { status: "error", message: "Logo must be a PNG, JPEG, WebP, or SVG image." };
  }
  if (file.size > MAX_LOGO_BYTES) {
    return { status: "error", message: "Logo must be smaller than 5MB." };
  }

  const supabase = await createClient();
  const user = await getCurrentUser();
  const ext = file.name.split(".").pop() || "png";
  const path = `branding/logo-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("kida-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    return { status: "error", message: "Upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("kida-media").getPublicUrl(path);

  await supabase.from("kida_media").insert({
    storage_path: path,
    url: publicUrl,
    type: "image",
    mime_type: file.type,
    size_bytes: file.size,
    folder: "branding",
    uploaded_by: user?.id,
  });

  const { error: settingsError } = await supabase
    .from("kida_settings")
    .update({ value: publicUrl, updated_by: user?.id })
    .eq("key", "logo_url");

  if (settingsError) {
    return { status: "error", message: "Logo uploaded but settings update failed." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return { status: "success", message: "Logo updated across the site." };
}

const brandingSchema = z.object({
  site_name: z.string().trim().min(2),
  site_short_name: z.string().trim().min(1),
  tagline: z.string().trim().min(1),
  contact_email: z.string().trim().email(),
  contact_phone: z.string().trim().min(1),
  contact_address: z.string().trim().min(1),
});

export async function updateBrandingSettings(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = brandingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const user = await getCurrentUser();

  const updates = Object.entries(parsed.data).map(([key, value]) =>
    supabase.from("kida_settings").update({ value, updated_by: user?.id }).eq("key", key),
  );
  const results = await Promise.all(updates);
  if (results.some((r) => r.error)) {
    return { status: "error", message: "Some settings failed to save." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return { status: "success", message: "Branding settings saved." };
}

const ALLOWED_HERO_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_HERO_IMAGE_BYTES = 8 * 1024 * 1024;

const heroSchema = z.object({
  eyebrow: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  subheadline: z.string().trim().min(1),
  primary_cta_label: z.string().trim().min(1),
  primary_cta_href: z.string().trim().min(1),
  secondary_cta_label: z.string().trim().min(1),
  secondary_cta_href: z.string().trim().min(1),
});

export async function updateHeroSettings(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const parsed = heroSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const supabase = await createClient();
  const user = await getCurrentUser();

  let mediaUrl: string | undefined;
  const file = formData.get("hero_image");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_HERO_IMAGE_TYPES.includes(file.type)) {
      return { status: "error", message: "Hero image must be a PNG, JPEG, or WebP image." };
    }
    if (file.size > MAX_HERO_IMAGE_BYTES) {
      return { status: "error", message: "Hero image must be smaller than 8MB." };
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `hero/background-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("kida-media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      return { status: "error", message: "Hero image upload failed." };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("kida-media").getPublicUrl(path);

    await supabase.from("kida_media").insert({
      storage_path: path,
      url: publicUrl,
      type: "image",
      mime_type: file.type,
      size_bytes: file.size,
      folder: "hero",
      uploaded_by: user?.id,
    });

    mediaUrl = publicUrl;
  }

  const { data: existing } = await supabase.from("kida_settings").select("value").eq("key", "hero").maybeSingle();
  const existingHero = (existing?.value ?? {}) as Partial<{ media_type: string; media_url: string }>;

  const { error } = await supabase
    .from("kida_settings")
    .update({
      value: {
        ...parsed.data,
        media_type: existingHero.media_type ?? "image",
        media_url: mediaUrl ?? existingHero.media_url,
      },
      updated_by: user?.id,
    })
    .eq("key", "hero");

  if (error) {
    return { status: "error", message: "Failed to save hero section." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return { status: "success", message: "Hero section saved." };
}

const impactStatSchema = z.object({
  label: z.string().trim().min(1),
  value: z.coerce.number().int().min(0),
  suffix: z.string().trim().optional(),
});
const impactStatsSchema = z.array(impactStatSchema).min(1).max(8);

export async function updateImpactStats(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  if (!(await isStaff())) {
    return { status: "error", message: "You don't have permission to do that." };
  }

  const count = Number(formData.get("stat_count") ?? 0);
  const stats = Array.from({ length: count }, (_, i) => ({
    label: formData.get(`stat_${i}_label`),
    value: formData.get(`stat_${i}_value`),
    suffix: formData.get(`stat_${i}_suffix`) || undefined,
  }));

  const parsed = impactStatsSchema.safeParse(stats);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }

  const cleaned = parsed.data.map((stat) => ({
    label: stat.label,
    value: stat.value,
    ...(stat.suffix ? { suffix: stat.suffix } : {}),
  }));

  const supabase = await createClient();
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("kida_settings")
    .update({ value: cleaned, updated_by: user?.id })
    .eq("key", "impact_stats");

  if (error) {
    return { status: "error", message: "Failed to save statistics." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return { status: "success", message: "Homepage statistics saved." };
}
