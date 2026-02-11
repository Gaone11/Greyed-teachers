# GreyEd Teachers Platform — Full Audit & Redesign Plan

## Platform Overview & Vision

**Siyafunda** ("We are learning") is an AI-powered teaching platform built for **Cophetsheni Primary School** in Mpumalanga, South Africa. The vision is clear and compelling:

- Give teachers AI-generated, CAPS-aligned lesson plans and assessments
- Enable family/parent communication through weekly updates
- Provide an AI teaching assistant (El AI) that adapts to personality profiles
- Support neurodivergent and dyslexia-friendly learning
- Offer subscription-based monetization via Stripe

**The idea is strong.** An AI tool that removes the administrative burden from South African teachers — especially in under-resourced schools — has genuine value. The personality-driven AI assistant, CAPS curriculum alignment, and accessibility-first approach are differentiating features that show real thought about the user base.

---

## Is the Platform Functional?

**Partially.** The core scaffolding exists and the build compiles, but there are meaningful gaps between "working code" and "usable product":

### What Works
- Authentication flow (signup, login, password reset) via Supabase
- Class CRUD operations (create, read, update, delete)
- Lesson plan generation (template-based, saves to DB)
- Assessment generation (mock questions, saves to DB)
- Family update creation and tracking
- Dashboard with stats from real database queries
- Stripe checkout integration (product/price IDs configured)
- Responsive layout with Tailwind + mobile navigation
- PWA manifest and service worker registered
- Dyslexia-friendly mode toggle

### What Does NOT Work / Is Incomplete
- **No real AI generation** — Lesson plans use hardcoded markdown templates. Assessments use `generateMockQuestions()` which produces generic filler text. The "AI" is cosmetic.
- **Protected routes aren't protected** — `ProtectedTeacherRoute` renders children unconditionally regardless of auth state (`src/components/ui/ProtectedTeacherRoute.tsx:21`)
- **`hasActiveSubscription()` always returns `true`** — Subscription checks are bypassed (`src/lib/api/teacher-api.ts:765`)
- **`getTeacherLimits()` returns Infinity** — Free tier limits are disabled (`src/lib/api/teacher-api.ts:772-779`)
- **Social links are dead** — All footer social media links point to `#` (`src/components/layout/Footer.tsx`)
- **El AI chat is not connected** — Calls Supabase edge functions that may not be deployed
- **Family updates don't actually send emails** — `sendFamilyUpdate()` only marks the DB flag
- **Student portal is completely removed** — Routes redirect to home, types exist but no pages
- **Admin dashboard has no role enforcement** — Anyone can navigate to `/admin/dashboard`
- **Analytics tracking is sessionStorage writes** — No actual analytics service connected

---

## Bugs & Errors Found

### Critical (Breaking)

| # | Location | Issue |
|---|----------|-------|
| 1 | `TeacherDashboardPage.tsx:149` | Escaped quote in className: `z-40\"` — renders broken HTML attribute |
| 2 | `TeacherClassesPage.tsx:261` | Same escaped quote bug in overlay className |
| 3 | `TeacherLessonPlannerPage.tsx:483` | Same escaped quote bug in overlay className |
| 4 | `TeacherAssessmentsPage.tsx:652` | Same escaped quote bug in overlay className |
| 5 | `AuthContext.tsx:121` | `catch { return { error }; }` — references undefined `error` variable in catch block (no binding) |
| 6 | `AuthContext.tsx:176` | Same undefined `error` in catch block |

### High Severity (Functional Bugs)

| # | Location | Issue |
|---|----------|-------|
| 7 | `ProtectedTeacherRoute.tsx:21` | No auth check — renders children for unauthenticated users |
| 8 | `teacher-api.ts:765` | `hasActiveSubscription()` hardcoded to return `true` |
| 9 | `teacher-api.ts:772` | `getTeacherLimits()` returns `Infinity` for all limits |
| 10 | `TeacherAssessmentsPage.tsx:4` | `CreditCard` imported as `Edit2` — wrong icon displayed |
| 11 | `TeacherLessonPlannerPage.tsx:681-684` | `setGeneratedPlan` referenced but never initialized as state |
| 12 | `DashboardRedirect:347-357` | Redirects to `/auth/login` which doesn't exist as a route |
| 13 | `LandingLayout.tsx:29` | Sets `user-scalable=no` — violates WCAG accessibility |
| 14 | Multiple teacher pages | Sidebar localStorage key inconsistency: `teacherSidebarCollapsed` vs `sidebarCollapsed` |

