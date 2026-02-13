-- Migration: Create teacher AI conversation tables
-- These tables store the El AI teacher assistant chat history

-- Teacher AI Conversations table
CREATE TABLE IF NOT EXISTS teacher_ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Teacher AI Messages table
CREATE TABLE IF NOT EXISTS teacher_ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES teacher_ai_conversations(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teacher_ai_conversations_teacher_id ON teacher_ai_conversations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_ai_conversations_updated_at ON teacher_ai_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_teacher_ai_messages_conversation_id ON teacher_ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_teacher_ai_messages_teacher_id ON teacher_ai_messages(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_ai_messages_created_at ON teacher_ai_messages(created_at);

-- Enable Row Level Security
ALTER TABLE teacher_ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_ai_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Teachers can only access their own conversations
CREATE POLICY "Teachers can view own conversations"
  ON teacher_ai_conversations FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create own conversations"
  ON teacher_ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own conversations"
  ON teacher_ai_conversations FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own conversations"
  ON teacher_ai_conversations FOR DELETE
  USING (auth.uid() = teacher_id);

-- RLS Policies: Teachers can only access messages in their own conversations
CREATE POLICY "Teachers can view own messages"
  ON teacher_ai_messages FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create own messages"
  ON teacher_ai_messages FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own messages"
  ON teacher_ai_messages FOR DELETE
  USING (auth.uid() = teacher_id);
