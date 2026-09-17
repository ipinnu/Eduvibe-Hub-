-- Replace recursive portal RLS policies with security-definer predicates.
-- Run after 202608170001_fix_portal_rls_recursion.sql.

begin;

create or replace function public.can_read_profile(target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select target_profile_id = (select auth.uid())
    or public.user_has_role(array['tutor_admin']::public.profile_role[])
    or exists (
      select 1
      from public.parent_child_links family
      join public.tutor_assignments assignment
        on assignment.student_id = family.student_id
      where family.parent_id = target_profile_id
        and assignment.tutor_id = (select auth.uid())
        and public.user_has_role(array['partner_tutor']::public.profile_role[])
    );
$$;

create or replace function public.can_read_parent_child_link(
  target_parent_id uuid,
  target_student_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select public.user_has_role(array['tutor_admin']::public.profile_role[])
    or target_parent_id = (select auth.uid())
    or exists (
      select 1
      from public.tutor_assignments assignment
      where assignment.student_id = target_student_id
        and assignment.tutor_id = (select auth.uid())
        and public.user_has_role(array['partner_tutor']::public.profile_role[])
    )
    or exists (
      select 1
      from public.students learner
      where learner.id = target_student_id
        and learner.child_profile_id = (select auth.uid())
    );
$$;

drop policy if exists "users read own profile" on public.profiles;
drop policy if exists "admins read profiles" on public.profiles;
drop policy if exists "staff read linked family profiles" on public.profiles;

create policy "portal users read allowed profiles"
on public.profiles
for select
to authenticated
using (public.can_read_profile(id));

drop policy if exists "staff read students" on public.students;

create policy "participants read students"
on public.students
for select
to authenticated
using (public.can_access_student(id));

drop policy if exists "linked users read parent child links" on public.parent_child_links;

create policy "linked users read parent child links"
on public.parent_child_links
for select
to authenticated
using (public.can_read_parent_child_link(parent_id, student_id));

revoke all on function public.can_read_profile(uuid) from public;
revoke all on function public.can_read_parent_child_link(uuid, uuid) from public;

grant execute on function public.can_read_profile(uuid) to authenticated;
grant execute on function public.can_read_parent_child_link(uuid, uuid) to authenticated;

commit;
