/*
  # Create email logs table

  1. New Tables
    - `email_logs`
      - `id` (uuid, primary key)
      - `recipient_email` (text, not null)
      - `recipient_name` (text, not null)
      - `email_type` (text, not null)
      - `status` (text, not null)
      - `content` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `email_logs` table
    - Add policy for admins to view email logs
*/

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name text NOT NULL,
  email_type text NOT NULL,
  status text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to view email logs
CREATE POLICY "Admins can view email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() IN (
      SELECT email FROM profiles WHERE role = 'admin'
    )
  ));