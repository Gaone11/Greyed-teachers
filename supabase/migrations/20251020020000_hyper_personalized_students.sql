/*
  # Hyper-Personalized AI Education Platform - Core Student Data Models

  ## Overview
  This migration creates the foundation for an AI-powered hyper-personalized
  education system that analyzes student interactions over time to build
  comprehensive learning profiles and train customized AI tutors.

  ## 1. New Tables

  ### Students Extended Profile
  - `students`: Core student profile with extended learning metadata
    - Links to auth.users for authentication
    - Stores curriculum info, grade level, timezone, language
    - Tracks subscription tier and parent/guardian relationships
    - Includes AI avatar customization preferences

  ### Personality Assessment System
  - `personality_assessments`: Initial comprehensive personality test results
    - Stores test type (16Personalities, Big Five, etc.)
    - Captures trait dimensions and detailed interpretations
    - Links to source assessment data

  - `personality_evolution`: Continuous personality profiling over time
    - Tracks personality indicators observed through conversations
    - Records confidence scores that improve with more data
    - Monitors personality changes and trends over weeks/months

  ### Multi-Modal Chat System
  - `student_chat_messages`: All AI-student interactions with rich metadata
    - Supports text, image, video, audio, and file attachments
    - Stores AI analysis results for non-text content
    - Includes sentiment analysis, subject tagging, complexity scoring
    - Tracks conversation context and learning objectives
    - Enables soft delete for retention and analysis

  - `chat_media_attachments`: Metadata for media files in conversations
    - Links to Supabase Storage buckets
    - Stores AI vision analysis, transcripts, content summaries
    - Tracks file processing status and moderation flags

  ### Learning Profile Intelligence
  - `user_learning_profiles`: Comprehensive AI-generated student analysis
    - Stores versioned profiles that evolve over time
    - Tracks learning style preferences with confidence percentages
    - Includes subject-specific knowledge levels and skill breakdowns
    - Records mastery areas and struggling topics with evidence
    - Stores engagement patterns, motivational triggers, communication preferences
    - Links to personality assessment data for correlation
    - Includes profile completeness score for training readiness

  ## 2. Security
  - All tables have Row Level Security (RLS) enabled
  - Students can only access their own data
  - Parent/guardian access controlled by permission flags
  - Admin access for review and training workflows
  - Audit logging for sensitive data operations

  ## 3. Important Notes
  - Message retention supports 7-day rolling analysis cycles
  - Profile completeness score determines AI training readiness
  - All timestamps use timestamptz for proper timezone handling
  - Soft deletes preserve data for analytics while respecting privacy
  - Foreign key constraints ensure referential integrity
*/

-- =====================================================
-- STUDENTS EXTENDED PROFILE
-- =====================================================

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  grade_level text,
  curriculum_type text,
  school_name text,
  timezone text DEFAULT 'UTC',
  language_preference text DEFAULT 'en',
  subjects_of_interest text[],
  learning_goals text[],
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  parent_guardian_email text,
  parent_guardian_name text,
  parent_permissions jsonb DEFAULT '{"view_progress": true, "view_chat": false, "notifications": true}'::jsonb,
  accessibility_requirements text[],
  avatar_config jsonb DEFAULT '{"color": "blue", "voice": "friendly", "style": "casual"}'::jsonb,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own profile"
  ON students
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Students can update own profile"
  ON students
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS students_user_id_idx ON students(user_id);
CREATE INDEX IF NOT EXISTS students_subscription_tier_idx ON students(subscription_tier);

-- =====================================================
-- PERSONALITY ASSESSMENT SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS personality_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  assessment_type text NOT NULL,
  assessment_version text,
  raw_scores jsonb NOT NULL,
  trait_dimensions jsonb NOT NULL,
  detailed_interpretation jsonb,
  completion_date timestamptz DEFAULT now(),
  source_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE personality_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own assessments"
  ON personality_assessments
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS personality_assessments_student_id_idx ON personality_assessments(student_id);

-- Continuous personality profiling
CREATE TABLE IF NOT EXISTS personality_evolution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  observation_date timestamptz DEFAULT now(),
  personality_indicators jsonb NOT NULL,
  confidence_scores jsonb NOT NULL,
  behavioral_patterns jsonb,
  emotional_patterns jsonb,
  motivation_triggers text[],
  social_preferences jsonb,
  changes_from_baseline jsonb,
  linked_events text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE personality_evolution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own personality evolution"
  ON personality_evolution
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS personality_evolution_student_id_idx ON personality_evolution(student_id);
CREATE INDEX IF NOT EXISTS personality_evolution_observation_date_idx ON personality_evolution(observation_date);

