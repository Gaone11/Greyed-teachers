/*
  # Student academic profile metadata

  Adds durable fields for student signup/onboarding selections so content can be
  aligned by country, school stage, grade, and university major.
*/

DO $$
DECLARE
  constraint_record record;
BEGIN
  FOR constraint_record IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'profiles'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%role%'
  LOOP
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
  END LOOP;
END $$;

DO $$
DECLARE
  constraint_record record;
BEGIN
  FOR constraint_record IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'profiles'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%plan%'
  LOOP
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT IF EXISTS %I', constraint_record.conname);
  END LOOP;
END $$;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'parent', 'teacher', 'admin', 'super_admin', 'other'));

ALTER TABLE profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'basic', 'standard', 'premium', 'enterprise'));

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS education_level text,
  ADD COLUMN IF NOT EXISTS school_stage text,
  ADD COLUMN IF NOT EXISTS grade_level text,
  ADD COLUMN IF NOT EXISTS university_major text,
  ADD COLUMN IF NOT EXISTS academic_profile jsonb DEFAULT '{}'::jsonb;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS school_stage text,
  ADD COLUMN IF NOT EXISTS university_major text,
  ADD COLUMN IF NOT EXISTS academic_profile jsonb DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS profiles_academic_profile_gin_idx ON profiles USING gin (academic_profile);
CREATE INDEX IF NOT EXISTS students_academic_profile_gin_idx ON students USING gin (academic_profile);
