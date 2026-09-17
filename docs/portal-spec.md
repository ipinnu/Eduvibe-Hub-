# EduVibe Hub Tutor Portal

Active product and build document v0.3  
BrainBox Studios, August 2026

This document is the working memory for the EduVibe Hub portal direction. It is not a frozen instruction file. Update it as decisions change, implementation progresses, blockers appear, or the next build plan changes.

## How To Use This Document

- Treat this as the active source of truth for portal planning.
- Keep decisions, blockers, and next steps current as the build evolves.
- Add implementation notes after meaningful technical choices.
- Do not store secrets in this document.
- Treat the curriculum and report structures as educator-editable; they are no longer blocked on one fixed external format.

## What This Is

EduVibe Hub is becoming more than a public tutoring website. The next product is a private tutor management portal for one educator and her partner tutor.

It is not a marketplace and not a generic SaaS dashboard. It should support how they already teach: online lessons, live written work, parent communication, homework, progress tracking, and reports.

The portal has one job: make it effortless for the tutors to run lessons and make the results visible to parents.

## Current Public Site

The marketing site is now traditional multi-page:

- `/` home
- `/subjects`
- `/how-it-works`
- `/about`
- `/store`

The public CTA is now **Book a call**, not **Book free trial**.

## Current Configuration

Supabase is the selected backend for auth, database, realtime, and storage.

Local environment variables are stored in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not commit service-role keys or Google OAuth secrets. Keep private credentials in local or deployment environment variables only.

Implementation update (2 August 2026):

- the public Supabase project connection is confirmed
- the portal foundation migration exists at `supabase/migrations/202608020001_portal_foundation.sql`
- the migration has not yet been applied to the remote project
- Supabase browser and SSR helpers are installed
- Next.js Proxy refreshes Supabase sessions and redirects anonymous portal requests
- page-level authorization verifies the current database role before rendering protected pages
- the public navigation and footer include a Portal login entry point
- password recovery and tutor-admin account invitation flows are implemented
- the public store falls back to the seeded live workbook until the table is available
- the learning operations migration exists at `supabase/migrations/202608020002_learning_operations.sql`
- functional student, scheduling, board, attendance, review, homework, curriculum, progress, report, notification, and relationship screens are implemented
- Google Calendar/Meet OAuth and encrypted token storage are wired
- simple transactional email delivery is wired through Resend
- both migrations still require privileged application to the remote project; an anonymous key cannot create schema or policies

## Users And Roles

### Tutor Admin

- Full access to everything
- Creates and manages students, parents, sessions, reports, store resources
- Can see partner tutor sessions and notes
- Manages settings and integrations

### Partner Tutor

- Can see and manage assigned students only
- Can create lesson reviews and contribute to reports
- Cannot access admin settings, payments, or unassigned students

### Parent

- Has independent login
- Receives an independent invited account linked to one or more learner profiles
- Sees child sessions, homework, progress, lesson board history, and reports
- Receives dashboard and optional Resend email updates

### Child

- Optional separate login, controlled by parent
- Can view own sessions, homework, progress, and lesson board
- Can write/draw on the live lesson board during active lessons
- Cannot see reports, payments, or private tutor notes

## MVP Modules

### 1. Authentication

Use Supabase Auth.

Roles:

- `tutor_admin`
- `partner_tutor`
- `parent`
- `child`

Parent account creation should support creating or enabling a child account later. Child login should be parent-managed.

### 2. Student Management

Student profile fields:

- name
- age
- year group
- subjects enrolled
- linked parent
- assigned tutor
- session history
- progress snapshot

Partner tutors only see assigned students.

### 3. Lesson Board

The lesson board replaces the tutor's current OneNote screen-share workflow.

The tutor currently writes while teaching, shares the screen in the meeting, and uses that written work as the live teaching surface. EduVibe should support that same workflow inside the portal.

Decision:

