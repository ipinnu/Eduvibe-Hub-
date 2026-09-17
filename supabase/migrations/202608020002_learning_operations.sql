-- EduVibe Hub learning operations
-- Run after 202608020001_portal_foundation.sql.

create type public.attendance_status as enum ('pending', 'present', 'late', 'absent', 'excused');
create type public.homework_status as enum ('assigned', 'submitted', 'reviewed', 'overdue');
create type public.progress_status as enum ('not_started', 'introduced', 'needs_practice', 'developing', 'confident', 'mastered');
create type public.report_period as enum ('weekly', 'monthly');
create type public.report_status as enum ('draft', 'published');
create type public.curriculum_node_type as enum ('subject', 'topic', 'skill', 'milestone');
create type public.notification_channel as enum ('in_app', 'email', 'both');

alter table public.students
  add column if not exists date_of_birth date,
  add column if not exists preferred_name text,
  add column if not exists learning_goals text not null default '',
  add column if not exists accommodations text not null default '',
  add column if not exists active boolean not null default true;

alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where p.id = u.id and p.email is null;

alter table public.sessions
  add column if not exists title text not null default 'Learning session',
  add column if not exists attendance public.attendance_status not null default 'pending',
  add column if not exists calendar_sync_status text not null default 'local',
  add column if not exists calendar_sync_error text,
  add column if not exists board_locked boolean not null default false;

