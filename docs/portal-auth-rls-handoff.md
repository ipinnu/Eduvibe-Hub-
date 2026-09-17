# EduVibe Hub portal auth/RLS handoff

Date: 2026-08-17  
Project: `C:\Users\USER\Documents\Code\eduvibehub`  
Supabase project ref: `ryriijqjxtoyvhhklhrh`

## Latest update after final SQL check

The user ran the final combined SQL block on 2026-08-17. After that, the original Supabase RLS/profile error was cleared.

Confirmed after final SQL:

```json
{
  "authUser": "a2df00f7-204b-45ca-b54a-bd09788ee128",
  "serverUser": "a2df00f7-204b-45ca-b54a-bd09788ee128",
  "serverUserError": null,
  "serverRole": "tutor_admin",
  "serverProfileError": null
}
```

Meaning:

- Supabase Auth accepts the tutor-admin account.
- `public.profiles.role` now reads correctly.
- The previous RLS recursion error is not the active blocker anymore.
- The account is confirmed as `tutor_admin`.

The one-point local route check still redirected:

```json
{
  "ok": false,
  "user": "a2df00f7-204b-45ca-b54a-bd09788ee128",
  "role": "tutor_admin",
  "profileError": null,
  "cookieCount": 1,
  "adminStatus": 307,
  "adminLocation": "/portal/login?next=%2Fportal%2Fadmin"
}
```

Important interpretation:

- The database/RLS/profile side is fixed.
- The same in-memory Supabase auth cookie works when passed directly into `createServerClient(...).auth.getUser()`.
- The remaining uncertainty is either:
  1. the CLI-built `Cookie` header is not equivalent to a real browser cookie flow, or
  2. the Next proxy/request path is not receiving/parsing Supabase cookies correctly.

Next model should not keep treating `parent_child_links` RLS recursion as current unless a fresh test shows that exact error again.

Next check should be a real browser login flow:

1. start local dev server with `npm.cmd run dev`
2. open `http://localhost:3000/portal/login`
3. log in as the tutor-admin test account
4. verify whether the browser lands on `/portal/admin`
5. if it redirects back to login, instrument `lib/supabase/proxy.ts` temporarily to confirm what `request.cookies.getAll()` contains on `/portal/admin`

Current suspected active area: Next proxy/session cookie handling, not Supabase role data.

## Current status

The production portal login issue is not fully fixed.

The main confirmed blocker is Supabase Row Level Security recursion. Authentication succeeds, but an authenticated read from `public.profiles` fails because a policy recursively evaluates `public.parent_child_links`.

Exact local test result after signing in with the tutor-admin account:

```json
{
  "ok": true,
  "user": "a2df00f7-204b-45ca-b54a-bd09788ee128",
  "role": null,
  "profileError": "infinite recursion detected in policy for relation \"parent_child_links\"",
  "cookieCount": 1
}
```

Because the app cannot read `profiles.role`, every protected portal route redirects back to login.

## Confirmed account/profile facts

The user manually checked the live DB and provided:

| id | email | role | full_name |
| --- | --- | --- | --- |
| `a2df00f7-204b-45ca-b54a-bd09788ee128` | `eduvibehub@gmail.com` | `tutor_admin` | empty |
| `790ed77c-a699-407d-b2c3-1926b5d87ac2` | `amakaadika@gmail.com` | `partner_tutor` | empty |

So the first hypothesis, “missing profile row or wrong role,” is ruled out.

## Confirmed live schema facts

Using Supabase REST with the anon key, the required portal tables returned `200`:

- `profiles`
- `students`
- `sessions`
- `homework`
- `lesson_reviews`
- `reports`
- `tutor_assignments`
- `parent_child_links`

Required newer columns also returned `200`:

- `students`: `preferred_name`, `learning_goals`, `accommodations`
- `sessions`: `time_zone`, `calendar_sync_status`, `board_locked`
- `homework`: `time_zone`, `status`, `submission_url`
- `reports`: `status`, `homework_summary`
- `lesson_reviews`: `engagement`, `published_at`

So this no longer looks like missing migration `202608020002` / `202608020003`.