### Medium Severity (UX / Quality)

| # | Location | Issue |
|---|----------|-------|
| 15 | `TeacherAssessmentsPage.tsx:236` | Uses browser `alert()` for form validation |
| 16 | `TeacherLessonPlannerPage.tsx:336` | Uses browser `confirm()` for delete confirmation |
| 17 | `TeacherSettingsPage.tsx:365` | Hardcoded Stripe **test** billing URL in production code |
| 18 | `Hero.tsx:131-214` | 100+ lines of duplicated markup (animated vs non-animated paths) |
| 19 | `Footer.tsx:86-226` | 140+ lines of duplicated motion/non-motion markup |
| 20 | `TeacherSidebar.tsx:44,61` | `localStorage` access without try-catch (breaks in private browsing) |
| 21 | `App.tsx:58-143` | 85 lines of repetitive sessionStorage analytics tracking |
| 22 | `Hero.tsx:77` | Empty catch block silently swallows Lottie loading errors |
| 23 | `Loader.tsx` | No ARIA attributes (aria-busy, aria-label, role) for screen readers |
| 24 | Main JS bundle | 2.66 MB — no code splitting, no lazy loading |

---

## Redesign Plan

### Phase 1: Fix Critical Bugs & Security

**Goal:** Make the platform actually functional and secure.

1. **Fix all escaped quote bugs** (4 locations) — remove trailing `\"` from className strings
2. **Fix AuthContext catch blocks** — add error binding: `catch (error) { return { error }; }`
3. **Implement real route protection** — `ProtectedTeacherRoute` should redirect unauthenticated users to login
4. **Add admin route protection** — check role before rendering admin dashboard
5. **Re-enable subscription checking** — remove hardcoded `return true` from `hasActiveSubscription()`
6. **Re-enable tier limits** — `getTeacherLimits()` should query actual usage from DB
7. **Fix DashboardRedirect** — point to valid login route or use login modal
8. **Remove `user-scalable=no`** from viewport meta — allow zoom for accessibility
9. **Fix icon import** — replace `CreditCard as Edit2` with actual `Edit2` icon

### Phase 2: Design System Overhaul

**Goal:** Create visual consistency and a polished, professional feel.

#### 2a. Establish Component Library
- Extract reusable `<Card>`, `<StatCard>`, `<EmptyState>`, `<ConfirmDialog>`, `<PageHeader>` components
- Create a `<FormField>` wrapper with consistent error display (replace `alert()` / `confirm()`)
- Build `<IconButton>` and `<ActionMenu>` components for consistent interaction patterns
- Create `<Badge>` / `<StatusBadge>` for lesson plan status, assessment status, etc.

#### 2b. Typography & Spacing Scale
- Define and enforce a strict type scale: display (hero), h1-h4, body, caption, overline
- Standardize spacing: consistent `gap-4`, `gap-6`, `gap-8` between sections
- Use Poppins for headings, Inter for body — enforce this everywhere (currently inconsistent)

#### 2c. Color Refinement
- The earth-tone palette (forest green, gold, cream, terracotta) is beautiful and culturally appropriate — keep it
- But clean up color redundancy: `greyed.*`, `cps.*`, `premium.*`, `navy.*`, `sand.*` are all overlapping aliases for the same ~8 colors
- Consolidate to a single semantic scale: `primary`, `accent`, `surface`, `error`, `muted`
- Remove all inline hex codes from components — everything should reference Tailwind config

#### 2d. Iconography
- Replace all inline SVGs in dashboard pages (100+ lines of raw SVG) with Lucide React components (already installed)
- Standardize icon sizes: `w-4 h-4` (inline), `w-5 h-5` (buttons), `w-6 h-6` (nav), `w-8 h-8` (feature cards)

