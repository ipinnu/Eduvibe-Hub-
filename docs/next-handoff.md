# Next Handoff

Completed on 2 August 2026:

1. Implemented distinct tutor-admin, partner-tutor, parent, and child portal dashboards.
2. Added the shared responsive portal shell and module routes for students, sessions, reports, store, and settings.
3. Added a Supabase email/password login UI and browser/server client helpers.
4. Added the initial RLS-protected Supabase schema for profiles, roles, students, relationships, tutor assignments, sessions, and store products.
5. Rebuilt the public store around the educator's live Selar workbook and retained Selar as the checkout destination.
6. Added a tutor-admin store editor for product copy, price, cover, inclusions, visibility, and checkout URL.
7. Downloaded the live workbook cover into the project for stable local delivery.
8. Verified TypeScript, ESLint, production build, and the main layouts in a local browser.
9. Added Portal login links to the public navigation and footer.
10. Added Supabase session refresh through the Next.js 16 Proxy convention.
11. Added server-side role authorization to every portal route and removed the design-preview role switcher.
12. Added logout, forgot-password, reset-password, and Auth callback flows.
13. Added tutor-admin invitations for partner tutors, parents, and students at `/portal/access`.

Next session plan:

1. Apply `supabase/migrations/202608020001_portal_foundation.sql` to the live Supabase project.
2. Create or identify Peace's Auth user and promote the matching profile to `tutor_admin`.
3. Configure the server-only `SUPABASE_SERVICE_ROLE_KEY` and production site URL.
4. Verify invitations, recovery emails, role redirects, and store publishing end to end.
5. Replace portal sample data with role-scoped Supabase reads.
6. Wire student and session forms before Google Calendar integration.

Known blockers:

- The remote database has none of the portal tables yet; the migration is ready but unapplied.
- Account invitations require a server-only service-role key that is not currently in `.env.local`.
- Google OAuth credentials are not configured.
- Q6 lesson review format and Q7 progress tracking structure are still pending.