## Exact failing route simulation

After local sign-in succeeded, the script tested protected local routes with the returned auth cookie. All redirected to login because the profile read failed:

```txt
/portal/admin         -> 307 /portal/login?next=%2Fportal%2Fadmin
/portal/access        -> 307 /portal/login?next=%2Fportal%2Faccess
/portal/students      -> 307 /portal/login?next=%2Fportal%2Fstudents
/portal/sessions      -> 307 /portal/login?next=%2Fportal%2Fsessions
/portal/homework      -> 307 /portal/login?next=%2Fportal%2Fhomework
/portal/reports       -> 307 /portal/login?next=%2Fportal%2Freports
/portal/curriculum    -> 307 /portal/login?next=%2Fportal%2Fcurriculum
/portal/reviews       -> 307 /portal/login?next=%2Fportal%2Freviews
/portal/resources     -> 307 /portal/login?next=%2Fportal%2Fresources
/portal/notifications -> 307 /portal/login?next=%2Fportal%2Fnotifications
/portal/settings      -> 307 /portal/login?next=%2Fportal%2Fsettings
/portal/store         -> 307 /portal/login?next=%2Fportal%2Fstore
/portal/tutor         -> 307 /portal/login?next=%2Fportal%2Ftutor
/portal/parent        -> 307 /portal/login?next=%2Fportal%2Fparent
/portal/student       -> 307 /portal/login?next=%2Fportal%2Fstudent
```

## Code changes already made

These local files were changed:

### `lib/auth.ts`

Server portal auth was changed from `supabase.auth.getClaims()` to `supabase.auth.getUser()`.

Reason: protected server routes should validate the actual Supabase session cookie directly. `getClaims()` was too brittle for the observed “login succeeds, then server rejects protected page” behavior.

### `lib/supabase/proxy.ts`

Proxy auth gate was changed from `getClaims()` to `getUser()`.

Also, earlier local proxy response handling was corrected from the invalid pattern:

```ts
NextResponse.next({ request })
```

to:

```ts
NextResponse.next()
```

Reason: Next 16 expects `request: { headers }` only when overriding request headers. Passing the raw `request` object is the wrong shape.

### `app/portal/login/page.tsx`

The login page no longer silently falls back to `parent` when it cannot read a profile.

Old bad behavior:

```ts
const role = (profile?.role ?? "parent") as PortalRole;
```

New behavior:

- if auth succeeds but the profile/role cannot be read, sign out
- show a setup/access error
- do not route the staff user into the parent portal

This is important because the old fallback hid the real RLS/profile failure.

## Production deployment status

A production deploy was done after the `getUser()`/proxy/login hardening.

Deployment URL:

```txt
https://eduvibehub-78mt4uoie-ipinnus-projects.vercel.app
```

Aliased to:

```txt
https://eduvibehub.com.ng
```

Unauthenticated route checks after deploy:

```txt
https://eduvibehub.com.ng/portal       -> 307 /portal/login?next=%2Fportal
https://eduvibehub.com.ng/portal/login -> 200 OK
```

But the DB RLS recursion remains, so authenticated portal access is still blocked until the SQL policy issue is fixed.

## SQL migrations added locally

Two local migrations were added after the issue was discovered.

### `supabase/migrations/202608170001_fix_portal_rls_recursion.sql`

Purpose:

- redefine helper functions with `security definer`
- set `row_security = off`
- target helper functions:
  - `public.user_has_role(public.profile_role[])`
  - `public.can_teach_student(uuid)`
  - `public.can_access_student(uuid)`

The user said this migration was run, but retesting still produced the same recursion error.

Possible explanations:

- migration did not actually run
- migration ran in a different Supabase project/environment
- migration ran but did not replace all recursive policy paths
- Supabase SQL Editor error was missed
- active policies still recurse even if helper functions are fixed

### `supabase/migrations/202608170002_fix_recursive_portal_policies.sql`

Purpose:

- replace recursive policies directly
- add security-definer helper predicates:
  - `public.can_read_profile(uuid)`
  - `public.can_read_parent_child_link(uuid, uuid)`
