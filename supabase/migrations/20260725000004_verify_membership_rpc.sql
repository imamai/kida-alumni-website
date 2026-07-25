-- Public "Verify Membership" lookup by admission number. kida_profiles RLS only lets anon see
-- rows with visibility = 'public', which would make verification fail for members who've kept
-- their profile private — but confirming *membership status* isn't the same as exposing their
-- directory listing. This SECURITY DEFINER function returns only the minimum needed to confirm
-- membership (name, grad year, status), and only for rows that are actually verified.
create or replace function kida_verify_membership(p_admission_number text)
returns table(full_name text, graduation_year int, membership_status text)
language sql
security definer
set search_path = public
stable
as $$
  select full_name, graduation_year, membership_status
  from kida_profiles
  where admission_number = p_admission_number
    and deleted_at is null
    and membership_status = 'verified'
  limit 1;
$$;

grant execute on function kida_verify_membership(text) to anon, authenticated;