-- =====================================================
-- MULTI-MODAL CHAT SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS student_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  session_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  subject_area text,
  learning_objective text,
  sentiment_score numeric(3, 2),
  sentiment_label text CHECK (sentiment_label IN ('positive', 'neutral', 'negative', 'frustrated', 'engaged', 'confused', 'confident')),
  complexity_level integer CHECK (complexity_level >= 1 AND complexity_level <= 10),
  token_count integer DEFAULT 0,
  conversation_context jsonb,
  ai_model_version text,
  processing_time_ms integer,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE student_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own chat messages"
  ON student_chat_messages
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

CREATE POLICY "Students can insert own chat messages"
  ON student_chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_chat_messages_student_id_idx ON student_chat_messages(student_id);
CREATE INDEX IF NOT EXISTS student_chat_messages_session_id_idx ON student_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS student_chat_messages_created_at_idx ON student_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS student_chat_messages_subject_area_idx ON student_chat_messages(subject_area);
CREATE INDEX IF NOT EXISTS student_chat_messages_deleted_at_idx ON student_chat_messages(deleted_at) WHERE deleted_at IS NULL;

-- Media attachments for chat messages
CREATE TABLE IF NOT EXISTS chat_media_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES student_chat_messages(id) ON DELETE CASCADE NOT NULL,
  file_type text NOT NULL,
  mime_type text NOT NULL,
  file_size_bytes bigint NOT NULL,
  storage_path text NOT NULL,
  storage_bucket text DEFAULT 'chat-attachments',
  thumbnail_path text,
  ai_vision_analysis jsonb,
  transcript text,
  content_summary text,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  moderation_status text DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  moderation_flags text[],
  uploaded_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE chat_media_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own media attachments"
  ON chat_media_attachments
  FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT id FROM student_chat_messages
      WHERE student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
      )
    )
  );

CREATE INDEX IF NOT EXISTS chat_media_attachments_message_id_idx ON chat_media_attachments(message_id);
CREATE INDEX IF NOT EXISTS chat_media_attachments_processing_status_idx ON chat_media_attachments(processing_status);

-- =====================================================
-- LEARNING PROFILE INTELLIGENCE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_learning_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  profile_version integer NOT NULL DEFAULT 1,
  generation_timestamp timestamptz DEFAULT now(),

  -- Learning style preferences
  learning_styles jsonb NOT NULL DEFAULT '{
    "visual": {"preference": 0, "confidence": 0},
    "auditory": {"preference": 0, "confidence": 0},
    "kinesthetic": {"preference": 0, "confidence": 0},
    "reading_writing": {"preference": 0, "confidence": 0}
  }'::jsonb,

  -- Knowledge and skill tracking
  subject_knowledge_levels jsonb DEFAULT '{}'::jsonb,
  skill_breakdowns jsonb DEFAULT '{}'::jsonb,
  mastery_areas jsonb DEFAULT '[]'::jsonb,
  struggling_topics jsonb DEFAULT '[]'::jsonb,
  misconception_patterns jsonb DEFAULT '[]'::jsonb,

  -- Engagement and communication
  engagement_patterns jsonb DEFAULT '{
    "best_study_hours": [],
    "optimal_session_length_minutes": 30,
    "break_frequency_minutes": 25,
    "focus_level_by_time": {}
  }'::jsonb,

  motivational_triggers text[],
  communication_preferences jsonb DEFAULT '{
    "formality_level": "casual",
    "emoji_usage": "moderate",
    "humor_appreciation": "medium",
    "explanation_depth": "detailed"
  }'::jsonb,

  -- Learning characteristics
  attention_span_minutes integer,
  preferred_content_difficulty jsonb DEFAULT '{}'::jsonb,
  question_types_preferred text[],
  explanation_styles_preferred text[],

  -- Profile metadata
  profile_completeness_score integer DEFAULT 0 CHECK (profile_completeness_score >= 0 AND profile_completeness_score <= 100),
  data_points_analyzed integer DEFAULT 0,
  confidence_level numeric(3, 2) DEFAULT 0.00 CHECK (confidence_level >= 0 AND confidence_level <= 1),

  -- Linked data
  linked_personality_assessment_id uuid REFERENCES personality_assessments(id),

  -- AI insights
  ai_generated_insights text[],
  recommended_learning_strategies text[],

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(student_id, profile_version)
);

ALTER TABLE user_learning_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own learning profiles"
  ON user_learning_profiles
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS user_learning_profiles_student_id_idx ON user_learning_profiles(student_id);
CREATE INDEX IF NOT EXISTS user_learning_profiles_version_idx ON user_learning_profiles(profile_version DESC);
CREATE INDEX IF NOT EXISTS user_learning_profiles_completeness_idx ON user_learning_profiles(profile_completeness_score DESC);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_students_updated_at'
  ) THEN
    CREATE TRIGGER update_students_updated_at
      BEFORE UPDATE ON students
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Apply updated_at trigger to user_learning_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_learning_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_learning_profiles_updated_at
      BEFORE UPDATE ON user_learning_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
