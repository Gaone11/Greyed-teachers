# GreyEd Subscription Tiers

Status: Decided 2026-10-10 (Gaone Molefi). Gating built in the app; server-side enforcement written but needs deploying (see "Deployment").

## Principles

1. **AI usage is the marginal cost.** Paid tiers sell more AI volume and the AI tools that do work for you.
2. **Network features stay free.** Messaging, connections, and the parent hub are how students, parents, and teachers invite each other. Gating them would slow growth.
3. **Each upgrade has one clear reason.** Standard = study tools and more AI. Premium = AI that does work for you. Enterprise = organisation control.
4. **Users only see what their tier includes.** Locked pages are hidden from navigation. Opening one by direct link shows an upgrade prompt.

## Tier summary

| Tier | Price (GBP) | Who it is for | Upgrade reason |
|---|---|---|---|
| Basic | Free | Every new account | Real daily use at no cost |
| Standard | 9.99 / month, 99.50 / year (Stripe prices not yet created) | Individual students and teachers | Learning Hub, goals, courses, 5x the AI |
| Premium | 19.99 / month, 199.10 / year (Stripe prices not yet created) | Power users, private tutors | AI lesson planner, test maker, auto-grading, analytics |
| Enterprise | Custom | Schools, tutoring groups, NGOs | Admin, school-wide analytics, custom setup |

## Feature matrix

| Feature | Basic | Standard | Premium | Enterprise |
|---|---|---|---|---|
| Student, teacher, or parent hub access | Yes | Yes | Yes | Yes |
| Dashboard, timetable, and notifications | Yes | Yes | Yes | Yes |
| Messaging and connections | Yes | Yes | Yes | Yes |
| Homework, assessments, and basic grades | Yes | Yes | Yes | Yes |
| El AI requests (Ask El, GreyEd AI, generators) | 20 / day | 100 / day | 300 / day | Custom (300 default) |
| Teacher classes | Up to 2 | Unlimited | Unlimited | Unlimited |
| Learning Hub, smart notes, and flashcards | No | Yes | Yes | Yes |
| Learning goals and achievements | No | Yes | Yes | Yes |
| Courses and assessment library | No | Yes | Yes | Yes |
| Tutor and family progress updates | No | Yes | Yes | Yes |
| AI lesson planner and test maker | No | No | Yes | Yes |
| AI auto-grading | No | No | Yes | Yes |
| GreyEd TA avatar and exam prep | No | No | Yes | Yes |
| Personal analytics and reports | No | No | Yes | Yes |
| Priority support | No | No | Yes | Yes |
| Organisation admin controls and bulk onboarding | No | No | No | Yes |
| School-wide analytics | No | No | No | Yes |
| Custom curriculum and dedicated support | No | No | No | Yes |

The parent hub is fully free on every tier.

### AI limits: rationale

- **One counter for all AI requests.** Chat and the generators call the same AI functions, so the server cannot tell them apart. Counting every request gives one honest cost cap per user.
- **Basic 20:** enough for a real study session; caps cost per free user.
- **Standard 100 (5x Basic):** heavy daily use by one student or teacher without hitting the cap in normal work.
- **Premium 300:** covers generator-heavy days (each lesson plan or test is one request) with headroom. Effectively unlimited for normal use while still capping abuse.
- **Enterprise:** 300 per user by default, adjustable per contract.
- Limits reset at 00:00 UTC (02:00 SAST, 01:00 WAT). A refused request does not count.
- **Revisit** once real per-request model cost is known: monthly AI cost per user at the cap should stay below the tier price.

### Changes from the first draft

- **Lesson planner and assessments (Test Maker) moved to Premium.** In the product, lesson plans and assessments can only be created through the AI generators, so a Standard "lesson planner" would have been an empty page.
- **Removed "Upload your own knowledge base" and "SSO".** Neither exists for users today (the knowledge base tool is limited to GreyEd staff). Add them back when built.
- **Tutor invite links and marketplace listing are not in the matrix.** They were only described in the removed pricing builder and do not exist in the product. When built, invite links should be free on every tier (principle 2).
- **"Knowledge Galaxy" renamed to "Learning Hub"** across the product, docs, file names, and code identifiers. The browser storage key `kg_progress` is unchanged so saved progress is kept.

## Hub pages by minimum tier

The source of truth is `ROUTE_TIERS` in `src/lib/tiers.ts`. Unlisted pages are Basic.

### Student hub

| Page | Minimum tier |
|---|---|
| Dashboard, Smart Timetable, Homework & Assessments, Grades & Progress, Communication Center, Connections, Settings | Basic |
| Ask El | Basic (20 requests / day) |
| Learning Goals, Learning Hub, Assessment Library, Achievement System | Standard |
| Exams & Assessments (exam prep) | Premium |

### Teacher hub

| Page | Minimum tier |
|---|---|
| Dashboard, Timetable, Students & Attendance, Homework & Assessments, Communication Center, Connections, Settings | Basic |
| Classes | Basic (up to 2), Standard (unlimited) |
| GreyEd AI chat | Basic (20 requests / day) |
| Courses, Learning Hub, Updates (tutor and family) | Standard |
| Lesson Planner and AI Lesson Plan Generator | Premium |
| Assessments (Test Maker) and AI Auto-Grading | Premium |
| GreyEd TA (avatar), Analytics & Reports | Premium |

### Parent hub

All pages free.

## How it is enforced

| Layer | What it does | Where |
|---|---|---|
| Tier source | `profiles.plan` (basic, standard, premium, enterprise). Old `free` values become `basic`. | `supabase/migrations/20261010120000_subscription_tiers.sql` |
| Plan protection | Users cannot choose or change their own plan. New profiles start on Basic; only the service role or SQL as postgres can change a plan. | Same migration (`protect_profile_plan` trigger) |
| AI limits | Edge functions identify the user, read their plan, and atomically count the request. Over the limit returns HTTP 429 with a message the chat shows to the user. | `supabase/functions/_shared/ai-usage.ts`, `el-ai-student`, `el-ai-teacher` |
| Class limit | Database rejects a third class for Basic teachers; the Classes page shows "Upgrade for more classes". | Migration (`enforce_class_limit` trigger), `TeacherClassesPage.tsx` |
| Page access | Sidebars, dashboard shortcuts, and mobile nav hide locked pages; route guards show an upgrade prompt. | `src/lib/tiers.ts`, `src/context/TierContext.tsx`, `Protected*Route.tsx` |

Page access is enforced in the app only. Premium pages mostly call AI, which the server caps per tier, but someone who bypasses the app could still reach Premium-only data reads. Acceptable for now; move checks server-side if that changes.

## Deployment

Order matters: the edge functions refuse AI requests until the migration exists.

1. Apply the migration: `supabase link --project-ref <ref>` then `supabase db push` (or run the SQL in the Supabase SQL editor).
2. Deploy the functions: `supabase functions deploy el-ai-student el-ai-teacher`.
3. Deploy the frontend (push to `main`).

To change a user's plan until Stripe is wired up, run as postgres in the SQL editor:
`update profiles set plan = 'premium' where email = 'someone@example.com';`

## Open items

- **Stripe:** create Standard and Premium prices and a webhook that sets `profiles.plan`. Until then no one can self-upgrade, and the "Upgrade" buttons lead to the pricing page only.
- **Existing users:** after deployment, every account on `free`/`basic` loses Standard and Premium features. Decide whether to grant existing users a grace period (for example, set them to `premium` for 30 days).
- **Enterprise features** (admin controls, school-wide analytics) are sales-led and not yet built as self-serve product.
