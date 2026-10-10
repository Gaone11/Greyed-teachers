/*
  # Subscription tiers

  Decision record: docs/TIERS.md. Limits here must match src/lib/tiers.ts and
  supabase/functions/_shared/tiers.ts.

  1. profiles.plan
    - Allowed values: basic, standard, premium, enterprise ('free' becomes 'basic')
    - Users cannot choose or change their own plan. New profiles always start on
      basic; only the service role, or SQL run as postgres, can change a plan.

  2. ai_usage_daily
    - One row per user per UTC day, counting AI requests
    - consume_ai_request() atomically checks and increments the count. Only the
      service role (edge functions) can call it.

  3. Class limit
    - Basic teachers can own at most 2 classes
*/

-- 1. profiles.plan ----------------------------------------------------------

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%plan%'
  LOOP
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

UPDATE public.profiles
SET plan = 'basic'
WHERE plan IS NULL OR plan NOT IN ('basic', 'standard', 'premium', 'enterprise');

ALTER TABLE public.profiles ALTER COLUMN plan SET DEFAULT 'basic';
ALTER TABLE public.profiles ALTER COLUMN plan SET NOT NULL;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('basic', 'standard', 'premium', 'enterprise'));

CREATE OR REPLACE FUNCTION public.protect_profile_plan()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF current_user <> 'service_role' THEN
      NEW.plan := 'basic';
    END IF;
  ELSIF current_user IN ('authenticated', 'anon') AND NEW.plan IS DISTINCT FROM OLD.plan THEN
    NEW.plan := OLD.plan;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_plan ON public.profiles;
CREATE TRIGGER protect_profile_plan
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_plan();

-- 2. AI usage ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ai_usage_daily (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  request_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, usage_date)
);

ALTER TABLE public.ai_usage_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own AI usage" ON public.ai_usage_daily;
CREATE POLICY "Users can view their own AI usage"
  ON public.ai_usage_daily
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Returns whether the request is allowed and the count after this request.
-- A denied request does not increment the count.
CREATE OR REPLACE FUNCTION public.consume_ai_request(p_user_id uuid, p_limit integer)
RETURNS TABLE (allowed boolean, used integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'utc')::date;
  v_count integer;
BEGIN
  INSERT INTO ai_usage_daily (user_id, usage_date, request_count)
  VALUES (p_user_id, v_today, 0)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  UPDATE ai_usage_daily
  SET request_count = request_count + 1, updated_at = now()
  WHERE user_id = p_user_id AND usage_date = v_today AND request_count < p_limit
  RETURNING request_count INTO v_count;

  IF v_count IS NULL THEN
    SELECT request_count INTO v_count
    FROM ai_usage_daily
    WHERE user_id = p_user_id AND usage_date = v_today;
    RETURN QUERY SELECT false, v_count;
  ELSE
    RETURN QUERY SELECT true, v_count;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_ai_request(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_request(uuid, integer) TO service_role;

-- 3. Class limit ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_class_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan text;
  v_count integer;
BEGIN
  SELECT plan INTO v_plan FROM profiles WHERE id = NEW.teacher_id;

  IF COALESCE(v_plan, 'basic') = 'basic' THEN
    SELECT count(*) INTO v_count FROM classes WHERE teacher_id = NEW.teacher_id;
    IF v_count >= 2 THEN
      RAISE EXCEPTION 'class_limit_reached: the Basic plan includes up to 2 classes'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_class_limit ON public.classes;
CREATE TRIGGER enforce_class_limit
  BEFORE INSERT ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.enforce_class_limit();