### Phase 3: Landing Page Redesign

**Goal:** Convert visitors to signups with a clear, compelling narrative.

#### Current Issues
- Hero section duplicates 100+ lines of markup
- Sections are stacked with no clear visual hierarchy or breathing room
- No clear CTA flow: visitor lands → understands value → signs up
- Social proof (testimonials, featured on) lacks real content

#### Proposed Structure
1. **Hero** — Bold headline, sub-headline explaining the value, single primary CTA ("Start Free"), subtle animation (not Lottie — too heavy at 2.6MB bundle)
2. **Social Proof Bar** — Logos or stats ("500+ lesson plans generated", "12 schools")
3. **Problem / Solution** — Two-column: left shows the teacher's pain, right shows GreyEd's solution
4. **Feature Showcase** — 3-4 cards with icons: Lesson Plans, Assessments, Family Updates, El AI
5. **How It Works** — 3-step visual: Sign Up → Create Class → Generate Content
6. **Pricing** — Embedded pricing cards (free vs pro), not a separate page
7. **Testimonial** — Single powerful quote from a real teacher
8. **Final CTA** — Full-width banner: "Join Siyafunda today"

#### Design Principles
- Max content width of 1200px with generous horizontal padding
- Each section alternates background (cream / white) for visual rhythm
- Consistent 80px vertical padding between sections
- Animations: subtle fade-in on scroll only — remove snap scroll behavior entirely
- Mobile: single column, larger touch targets, sticky bottom CTA bar

### Phase 4: Teacher Dashboard Redesign

**Goal:** Make the teacher's daily workflow fast and intuitive.

#### Current Issues
- Dashboard is information-dense but not actionable
- Stats cards use raw SVGs and inconsistent styling
- "Today's Schedule" shows hardcoded demo data
- AI suggestions section feels disconnected
- Sidebar navigation has inconsistent state management

#### Proposed Layout
```
+------+--------------------------------------------------+
|      |  Welcome, [Name]              [Quick Actions ▾]  |
| Side |                                                   |
| bar  |  [4 Stat Cards in a row]                         |
|      |                                                   |
|      |  +--Recent Classes--+ +--Quick Actions-----------+|
|      |  | Class list with  | | Generate Lesson Plan     ||
|      |  | progress bars    | | Create Assessment        ||
|      |  |                  | | Send Family Update       ||
|      |  +------------------+ +--------------------------+|
|      |                                                   |
|      |  +--Recent Activity--------------------------------+
|      |  | Timeline of last 5 actions                     |
|      |  +------------------------------------------------+
+------+--------------------------------------------------+
```

#### Key Changes
- Remove demo/hardcoded schedule data — show real data or hide section
- Stat cards: use Lucide icons, consistent card component, real numbers
- Add "Quick Actions" panel — the most common teacher actions in 1 click
- Add activity timeline showing recent lesson plans, assessments, updates
- Fix sidebar localStorage key to be consistent across all pages
- Sidebar: extract navItems config to a shared constants file

### Phase 5: Teacher Workflow Pages

**Goal:** Streamline the core teacher workflows.

#### Lesson Planner
- Fix `setGeneratedPlan` uninitialized state bug
- Replace `confirm()` with custom confirmation dialog
- Make status dropdown touch-friendly (not hover-only)
- Add loading skeleton while generating plans
- Show curriculum alignment prominently (CAPS is a key differentiator)

#### Assessments
- Fix `CreditCard as Edit2` icon bug
- Replace `alert()` with in-form validation
- Remove mock question generation — either connect to real AI or show clear "coming soon" state
- Add bulk actions (delete multiple, change status)
- Improve grading interface with better visual feedback

#### Classes
- Fix escaped quote in overlay
- Add class cards with richer information (student count, last activity, progress)
- Improve empty state with clear onboarding: "Create your first class to get started"

#### Settings
- Remove hardcoded Stripe test URL
- Organize settings into clear tabs: Profile, Notifications, Subscription, Privacy
- Add avatar upload preview before save
- Show subscription status with clear upgrade path

