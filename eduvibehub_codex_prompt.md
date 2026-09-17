# EduVibe Hub — Codex Build Prompt
**Project:** EduVibeHub.com — Full marketing website  
**Builder:** BrainBox Studios for EduVibe Hub  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion  

---

## What you are building

A single-page marketing website for **EduVibe Hub** — an online 1-on-1 tutoring service run by a single educator in Nigeria. She teaches Mathematics, Literacy, and Science to children aged 3–12 (Nursery 1 through Year 8). She is energetic, firm, warm, and deeply attentive — she sends end-of-month progress reports to every parent, tracks each child's weaknesses deliberately, and operates on the belief that a collective front between tutor, child, and parent is how real progress happens.

This is not a platform. There is no marketplace. There is one tutor. The site must feel like meeting a person — not a product.

---

## Tech stack

```
Next.js 14 (App Router)
TypeScript
Tailwind CSS (utility-first, no component libraries)
Framer Motion (scroll reveals + subtle hover states)
Google Fonts (loaded via next/font)
```

No UI kits. No shadcn. No Radix. Hand-rolled components only. The design must feel intentional, not assembled.

---

## File structure

```
/app
  layout.tsx          ← font loading, metadata, global styles
  page.tsx            ← assembles all sections in order
/components
  /sections
    Nav.tsx
    Hero.tsx
    TrustBar.tsx
    Philosophy.tsx
    Subjects.tsx
    HowItWorks.tsx
    Reports.tsx
    Testimonials.tsx
    FinalCTA.tsx
    Footer.tsx
  /ui
    Button.tsx
    SectionLabel.tsx
    RevealOnScroll.tsx   ← Framer Motion wrapper
/lib
  constants.ts         ← all copy in one place, nothing hardcoded in JSX
/public
  /images
    tutor-hero.jpg      ← placeholder, client will replace
```

---

## Design tokens — use exactly these, nowhere else

```ts
// tailwind.config.ts — extend theme with:
colors: {
  ev: {
    yellow:      '#F5C518',   // energy, spark, accent
    'yellow-lt': '#FEF8D0',   // yellow tint backgrounds
    green:       '#1A3A2A',   // authority, nav, dark sections
    'green-mid': '#2D6148',   // hover states, secondary green
    teal:        '#0DB47A',   // growth, warmth, highlights
    'teal-lt':   '#E0F7EE',   // teal tint backgrounds
    cream:       '#FFFDF5',   // warm white, hero bg
    board:       '#F7F4EE',   // off-white, section backgrounds
    ink:         '#111A13',   // body text
    muted:       '#6B7A6D',   // secondary text
  }
}

fontFamily: {
  display: ['Cormorant Garamond', 'Georgia', 'serif'],   // hero headlines, section titles
  body:    ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],  // all body text
  mono:    ['JetBrains Mono', 'Courier New', 'monospace'],  // labels, eyebrows, tags
}
```

---

## Typography scale

| Role | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Hero H1 | Cormorant Garamond | 52–64px | 400 | Single hero headline |
| Section title | Cormorant Garamond | 32–40px | 400 | One per section |
| Body | Inter | 15–16px | 400 | All running copy |
| Label/eyebrow | JetBrains Mono | 10–11px | 500 | ALL CAPS, letter-spacing 0.1em |
| Button | Inter | 13px | 700 | CTAs |

Cormorant Garamond should be used with restraint — display only. Inter does all the work. JetBrains Mono is the credibility layer.

---

## Brand personality — embed this in every copy and design decision

She is:
- **Energetic** — not frantic
- **Firm** — not cold
- **Attentive** — not smothering
- **Accountable** — not performative
- **Collective** — child + tutor + parent, all aligned

Her core philosophy:
> *"Every child has a weakness. That's not a failure — that's a place to begin. All it takes is a little extra time, a little extra attention, and the right person in the room."*

This should live as the philosophy section headline verbatim.

---

## Section-by-section build spec

---

### 1. Nav — `Nav.tsx`

