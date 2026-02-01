/*
  # Update smart_notes table configuration

  1. Ensures the smart_notes table exists with proper schema
  2. Updates RLS configuration
  3. Safely handles existing policy
*/

-- Create smart_notes table if it doesn't exist
CREATE TABLE IF NOT EXISTS smart_notes (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  source_type text CHECK (source_type IN ('pdf', 'image', 'text')),
  storage_path text,
  markdown_path text,
  flashcards jsonb,
  created_at timestamptz DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE smart_notes ENABLE ROW LEVEL SECURITY;

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'smart_notes' AND policyname = 'Users can manage their own notes'
  ) THEN
    CREATE POLICY "Users can manage their own notes"
      ON smart_notes
      FOR ALL
      TO public
      USING (auth.uid() = user_id);
  END IF;
END
$$;