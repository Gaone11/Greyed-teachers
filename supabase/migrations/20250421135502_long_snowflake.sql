/*
  # Fix waitlist RLS policies

  1. Changes
    - Add a new policy to allow public users to insert into the waitlist table
    - Keep existing admin policy for full management

  2. Security
    - Maintain admin capabilities for managing all waitlist entries
    - Allow public (unauthenticated) users to submit to the waitlist
*/

-- Add policy to allow public users to insert into waitlist
CREATE POLICY "Public users can join waitlist"
  ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);