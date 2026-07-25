-- Curated "Featured Alumni" spotlight shown on the homepage. Standalone from kida_profiles so
-- staff can showcase distinguished Kibabiians immediately, without requiring them to have an
-- alumni account yet (mirrors kida_leadership / kida_testimonials).

create table kida_featured_alumni (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null, -- e.g. 'Class of 2004 · Cardiothoracic Surgeon'
  bio text,
  photo_media_id uuid references kida_media (id) on delete set null,
  linkedin_url text,
  website_url text,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_featured_alumni_set_updated_at
  before update on kida_featured_alumni
  for each row execute function kida_set_updated_at();

create index kida_featured_alumni_status_idx on kida_featured_alumni (status) where deleted_at is null;

alter table kida_featured_alumni enable row level security;

create policy "kida_featured_alumni_select_active" on kida_featured_alumni
  for select to anon, authenticated using (status = 'active' and deleted_at is null);
create policy "kida_featured_alumni_select_staff" on kida_featured_alumni
  for select to authenticated using (kida_is_staff());
create policy "kida_featured_alumni_write_staff" on kida_featured_alumni
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());
