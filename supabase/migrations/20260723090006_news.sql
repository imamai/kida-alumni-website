-- News, announcements, and blog posts share one table distinguished by `type`.

create table kida_news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table kida_news (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references kida_news_categories (id) on delete set null,
  type text not null default 'news' check (type in ('news', 'announcement', 'blog')),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb not null default '[]',
  cover_media_id uuid references kida_media (id) on delete set null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  author_id uuid references auth.users (id),
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_news_set_updated_at
  before update on kida_news
  for each row execute function kida_set_updated_at();

create index kida_news_status_idx on kida_news (status) where deleted_at is null;
create index kida_news_published_at_idx on kida_news (published_at desc) where status = 'published';
create index kida_news_type_idx on kida_news (type) where deleted_at is null;

alter table kida_news_categories enable row level security;
alter table kida_news enable row level security;

create policy "kida_news_categories_select_all" on kida_news_categories for select to anon, authenticated using (true);
create policy "kida_news_categories_write_staff" on kida_news_categories for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_news_select_published" on kida_news
  for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "kida_news_select_staff" on kida_news
  for select to authenticated using (kida_is_staff());
create policy "kida_news_write_staff" on kida_news
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());
