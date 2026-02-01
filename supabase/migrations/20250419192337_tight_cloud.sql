/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `role` (enum, not null)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for admins to manage waitlist entries
*/

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'other')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage waitlist
CREATE POLICY "Admins can manage waitlist"
  ON waitlist
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() IN (
      SELECT email FROM profiles WHERE role = 'admin'
    )
  ));

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);