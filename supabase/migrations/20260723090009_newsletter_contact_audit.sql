-- Newsletter subscribers, contact form submissions, and the platform-wide audit log.

create table kida_newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  source text, -- e.g. 'homepage_footer', 'event_registration'
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kida_newsletter_subscribers_set_updated_at
  before update on kida_newsletter_subscribers
  for each row execute function kida_set_updated_at();

create table kida_contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  handled_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kida_contact_submissions_set_updated_at
  before update on kida_contact_submissions
  for each row execute function kida_set_updated_at();

-- Append-only audit trail for sensitive writes (role changes, membership approvals, settings edits, ...).
-- Populated from Server Actions/Route Handlers, not database triggers, so it can capture actor + reason context.
create table kida_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id),
  action text not null, -- e.g. 'membership.approve', 'role.assign', 'settings.update'
  entity_type text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index kida_audit_logs_entity_idx on kida_audit_logs (entity_type, entity_id);
create index kida_audit_logs_actor_id_idx on kida_audit_logs (actor_id);
create index kida_audit_logs_created_at_idx on kida_audit_logs (created_at desc);

alter table kida_newsletter_subscribers enable row level security;
alter table kida_contact_submissions enable row level security;
alter table kida_audit_logs enable row level security;

-- Anyone can subscribe/submit the contact form; only staff can read the results.
create policy "kida_newsletter_subscribers_insert_anyone" on kida_newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy "kida_newsletter_subscribers_select_staff" on kida_newsletter_subscribers
  for select to authenticated using (kida_is_staff());
create policy "kida_newsletter_subscribers_write_staff" on kida_newsletter_subscribers
  for update to authenticated using (kida_is_staff()) with check (kida_is_staff());
create policy "kida_newsletter_subscribers_delete_staff" on kida_newsletter_subscribers
  for delete to authenticated using (kida_is_staff());

create policy "kida_contact_submissions_insert_anyone" on kida_contact_submissions
  for insert to anon, authenticated with check (true);
create policy "kida_contact_submissions_select_staff" on kida_contact_submissions
  for select to authenticated using (kida_is_staff());
create policy "kida_contact_submissions_write_staff" on kida_contact_submissions
  for update to authenticated using (kida_is_staff()) with check (kida_is_staff());

-- Audit logs: admin-tier read only; inserts happen via the service-role client from trusted server code.
create policy "kida_audit_logs_select_admin" on kida_audit_logs
  for select to authenticated using (kida_is_admin());
