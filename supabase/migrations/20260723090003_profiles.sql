-- kida_profiles: one row per auth.users, the core identity record for the alumni directory,
-- portal, and membership workflow. Richer history (multiple employers, degrees, awards) lands
-- as normalized kida_profile_employment / kida_profile_education tables with the Alumni Portal
-- module; for now those are kept as lightweight arrays/JSON so the directory and portal shell
-- have something real to render against.

create table kida_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  admission_number text unique,
  full_name text not null,
  preferred_name text,
  gender text check (gender in ('male', 'female', 'prefer_not_to_say')),
  date_of_birth date,
  graduation_year smallint check (graduation_year between 1960 and 2100),
  county text,
  country text not null default 'Kenya',
  city text,
  phone text,
  avatar_url text,
  cover_photo_url text,
  bio text,
  profession text,
  employer text,
  industry text,
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  linkedin_url text,
  github_url text,
  website_url text,
  cv_url text,
  visibility text not null default 'alumni_only'
    check (visibility in ('public', 'alumni_only', 'private')),
  is_mentor_available boolean not null default false,
  is_volunteer_available boolean not null default false,
  membership_status text not null default 'pending'
    check (membership_status in ('pending', 'verified', 'rejected', 'suspended')),
  verified_at timestamptz,
  verified_by uuid references auth.users (id),
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_profiles_set_updated_at
  before update on kida_profiles
  for each row execute function kida_set_updated_at();

create index kida_profiles_graduation_year_idx on kida_profiles (graduation_year) where deleted_at is null;
create index kida_profiles_county_idx on kida_profiles (county) where deleted_at is null;
create index kida_profiles_membership_status_idx on kida_profiles (membership_status) where deleted_at is null;
create index kida_profiles_full_name_trgm_idx on kida_profiles using gin (full_name gin_trgm_ops);

alter table kida_profiles enable row level security;

create policy "kida_profiles_select_visible" on kida_profiles
  for select to authenticated using (
    deleted_at is null and (
      id = auth.uid()
      or kida_is_staff()
      or visibility = 'public'
      or (visibility = 'alumni_only' and kida_has_role('alumni'))
    )
  );

-- Unauthenticated visitors can only see explicitly public profiles (Hall of Fame, directory teasers).
create policy "kida_profiles_select_public_anon" on kida_profiles
  for select to anon using (deleted_at is null and visibility = 'public');

create policy "kida_profiles_insert_own" on kida_profiles
  for insert to authenticated with check (id = auth.uid());

create policy "kida_profiles_update_own_or_staff" on kida_profiles
  for update to authenticated
  using (id = auth.uid() or kida_is_staff())
  with check (id = auth.uid() or kida_is_staff());

create policy "kida_profiles_delete_staff" on kida_profiles
  for delete to authenticated using (kida_is_staff());

-- Provisions a kida_profiles row and a default 'alumni' role the moment someone signs up.
create or replace function kida_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_role_id uuid;
begin
  insert into kida_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;

  select id into default_role_id from kida_roles where name = 'alumni';
  if default_role_id is not null then
    insert into kida_user_roles (user_id, role_id)
    values (new.id, default_role_id)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger kida_on_auth_user_created
  after insert on auth.users
  for each row execute function kida_handle_new_user();
