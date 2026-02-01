/*
  # Add updated_at field to profiles table

  1. Changes
    - Add updated_at timestamp column to profiles table
    - Set default value to now()
    - Update existing rows to have updated_at = created_at
*/

-- Add updated_at column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update existing rows to set updated_at = created_at
UPDATE profiles
SET updated_at = created_at
WHERE updated_at IS NULL;