- Use **Tldraw** for the board engine.
- Use **Supabase Realtime** for MVP collaboration.
- Do not run separate whiteboard infrastructure yet.
- Do not outsource the whiteboard to a paid whiteboard SaaS.

Expected board behavior:

- tutor and child can both draw/type
- pen/mouse drawing from day one
- typed text supported
- shapes/lines/eraser/undo/redo from Tldraw
- autosave board state per session
- tutor can lock child editing at any time
- parent can view saved board after class
- one board belongs to one session

MVP realtime assumption:

Most sessions are 1 tutor + 1 child. Supabase Realtime should be enough to validate the live teaching workflow. If collaboration later feels laggy or conflict-prone, upgrade only the sync layer and keep the rest of the portal intact.

### 4. Google Calendar And Meet

Google Meet should stay off-platform for video. EduVibe owns scheduling, records, notes, reports, and dashboards.

Decision:

- Connect tutor admin's Google account via OAuth.
- Use Google Calendar API to create session events.
- Generate Google Meet links through Calendar event conference data.
- Send parent invites through Google Calendar.
- Store the returned Meet link on the session.
- No manual Meet link pasting for MVP.

Only tutor/admin Google OAuth is required for meeting creation. Parents and children do not need Google OAuth.

Expected flow:

1. Tutor logs into EduVibe with Supabase.
2. Tutor connects Google Calendar in settings.
3. Tutor creates a session.
4. Backend creates Google Calendar event with Meet link.
5. Parent receives calendar invite.
6. Portal stores and shows the Meet link.
7. Tutor and child use Google Meet for voice/video.
8. Tutor shares the EduVibe lesson board tab in Meet when needed.

### 5. Lesson Review

Implemented with educator-editable text and rating fields.

Confirmed draft fields:

- attendance: present / absent / late
- strengths observed
- next teaching focus
- engagement rating from 1 to 5
- parent-visible summary
- private tutor note

Private tutor notes must never show to parents or children.

### 6. Progress Tracking

Implemented as educator-owned learning paths. The tutor can create multiple paths and arrange:

- subject
- topic
- skill
- status

Example:

Mathematics -> Fractions -> Equivalent fractions -> Needs practice

### 7. Reports

Reports are a portal feature, not a public marketing nav item.

Implemented:

- weekly reports written and published by staff
- monthly reports written and reviewed by staff before publishing
- live parent dashboard summary
- attendance and homework summary fields
- achievements and next-focus fields

Private tutor notes are excluded from all parent-facing reports.

### 8. Notifications

Implemented channels:

- dashboard notification centre
- Resend transactional email when configured
- Google Calendar email invitations for scheduled sessions created through the connected calendar

### 9. Store

The store is lower priority but still part of the broader MVP direction.

Purpose:

- worksheets
- PDFs
- extra learning materials
- recorded lesson bundles later

Payments are intentionally out of scope. Products retain an editable Selar checkout URL; the site does not process or record payments.

## Proposed Portal Routes

- `/portal`
- `/portal/students`
- `/portal/students/[studentId]`
- `/portal/sessions`
- `/portal/lesson-board/[sessionId]`
- `/portal/homework`
- `/portal/curriculum`
- `/portal/reviews`
- `/portal/reports`
- `/portal/notifications`
- `/portal/store`
- `/portal/access`
- `/portal/settings`

## Dashboard Concepts

### Tutor Admin Dashboard

- today's sessions
- quick actions: new session, write report, view students
- student snapshot grid
- notification feed
- partner tutor activity visible

### Parent Dashboard

- child summary
- next session countdown
- latest parent-visible update
- recent lesson board
- homework due
- notifications

### Child Dashboard

- simpler, warmer interface
- next session
- homework
- open lesson board
- subject progress visual

## Build Phases

### Phase 1: Core Portal

