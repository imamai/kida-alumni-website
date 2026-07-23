-- Central media library (backed by Supabase Storage) plus the public photo/video gallery.

create table kida_media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null, -- path within the 'kida-media' storage bucket
  url text not null, -- public URL
  type text not null default 'image' check (type in ('image', 'video', 'document')),
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  caption text,
  folder text not null default 'general',
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_media_set_updated_at
  before update on kida_media
  for each row execute function kida_set_updated_at();

create index kida_media_folder_idx on kida_media (folder) where deleted_at is null;

alter table kida_media enable row level security;

create policy "kida_media_select_all" on kida_media for select to anon, authenticated using (deleted_at is null);
create policy "kida_media_write_staff" on kida_media for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create table kida_gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_media_id uuid references kida_media (id) on delete set null,
  event_id uuid, -- FK to kida_events added once that table exists (see events migration)
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_gallery_albums_set_updated_at
  before update on kida_gallery_albums
  for each row execute function kida_set_updated_at();

create table kida_gallery_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references kida_gallery_albums (id) on delete cascade,
  media_id uuid not null references kida_media (id) on delete cascade,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index kida_gallery_items_album_id_idx on kida_gallery_items (album_id);

alter table kida_gallery_albums enable row level security;
alter table kida_gallery_items enable row level security;

create policy "kida_gallery_albums_select_published" on kida_gallery_albums
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "kida_gallery_albums_select_staff" on kida_gallery_albums
  for select to authenticated using (kida_is_staff());
create policy "kida_gallery_albums_write_staff" on kida_gallery_albums
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_gallery_items_select_via_album" on kida_gallery_items
  for select to anon, authenticated using (
    exists (
      select 1 from kida_gallery_albums a
      where a.id = album_id and (a.status = 'published' or kida_is_staff())
    )
  );
create policy "kida_gallery_items_write_staff" on kida_gallery_items
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());
