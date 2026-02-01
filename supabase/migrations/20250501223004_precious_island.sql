/*
  # Update teacher subscription functionality

  1. Changes
     - Adds a 'subscription_tier' column to 'teacher_preferences' table to track subscription level
     - Adds a 'features' JSONB column to store teacher-specific subscription features
  
  2. Security
     - Maintains existing RLS policies
*/

-- Add subscription related columns to teacher_preferences table
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'teacher_preferences' 
    AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE public.teacher_preferences ADD COLUMN subscription_tier text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'teacher_preferences' 
    AND column_name = 'features'
  ) THEN
    ALTER TABLE public.teacher_preferences ADD COLUMN features jsonb DEFAULT '{"lesson_plans": 3, "assessments": 5, "family_updates": 2}';
  END IF;
END $$;