- Supabase Auth + roles — foundation implemented; remote migration pending
- student management — route and UI foundation implemented
- session scheduling — route and UI foundation implemented
- Google Calendar/Meet integration
- Tldraw lesson board with Supabase Realtime
- basic lesson review placeholder
- basic parent dashboard — implemented
- tutor-admin, partner-tutor, and child dashboards — implemented

### Phase 2: Reports And Notifications

- weekly/monthly reports
- PDF export
- WhatsApp summaries
- push notifications
- progress tracking after Q7

### Phase 3: Store And Payments

- Paystack store
- resource uploads
- store purchase flow
- session packages later

## Next Build Plan

Current next step: apply and verify the Phase 1 Supabase migration, then replace dashboard sample content with live role-scoped data.

Current order:

1. Apply `supabase/migrations/202608020001_portal_foundation.sql` to the remote project.
2. Create the tutor's Auth account and promote its profile to `tutor_admin`.
3. Add `SUPABASE_SERVICE_ROLE_KEY` to the deployment's server environment for invitations.
4. Verify login, role reads, invitations, password recovery, RLS, and store publishing end to end.
5. Replace dashboard sample content with role-scoped Supabase queries.
6. Connect student creation and session scheduling forms to Supabase.
7. Add Google Calendar/Meet integration after OAuth credentials are available.
8. Add Tldraw board route and Supabase Realtime sync proof of concept.
9. Add lesson review placeholder only; do not finalize until Q6 is answered.
10. Add progress placeholder only; do not finalize until Q7 is answered.

Immediate blockers:

- the portal foundation migration is not applied to the live Supabase project yet
- the server-only Supabase service-role key is not configured for account invitations
- Google OAuth client ID and secret are not configured yet.
- Q6 lesson review format is pending.
- Q7 progress tracking structure is pending.

## Open Questions

### Q6: Lesson Review Format

What exactly does she fill after each class today?

Status: pending.

Do not build the final lesson review module until answered.

### Q7: Progress Tracking Structure

How does she currently track progress?

Status: pending.

Do not build the final progress model until answered.

## Architecture Decisions

### Store

- The public store follows the educator's live Selar product structure while retaining EduVibe branding.
- The current live product is Mastering Maths – Year 6 Numbers & Place Value Workbook.
- Checkout remains on Selar at `https://selar.com/h35458h504` for now.
- Tutor admins edit product copy, pricing, visibility, imagery, and checkout URL from `/portal/store`.
- Public reads and tutor-admin mutations are secured with Supabase RLS after the migration is applied.

### Video

Do not build video streaming. Use Google Meet.

### Whiteboard

Do not build drawing tools from scratch. Use Tldraw.

### Realtime Whiteboard Sync

Start with Supabase Realtime. Upgrade only if real tutoring sessions expose performance or conflict issues.

### Calendar And Meet Creation

Use Google OAuth + Calendar API from day one.

### Auth And Data

Use Supabase for auth, database, storage, and realtime.

Implemented access flow:

1. Every user enters through `/portal/login`.
2. Supabase Auth verifies the email/password session.
3. The server reads the current role from `public.profiles` on protected requests.
4. `/portal` routes the user to the correct role dashboard.
5. Role-specific pages redirect users who manually enter another role's URL.
6. Tutor admins invite partner tutors, parents, and students from `/portal/access`.
7. Invitees and existing users can establish or recover passwords through the EduVibe recovery screens.
8. Changing `profiles.role` in Supabase changes the user's permitted UI on refresh or their next navigation.

## Current Memory Summary

We are building:

- a public EduVibe Hub marketing site
- a private tutor portal
- role-based dashboards
- Supabase authentication
- student/session management
- Google Calendar generated Meet links
- a Tldraw live lesson board synced through Supabase Realtime
- post-class reviews that feed weekly/monthly reports
- a lower-priority store with Paystack

We are not building:

- a tutoring marketplace
- custom video streaming
- final lesson review format before Q6
- final progress tracking model before Q7