### Phase 6: Performance & Architecture

**Goal:** Get the bundle size down and the app feeling fast.

1. **Code splitting** — Lazy load all route-level pages with `React.lazy()` + `Suspense`
   - Current: single 2.66 MB bundle
   - Target: <500KB initial load, route chunks loaded on demand
2. **Remove Lottie** — The `@lottiefiles/react-lottie-player` alone adds significant weight and uses `eval()`. Replace with CSS animations or lightweight SVG animations
3. **Tree-shake icons** — Import individual Lucide icons: `import { Home } from 'lucide-react'` (already done correctly)
4. **Eliminate code duplication**:
   - Hero.tsx: extract shared markup, use motion wrapper conditionally
   - Footer.tsx: extract link components, wrap with optional motion
   - Teacher pages: extract shared sidebar/layout wrapper
5. **Image optimization** — Use `<img loading="lazy">` and WebP format for any images
6. **Remove dead code**:
   - Unused student types in `types/hyper-personalized.ts`
   - Unused onboarding components if not in any route
   - Commented-out chat widget in `index.html`

### Phase 7: Accessibility & Internationalization

**Goal:** Meet WCAG 2.1 AA and prepare for multi-language support.

1. **Remove `user-scalable=no`** — allow 2x zoom minimum
2. **Add ARIA attributes** to Loader, modals, dropdowns, sidebar
3. **Keyboard navigation** — all interactive elements must be focusable and operable
4. **Focus management** — trap focus in modals, return focus on close
5. **Form accessibility** — link error messages to inputs with `aria-describedby`
6. **Color contrast** — audit all text/background combinations against WCAG AA (4.5:1 ratio)
7. **Semantic HTML** — replace clickable `<div>` elements with `<button>` or `<a>`
8. **i18n preparation** — extract all user-facing strings to a locale file (English + potentially isiZulu, isiXhosa, Siswati for Mpumalanga)

### Phase 8: Connect Real AI

**Goal:** Replace mock/template content with actual AI generation.

1. **Deploy Supabase Edge Functions** for `el-ai-teacher` and `el-ai-student`
2. **Implement actual lesson plan generation** — send curriculum context, topic, grade level to an LLM; replace the hardcoded markdown template
3. **Implement real assessment generation** — replace `generateMockQuestions()` with AI-generated questions validated against the topic and difficulty
4. **Implement family update generation** — AI-written summaries of the week's activities
5. **Add streaming responses** — show AI output as it generates for perceived speed
6. **Rate limiting** — enforce per-user, per-day limits on AI calls

---

## Priority Order

| Priority | Phase | Impact | Effort |
|----------|-------|--------|--------|
| 1 | Phase 1: Fix Critical Bugs | Unblocks everything | Low |
| 2 | Phase 2: Design System | Foundation for all UI work | Medium |
| 3 | Phase 4: Dashboard Redesign | First thing teachers see daily | Medium |
| 4 | Phase 6: Performance | 2.6MB bundle is unacceptable | Medium |
| 5 | Phase 5: Workflow Pages | Core value delivery | High |
| 6 | Phase 3: Landing Page | Conversion and first impressions | Medium |
| 7 | Phase 7: Accessibility | Compliance and inclusivity | Medium |
| 8 | Phase 8: Real AI | Transform from demo to product | High |

---

## Summary

The vision behind GreyEd/Siyafunda is genuinely compelling — an AI-powered teaching assistant built specifically for South African schools, with cultural sensitivity, CAPS alignment, and accessibility features baked in from the start. The architecture choices (React + Supabase + Stripe) are sound and appropriate for the scale.

However, the current state is closer to a **functional prototype** than a production application. The critical bugs (broken classNames, unprotected routes, disabled security checks) need immediate attention. The AI features are entirely mocked. The bundle size makes it impractical for the low-bandwidth environments where Mpumalanga schools operate.

The redesign plan above takes the existing strong foundation and transforms it into a polished, performant, accessible product that delivers on the vision. The earth-tone palette and cultural elements should be preserved and refined — they are a strength, not a weakness.
