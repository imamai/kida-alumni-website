-- KIDA — Kibabiians Development Association
-- Extensions and shared helper functions used across every kida_ table.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm"; -- fuzzy/ILIKE search for the alumni directory later

-- Generic updated_at trigger, attached to every kida_ table with an updated_at column.
create or replace function kida_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- True if the current JWT belongs to a user holding the given role name (see kida_user_roles).
create or replace function kida_has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from kida_user_roles ur
    join kida_roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.name = role_name
      and ur.deleted_at is null
  );
$$;

-- True if the current JWT belongs to a user holding any staff/admin-tier role.
-- Kept in sync with the ADMIN_ROLE_NAMES list in src/lib/auth/roles.ts.
create or replace function kida_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from kida_user_roles ur
    join kida_roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and ur.deleted_at is null
      and r.name in (
        'super_admin',
        'administrator',
        'content_manager',
        'membership_officer',
        'finance_officer',
        'event_manager',
        'communications_officer'
      )
  );
$$;

-- True if the current JWT belongs to a Super Admin or Administrator (top-tier access only —
-- audit logs, role management, system settings).
create or replace function kida_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from kida_user_roles ur
    join kida_roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and ur.deleted_at is null
      and r.name in ('super_admin', 'administrator')
  );
$$;

comment on function kida_has_role(text) is 'RLS helper: does the current user hold the named role?';
comment on function kida_is_staff() is 'RLS helper: does the current user hold any staff/admin-tier role?';
comment on function kida_is_admin() is 'RLS helper: is the current user a Super Admin or Administrator?';
