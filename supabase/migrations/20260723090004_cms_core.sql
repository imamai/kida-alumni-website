-- CMS core: kida_settings, kida_menus/kida_menu_items, kida_pages, kida_seo.
-- Everything rendered on the public site is meant to be driven from these tables — no hardcoded copy.

-- Site-wide public configuration (site name, logo, hero content, contact info, social links, stats).
-- This table is for PUBLIC-safe configuration only — never store secrets/API keys here.
create table kida_settings (
  key text primary key,
  value jsonb not null,
  label text not null,
  "group" text not null default 'general', -- e.g. 'branding', 'contact', 'homepage', 'social'
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

create trigger kida_settings_set_updated_at
  before update on kida_settings
  for each row execute function kida_set_updated_at();

alter table kida_settings enable row level security;

create policy "kida_settings_select_all" on kida_settings
  for select to anon, authenticated using (true);
create policy "kida_settings_write_staff" on kida_settings
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

insert into kida_settings (key, value, label, "group") values
  ('site_name', '"Kibabiians Development Association"', 'Site Name', 'branding'),
  ('site_short_name', '"KIDA"', 'Short Name', 'branding'),
  ('tagline', '"Advancing our Prosperity"', 'Tagline', 'branding'),
  ('logo_url', '"/brand/kida-logo-placeholder.svg"', 'Logo URL', 'branding'),
  ('favicon_url', '"/favicon.ico"', 'Favicon URL', 'branding'),
  ('contact_email', '"info@kida.or.ke"', 'Contact Email', 'contact'),
  ('contact_phone', '"+254 700 000000"', 'Contact Phone', 'contact'),
  ('contact_address', '"Kibabii High School, Bungoma County, Kenya"', 'Contact Address', 'contact'),
  ('social_links', '{"facebook":"","twitter":"","instagram":"","linkedin":"","youtube":""}', 'Social Links', 'social'),
  (
    'hero',
    '{"eyebrow":"The Alumni Organisation of Kibabii High School","headline":"Advancing our Prosperity, Together.","subheadline":"KIDA connects generations of Kibabiians for lifelong networking, mentorship, and community impact.","primary_cta_label":"Become a Member","primary_cta_href":"/membership/become-member","secondary_cta_label":"Explore the Directory","secondary_cta_href":"/directory","media_type":"image","media_url":"https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2400&auto=format&fit=crop"}',
    'Homepage Hero',
    'homepage'
  ),
  (
    'impact_stats',
    '[{"label":"Registered Alumni","value":12500,"suffix":"+"},{"label":"Counties Represented","value":47},{"label":"Scholarships Awarded","value":320,"suffix":"+"},{"label":"Diaspora Countries","value":18}]',
    'Impact Statistics',
    'homepage'
  );

-- Navigation menus (header, footer, portal sidebar, ...).
create table kida_menus (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, -- e.g. 'primary', 'footer'
  location text not null, -- 'header' | 'footer' | 'portal'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kida_menus_set_updated_at
  before update on kida_menus
  for each row execute function kida_set_updated_at();

create table kida_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content jsonb not null default '[]', -- ordered array of content blocks: [{ "type": "richtext" | "hero" | "stats" | ..., "data": {...} }]
  template text not null default 'default',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  author_id uuid references auth.users (id),
  parent_id uuid references kida_pages (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_pages_set_updated_at
  before update on kida_pages
  for each row execute function kida_set_updated_at();

create index kida_pages_status_idx on kida_pages (status) where deleted_at is null;
create index kida_pages_parent_id_idx on kida_pages (parent_id) where deleted_at is null;

create table kida_menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references kida_menus (id) on delete cascade,
  parent_id uuid references kida_menu_items (id) on delete cascade,
  label text not null,
  url text, -- external or internal href; takes precedence if page_id is null
  page_id uuid references kida_pages (id) on delete set null,
  sort_order integer not null default 0,
  open_in_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kida_menu_items_set_updated_at
  before update on kida_menu_items
  for each row execute function kida_set_updated_at();

create index kida_menu_items_menu_id_idx on kida_menu_items (menu_id);

alter table kida_menus enable row level security;
alter table kida_menu_items enable row level security;
alter table kida_pages enable row level security;

create policy "kida_menus_select_all" on kida_menus for select to anon, authenticated using (true);
create policy "kida_menus_write_staff" on kida_menus for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_menu_items_select_all" on kida_menu_items for select to anon, authenticated using (true);
create policy "kida_menu_items_write_staff" on kida_menu_items for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_pages_select_published" on kida_pages
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "kida_pages_select_staff" on kida_pages
  for select to authenticated using (kida_is_staff());
create policy "kida_pages_write_staff" on kida_pages
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

-- Per-entity SEO overrides (pages, news, events, ...) instead of duplicating SEO columns everywhere.
create table kida_seo (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- 'page' | 'news' | 'event' | ...
  entity_id uuid not null,
  meta_title text,
  meta_description text,
  og_image_url text,
  canonical_url text,
  no_index boolean not null default false,
  structured_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id)
);

create trigger kida_seo_set_updated_at
  before update on kida_seo
  for each row execute function kida_set_updated_at();

alter table kida_seo enable row level security;

create policy "kida_seo_select_all" on kida_seo for select to anon, authenticated using (true);
create policy "kida_seo_write_staff" on kida_seo for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

-- Seed the primary header/footer menus so navigation renders from day one.
insert into kida_menus (name, location) values ('primary', 'header'), ('footer', 'footer');
