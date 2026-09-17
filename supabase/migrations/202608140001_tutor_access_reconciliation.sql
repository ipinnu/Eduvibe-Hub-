-- EduVibe Hub tutor and tutor-assistant access reconciliation.
-- Run after 202608020002_learning_operations.sql and
-- 202608020003_security_and_reliability.sql.

begin;

-- The lead tutor can manage every learner. A tutor assistant can only work
-- with learners explicitly linked through tutor_assignments.
create or replace function public.can_teach_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
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

revoke all on function public.can_teach_student(uuid) from public;
revoke all on function public.can_access_student(uuid) from public;
grant execute on function public.can_teach_student(uuid) to authenticated;
grant execute on function public.can_access_student(uuid) to authenticated;

-- Replace the broad foundation policy. Assistants may only see family links
-- belonging to one of their assigned learners.
drop policy if exists "linked users read parent child links" on public.parent_child_links;
create policy "linked users read parent child links"
on public.parent_child_links
for select
to authenticated
using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or parent_id = (select auth.uid())
  or exists (
    select 1
    from public.tutor_assignments assignment
    where assignment.student_id = parent_child_links.student_id
      and assignment.tutor_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.students learner
    where learner.id = parent_child_links.student_id
      and learner.child_profile_id = (select auth.uid())
  )
);

-- Keep session ownership and learner assignment aligned for assistants.
drop policy if exists "staff create assigned sessions" on public.sessions;
create policy "staff create assigned sessions"
on public.sessions
for insert
to authenticated
with check (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (
    tutor_id = (select auth.uid())
    and public.can_teach_student(student_id)
  )
);

drop policy if exists "staff update assigned sessions" on public.sessions;
create policy "staff update assigned sessions"
on public.sessions
for update
to authenticated
using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (
    tutor_id = (select auth.uid())
    and public.can_teach_student(student_id)
  )
)
with check (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (
    tutor_id = (select auth.uid())
    and public.can_teach_student(student_id)
  )
);

drop policy if exists "staff delete assigned sessions" on public.sessions;
create policy "staff delete assigned sessions"
on public.sessions
for delete
to authenticated
using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (
    tutor_id = (select auth.uid())
    and public.can_teach_student(student_id)
  )
);

-- Fail the deployment transaction if any tutor-side object is still missing.
do $$
declare
  required_table text;
begin
  foreach required_table in array array[
    'profiles', 'students', 'tutor_assignments', 'sessions',
    'curricula', 'curriculum_nodes', 'student_curricula',
    'student_progress', 'lesson_reviews', 'lesson_private_notes',
    'student_private_notes', 'homework', 'lesson_boards', 'reports',
    'notifications', 'notification_preferences', 'google_connections',
    'contact_requests'
  ]
  loop
    if to_regclass('public.' || required_table) is null then
      raise exception 'Required tutor portal table is missing: %', required_table;
    end if;
  end loop;
end;
$$;

commit;
