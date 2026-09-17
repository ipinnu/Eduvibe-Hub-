-- EduVibe Hub portal foundation
-- Apply with the Supabase SQL editor or `supabase db push` after linking the project.

create extension if not exists pgcrypto;

create type public.profile_role as enum ('tutor_admin', 'partner_tutor', 'parent', 'child');
create type public.product_status as enum ('draft', 'published', 'archived');
create type public.session_status as enum ('scheduled', 'completed', 'cancelled', 'missed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.profile_role not null default 'parent',
  avatar_url text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age smallint check (age between 2 and 19),
  year_group text,
  subjects text[] not null default '{}',
  child_profile_id uuid unique references public.profiles(id) on delete set null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.parent_child_links (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  relationship text not null default 'parent',
  primary key (parent_id, student_id)
);

create table public.tutor_assignments (
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  is_primary boolean not null default false,
  primary key (tutor_id, student_id)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  tutor_id uuid not null references public.profiles(id) on delete restrict,
  subject text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.session_status not null default 'scheduled',
  google_event_id text,
  meet_url text,
  board_snapshot jsonb,
  parent_summary text,
  private_tutor_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_ends_after_start check (ends_at > starts_at)
);

create table public.store_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  product_type text not null default 'Downloadable',
  price_kobo integer not null default 0 check (price_kobo >= 0),
  currency text not null default 'NGN',
  image_url text not null default '',
  checkout_url text not null default '',
  audience text not null default '',
  features text[] not null default '{}',
  status public.product_status not null default 'draft',
  featured boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger students_set_updated_at before update on public.students for each row execute function public.set_updated_at();
create trigger sessions_set_updated_at before update on public.sessions for each row execute function public.set_updated_at();
create trigger store_products_set_updated_at before update on public.store_products for each row execute function public.set_updated_at();

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

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create or replace function public.user_has_role(allowed_roles public.profile_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = any(allowed_roles)
  );
$$;

grant execute on function public.user_has_role(public.profile_role[]) to authenticated, anon;

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parent_child_links enable row level security;
alter table public.tutor_assignments enable row level security;
alter table public.sessions enable row level security;
alter table public.store_products enable row level security;

create policy "users read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "admins read profiles" on public.profiles for select to authenticated using (public.user_has_role(array['tutor_admin']::public.profile_role[]));
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.user_has_role(array['tutor_admin']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin']::public.profile_role[]));

create policy "staff read students" on public.students for select to authenticated using (
  public.user_has_role(array['tutor_admin']::public.profile_role[])
  or exists (select 1 from public.tutor_assignments a where a.student_id = id and a.tutor_id = (select auth.uid()))
  or exists (select 1 from public.parent_child_links l where l.student_id = id and l.parent_id = (select auth.uid()))
  or child_profile_id = (select auth.uid())
);
create policy "admins manage students" on public.students for all to authenticated using (public.user_has_role(array['tutor_admin']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin']::public.profile_role[]));

create policy "linked users read parent child links" on public.parent_child_links for select to authenticated using (parent_id = (select auth.uid()) or public.user_has_role(array['tutor_admin','partner_tutor']::public.profile_role[]));
create policy "admins manage parent child links" on public.parent_child_links for all to authenticated using (public.user_has_role(array['tutor_admin']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin']::public.profile_role[]));

create policy "staff read assignments" on public.tutor_assignments for select to authenticated using (tutor_id = (select auth.uid()) or public.user_has_role(array['tutor_admin']::public.profile_role[]));
create policy "admins manage assignments" on public.tutor_assignments for all to authenticated using (public.user_has_role(array['tutor_admin']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin']::public.profile_role[]));

create policy "participants read sessions" on public.sessions for select to authenticated using (
  tutor_id = (select auth.uid())
  or public.user_has_role(array['tutor_admin']::public.profile_role[])
  or exists (select 1 from public.parent_child_links l where l.student_id = student_id and l.parent_id = (select auth.uid()))
  or exists (select 1 from public.students s where s.id = student_id and s.child_profile_id = (select auth.uid()))
);
create policy "staff manage sessions" on public.sessions for all to authenticated using (tutor_id = (select auth.uid()) or public.user_has_role(array['tutor_admin']::public.profile_role[])) with check (tutor_id = (select auth.uid()) or public.user_has_role(array['tutor_admin']::public.profile_role[]));

create policy "public reads published products" on public.store_products for select to anon, authenticated using (status = 'published');
create policy "admins manage products" on public.store_products for all to authenticated using (public.user_has_role(array['tutor_admin']::public.profile_role[])) with check (public.user_has_role(array['tutor_admin']::public.profile_role[]));

insert into public.store_products (
  id, slug, title, short_description, description, product_type, price_kobo, currency,
  image_url, checkout_url, audience, features, status, featured
) values (
  '00000000-0000-4000-8000-000000000001',
  'mastering-maths-year-6-numbers-place-value',
  'Mastering Maths – Year 6 Numbers & Place Value Workbook',
  'Seven guided lessons, worked examples, focused practice, and a complete answer key.',
  'A practical 9-page workbook that takes Year 6 learners step by step through reading, writing, comparing, ordering, rounding, and creating numbers. Each lesson builds real understanding with clear objectives and guided practice.',
  'Downloadable workbook', 350000, 'NGN', '/mastering-maths-year-6.png',
  'https://selar.com/h35458h504',
  'Year 6 learners working on place value up to 10 million — ideal for parents, tutors, and teachers.',
  array['7 complete Numbers & Place Value lessons','Clear learning objectives for every lesson','Worked examples and remember boxes','Real-life word problems','Full answer key included','Print-ready PDF for home or classroom use'],
  'published', true
);

-- After creating the educator's Auth account, promote it once in the SQL editor:
-- update public.profiles set role = 'tutor_admin' where id = '<auth-user-uuid>';
