# GreyEd Siyafunda — Sprint Plan

> 6 sprints. Each sprint builds on the last. Nothing is skipped.
> Based on the full audit in `AUDIT_AND_REDESIGN_PLAN.md`.

---

## Sprint 1 — "Stop the Bleeding"
**Focus:** Fix every critical and high-severity bug. Make the app actually secure.

### Tickets

| # | Task | File(s) | Bug # |
|---|------|---------|-------|
| 1.1 | Fix escaped quote in className (`z-40\"` → `z-40`) | `TeacherDashboardPage.tsx:149`, `TeacherClassesPage.tsx:261`, `TeacherLessonPlannerPage.tsx:483`, `TeacherAssessmentsPage.tsx:652` | #1-4 |
| 1.2 | Fix AuthContext catch blocks — add error binding `catch (err)` | `AuthContext.tsx:121`, `AuthContext.tsx:176` | #5-6 |
| 1.3 | Implement real route protection — redirect unauthenticated users to home/login modal | `ProtectedTeacherRoute.tsx` | #7 |
| 1.4 | Add admin route protection — check `role === 'admin'` before rendering | `AdminDashboardPage.tsx`, `App.tsx` (admin routes) | — |
| 1.5 | Re-enable `hasActiveSubscription()` — query `stripe_subscriptions` table | `teacher-api.ts:765` | #8 |
| 1.6 | Re-enable `getTeacherLimits()` — count actual usage from DB | `teacher-api.ts:772-779` | #9 |
| 1.7 | Fix DashboardRedirect — point to `/` with login modal instead of non-existent `/auth/login` | `App.tsx:347-357` | #12 |
| 1.8 | Fix icon import — `Edit2` instead of `CreditCard as Edit2` | `TeacherAssessmentsPage.tsx:4` | #10 |
| 1.9 | Initialize missing `setGeneratedPlan` state | `TeacherLessonPlannerPage.tsx:681` | #11 |
| 1.10 | Remove `user-scalable=no` from viewport meta | `LandingLayout.tsx:29` | #13 |
| 1.11 | Standardize sidebar localStorage key to `sidebarCollapsed` everywhere | `TeacherDashboardPage.tsx`, `TeacherClassesPage.tsx`, `TeacherLessonPlannerPage.tsx`, `TeacherAssessmentsPage.tsx`, `TeacherSidebar.tsx` | #14 |
| 1.12 | Wrap all `localStorage` access in try-catch | `TeacherSidebar.tsx:44,61` + all teacher pages | #20 |
| 1.13 | Remove hardcoded Stripe test billing URL | `TeacherSettingsPage.tsx:365` | #17 |

### Definition of Done
- All 6 critical bugs fixed and verified
- All 8 high-severity bugs fixed
- Protected routes actually reject unauthenticated users
- Subscription/limits check real data
- Build passes with no regressions

---

## Sprint 2 — "Design Foundations"
**Focus:** Create the shared component library and clean up the design system so every sprint after this has consistent building blocks.

### Tickets

