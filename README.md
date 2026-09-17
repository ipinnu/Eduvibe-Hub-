# EduVibe Hub

Marketing site and tutor portal build for EduVibe Hub by BrainBox Studios.

## Active Product Document

The current portal direction and next build plan are maintained in:

- [docs/portal-spec.md](docs/portal-spec.md)

This is a living document. Update it as product decisions change, blockers are resolved, or the next implementation plan changes. It contains the working decisions for roles, Supabase Auth, Google Calendar/Meet integration, Tldraw lesson board, Supabase Realtime sync, reports, store, and open questions.

## Current Public Site Routes

- `/`
- `/subjects`
- `/how-it-works`
- `/about`
- `/store`

## Portal Direction

Implemented portal routes:

- `/portal`
- `/portal/login`
- `/portal/forgot-password`
- `/portal/reset-password`
- `/portal/admin`
- `/portal/tutor`
- `/portal/parent`
- `/portal/student`
- `/portal/students`
- `/portal/sessions`
- `/portal/homework`
- `/portal/curriculum`
- `/portal/reviews`
- `/portal/reports`
- `/portal/notifications`
- `/portal/lesson-board/[sessionId]`
- `/portal/store`
- `/portal/access`
- `/portal/settings`

The Supabase schema and RLS policies are in `supabase/migrations/`. Apply both migrations in filename order before using authenticated store publishing or live portal data.

Portal authentication reads the current `profiles.role` on protected requests. Role changes in Supabase take effect on refresh or the next navigation. Production account invitations require the server-only `SUPABASE_SERVICE_ROLE_KEY` and a public `NEXT_PUBLIC_SITE_URL` (for example `https://eduvibehub.com.ng`). In the Supabase dashboard, set Authentication → URL Configuration → Site URL to that same origin and allow `https://eduvibehub.com.ng/auth/callback` under Redirect URLs; otherwise invite emails fall back to localhost.

Google Calendar/Meet requires the Google OAuth variables in `.env.example`. Google tokens are AES-GCM encrypted before database storage. Resend email is optional: in-app notifications still work without `RESEND_API_KEY`.

The website does not process payments. Store posts contain an editable external checkout URL and currently point to Selar.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```
