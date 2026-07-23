import { createClient } from "@/lib/supabase/server";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  type: "news" | "announcement" | "blog";
  published_at: string | null;
  cover_media: { url: string; alt_text: string | null } | null;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  location_name: string | null;
  is_virtual: boolean;
  start_at: string;
  end_at: string | null;
  cover_media: { url: string; alt_text: string | null } | null;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_title: string | null;
  quote: string;
  author_photo: { url: string; alt_text: string | null } | null;
};

export type Partner = {
  id: string;
  name: string;
  website_url: string | null;
  tier: string | null;
  logo: { url: string; alt_text: string | null } | null;
};

export type LeadershipMember = {
  id: string;
  full_name: string;
  title: string;
  category: "executive" | "patron" | "committee";
  bio: string | null;
  photo: { url: string; alt_text: string | null } | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

/** Every fetcher below fails soft to an empty array — the DB may not be migrated/seeded yet. */

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_news")
      .select("id, title, slug, excerpt, type, published_at, cover_media:kida_media(url, alt_text)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as NewsItem[];
  } catch {
    return [];
  }
}

export async function getUpcomingEvents(limit = 3): Promise<EventItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_events")
      .select(
        "id, title, slug, category, location_name, is_virtual, start_at, end_at, cover_media:kida_media(url, alt_text)",
      )
      .eq("status", "published")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(limit);
    return (data ?? []) as unknown as EventItem[];
  } catch {
    return [];
  }
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_testimonials")
      .select("id, author_name, author_title, quote, author_photo:kida_media(url, alt_text)")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .limit(limit);
    return (data ?? []) as unknown as Testimonial[];
  } catch {
    return [];
  }
}

export async function getActivePartners(): Promise<Partner[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("kida_partners")
      .select("id, name, website_url, tier, logo:kida_media(url, alt_text)")
      .eq("status", "active")
      .order("sort_order", { ascending: true });
    return (data ?? []) as unknown as Partner[];
  } catch {
    return [];
  }
}

export async function getLeadership(category?: "executive" | "patron" | "committee"): Promise<LeadershipMember[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kida_leadership")
      .select("id, full_name, title, category, bio, photo:kida_media(url, alt_text)")
      .eq("status", "active")
      .order("sort_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    return (data ?? []) as unknown as LeadershipMember[];
  } catch {
    return [];
  }
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kida_faqs")
      .select("id, question, answer, category")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data } = await query;
    return (data ?? []) as unknown as Faq[];
  } catch {
    return [];
  }
}