| # | Task | Details |
|---|------|---------|
| 2.1 | **Consolidate color tokens** — Merge `greyed.*`, `cps.*`, `premium.*`, `navy.*`, `sand.*` into one semantic scale | `tailwind.config.js` — keep backward-compat aliases but define single source: `primary`, `primary-light`, `accent`, `accent-light`, `surface`, `surface-alt`, `text`, `text-muted`, `error`, `success` |
| 2.2 | **Define typography scale** — Create Tailwind `@layer components` classes | `index.css` — `.text-display`, `.text-h1` through `.text-h4`, `.text-body`, `.text-caption`, `.text-overline`. Poppins for headings, Inter for body. |
| 2.3 | **Build `<Card>` component** | `src/components/ui/Card.tsx` — variants: `default`, `elevated`, `outlined`. Props: `padding`, `className`. Used everywhere cards appear. |
| 2.4 | **Build `<StatCard>` component** | `src/components/ui/StatCard.tsx` — Props: `icon`, `label`, `value`, `trend?`, `color`. Replaces the 4 hand-built stat cards with inline SVGs in `TeacherDashboardPage.tsx:189-237`. |
| 2.5 | **Build `<EmptyState>` component** | `src/components/ui/EmptyState.tsx` — Props: `icon`, `title`, `description`, `action?` (button). Consistent empty states across classes, lesson plans, assessments. |
| 2.6 | **Build `<ConfirmDialog>` component** | `src/components/ui/ConfirmDialog.tsx` — Modal with title, message, confirm/cancel buttons. Replace all `window.confirm()` and `window.alert()` calls. |
| 2.7 | **Build `<PageHeader>` component** | `src/components/ui/PageHeader.tsx` — Props: `title`, `subtitle?`, `actions?` (buttons). Consistent header across all teacher pages. |
| 2.8 | **Build `<StatusBadge>` component** | `src/components/ui/StatusBadge.tsx` — Props: `status` ('draft' / 'ready' / 'taught' / 'published' / 'completed'). Color-coded pill. |
| 2.9 | **Build `<FormField>` wrapper** | `src/components/ui/FormField.tsx` — Props: `label`, `error?`, `required?`, `children` (input). Handles error display with `aria-describedby`. |
| 2.10 | **Replace inline SVG icons** with Lucide React across all teacher pages | `TeacherDashboardPage.tsx`, `TeacherClassesPage.tsx`, `TeacherLessonPlannerPage.tsx`, `TeacherAssessmentsPage.tsx` — standardize sizes: `w-5 h-5` (buttons), `w-6 h-6` (nav), `w-8 h-8` (feature cards) |
| 2.11 | **Extract `TeacherPageLayout` wrapper** | `src/components/teachers/TeacherPageLayout.tsx` — Wraps sidebar + main content + mobile nav. Every teacher page uses this instead of duplicating sidebar/layout logic. |
| 2.12 | **Extract sidebar `navItems` config** to shared constants | `src/data/navigation.ts` — Single source of truth for sidebar items, used by `TeacherSidebar.tsx` and `MobileBottomNavigation.tsx` |

### Definition of Done
- All shared components created with TypeScript interfaces
- Tailwind config has one clean color scale (aliases preserved for migration)
- Typography classes defined and documented
- At least one teacher page (Dashboard) migrated to use new components as proof of concept

---

## Sprint 3 — "Teacher Experience"
**Focus:** Redesign all teacher-facing pages using Sprint 2 components. This is where teachers spend 95% of their time.

### Tickets

| # | Task | Details |
|---|------|---------|
| 3.1 | **Dashboard redesign** | Migrate `TeacherDashboardPage.tsx` to use `StatCard`, `Card`, `PageHeader`, `TeacherPageLayout`. Remove hardcoded demo schedule data. Add Quick Actions panel (Generate Plan, Create Assessment, Send Update). Add recent activity timeline. |
| 3.2 | **Classes page redesign** | Migrate `TeacherClassesPage.tsx`. Use `Card` for class cards with richer info (student count, last lesson date, assessment count). Use `EmptyState` for zero classes. Use `ConfirmDialog` for delete. |
| 3.3 | **Lesson Planner redesign** | Migrate `TeacherLessonPlannerPage.tsx`. Make status dropdown touch-friendly (click, not hover-only). Add loading skeleton during plan generation. Use `ConfirmDialog` for delete (replace `confirm()`). Show CAPS alignment prominently. |
| 3.4 | **Assessments page redesign** | Migrate `TeacherAssessmentsPage.tsx`. Use `FormField` for validation (replace `alert()`). Use `StatusBadge` for assessment status. Add filter/sort controls. Improve grading view. |
| 3.5 | **Families page redesign** | Migrate `TeacherFamiliesPage.tsx`. Clearer sent/unsent status. Engagement metrics (open rates) displayed visually. |
| 3.6 | **Settings page redesign** | Migrate `TeacherSettingsPage.tsx`. Organize into tabbed sections: Profile, Notifications, Subscription, Privacy. Avatar upload with preview. Use env variable for Stripe billing URL. |
| 3.7 | **El AI Assistant page polish** | Migrate `ElAIAssistantPage.tsx`. Chat bubble design. Loading indicators during AI response. Clear "not connected" state if edge function unavailable. |
| 3.8 | **Sidebar & mobile nav consistency** | Ensure `TeacherSidebar.tsx` and `MobileBottomNavigation.tsx` both consume `navItems` from `data/navigation.ts`. Active state styling matches. Collapse state persists correctly. |
| 3.9 | **Replace all `alert()` / `confirm()` calls** across all teacher pages with `ConfirmDialog` and in-form validation | Grep for `alert(` and `confirm(` — replace every instance |

