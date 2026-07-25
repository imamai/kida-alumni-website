import { createClient } from "@/lib/supabase/server";

export type HeroSettings = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  media_type: "image" | "video";
  media_url: string;
};

export type ImpactStat = {
  label: string;
  value: number;
  suffix?: string;
};

export type SocialLinks = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

export type AboutContent = {
  story: string;
  vision: string;
  mission: string;
  objectives: string;
};

export type AuthPanelSettings = {
  image_url: string;
  quote: string;
  quote_author: string;
};

export type SiteSettings = {
  site_name: string;
  site_short_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_links: SocialLinks;
  hero: HeroSettings;
  impact_stats: ImpactStat[];
  about: AboutContent;
  auth_panel: AuthPanelSettings;
};

// Fallbacks mirror the seed data in supabase/migrations/20260723090004_cms_core.sql so the site
// still renders sensibly before migrations are applied or if a key is ever deleted from the CMS.
export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Kibabiians Development Association",
  site_short_name: "KIDA",
  tagline: "Advancing our Prosperity",
  logo_url: "/brand/kida-logo-placeholder.svg",
  favicon_url: "/favicon.ico",
  contact_email: "info@kida.or.ke",
  contact_phone: "+254 700 000000",
  contact_address: "Kibabii High School, Bungoma County, Kenya",
  social_links: { facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "" },
  hero: {
    eyebrow: "The Alumni Organisation of Kibabii High School",
    headline: "Advancing our Prosperity, Together.",
    subheadline:
      "KIDA connects generations of Kibabiians for lifelong networking, mentorship, and community impact.",
    primary_cta_label: "Become a Member",
    primary_cta_href: "/membership/become-member",
    secondary_cta_label: "Explore the Directory",
    secondary_cta_href: "/directory",
    media_type: "image",
    media_url:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2400&auto=format&fit=crop",
  },
  impact_stats: [
    { label: "Registered Alumni", value: 12500, suffix: "+" },
    { label: "Counties Represented", value: 47 },
    { label: "Scholarships Awarded", value: 320, suffix: "+" },
    { label: "Diaspora Countries", value: 18 },
  ],
  about: {
    story:
      "Since 1998, KIDA has united generations of Kibabii High School graduates under one banner — “Advancing our Prosperity.” What began as informal reunions among former students has grown into a structured association with county chapters, a diaspora network, scholarship programmes, and a growing digital community connecting Kibabiians across the world.",
    vision:
      "To be the leading alumni association in Kenya, empowering Kibabiians to achieve excellence and give back to their community.",
    mission:
      "To connect, develop, and mobilize Kibabii High School alumni for lifelong networking, mentorship, and the sustained growth of our alma mater.",
    objectives:
      "Strengthen alumni networks, support scholarships and school infrastructure, promote mentorship, and champion the achievements of Kibabiians everywhere.",
  },
  auth_panel: {
    image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
    quote:
      "Once a Kibabiian, always a Kibabiian. This platform keeps that bond alive across every county and continent.",
    quote_author: "KIDA Executive Committee",
  },
};

/**
 * Reads the kida_settings key/value table and merges it over DEFAULT_SETTINGS, so the site keeps
 * rendering even before the schema/seed data exists or if the request runs unauthenticated.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("kida_settings").select("key, value");

    if (error || !data) return DEFAULT_SETTINGS;

    const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
