// Daily AI request limits per subscription tier, enforced server-side.
// Must match AI_DAILY_LIMITS in src/lib/tiers.ts. Decision record: docs/TIERS.md.
import { createClient } from "npm:@supabase/supabase-js@2";

type Tier = "basic" | "standard" | "premium" | "enterprise";

const AI_DAILY_LIMITS: Record<Tier, number> = {
  basic: 20,
  standard: 100,
  premium: 300,
  enterprise: 300,
};

const TIER_LABELS: Record<Tier, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
  enterprise: "Enterprise",
};

const normalizeTier = (plan?: string | null): Tier =>
  plan && plan in AI_DAILY_LIMITS ? (plan as Tier) : "basic";

export interface AiUsage {
  tier: Tier;
  used: number;
  limit: number;
}

export type AiUsageResult =
  | { ok: true; usage: AiUsage }
  | { ok: false; status: number; body: Record<string, unknown> };

/**
 * Identifies the caller from their JWT, then counts this request against their
 * tier's daily limit. Fails closed: if usage cannot be recorded, the request is refused.
 */
export async function consumeAiRequest(req: Request): Promise<AiUsageResult> {
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, status: 500, body: { error: "API configuration error" } };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) {
    return { ok: false, status: 401, body: { error: "Please log in to use El AI." } };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();
  const tier = normalizeTier(profile?.plan);
  const limit = AI_DAILY_LIMITS[tier];

  const { data, error } = await supabase.rpc("consume_ai_request", {
    p_user_id: user.id,
    p_limit: limit,
  });
  const row = Array.isArray(data) ? data[0] : data;

  if (error || !row) {
    console.error("consume_ai_request failed:", error);
    return { ok: false, status: 503, body: { error: "El AI is temporarily unavailable. Please try again shortly." } };
  }

  if (!row.allowed) {
    return {
      ok: false,
      status: 429,
      body: {
        error: `You've used all ${limit} AI requests included in ${TIER_LABELS[tier]} today. Your limit resets at midnight UTC, or upgrade for more.`,
        code: "ai_limit_reached",
        usage: { tier, used: row.used, limit },
      },
    };
  }

  return { ok: true, usage: { tier, used: row.used, limit } };
}
