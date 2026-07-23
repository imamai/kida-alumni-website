-- Live homepage statistics, computed from real data instead of the static kida_settings fallback.
-- Counts only — no PII — so it's safe to read publicly.

create materialized view kida_mv_alumni_stats as
select
  1 as id,
  count(*) filter (where membership_status = 'verified') as verified_alumni_count,
  count(distinct county) filter (where county is not null) as counties_represented,
  count(distinct graduation_year) filter (where graduation_year is not null) as graduation_years_represented,
  now() as refreshed_at
from kida_profiles
where deleted_at is null;

create unique index kida_mv_alumni_stats_id_idx on kida_mv_alumni_stats (id);

grant select on kida_mv_alumni_stats to anon, authenticated;

-- Call after bulk membership approvals, or on a schedule (pg_cron / a nightly job) once volume justifies it.
create or replace function kida_refresh_alumni_stats()
returns void
language sql
security definer
set search_path = public
as $$
  refresh materialized view concurrently kida_mv_alumni_stats;
$$;

comment on function kida_refresh_alumni_stats() is 'Refreshes kida_mv_alumni_stats; call after membership approvals or on a schedule.';
