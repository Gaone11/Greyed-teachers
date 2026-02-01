/*
  # Teacher Profiles and Authentication Schema

  1. New Tables
    - `profiles`: Core user profile table for teachers
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text, check constraint for 'teacher' or 'admin')
      - `school_name` (text, nullable)
      - `grade_level` (text, nullable)
      - `plan` (text, default 'free')
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on profiles table
    - Add policies for teachers to view and update their own profiles
    - Add policies for admins to manage all profiles

  3. Indexes
    - Add index on email for faster lookups
    - Add index on role for filtering

  4. Functions
    - Auto-update updated_at timestamp on profile changes

  5. Important Notes
    - This migration ensures profiles table exists with proper schema
    - Teachers authenticate using email and password (minimum 10 chars, 1 capital, 1 special char)
    - No email verification required - immediate access after signup
    - Student accounts have been removed from the system
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  role text NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin')),
  school_name text,
  grade_level text,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Teachers can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Teachers can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Policy: Teachers can view their own profile
CREATE POLICY "Teachers can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Teachers can update their own profile
CREATE POLICY "Teachers can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (for signup flow)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles (role);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Trigger to call the function on profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
