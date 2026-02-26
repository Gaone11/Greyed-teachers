/*
  # Teacher Knowledge Base for CAPS Syllabus Chunking

  1. New Tables
    - `kb_teacher_documents`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references auth.users)
      - `filename` (text) - original file name
      - `file_size` (integer) - size in bytes
      - `subject` (text) - CAPS subject name
      - `grade` (text) - grade level
      - `term` (text) - school term
      - `status` (text) - processing status: pending, processing, completed, failed
      - `chunk_count` (integer) - number of chunks created
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `kb_teacher_chunks`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references kb_teacher_documents)
      - `teacher_id` (uuid, references auth.users)
      - `content` (text) - the actual text chunk
      - `subject` (text) - CAPS subject
      - `topic` (text) - specific topic within subject
      - `grade` (text) - grade level
      - `term` (text) - school term
      - `chunk_index` (integer) - order within document
      - `metadata` (jsonb) - additional metadata labels
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Teachers can only access their own documents and chunks
*/

CREATE TABLE IF NOT EXISTS kb_teacher_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id),
  filename text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  subject text NOT NULL,
  grade text NOT NULL DEFAULT '',
  term text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  chunk_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kb_teacher_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own documents"
  ON kb_teacher_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own documents"
  ON kb_teacher_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own documents"
  ON kb_teacher_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own documents"
  ON kb_teacher_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE TABLE IF NOT EXISTS kb_teacher_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES kb_teacher_documents(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL DEFAULT '',
  grade text NOT NULL DEFAULT '',
  term text NOT NULL DEFAULT '',
  chunk_index integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE kb_teacher_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own chunks"
  ON kb_teacher_chunks FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own chunks"
  ON kb_teacher_chunks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own chunks"
  ON kb_teacher_chunks FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE INDEX IF NOT EXISTS idx_kb_teacher_chunks_subject_topic
  ON kb_teacher_chunks (teacher_id, subject, topic, grade);

CREATE INDEX IF NOT EXISTS idx_kb_teacher_documents_teacher
  ON kb_teacher_documents (teacher_id, subject);
