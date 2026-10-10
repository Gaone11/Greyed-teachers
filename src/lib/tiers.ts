// Subscription tiers: single source of truth for what each tier can access.
// Decision record: docs/TIERS.md. The AI limits here must match
// supabase/functions/_shared/tiers.ts, which enforces them server-side.

export type Tier = 'basic' | 'standard' | 'premium' | 'enterprise';

export const TIER_ORDER: Tier[] = ['basic', 'standard', 'premium', 'enterprise'];

export const TIER_LABELS: Record<Tier, string> = {
  basic: 'Basic',
  standard: 'Standard',
  premium: 'Premium',
  enterprise: 'Enterprise',
};

// Daily AI requests (Ask El, GreyEd AI chat, and AI generators). Resets at 00:00 UTC.
export const AI_DAILY_LIMITS: Record<Tier, number> = {
  basic: 20,
  standard: 100,
  premium: 300,
  enterprise: 300,
};

// Maximum classes a teacher can create. null = unlimited.
export const CLASS_LIMITS: Record<Tier, number | null> = {
  basic: 2,
  standard: null,
  premium: null,
  enterprise: null,
};

// Profiles created before tiers existed store 'free'; treat anything unknown as basic.
export const normalizeTier = (plan?: string | null): Tier => {
  const value = (plan || '').toLowerCase();
  return (TIER_ORDER as string[]).includes(value) ? (value as Tier) : 'basic';
};

export const tierAtLeast = (tier: Tier, required: Tier) =>
  TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(required);

// Minimum tier per hub route. Longest matching prefix wins; unlisted routes are Basic.
// The parent hub is free on every tier, so it has no entries.
const ROUTE_TIERS: Record<string, Tier> = {
  '/students/goals': 'standard',
  '/students/knowledge': 'standard',
  '/students/assessment-library': 'standard',
  '/students/achievements': 'standard',
  '/students/exams': 'premium',

  // Lesson plans and assessments are only created through the AI generators
  '/teachers/lesson-planner': 'premium',
  '/teachers/assessments': 'premium',
  '/teachers/assessment-grading': 'premium',
  '/teachers/tutors': 'standard',
  '/teachers/courses': 'standard',
  '/teachers/knowledge': 'standard',
  '/teachers/grey-ed-ta': 'premium',
  '/teachers/analytics': 'premium',
};

export const requiredTierForPath = (pathname: string): Tier => {
  const match = Object.keys(ROUTE_TIERS)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_TIERS[match] : 'basic';
};

export const canAccessPath = (tier: Tier, pathname: string) =>
  tierAtLeast(tier, requiredTierForPath(pathname));