**Layout:** Fixed top. Full width. Height 56px.  
**Background:** `ev-green` (#1A3A2A)  
**Left:** Logo mark + wordmark  
**Right:** Ghost links + CTA button  

**Logo:**
- Yellow rounded square (28×28px, border-radius 7px) containing a simple SVG smiley face (two dots for eyes, curved mouth arc) — this is the child-energy mark
- Next to it: `EduVibe` in Cormorant Garamond 16px white, `Hub` in ev-teal
- Do not use an image for the logo. Build it entirely in SVG inline

**Nav links:** `Subjects` · `How it works` · `About` · `Reports`  
**CTA button:** `Book free trial` — pill shape, `ev-yellow` background, `ev-green` text, bold  

On mobile: hamburger menu, slides down with Framer Motion AnimatePresence. Logo remains. CTA becomes full width inside the drawer.

---

### 2. Hero — `Hero.tsx`

This is the most important section. Get it right.

**Layout:** Two-column grid on desktop. Left column 55%, right column 45%.  
**Background:** `ev-cream` (#FFFDF5)  

**Left column — copy:**

Eyebrow (JetBrains Mono, ev-teal, 10px, ALL CAPS):
```
Online tutoring · Ages 3–12 · Nigeria
```

Headline (Cormorant Garamond, 56px, ev-ink, line-height 1.15):
```
Every child can thrive
with the right teacher.
```
The word `thrive` is wrapped in a `<mark>` styled with `ev-yellow` background, `ev-green` text, slight padding, border-radius 3px. No italics on the mark.

Subheadline (Inter, 15px, ev-muted, line-height 1.75, max-width 400px):
```
Personalised 1-on-1 sessions in Maths, Literacy and Science —
for children aged 3 to 12. She sees where your child struggles,
works on it deliberately, and keeps you in the loop every step of the way.
```

CTA row:
- Primary button: `ev-green` pill, white text, `Book a free trial session` — with a small yellow arrow circle on the right (→)
- Ghost link: `ev-green-mid` color, underline offset 3px, `See how it works`

Trust micro-copy below CTAs (JetBrains Mono, 10px, ev-muted):
```
✓ Free first session  ·  ✓ No commitment  ·  ✓ 1-on-1 always
```

**Right column — tutor image:**

This is the hero image treatment. The client will supply a photo. Until then use a placeholder.

- Image is **half-body / portrait crop** — tutor visible from roughly mid-torso upward, slightly angled, confident posture, looking at camera. Not a full-length shot. Not a headshot. Mid-body.
- Image sits in a container with:
  - **No rectangle frame.** Use `clip-path: polygon()` or border-radius asymmetric to give the image a soft organic edge — not a circle, not a square. Something like a rounded left edge, straight right edge — feeling like the person is stepping into the frame from the right.
  - A subtle `ev-teal` glow behind the image (box-shadow or pseudo-element) — not bright, barely there, like warmth
  - `ev-yellow` decorative dot cluster (3 dots, varying sizes) in the top-left corner of the image container
- Below the image, a floating card (absolutely positioned, bottom-left of image, slight overlap into hero left column):
  - White background, subtle shadow, border-radius 10px, padding 12px 16px
  - Content: `"She noticed my daughter struggled before I did."` in Cormorant Garamond italic 13px, ev-ink. Below: `— Parent, Lagos · Primary 4` in JetBrains Mono 9px ev-muted
  - This card animates in with Framer Motion: fade + slide up, 0.6s delay after hero load

On mobile: stack vertically. Image comes first, full width, clip-path removed, standard border-radius. Copy below.

---

### 3. Trust bar — `TrustBar.tsx`

**Background:** `ev-yellow`  
**Layout:** Single horizontal row, flex, space-between, overflow hidden  
**Height:** 44px  

Items (JetBrains Mono, 11px, ev-green, font-weight 700):
```
✓ Free first session
✓ 1-hour sessions
✓ Fully online
✓ Flexible scheduling
✓ Monthly progress reports
✓ Nigerian-contextualised content
```

Separated by a small `·` dot in ev-green at 40% opacity. On mobile, this scrolls horizontally (overflow-x: auto, no scrollbar visible).

---

### 4. Philosophy — `Philosophy.tsx`

**Background:** `ev-board` (#F7F4EE)  
**Layout:** Two column. Left: the statement. Right: three pillars.

**Left:**
- Eyebrow: `BRAND PHILOSOPHY` in JetBrains Mono
- Pull quote in Cormorant Garamond 28px, ev-green, line-height 1.4, max-width 380px:
  ```
  "Every child has a weakness.
  That's not a failure —
  that's a place to begin."
  ```
- Below the quote: Inter 14px ev-muted:
  ```
  All it takes is a little extra time, a little extra attention,
  and the right person in the room.
  ```

**Right — three pillars, stacked vertically:**

Each pillar: left border 3px ev-yellow, padding-left 14px, margin-bottom 20px

```
SEE CLEARLY
She watches every session and tracks where each child
slows down — not to judge, but to know where to begin.

WORK DELIBERATELY
Extra time on the hard thing. Not punishing it —
patiently dismantling it, piece by piece.

OWN IT TOGETHER
Child, tutor, parent — all aligned. That's the
collective front she builds every month.
```

Pillar label: JetBrains Mono 9px, ev-teal, ALL CAPS  
Pillar body: Inter 13px, ev-muted, line-height 1.65

Reveal animation: pillars stagger in from right, 0.15s delay between each, on scroll entry.

---

### 5. Subjects — `Subjects.tsx`

**Background:** `ev-cream`  
**Layout:** 3-column card grid on desktop, 1-column on mobile

Section eyebrow: `WHAT WE TEACH`  
Section title: `Three subjects. One consistent tutor.`

**Cards:**

Each card: white background, border 1.5px #E8EDE9, border-radius 12px, padding 20px, hover → border-color ev-teal transition 200ms

```
📐 Mathematics
Numbers, fractions, algebra, and problem-solving —
built on real understanding, not memorisation.
Ages 3–12
```
```
📖 Literacy
Reading fluency, writing confidence, comprehension —
especially for early learners finding their voice.
Ages 3–12
```
```
🔬 Science
Curiosity-led exploration of the natural world —
building critical thinkers, not just exam passers.
Ages 6–12
```

Icon: 32×32 emoji in a rounded square background (ev-yellow-lt for Maths, ev-teal-lt for Literacy, #EEF2FF for Science)  
Subject name: Inter 15px, ev-ink, font-weight 700  
Description: Inter 13px, ev-muted, line-height 1.6  
Age tag: JetBrains Mono 9px, pill shape, matching tint background

---

### 6. How it works — `HowItWorks.tsx`

**Background:** `ev-green`  
**Layout:** Horizontal step row on desktop, stacked on mobile

Section eyebrow: `HOW IT WORKS` (ev-teal)  
Section title (Cormorant Garamond, white): `From first message to first breakthrough.`

**3 Steps:**

Step number: Cormorant Garamond 48px, ev-yellow, opacity 0.3 — large, behind the step content  
Step title: Inter 16px, white, font-weight 700  
Step body: Inter 13px, rgba(255,255,255,0.6), line-height 1.65  

```
01 — Book a free trial
Send a WhatsApp message or fill the form. We'll schedule
your child's first session at a time that works for your family.

02 — Meet your tutor
The first session is a discovery — she learns how your child
thinks, where they are, and what they need. No pressure.

03 — Watch them grow
Regular sessions, deliberate focus on weak spots, and an
end-of-month report so you always know exactly where they stand.
```

Connecting arrow between steps: thin ev-teal dashed line with arrow, hidden on mobile.

---

### 7. Reports section — `Reports.tsx`

This section is a differentiator. Treat it as such — don't make it feel like a feature list.

**Background:** `ev-yellow`  
**Layout:** Two column. Left: large statement. Right: mock report card visual.

**Left:**
- Eyebrow: `MONTHLY PROGRESS REPORTS`
- Headline (Cormorant Garamond, 36px, ev-green):
  ```
  You'll always know
  exactly where your
  child stands.
  ```
- Body (Inter, 14px, ev-green at 70% opacity):
  ```
  At the end of every month, every parent receives a
  written progress report — what was covered, where the
  child excelled, what needs more time, and the plan
  going forward. No surprises. No guessing.
  ```

**Right — mock report card:**

Build this as a small stylised "document" component — white card, shadow, border-radius 8px, padding 20px, width ~280px.

```
[EduVibeHub logo small]

MONTHLY PROGRESS REPORT
Child: ____________
Month: July 2026

MATHEMATICS        ████████░░  80%
LITERACY           ██████████  100%
SCIENCE            ██████░░░░  60%

Areas of focus next month:
· Long division (extra session planned)
· Reading speed — improving steadily

Tutor's note: "She's building real confidence
in literacy. Science needs more time — we're
on it together."
```

Progress bars: thin, ev-green fill on ev-teal-lt background, border-radius pill  
The "Tutor's note" is in Cormorant Garamond italic, ev-green  
The whole card has a subtle rotation: `rotate(-2deg)` — like it was placed on a desk

Framer Motion: card slides in from right on scroll entry.

---

### 8. Testimonials — `Testimonials.tsx`

**Background:** `ev-green`  
**Layout:** 2-column card grid

Section eyebrow: `WHAT PARENTS SAY` (rgba white 0.4)  
Section title (Cormorant Garamond, white): `Parent to parent.`

**4 testimonial cards:**

Card style: background rgba(255,255,255,0.06), border 1px rgba(255,255,255,0.10), border-radius 10px, padding 18px

```
★★★★★
"My daughter went from dreading maths to asking for extra
practice. I didn't think that was possible."
— Parent, Lagos · Primary 4

★★★★★
"She noticed my son was struggling with reading before I
brought it up. The monthly report made everything clear."
— Parent, Abuja · Year 2

★★★★★
"What I didn't expect was the follow-up. She actually
follows up. That alone makes her different."
— Parent, Port Harcourt · Nursery 2

★★★★★
"My child looks forward to sessions now. She builds
confidence, not just knowledge."
— Parent, Lagos · Year 5
```

Stars: ev-yellow  
Quote: Cormorant Garamond italic 14px, rgba(white, 0.80)  
Attribution: JetBrains Mono 9px, rgba(white, 0.40)

Stagger reveal on scroll: cards fade in 0.1s apart.

---

### 9. Final CTA — `FinalCTA.tsx`

**Background:** `ev-cream`  
**Layout:** Centered, single column, generous vertical padding (80px top/bottom)

Eyebrow: `GET STARTED`  
Headline (Cormorant Garamond, 44px, ev-ink):
```
Ready to see what
your child can do?
```
Body (Inter, 15px, ev-muted):
```
One free session. No commitment. No pressure.
Just good teaching, and a tutor who genuinely cares.
```

**CTA buttons, centered:**
- Primary: `Book a free trial session →` — ev-green pill, white text
- Secondary: `WhatsApp us directly` — ev-teal text, no background, underline

Micro text below (JetBrains Mono, 9px, ev-muted):
```
✓ Free first session  ·  ✓ Flexible scheduling  ·  ✓ Response within 24hrs
```

---

### 10. Footer — `Footer.tsx`

**Background:** `ev-ink` (#111A13)  
**Layout:** Three columns + bottom bar

**Column 1:** Logo + tagline
```
EduVibeHub
"Learning that lasts."
```

**Column 2:** Quick links
```
Subjects
How it works
Monthly reports
Book a trial
```

**Column 3:** Contact
```
WhatsApp: +234 907 314 9749
eduvibehub.com
```

**Bottom bar:**
```
© 2026 EduVibe Hub  ·  Built by BrainBox Studios
```
`BrainBox Studios` is a subtle link in ev-teal — your credit.

---

## Animation system — Framer Motion

### RevealOnScroll wrapper
```tsx
// components/ui/RevealOnScroll.tsx
// Wraps children with useInView + motion.div
// Default: fade up (y: 30 → 0, opacity: 0 → 1)
// Duration: 0.55s, ease: [0.22, 1, 0.36, 1]
// Trigger: once, margin: "-80px"
// Accept: delay prop (number, seconds)
```

Apply to:
- Every section title + eyebrow
- Philosophy pillars (stagger 0.15s)
- Subject cards (stagger 0.1s)
- Testimonial cards (stagger 0.1s)
- Reports card (slide from right)
- Hero floating quote card (delay 0.6s)

Do **not** animate:
- Nav
- Trust bar
- Hero headline (above the fold — no animation needed)

---

## Copy constants — `lib/constants.ts`

All text content must live here. No hardcoded strings in JSX. Structure:

```ts
export const COPY = {
  nav: { ... },
  hero: { eyebrow, headline, sub, cta, microCopy },
  trustBar: { items: string[] },
  philosophy: { quote, body, pillars: { label, body }[] },
  subjects: { sectionTitle, cards: { icon, title, body, age }[] },
  howItWorks: { sectionTitle, steps: { number, title, body }[] },
  reports: { headline, body },
  testimonials: { sectionTitle, items: { stars, quote, author }[] },
  finalCta: { headline, body, microCopy },
  footer: { tagline, links, contact, credit },
}
```

---

## Responsiveness

| Breakpoint | Key changes |
|---|---|
| Mobile < 768px | Single column throughout. Hero image above copy. Nav becomes hamburger. Trust bar scrolls horizontally. |
| Tablet 768–1024px | 2-col hero. Subjects 2-col. Steps stack. |
| Desktop > 1024px | Full layout as spec'd above. Max-width 1200px, centered. |

---

## Image handling

The client (EduVibe Hub) will supply:
- `tutor-hero.jpg` — half-body portrait, confident, direct, warm
- Testimonial parent avatars (optional, may be initials only)

Until real images are supplied, use:
```tsx
// In Hero.tsx — placeholder div styled as image container
<div className="w-full h-full bg-ev-teal-lt flex items-center justify-center">
  <span className="font-mono text-xs text-ev-muted">Tutor photo — coming soon</span>
</div>
```

Do not use any stock photo URLs. Do not use picsum, unsplash, or any external image source. Placeholder divs only.

---

## Paystack integration

The "Book a free trial" CTA button opens a **modal** (not a new page).

Modal contains:
```
Parent name (text input)
Child's name (text input)
Child's age / year group (select)
Subject interest (multi-select: Maths, Literacy, Science)
Preferred days (multi-select: Mon–Sat)
WhatsApp number (tel input)
Brief note (textarea, optional)
```

On submit: POST to `/api/contact` — this route should log the submission to console for now and return `{ success: true }`. The actual email/WhatsApp delivery will be wired later.

No Paystack on this modal — the free trial has no payment. Paystack integration comes after the trial converts to a paid session. Leave a clear `// TODO: Paystack` comment in the route handler.

---

## Performance requirements

- `next/image` for all images — width, height, priority on hero image
- Fonts via `next/font/google` — no external `<link>` tags
- No layout shift on font load
- Lighthouse target: 90+ performance, 100 accessibility
- `prefers-reduced-motion` respected in all Framer Motion variants:
```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// If true: skip y offset, keep opacity fade only
```

---

## What to build first (order)

1. `tailwind.config.ts` — tokens first, nothing else works without this
2. `app/layout.tsx` — fonts, metadata, global CSS reset
3. `lib/constants.ts` — all copy
4. `components/ui/Button.tsx` + `RevealOnScroll.tsx`
5. `Nav.tsx`
6. `Hero.tsx` — spend the most time here
7. `TrustBar.tsx`
8. `Philosophy.tsx`
9. `Subjects.tsx`
10. `HowItWorks.tsx`
11. `Reports.tsx`
12. `Testimonials.tsx`
13. `FinalCTA.tsx`
14. `Footer.tsx`
15. `app/api/contact/route.ts`
16. Mobile responsive pass — every section
17. Animation pass — add RevealOnScroll wrappers
18. Final audit — spacing, type scale, colour consistency

---

## Things Codex must NOT do

- Do not use any component library (shadcn, Radix, MUI, Chakra)
- Do not use any CSS framework other than Tailwind
- Do not hardcode any copy in JSX — use `constants.ts`
- Do not use stock photo URLs
- Do not use `<img>` tags — use `next/image` only
- Do not use `any` TypeScript type
- Do not generate placeholder lorem ipsum — use the real copy from this brief
- Do not add features not in this spec without a `// TODO:` comment explaining why
- Do not use numbered markers (01, 02, 03) decoratively — only where order genuinely matters (How It Works steps)

---

## Final check before shipping

Before marking complete, Codex should verify:

- [ ] Logo SVG renders correctly at 28px and 56px
- [ ] `ev-yellow` background with `ev-green` text passes WCAG AA contrast
- [ ] Hero image placeholder is visible and sized correctly
- [ ] All Framer Motion animations respect `prefers-reduced-motion`
- [ ] Mobile nav opens and closes cleanly
- [ ] Contact modal opens from both hero CTA and final CTA
- [ ] `/api/contact` returns `{ success: true }` on POST
- [ ] No TypeScript errors on `tsc --noEmit`
- [ ] `next build` completes without warnings

---

*Prompt authored by BrainBox Studios for EduVibe Hub — July 2026*
