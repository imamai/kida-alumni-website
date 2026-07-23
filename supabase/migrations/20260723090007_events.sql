-- Events (AGM, homecoming, reunions, chapter meetings, ...) and registrations with QR check-in.

create table kida_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  content jsonb not null default '[]',
  category text not null default 'networking'
    check (category in ('agm', 'homecoming', 'reunion', 'networking', 'forum', 'county_meeting', 'international', 'other')),
  cover_media_id uuid references kida_media (id) on delete set null,
  location_name text,
  address text,
  county text,
  country text default 'Kenya',
  is_virtual boolean not null default false,
  virtual_link text,
  start_at timestamptz not null,
  end_at timestamptz,
  timezone text not null default 'Africa/Nairobi',
  capacity integer,
  registration_deadline timestamptz,
  requires_registration boolean not null default true,
  ticket_price numeric(10, 2) not null default 0,
  currency text not null default 'KES',
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled', 'completed')),
  organizer_id uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_events_set_updated_at
  before update on kida_events
  for each row execute function kida_set_updated_at();

create index kida_events_start_at_idx on kida_events (start_at);
create index kida_events_status_idx on kida_events (status) where deleted_at is null;

alter table kida_gallery_albums
  add constraint kida_gallery_albums_event_id_fkey
  foreign key (event_id) references kida_events (id) on delete set null;

create table kida_event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references kida_events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'registered'
    check (status in ('registered', 'waitlisted', 'cancelled', 'attended')),
  qr_code text not null unique default encode(gen_random_bytes(16), 'hex'),
  checked_in_at timestamptz,
  guests_count integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create trigger kida_event_registrations_set_updated_at
  before update on kida_event_registrations
  for each row execute function kida_set_updated_at();

create index kida_event_registrations_event_id_idx on kida_event_registrations (event_id);
create index kida_event_registrations_user_id_idx on kida_event_registrations (user_id);

alter table kida_events enable row level security;
alter table kida_event_registrations enable row level security;

create policy "kida_events_select_published" on kida_events
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "kida_events_select_staff" on kida_events
  for select to authenticated using (kida_is_staff());
create policy "kida_events_write_staff" on kida_events
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_event_registrations_select_own_or_staff" on kida_event_registrations
  for select to authenticated using (user_id = auth.uid() or kida_is_staff());
create policy "kida_event_registrations_insert_own" on kida_event_registrations
  for insert to authenticated with check (user_id = auth.uid());
create policy "kida_event_registrations_update_own_or_staff" on kida_event_registrations
  for update to authenticated
  using (user_id = auth.uid() or kida_is_staff())
  with check (user_id = auth.uid() or kida_is_staff());
create policy "kida_event_registrations_delete_staff" on kida_event_registrations
  for delete to authenticated using (kida_is_staff());
