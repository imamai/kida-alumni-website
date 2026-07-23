-- Role-based access control: kida_roles, kida_permissions, kida_role_permissions, kida_user_roles.

create table kida_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, -- machine name, e.g. 'county_coordinator'
  label text not null, -- display name, e.g. 'County Coordinator'
  description text,
  is_system boolean not null default false, -- system roles can't be renamed/deleted via CMS
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger kida_roles_set_updated_at
  before update on kida_roles
  for each row execute function kida_set_updated_at();

create table kida_permissions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, -- e.g. 'news.publish'
  label text not null,
  category text not null, -- e.g. 'news', 'events', 'membership'
  created_at timestamptz not null default now()
);

create table kida_role_permissions (
  role_id uuid not null references kida_roles (id) on delete cascade,
  permission_id uuid not null references kida_permissions (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table kida_user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id uuid not null references kida_roles (id) on delete cascade,
  scope text, -- optional: county/chapter name for scoped roles (county_coordinator, chapter_leader)
  assigned_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, role_id, scope)
);

create trigger kida_user_roles_set_updated_at
  before update on kida_user_roles
  for each row execute function kida_set_updated_at();

create index kida_user_roles_user_id_idx on kida_user_roles (user_id) where deleted_at is null;
create index kida_user_roles_role_id_idx on kida_user_roles (role_id) where deleted_at is null;

-- Seed the system roles from the brief. Additional non-system roles can be created via the admin CMS.
insert into kida_roles (name, label, description, is_system) values
  ('super_admin', 'Super Admin', 'Full unrestricted access to every module.', true),
  ('administrator', 'Administrator', 'Manages users, settings, and all content.', true),
  ('content_manager', 'Content Manager', 'Manages CMS pages, news, gallery, and site content.', true),
  ('membership_officer', 'Membership Officer', 'Reviews and approves membership applications.', true),
  ('finance_officer', 'Finance Officer', 'Manages donations, payments, and financial reports.', true),
  ('event_manager', 'Event Manager', 'Creates and manages events, registrations, and check-ins.', true),
  ('communications_officer', 'Communications Officer', 'Sends newsletters, notifications, and announcements.', true),
  ('county_coordinator', 'County Coordinator', 'Coordinates alumni activity within an assigned county.', true),
  ('chapter_leader', 'Chapter Leader', 'Leads an international or regional chapter.', true),
  ('employer', 'Employer', 'Posts jobs and internships via the Career Centre.', true),
  ('mentor', 'Mentor', 'Offers mentorship to students and early-career alumni.', true),
  ('alumni', 'Alumni', 'Verified graduate of Kibabii High School.', true),
  ('student', 'Student', 'Current Kibabii High School student (limited access).', true),
  ('guest', 'Guest', 'Unauthenticated or unverified visitor.', true);

alter table kida_roles enable row level security;
alter table kida_permissions enable row level security;
alter table kida_role_permissions enable row level security;
alter table kida_user_roles enable row level security;

-- Roles/permissions are readable by anyone signed in (needed to render admin UI conditionally),
-- writable only by staff.
create policy "kida_roles_select_authenticated" on kida_roles
  for select to authenticated using (deleted_at is null);
create policy "kida_roles_write_staff" on kida_roles
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_permissions_select_authenticated" on kida_permissions
  for select to authenticated using (true);
create policy "kida_permissions_write_staff" on kida_permissions
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

create policy "kida_role_permissions_select_authenticated" on kida_role_permissions
  for select to authenticated using (true);
create policy "kida_role_permissions_write_staff" on kida_role_permissions
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());

-- Users can see their own role assignments; staff can see and manage everyone's.
create policy "kida_user_roles_select_own_or_staff" on kida_user_roles
  for select to authenticated using (user_id = auth.uid() or kida_is_staff());
create policy "kida_user_roles_write_staff" on kida_user_roles
  for all to authenticated using (kida_is_staff()) with check (kida_is_staff());
