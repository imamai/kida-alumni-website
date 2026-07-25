-- Curated "Our Journey" timeline shown on the homepage (mirrors kida_featured_alumni /
-- kida_leadership: a standalone, admin-managed ordered list rather than derived data).

create table kida_timeline_milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_timeline_milestones_set_updated_at
  before update on kida_timeline_milestones
  for each row execute function kida_set_updated_at();

create index kida_timeline_milestones_status_idx on kida_timeline_milestones (status) where deleted_at is null;

alter table kida_timeline_milestones enable row level security;

create policy "kida_timeline_milestones_select_active" on kida_timeline_milestones
  for select to anon, authenticated using (status = 'active' and deleted_at is null);
create policy "kida_timeline_milestones_select_staff" on kida_timeline_milestones
  for select to authenticated using (kida_is_staff());
create policy "kida_timeline_milestones_write_staff" on kida_timeline_milestones
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

insert into kida_timeline_milestones (year, title, description, sort_order) values
  ('1985', 'Kibabii High School Founded', 'The institution opens its doors in Bungoma County, setting the foundation for generations of leaders.', 1),
  ('1998', 'KIDA Established', 'Alumni formally organize as the Kibabiians Development Association to support their alma mater.', 2),
  ('2006', 'First Scholarship Fund', 'KIDA launches its first bursary programme for needy students at Kibabii High School.', 3),
  ('2014', 'County & Diaspora Chapters', 'Regional and international chapters form, extending the KIDA network across Kenya and abroad.', 4),
  ('2026', 'The Digital KIDA Platform', 'A world-class alumni portal launches — networking, mentorship, and giving in one place.', 5);