### Definition of Done
- Every teacher page uses `TeacherPageLayout`, shared components, and semantic color tokens
- No browser `alert()` or `confirm()` calls remain
- No inline SVG icons remain
- No hardcoded hex colors in JSX
- All pages mobile-tested (touch interactions work)

---

## Sprint 4 — "First Impressions"
**Focus:** Redesign the public-facing pages — landing, features, pricing. This is what converts visitors to users.

### Tickets

| # | Task | Details |
|---|------|---------|
| 4.1 | **Hero section rewrite** | `Hero.tsx` — Eliminate the 100+ lines of duplication. Single markup with conditional `motion.div` wrapper. Bold headline, clear value prop, one primary CTA ("Start Free"), one secondary ("See How It Works"). Remove Lottie dependency (replaced in Sprint 5). Use CSS animation or static illustration. |
| 4.2 | **Landing page section restructure** | `LandingPage.tsx` — New order: Hero → Social Proof Bar → Problem/Solution → Feature Cards → How It Works (3-step) → Pricing Preview → Testimonial → Final CTA. Remove snap scroll. 80px vertical rhythm. Alternating cream/white backgrounds. |
| 4.3 | **WhyGreyEd section redesign** | `WhyGreyEd.tsx` — Cleaner comparison cards. Stronger visual contrast between "without GreyEd" and "with GreyEd". |
| 4.4 | **Feature Showcase cards** | `FeaturesPage.tsx` + section components — 4 feature cards (Lesson Plans, Assessments, Family Updates, El AI) with icons, short descriptions, and "Learn more" links. |
| 4.5 | **Pricing page redesign** | `PricingPage.tsx` — Two clear tiers: Free (limited) vs Pro (unlimited). Feature comparison checklist. Prominent CTA on Pro tier. Show actual limits from config (not hardcoded text). |
| 4.6 | **Footer cleanup** | `Footer.tsx` — Eliminate 140+ lines of motion duplication. Extract `<FooterLink>` component. Add real social media URLs (or remove dead links). Fix the hidden admin login link — move to `/admin/login` route only. |
| 4.7 | **NavBar cleanup** | `NavBar.tsx` — Remove fragile DOM-based background color detection. Use route-based theming instead. Ensure right-side buttons (Login, Sign Up) always render for unauthenticated users. |
| 4.8 | **About, Contact, Tutoring, ELLM page polish** | Apply new typography scale, spacing, and color tokens. Consistent `PageHeader` usage. Mobile-responsive layouts. |
| 4.9 | **Auth modals polish** | `LoginModal.tsx`, `TeacherSignupModal.tsx` — Use `FormField` component. Add `aria-describedby` for errors. Focus trap. Consistent sizing and spacing. |

### Definition of Done
- Landing page has clear visual hierarchy and narrative flow
- No code duplication in Hero or Footer
- Pricing shows real tier limits
- All public pages use consistent typography, spacing, colors
- Dead social links removed or replaced with real URLs
- Build still passes, no regressions on teacher pages

---

## Sprint 5 — "Speed"
**Focus:** Cut the 2.66 MB bundle, remove dead weight, make the app fast on low-bandwidth connections.

### Tickets

| # | Task | Details |
|---|------|---------|
| 5.1 | **Route-level code splitting** | `App.tsx` — Wrap every page import in `React.lazy()` + `<Suspense fallback={<Loader />}>`. Target: initial bundle <500KB. |
| 5.2 | **Remove Lottie dependency** | Uninstall `@lottiefiles/react-lottie-player`. Replace Hero animation with CSS keyframe animation or static SVG illustration. Eliminates `eval()` security warning. |
| 5.3 | **Deduplicate Hero markup** | `Hero.tsx` — Single render path with conditional `motion.div` wrapper. Should reduce from ~200 lines to ~80. |
| 5.4 | **Deduplicate Footer markup** | `Footer.tsx` — Extract `<FooterLink>` and `<FooterSection>` components. Conditional motion wrapper. ~140 lines → ~60. |
| 5.5 | **Remove dead code** | Delete `types/hyper-personalized.ts` (unused student types). Remove commented-out chat widget from `index.html`. Remove unused onboarding components not referenced in any route. Clean up deprecated `/students/*` and `/waitlist` redirect routes. |
| 5.6 | **Clean up analytics boilerplate** | `App.tsx:58-143` — Replace 85 lines of repetitive sessionStorage tracking with a single generic `usePageTracking()` hook or remove entirely if no analytics service is connected. |
| 5.7 | **Optimize images** | Add `loading="lazy"` to all `<img>` tags. Convert any PNG/JPG assets to WebP. Compress favicon. |
| 5.8 | **Vite chunking config** | `vite.config.ts` — Add `build.rollupOptions.output.manualChunks` to split vendor code (react, supabase, tiptap, recharts) into separate cached chunks. |
| 5.9 | **Loader accessibility** | `Loader.tsx` — Add `role="status"`, `aria-label="Loading"`, `aria-busy="true"`. Remove unnecessary NavBar render inside fullscreen loader. |

