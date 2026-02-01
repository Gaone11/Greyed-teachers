/*
  # Create documents table

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `format` (text with check constraint)
      - `last_updated` (timestamp)
      - `created_at` (timestamp)
      - `is_shared` (boolean)
      - `shared_with` (text array)
      - `status` (text with check constraint)
      - `tags` (text array)
  2. Security
    - Enable RLS on `documents` table
    - Add policy for users to manage their own documents
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  format text NOT NULL CHECK (format IN ('docx', 'pdf', 'html', 'md')),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  is_shared boolean DEFAULT false,
  shared_with text[],
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags text[]
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can manage their own documents
CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);