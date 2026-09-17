-- Fix portal login/profile reads blocked by recursive RLS evaluation.
-- Symptom: authenticated profile reads can fail with
-- "infinite recursion detected in policy for relation parent_child_links".
--
-- Cause: policies call helper functions and linked-profile subqueries that
-- eventually inspect profiles/parent_child_links again. These helpers must run
-- as security-definer helpers with row security disabled, otherwise a simple
-- profile role lookup can recursively invoke the policies that depend on it.

begin;

create or replace function public.user_has_role(allowed_roles public.profile_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles profile
    where profile.id = (select auth.uid())
      and profile.role = any(allowed_roles)
  );
$$;

create or replace function public.can_teach_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select public.user_has_role(array['tutor_admin']::public.profile_role[])
    or (
      public.user_has_role(array['partner_tutor']::public.profile_role[])
      and exists (
        select 1
        from public.tutor_assignments assignment
        where assignment.student_id = target_student_id
          and assignment.tutor_id = (select auth.uid())
      )
    );
$$;

create or replace function public.can_access_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select public.can_teach_student(target_student_id)
    or exists (
      select 1
      from public.parent_child_links family
      where family.student_id = target_student_id
        and family.parent_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.students learner
      where learner.id = target_student_id
        and learner.child_profile_id = (select auth.uid())
    );
$$;

revoke all on function public.user_has_role(public.profile_role[]) from public;
revoke all on function public.can_teach_student(uuid) from public;
revoke all on function public.can_access_student(uuid) from public;

grant execute on function public.user_has_role(public.profile_role[]) to anon, authenticated;
grant execute on function public.can_teach_student(uuid) to authenticated;
grant execute on function public.can_access_student(uuid) to authenticated;

commit;