- replace profile/student/family-link select policies:
  - drop `"users read own profile"`
  - drop `"admins read profiles"`
  - drop `"staff read linked family profiles"`
  - create `"portal users read allowed profiles"`
  - drop `"staff read students"`
  - create `"participants read students"`
  - drop/recreate `"linked users read parent child links"`

This second migration had not been confirmed as run at the time this document was written.

## Suspicious policy chain

The likely recursive chain is:

```txt
profiles select policy
  -> checks linked family profiles
  -> queries parent_child_links
  -> parent_child_links select policy fires
  -> checks user_has_role / students / assignments
  -> students select policy may query parent_child_links again
  -> recursion
```

The exact error names `parent_child_links`, so that table’s select policy is part of the loop.

## Things another model should verify first

Run these SQL checks in Supabase SQL Editor:

```sql
select
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'students', 'parent_child_links', 'tutor_assignments')
order by tablename, policyname;
```

Check the live helper function definitions:

```sql
select
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'user_has_role',
    'can_teach_student',
    'can_access_student',
    'can_read_profile',
    'can_read_parent_child_link'
  )
order by p.proname;
```

Confirm whether migration 002 is present in live DB:

```sql
select
  version,
  name,
  inserted_at
from supabase_migrations.schema_migrations
order by version desc;
```

If the migration history table does not have `name` or `inserted_at`, use:

```sql
select *
from supabase_migrations.schema_migrations
order by version desc;
```

## Minimal post-SQL validation

After applying/fixing SQL, retest with a real authenticated session:

1. Sign in as tutor admin.
2. Read own profile:

```ts
supabase
  .from("profiles")
  .select("role,full_name,email")
  .eq("id", user.id)
  .maybeSingle()
```

Expected:

```json
{
  "role": "tutor_admin"
}
```

3. Local route expectations:

```txt
/portal/admin      -> 200
/portal/access     -> 200
/portal/students   -> 200
/portal/sessions   -> 200
/portal/homework   -> 200
/portal/reports    -> 200
/portal/curriculum -> 200
/portal/reviews    -> 200
/portal/resources  -> 200
/portal/settings   -> 200
/portal/store      -> 200
```

Role-specific redirects expected for tutor-admin:

```txt
/portal/tutor   -> redirect to /portal/admin
/portal/parent  -> redirect to /portal/admin
/portal/student -> redirect to /portal/admin
```

## Suspicious app-side areas to keep in mind

These are not the current confirmed blocker, but should be watched after RLS is fixed:

1. Cookie simulation might not perfectly match a browser.
   - Use Playwright/browser automation if CLI tests pass but real browser still fails.

2. `full_name` is empty for both staff profiles.
   - Not fatal, but UI may show fallback names/emails.

3. File upload is not implemented in tutor actions.
   - Existing homework flow uses URL fields such as `resource_url` and `submission_url`.
   - If the user says “upload details not working,” this may be because upload UI/storage was never implemented, not because Supabase Storage is broken.

4. Supabase MCP was authenticated, but SQL/database MCP tools were not exposed in the active Codex tool surface.
   - CLI was used instead for REST/auth checks.
   - Direct DB writes were not done through Codex.

5. The repo has a dirty/untracked worktree.
   - Many app folders are untracked.
   - Do not reset or clean the repo.

## Commands/tests already used

Local unauthenticated route:

```powershell
curl.exe -4 -I http://localhost:3000/portal/login
```

Production unauthenticated route:

```powershell
curl.exe -4 -I https://eduvibehub.com.ng/portal
curl.exe -4 -I https://eduvibehub.com.ng/portal/login
```

Build:

```powershell
npm.cmd run build
```

Deployment:

```powershell
vercel.cmd --prod
```

## Do not repeat the wrong diagnosis

Do not assume the current issue is:

- bad password
- missing `profiles` row
- wrong `profiles.role`
- missing `homework`/`reports`/`lesson_reviews` tables

Those were checked and are not the current strongest issue.

The confirmed error to solve is:

```txt
infinite recursion detected in policy for relation "parent_child_links"
```