create table public.curricula (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.curriculum_nodes (
  id uuid primary key default gen_random_uuid(),
  curriculum_id uuid not null references public.curricula(id) on delete cascade,
  parent_id uuid references public.curriculum_nodes(id) on delete cascade,
  node_type public.curriculum_node_type not null default 'skill',
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_curricula (
  student_id uuid not null references public.students(id) on delete cascade,
  curriculum_id uuid not null references public.curricula(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null,
  notes text not null default '',
  assigned_at timestamptz not null default now(),
  primary key (student_id, curriculum_id)
);

create table public.student_progress (
  student_id uuid not null references public.students(id) on delete cascade,
  curriculum_node_id uuid not null references public.curriculum_nodes(id) on delete cascade,
  status public.progress_status not null default 'not_started',
  evidence text not null default '',
  assessed_by uuid references public.profiles(id) on delete set null,
  assessed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, curriculum_node_id)
);

create table public.lesson_reviews (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  summary text not null default '',
  strengths text not null default '',
  focus_next text not null default '',
  engagement smallint check (engagement between 1 and 5),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_private_notes (
  session_id uuid primary key references public.sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_private_notes (
  student_id uuid primary key references public.students(id) on delete cascade,
  note text not null default '',
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.homework (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete set null,
  assigned_by uuid references public.profiles(id) on delete set null,
  title text not null,
  instructions text not null default '',
  due_at timestamptz,
  resource_url text,
  submission_url text,
  submission_note text not null default '',
  feedback text not null default '',
  status public.homework_status not null default 'assigned',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_boards (
  session_id uuid primary key references public.sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  snapshot jsonb,
  revision bigint not null default 0,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  period public.report_period not null,
  period_start date not null,
  period_end date not null,
  title text not null,
  overview text not null default '',
  achievements text not null default '',
  focus_next text not null default '',
  attendance_summary text not null default '',
  homework_summary text not null default '',
  status public.report_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_period_valid check (period_end >= period_start)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  link text,
  channel public.notification_channel not null default 'in_app',
  read_at timestamptz,
  emailed_at timestamptz,
  email_error text,
  created_at timestamptz not null default now()
);

create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  session_reminders boolean not null default true,
  homework_updates boolean not null default true,
  report_updates boolean not null default true,
  email_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.google_connections (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  encrypted_access_token text not null,
  encrypted_refresh_token text,
  access_token_expires_at timestamptz,
  scope text not null default '',
  connected_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Move legacy mixed-visibility content before removing the unsafe columns.
insert into public.lesson_reviews (session_id, student_id, author_id, summary, published_at)
select id, student_id, tutor_id, coalesce(parent_summary, ''), case when coalesce(parent_summary, '') <> '' then updated_at end
from public.sessions
where coalesce(parent_summary, '') <> ''
on conflict (session_id) do nothing;

insert into public.lesson_private_notes (session_id, student_id, author_id, note)
select id, student_id, tutor_id, coalesce(private_tutor_note, '')
from public.sessions
where coalesce(private_tutor_note, '') <> ''
on conflict (session_id) do nothing;

insert into public.lesson_boards (session_id, student_id, snapshot, updated_by)
select id, student_id, board_snapshot, tutor_id
from public.sessions
where board_snapshot is not null
on conflict (session_id) do nothing;

insert into public.student_private_notes (student_id, note, updated_by)
select id, notes, created_by from public.students where coalesce(notes, '') <> ''
on conflict (student_id) do nothing;

alter table public.students drop column if exists notes;

alter table public.sessions
  drop column if exists parent_summary,
  drop column if exists private_tutor_note,
  drop column if exists board_snapshot;

create index sessions_starts_at_idx on public.sessions(starts_at);
create index sessions_student_idx on public.sessions(student_id);
create index homework_student_due_idx on public.homework(student_id, due_at);
create index reports_student_period_idx on public.reports(student_id, period_start desc);
create index notifications_recipient_created_idx on public.notifications(recipient_id, created_at desc);
create index curriculum_nodes_tree_idx on public.curriculum_nodes(curriculum_id, parent_id, sort_order);

create trigger curricula_set_updated_at before update on public.curricula for each row execute function public.set_updated_at();
create trigger curriculum_nodes_set_updated_at before update on public.curriculum_nodes for each row execute function public.set_updated_at();
create trigger student_progress_set_updated_at before update on public.student_progress for each row execute function public.set_updated_at();
create trigger lesson_reviews_set_updated_at before update on public.lesson_reviews for each row execute function public.set_updated_at();
create trigger lesson_private_notes_set_updated_at before update on public.lesson_private_notes for each row execute function public.set_updated_at();
create trigger student_private_notes_set_updated_at before update on public.student_private_notes for each row execute function public.set_updated_at();
create trigger homework_set_updated_at before update on public.homework for each row execute function public.set_updated_at();
create trigger reports_set_updated_at before update on public.reports for each row execute function public.set_updated_at();
create trigger notification_preferences_set_updated_at before update on public.notification_preferences for each row execute function public.set_updated_at();
create trigger google_connections_set_updated_at before update on public.google_connections for each row execute function public.set_updated_at();

create or replace function public.can_access_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.user_has_role(array['tutor_admin']::public.profile_role[])
    or exists (select 1 from public.tutor_assignments a where a.student_id = target_student_id and a.tutor_id = (select auth.uid()))
    or exists (select 1 from public.parent_child_links l where l.student_id = target_student_id and l.parent_id = (select auth.uid()))
    or exists (select 1 from public.students s where s.id = target_student_id and s.child_profile_id = (select auth.uid()));
$$;

create or replace function public.can_teach_student(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.user_has_role(array['tutor_admin']::public.profile_role[])
    or exists (select 1 from public.tutor_assignments a where a.student_id = target_student_id and a.tutor_id = (select auth.uid()));
$$;

grant execute on function public.can_access_student(uuid), public.can_teach_student(uuid) to authenticated;

create policy "staff read linked family profiles" on public.profiles for select to authenticated using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or (
    public.user_has_role(array['partner_tutor']::public.profile_role[])
    and exists (
      select 1
      from public.parent_child_links family
      join public.tutor_assignments assignment on assignment.student_id = family.student_id
      where family.parent_id = profiles.id and assignment.tutor_id = (select auth.uid())
    )
  )
);

alter table public.curricula enable row level security;
alter table public.curriculum_nodes enable row level security;
alter table public.student_curricula enable row level security;
alter table public.student_progress enable row level security;
alter table public.lesson_reviews enable row level security;
alter table public.lesson_private_notes enable row level security;
alter table public.student_private_notes enable row level security;
alter table public.homework enable row level security;
alter table public.lesson_boards enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.google_connections enable row level security;

create policy "members read curricula" on public.curricula for select to authenticated using (true);
create policy "staff manage curricula" on public.curricula for all to authenticated using (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]));
create policy "members read curriculum nodes" on public.curriculum_nodes for select to authenticated using (true);
create policy "staff manage curriculum nodes" on public.curriculum_nodes for all to authenticated using (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]));

create policy "participants read assigned curricula" on public.student_curricula for select to authenticated using (public.can_access_student(student_id));
create policy "staff manage assigned curricula" on public.student_curricula for all to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));
create policy "participants read progress" on public.student_progress for select to authenticated using (public.can_access_student(student_id));
create policy "staff manage progress" on public.student_progress for all to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));

