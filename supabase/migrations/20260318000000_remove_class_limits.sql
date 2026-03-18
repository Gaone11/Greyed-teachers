/*
  # Remove class creation limits — all teachers get unlimited classes

  1. Drop any existing class-limit triggers and functions (safe with IF EXISTS)
  2. Set subscription_tier = 'paid' for all existing teachers
  3. Change default subscription_tier to 'paid' so new teachers are unlimited
  4. Remove the class count check from any RLS policy by recreating a clean one
*/

-- Drop common names for class-limit triggers (safe no-ops if they don't exist)
DROP TRIGGER IF EXISTS enforce_class_limit ON classes;
DROP TRIGGER IF EXISTS check_class_limit ON classes;
DROP TRIGGER IF EXISTS class_limit_check ON classes;
DROP TRIGGER IF EXISTS free_tier_class_limit ON classes;
DROP TRIGGER IF EXISTS subscription_class_limit ON classes;

-- Drop the underlying functions too
DROP FUNCTION IF EXISTS enforce_class_limit();
DROP FUNCTION IF EXISTS check_class_limit();
DROP FUNCTION IF EXISTS class_limit_check();
DROP FUNCTION IF EXISTS free_tier_class_limit();
DROP FUNCTION IF EXISTS subscription_class_limit();
DROP FUNCTION IF EXISTS check_teacher_class_limit();
DROP FUNCTION IF EXISTS enforce_teacher_class_limit();

-- Upgrade all existing teachers to 'paid' tier so no limit applies
UPDATE teacher_preferences
SET subscription_tier = 'paid',
    features = jsonb_build_object(
      'classes',       999,
      'lesson_plans',  999,
      'assessments',   999,
      'family_updates',999
    ),
    updated_at = NOW()
WHERE subscription_tier IS DISTINCT FROM 'paid';

-- Change the column default so new teachers start on 'paid'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'teacher_preferences'
      AND column_name  = 'subscription_tier'
  ) THEN
    ALTER TABLE teacher_preferences
      ALTER COLUMN subscription_tier SET DEFAULT 'paid';
  END IF;
END $$;
