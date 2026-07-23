-- Leadership directory, testimonials, partners/sponsors, and FAQs — all CMS-managed.

create table kida_leadership (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null, -- e.g. 'Chairperson', 'Patron', 'Treasurer'
  category text not null default 'executive' check (category in ('executive', 'patron', 'committee')),
  bio text,
  photo_media_id uuid references kida_media (id) on delete set null,
  term_start date,
  term_end date,
  county text,
  linkedin_url text,
  email text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_leadership_set_updated_at
  before update on kida_leadership
  for each row execute function kida_set_updated_at();

create table kida_testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  author_photo_media_id uuid references kida_media (id) on delete set null,
  quote text not null,
  rating smallint check (rating between 1 and 5),
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_testimonials_set_updated_at
  before update on kida_testimonials
  for each row execute function kida_set_updated_at();

create table kida_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_media_id uuid references kida_media (id) on delete set null,
  website_url text,
  type text not null default 'partner' check (type in ('partner', 'sponsor')),
  tier text check (tier in ('gold', 'silver', 'bronze')),
  description text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_partners_set_updated_at
  before update on kida_partners
  for each row execute function kida_set_updated_at();

create table kida_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_faqs_set_updated_at
  before update on kida_faqs
  for each row execute function kida_set_updated_at();

alter table kida_leadership enable row level security;
alter table kida_testimonials enable row level security;
alter table kida_partners enable row level security;
alter table kida_faqs enable row level security;

create policy "kida_leadership_select_active" on kida_leadership
  for select to anon, authenticated using (status = 'active' and deleted_at is null);
create policy "kida_leadership_select_staff" on kida_leadership for select to authenticated using (kida_is_staff());
create policy "kida_leadership_write_staff" on kida_leadership for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_testimonials_select_published" on kida_testimonials
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "kida_testimonials_select_staff" on kida_testimonials for select to authenticated using (kida_is_staff());
create policy "kida_testimonials_write_staff" on kida_testimonials for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_partners_select_active" on kida_partners
  for select to anon, authenticated using (status = 'active' and deleted_at is null);
create policy "kida_partners_select_staff" on kida_partners for select to authenticated using (kida_is_staff());
create policy "kida_partners_write_staff" on kida_partners for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_faqs_select_published" on kida_faqs
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "kida_faqs_select_staff" on kida_faqs for select to authenticated using (kida_is_staff());
create policy "kida_faqs_write_staff" on kida_faqs for all to authenticated using (kida_is_staff()) with check (kida_is_staff());