create policy "participants read published reviews" on public.lesson_reviews for select to authenticated using (public.can_teach_student(student_id) or (published_at is not null and public.can_access_student(student_id)));
create policy "staff manage reviews" on public.lesson_reviews for all to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));
create policy "staff read private notes" on public.lesson_private_notes for select to authenticated using (public.can_teach_student(student_id));
create policy "staff manage private notes" on public.lesson_private_notes for all to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));
create policy "staff read student private notes" on public.student_private_notes for select to authenticated using (public.can_teach_student(student_id));
create policy "staff manage student private notes" on public.student_private_notes for all to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));

create policy "participants read homework" on public.homework for select to authenticated using (public.can_access_student(student_id));
create policy "staff create homework" on public.homework for insert to authenticated with check (public.can_teach_student(student_id));
create policy "staff update homework" on public.homework for update to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));
create policy "students submit homework" on public.homework for update to authenticated using (exists (select 1 from public.students s where s.id = student_id and s.child_profile_id = (select auth.uid()))) with check (exists (select 1 from public.students s where s.id = student_id and s.child_profile_id = (select auth.uid())));

create policy "participants read boards" on public.lesson_boards for select to authenticated using (public.can_access_student(student_id));
create policy "participants create boards" on public.lesson_boards for insert to authenticated with check (public.can_access_student(student_id));
create policy "participants update boards" on public.lesson_boards for update to authenticated using (
  public.can_teach_student(student_id)
  or (
    exists (select 1 from public.students s where s.id = student_id and s.child_profile_id = (select auth.uid()))
    and not exists (select 1 from public.sessions x where x.id = session_id and x.board_locked)
  )
) with check (
  public.can_teach_student(student_id)
  or (
    exists (select 1 from public.students s where s.id = student_id and s.child_profile_id = (select auth.uid()))
    and not exists (select 1 from public.sessions x where x.id = session_id and x.board_locked)
  )
);

create policy "staff read reports" on public.reports for select to authenticated using (public.can_teach_student(student_id));
create policy "parents read published reports" on public.reports for select to authenticated using (status = 'published' and exists (select 1 from public.parent_child_links l where l.student_id = student_id and l.parent_id = (select auth.uid())));
create policy "staff manage reports" on public.reports for all to authenticated using (public.can_teach_student(student_id)) with check (public.can_teach_student(student_id));

create policy "users read notifications" on public.notifications for select to authenticated using (recipient_id = (select auth.uid()));
create policy "users mark notifications" on public.notifications for update to authenticated using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));
create policy "staff create notifications" on public.notifications for insert to authenticated with check (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]));
create policy "staff update notification delivery" on public.notifications for update to authenticated using (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]));
create policy "users manage preferences" on public.notification_preferences for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "owners read google connection" on public.google_connections for select to authenticated using (user_id = (select auth.uid()));
create policy "owners create google connection" on public.google_connections for insert to authenticated with check (user_id = (select auth.uid()) and public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]));
create policy "owners update google connection" on public.google_connections for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "owners delete google connection" on public.google_connections for delete to authenticated using (user_id = (select auth.uid()));

create or replace function public.protect_homework_child_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.user_has_role(array['child']::public.profile_role[]) then
    if new.student_id is distinct from old.student_id
      or new.session_id is distinct from old.session_id
      or new.assigned_by is distinct from old.assigned_by
      or new.title is distinct from old.title
      or new.instructions is distinct from old.instructions
      or new.due_at is distinct from old.due_at
      or new.resource_url is distinct from old.resource_url
      or new.feedback is distinct from old.feedback
      or new.reviewed_at is distinct from old.reviewed_at
      or new.status not in ('assigned', 'submitted') then
      raise exception 'Students may only submit their own homework response';
    end if;
  end if;
  return new;
end;
$$;

create trigger homework_protect_child_update before update on public.homework for each row execute function public.protect_homework_child_update();

create or replace function public.protect_board_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.session_id is distinct from old.session_id or new.student_id is distinct from old.student_id then
    raise exception 'Lesson board ownership cannot be changed';
  end if;
  return new;
end;
$$;

create trigger lesson_boards_protect_identity before update on public.lesson_boards for each row execute function public.protect_board_identity();

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
  if not public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[])
    and (new.emailed_at is distinct from old.emailed_at or new.email_error is distinct from old.email_error) then
    raise exception 'Recipients may only change notification read state';
  end if;
  return new;
end;
$$;

create trigger notifications_protect_update before update on public.notifications for each row execute function public.protect_notification_update();

-- Board row changes are delivered to subscribed lesson participants.
alter publication supabase_realtime add table public.lesson_boards;
