/*
  # Add syllabus column to classes table
  
  1. Changes
    - Add `syllabus` column to the `classes` table
    - The column will store the curriculum/syllabus information for each class
    - Examples: Cambridge IGCSE, Cambridge A Level, Botswana JSE, Botswana BGCSE
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'syllabus'
  ) THEN
    ALTER TABLE classes ADD COLUMN syllabus text;
  END IF;
END $$;