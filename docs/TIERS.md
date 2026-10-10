# GreyEd Subscription Tiers

Status: Decided 2026-10-10 (Gaone Molefi). Pricing page updated. Feature gating in the hubs is **not yet enforced**; see "Implementation status".

## Principles

1. **AI usage is the marginal cost.** Paid tiers sell more AI volume and heavier AI workflows.
2. **Network features stay free.** Messaging, connections, and the parent hub are how students, parents, and teachers invite each other. Gating them would slow growth.
3. **Each upgrade has one clear reason.** Standard = study and planning tools. Premium = AI that does work for you. Enterprise = organisation control.

## Tier summary

| Tier | Price (GBP) | Who it is for | Upgrade reason |
|---|---|---|---|
| Basic | Free | Every new account | Real daily use at no cost |
| Standard | 9.99 / month, 99.50 / year | Individual students and teachers | Knowledge Galaxy, goals, planning, more AI |
| Premium | 19.99 / month, 199.10 / year | Power users, private tutors | AI generators, auto-grading, analytics |
| Enterprise | Custom | Schools, tutoring groups, NGOs | Admin, school-wide analytics, custom setup |

## Feature matrix

| Feature | Basic | Standard | Premium | Enterprise |
|---|---|---|---|---|
| Student, teacher, or parent hub access | Yes | Yes | Yes | Yes |
| Dashboard, timetable, and notifications | Yes | Yes | Yes | Yes |
| Messaging and connections | Yes | Yes | Yes | Yes |
| Homework, assessments, and basic grades | Yes | Yes | Yes | Yes |
| Ask El / GreyEd AI chat | 20 / day | Higher limit (TBD) | Highest limit (TBD) | Custom |
| Teacher classes | Up to 2 | Unlimited | Unlimited | Unlimited |
| Knowledge Galaxy, smart notes, and flashcards | No | Yes | Yes | Yes |
| Learning goals and achievements | No | Yes | Yes | Yes |
| Lesson planner, courses, and assessment library | No | Yes | Yes | Yes |
| Tutor and family progress updates | No | Yes | Yes | Yes |
| AI lesson plan and assessment generators | No | No | Yes | Yes |
| AI auto-grading | No | No | Yes | Yes |
| GreyEd TA avatar and exam prep | No | No | Yes | Yes |
| Personal analytics and reports | No | No | Yes | Yes |
| Upload your own knowledge base | No | No | Yes | Yes |
| Priority support | No | No | Yes | Yes |
| Organisation admin controls and bulk onboarding | No | No | No | Yes |
| School-wide analytics | No | No | No | Yes |
| Custom curriculum, SSO, and dedicated support | No | No | No | Yes |

The parent hub is fully free on every tier.

## Mapping to hub pages

Use this when implementing gating. Minimum tier per sidebar item.

### Student hub

| Page | Minimum tier |
|---|---|
| Dashboard | Basic |
| Smart Timetable | Basic |
| Homework & Assessments | Basic |
| Grades & Progress | Basic |
| Communication Center | Basic |
| Connections | Basic |
| Ask El | Basic (20 messages / day) |
| Learning Goals | Standard |
| Knowledge Galaxy | Standard |
| Assessment Library | Standard |
| Achievement System | Standard |
| Exams & Assessments (exam prep) | Premium |

### Teacher hub

| Page | Minimum tier |
|---|---|
| Dashboard | Basic |
| Classes | Basic (up to 2), Standard (unlimited) |
| Timetable | Basic |
| Students & Attendance | Basic |
| Homework & Assessments | Basic |
| Communication Center | Basic |
| Connections | Basic |
| GreyEd AI chat | Basic (20 messages / day) |
| Lesson Planner | Standard |
| Courses | Standard |
| Knowledge Galaxy | Standard |
| Updates (tutor and family) | Standard |
| Assessments: AI generator and auto-grading | Premium |
| AI Lesson Plan Generator | Premium |
| GreyEd TA (avatar) | Premium |
| Analytics & Reports | Premium |
| Knowledge Base upload | Premium |

### Parent hub

All pages free: Child Dashboard, Communication, Connections, Timetable Access, Notifications, Settings.

## Implementation status

- **Done:** Pricing page comparison table, plan cards, and FAQ reflect this split (`src/data/pricingData.ts`, `src/components/pricing/FeatureMatrix.tsx`).
- **Not done:** No gating exists in the hubs. Sidebars show a hardcoded "Basic tier" label and every account can use every feature. Until gating ships, the pricing page describes limits that are not enforced.
- **Not done:** Stripe price IDs for Standard, Premium, and Enterprise are placeholders.
- **Open decision:** Standard and Premium AI chat limits (shown as "Higher limit" and "Highest limit").
- **Removed 2026-10-10:** The "Customise your account" à la carte builder (student and tutor add-on pricing). It conflicted with the tiers by charging for features Basic gives free. The four tiers are now the only pricing model.
