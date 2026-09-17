-- EduVibe Hub security, integrity, and operational hardening.
-- Run after 202608020002_learning_operations.sql.

alter table public.sessions add column if not exists time_zone text not null default 'Africa/Lagos';
alter table public.homework add column if not exists time_zone text not null default 'Africa/Lagos';

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null check (char_length(parent_name) between 1 and 100),
  child_name text not null check (char_length(child_name) between 1 and 100),
  year_group text not null check (char_length(year_group) between 1 and 50),
  subjects text[] not null default '{}',
  preferred_days text[] not null default '{}',
  whatsapp text not null check (char_length(whatsapp) between 7 and 32),
  note text not null default '' check (char_length(note) <= 2000),
  fingerprint_hash text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_requests_rate_limit_idx on public.contact_requests(fingerprint_hash, created_at desc);
alter table public.contact_requests enable row level security;
revoke all on public.contact_requests from anon, authenticated;
grant select, update on public.contact_requests to authenticated;

create or replace function public.submit_contact_request(
  p_parent_name text,
  p_child_name text,
  p_year_group text,
  p_subjects text[],
  p_preferred_days text[],
  p_whatsapp text,
  p_note text,
  p_fingerprint_hash text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare request_id uuid;
begin
  if char_length(trim(p_parent_name)) not between 1 and 100
    or char_length(trim(p_child_name)) not between 1 and 100
    or char_length(trim(p_year_group)) not between 1 and 50
    or char_length(trim(p_whatsapp)) not between 7 and 32
    or char_length(coalesce(p_note, '')) > 2000
    or p_fingerprint_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid contact request';
  end if;
  if (select count(*) from public.contact_requests where fingerprint_hash = p_fingerprint_hash and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'Too many contact requests';
  end if;
  insert into public.contact_requests(parent_name, child_name, year_group, subjects, preferred_days, whatsapp, note, fingerprint_hash)
  values (trim(p_parent_name), trim(p_child_name), trim(p_year_group), coalesce(p_subjects, '{}'), coalesce(p_preferred_days, '{}'), trim(p_whatsapp), coalesce(trim(p_note), ''), p_fingerprint_hash)
  returning id into request_id;
  return request_id;
end;
$$;

revoke all on function public.submit_contact_request(text,text,text,text[],text[],text,text,text) from public;
grant execute on function public.submit_contact_request(text,text,text,text[],text[],text,text,text) to anon, authenticated;

create policy "admins read contact requests" on public.contact_requests for select to authenticated
using (public.user_has_role(array['tutor_admin']::public.profile_role[]));
create policy "admins update contact requests" on public.contact_requests for update to authenticated
using (public.user_has_role(array['tutor_admin']::public.profile_role[]))
with check (public.user_has_role(array['tutor_admin']::public.profile_role[]));

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'parent', new.email);
  return new;
end;
$$;

drop policy if exists "staff manage sessions" on public.sessions;
create policy "staff create assigned sessions" on public.sessions for insert to authenticated
with check (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (tutor_id = (select auth.uid()) and public.can_teach_student(student_id))
);
create policy "staff update assigned sessions" on public.sessions for update to authenticated
using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (tutor_id = (select auth.uid()) and public.can_teach_student(student_id))
)
with check (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (tutor_id = (select auth.uid()) and public.can_teach_student(student_id))
);
create policy "staff delete assigned sessions" on public.sessions for delete to authenticated
using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (tutor_id = (select auth.uid()) and public.can_teach_student(student_id))
);

drop policy if exists "participants create boards" on public.lesson_boards;
create policy "staff create boards" on public.lesson_boards for insert to authenticated
with check (public.can_teach_student(student_id));

create or replace function public.validate_session_student_link()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare linked_student uuid;
begin
  if new.session_id is null then return new; end if;
  select student_id into linked_student from public.sessions where id = new.session_id;
  if linked_student is null or linked_student is distinct from new.student_id then
    raise exception 'The selected lesson does not belong to this student';
  end if;
  return new;
end;
$$;

drop trigger if exists lesson_reviews_validate_session on public.lesson_reviews;
create trigger lesson_reviews_validate_session before insert or update on public.lesson_reviews for each row execute function public.validate_session_student_link();
drop trigger if exists lesson_private_notes_validate_session on public.lesson_private_notes;
create trigger lesson_private_notes_validate_session before insert or update on public.lesson_private_notes for each row execute function public.validate_session_student_link();
drop trigger if exists lesson_boards_validate_session on public.lesson_boards;
create trigger lesson_boards_validate_session before insert or update on public.lesson_boards for each row execute function public.validate_session_student_link();
drop trigger if exists homework_validate_session on public.homework;
create trigger homework_validate_session before insert or update on public.homework for each row execute function public.validate_session_student_link();

create or replace function public.validate_curriculum_parent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare parent_curriculum uuid;
begin
  if new.parent_id is null then return new; end if;
  if new.parent_id = new.id then raise exception 'A curriculum item cannot be its own parent'; end if;
  select curriculum_id into parent_curriculum from public.curriculum_nodes where id = new.parent_id;
  if parent_curriculum is null or parent_curriculum is distinct from new.curriculum_id then
    raise exception 'Parent item must belong to the same learning path';
  end if;
  return new;
end;
$$;

drop trigger if exists curriculum_nodes_validate_parent on public.curriculum_nodes;
create trigger curriculum_nodes_validate_parent before insert or update on public.curriculum_nodes for each row execute function public.validate_curriculum_parent();

create or replace function public.protect_notification_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.recipient_id is distinct from old.recipient_id
    or new.title is distinct from old.title
    or new.body is distinct from old.body
    or new.link is distinct from old.link
    or new.channel is distinct from old.channel
    or new.created_at is distinct from old.created_at then
    raise exception 'Notification identity and content cannot be changed';
  end if;
  if (select auth.uid()) = old.recipient_id then
    if new.emailed_at is distinct from old.emailed_at or new.email_error is distinct from old.email_error then
      raise exception 'Recipients may only change notification read state';
    end if;
  elsif public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]) then
    if new.read_at is distinct from old.read_at then
      raise exception 'Staff may only change notification delivery state';
    end if;
  else
    raise exception 'Notification update is not allowed';
  end if;
  return new;
end;
$$;

drop trigger if exists contact_requests_set_updated_at on public.contact_requests;
create trigger contact_requests_set_updated_at before update on public.contact_requests for each row execute function public.set_updated_at();