### Definition of Done
- Initial bundle <500KB (currently 2.66 MB)
- Lighthouse performance score >80 on mobile
- Lottie removed, no `eval()` warnings
- No dead code, no unused types/components
- All lazy-loaded routes show Loader during chunk fetch

---

## Sprint 6 — "Intelligence & Access"
**Focus:** Connect real AI, complete accessibility audit, and prepare for multi-language support.

### Tickets

| # | Task | Details |
|---|------|---------|
| **AI Integration** | | |
| 6.1 | **Deploy `el-ai-teacher` Edge Function** | Supabase Edge Function that accepts teacher context (subject, grade, topic, CAPS alignment) and returns AI-generated content via Claude/GPT API. |
| 6.2 | **Real lesson plan generation** | `teacher-api.ts:generateLessonPlan()` — Replace hardcoded markdown template with call to edge function. Send curriculum context, receive structured lesson plan. Parse and display with existing markdown renderer. |
| 6.3 | **Real assessment generation** | `teacher-api.ts:generateAssessment()` — Replace `generateMockQuestions()` with AI-generated questions. Validate question format, store individual items in `assessment_items` table. |
| 6.4 | **Real family update generation** | `teacher-api.ts:generateFamilyUpdate()` — AI-written weekly summary based on actual class activity (lessons taught, assessments given). HTML template rendering. |
| 6.5 | **Streaming AI responses** | Add SSE/streaming support to edge functions. Show progressive text rendering in lesson planner and El AI chat. Loading skeletons during generation. |
| 6.6 | **Rate limiting** | Add per-user, per-day limits on AI calls. Free tier: 5 generations/day. Pro tier: 50/day. Track in `profiles` or new `usage_logs` table. |
| **Accessibility** | | |
| 6.7 | **ARIA audit** — Add `aria-label`, `aria-describedby`, `role` attributes | All modals, dropdowns, sidebar, navigation, forms. Use `aria-expanded` on collapsible sections. |
| 6.8 | **Keyboard navigation** | All interactive elements focusable via Tab. Enter/Space activates buttons. Escape closes modals. Arrow keys navigate sidebar and dropdowns. |
| 6.9 | **Focus trapping** | Modals trap focus (Tab cycles within modal). Focus returns to trigger element on close. |
| 6.10 | **Color contrast audit** | Test all text/background combinations against WCAG AA (4.5:1). Fix any failing pairs. Special attention to gold text on cream backgrounds. |
| 6.11 | **Semantic HTML pass** | Replace all clickable `<div>` elements with `<button>` or `<a>`. Add `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>` landmarks. |
| **i18n** | | |
| 6.12 | **Extract strings to locale file** | Create `src/data/locales/en.ts` with all user-facing strings. Wrap text in a `t()` helper function. Prepare structure for isiZulu, Siswati translations. |

### Definition of Done
- AI generates real, curriculum-aligned content (not templates/mocks)
- Streaming responses work in lesson planner and El AI
- Rate limits enforced for free and pro tiers
- WCAG 2.1 AA compliance verified (automated + manual testing)
- All interactive elements keyboard-navigable
- String extraction complete, ready for translation

---

## Sprint Dependency Map

```
Sprint 1 ──→ Sprint 2 ──→ Sprint 3 ──┐
  (Bugs)      (Design)    (Teacher)   │
                  │                    ├──→ Sprint 6
                  └──→ Sprint 4 ──────┘    (AI + A11y)
                       (Public)       │
                          │           │
                          └──→ Sprint 5
                               (Perf)
```

- **Sprint 1** must come first — broken code blocks everything
- **Sprint 2** must precede Sprints 3 and 4 — components needed for both
- **Sprints 3 and 4** can run in parallel if two developers are available
- **Sprint 5** benefits from Sprints 3-4 being done (less code to split)
- **Sprint 6** is the final polish — AI and accessibility layered on top of the cleaned-up codebase
