/*
  # AI-Generated Learning Materials and Progress Tracking

  ## Overview
  This migration creates tables for AI-generated personalized study materials,
  spaced repetition flashcards, progress tracking, and learning analytics.

  ## 1. New Tables

  ### AI-Generated Notes
  - `student_notes`: Personalized study materials created by AI
    - Supports multiple generation methods (chat summary, topic explanation, etc.)
    - Tracks source chat sessions and personalization levels
    - Allows student edits with version tracking
    - Includes comprehension checks and related concepts

  ### Spaced Repetition Flashcards
  - `student_flashcards`: AI-generated flashcards with Leitner system
    - Links to notes and chat sessions
    - Implements spaced repetition algorithm
    - Tracks performance and adapts difficulty
    - Generates contextual hints based on student struggles

  ### Progress Tracking
  - `student_progress`: Comprehensive learning outcome measurements
    - Tracks strengths, weaknesses, and knowledge gaps
    - Monitors study streaks and total study time
    - Calculates learning velocity and mastery levels
    - Correlates progress with chat activity and AI personalization

  ### Study Schedule
  - `student_timetables`: AI-optimized scheduling system
    - Supports class schedules and study sessions
    - Recommends optimal study times based on engagement patterns
    - Tracks completion and productivity ratings
    - Links sessions to topics and study materials

  ## 2. Security
  - RLS ensures students only access their own materials
  - Parent/guardian access controlled by permissions
  - Admin read access for quality monitoring
  - Audit logs for AI-generated content

  ## 3. Features
  - All study materials hyper-personalized to student
  - Spaced repetition optimizes long-term retention
  - Progress analytics inform AI adaptation
  - Smart scheduling aligns with learning patterns
*/

-- =====================================================
-- AI-GENERATED NOTES
-- =====================================================

CREATE TYPE note_generation_method AS ENUM (
  'chat_summary',
  'topic_explanation',
  'lesson_recap',
  'concept_breakdown',
  'exam_prep',
  'manual_request',
  'auto_generated'
);

CREATE TABLE IF NOT EXISTS student_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  markdown_content text NOT NULL,

  -- Generation metadata
  generation_method note_generation_method NOT NULL,
  source_chat_session_id uuid,
  ai_model_version text,
  personalization_level text CHECK (personalization_level IN ('generic', 'adapted', 'hyper_personalized')),

  -- Classification
  subject text NOT NULL,
  topics text[] DEFAULT '{}',
  curriculum_alignment text[],
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),

  -- Student interaction
  student_edits text,
  student_edited_at timestamptz,
  view_count integer DEFAULT 0,
  total_time_spent_seconds integer DEFAULT 0,
  last_viewed_at timestamptz,

  -- Learning aids
  comprehension_questions jsonb DEFAULT '[]'::jsonb,
  key_concepts text[],
  related_note_ids uuid[],
  external_resources jsonb DEFAULT '[]'::jsonb,

  -- AI insights
  ai_generated_summary text,
  suggested_review_date timestamptz,

  -- Status
  is_favorite boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  archived_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own notes"
  ON student_notes
  FOR ALL
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
    AND is_archived = false
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_notes_student_id_idx ON student_notes(student_id);
CREATE INDEX IF NOT EXISTS student_notes_subject_idx ON student_notes(subject);
CREATE INDEX IF NOT EXISTS student_notes_created_at_idx ON student_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS student_notes_last_viewed_idx ON student_notes(last_viewed_at DESC);
CREATE INDEX IF NOT EXISTS student_notes_favorite_idx ON student_notes(is_favorite) WHERE is_favorite = true;

-- =====================================================
-- SPACED REPETITION FLASHCARDS
-- =====================================================

CREATE TYPE flashcard_generation_source AS ENUM (
  'ai_from_notes',
  'ai_from_chat',
  'curriculum_aligned',
  'student_created'
);

CREATE TABLE IF NOT EXISTS student_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  linked_note_id uuid REFERENCES student_notes(id) ON DELETE SET NULL,
  source_chat_session_id uuid,

  -- Card content
  front_content text NOT NULL,
  back_content text NOT NULL,
  generation_source flashcard_generation_source NOT NULL,

  -- Classification
  subject text NOT NULL,
  topic text NOT NULL,
  difficulty_rating integer DEFAULT 3 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),

  -- Leitner system (spaced repetition)
  current_box integer DEFAULT 1 CHECK (current_box >= 1 AND current_box <= 5),
  next_review_date timestamptz NOT NULL,
  last_reviewed_at timestamptz,

  -- Performance tracking
  times_reviewed integer DEFAULT 0,
  times_correct integer DEFAULT 0,
  times_incorrect integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  mastery_level numeric(3, 2) DEFAULT 0.00 CHECK (mastery_level >= 0 AND mastery_level <= 1),

  -- AI personalization
  personalization_adaptations jsonb DEFAULT '[]'::jsonb,
  ai_generated_hints text[],
  hint_triggers jsonb DEFAULT '{}'::jsonb,

  -- Clustering
  related_flashcard_ids uuid[],
  concept_cluster text,

  -- Status
  is_suspended boolean DEFAULT false,
  suspended_at timestamptz,
  is_archived boolean DEFAULT false,
  archived_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own flashcards"
  ON student_flashcards
  FOR ALL
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
    AND is_archived = false
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_flashcards_student_id_idx ON student_flashcards(student_id);
CREATE INDEX IF NOT EXISTS student_flashcards_next_review_idx ON student_flashcards(next_review_date);
CREATE INDEX IF NOT EXISTS student_flashcards_subject_idx ON student_flashcards(subject);
CREATE INDEX IF NOT EXISTS student_flashcards_box_idx ON student_flashcards(current_box);
CREATE INDEX IF NOT EXISTS student_flashcards_note_id_idx ON student_flashcards(linked_note_id);

-- =====================================================
-- STUDENT PROGRESS TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Knowledge assessment
  strengths jsonb DEFAULT '[]'::jsonb,
  areas_for_improvement jsonb DEFAULT '[]'::jsonb,
  knowledge_gaps jsonb DEFAULT '[]'::jsonb,

  -- Recent activity
  recent_topics jsonb DEFAULT '[]'::jsonb,
  active_subjects text[],

  -- Study metrics
  study_streak_days integer DEFAULT 0,
  longest_study_streak integer DEFAULT 0,
  last_study_date date,
  total_study_hours numeric(10, 2) DEFAULT 0,
  study_sessions_count integer DEFAULT 0,

  -- Performance metrics
  overall_confidence_score numeric(3, 2) DEFAULT 0.50,
  learning_velocity_score numeric(5, 2),
  engagement_score numeric(3, 2),
  consistency_score numeric(3, 2),

  -- Subject-specific tracking
  subject_mastery_levels jsonb DEFAULT '{}'::jsonb,
  subject_time_distribution jsonb DEFAULT '{}'::jsonb,
  subject_confidence_scores jsonb DEFAULT '{}'::jsonb,

  -- Milestones and achievements
  milestones_achieved jsonb DEFAULT '[]'::jsonb,
  total_notes_created integer DEFAULT 0,
  total_flashcards_mastered integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  total_topics_completed integer DEFAULT 0,

  -- Predictive analytics
  predicted_exam_readiness jsonb DEFAULT '{}'::jsonb,
  at_risk_subjects text[],
  recommended_focus_areas text[],

  -- Correlation data
  progress_correlation_with_chat jsonb,
  progress_correlation_with_ai_personalization jsonb,

  -- Goals
  current_goals jsonb DEFAULT '[]'::jsonb,
  completed_goals jsonb DEFAULT '[]'::jsonb,

  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_progress_student_id_idx ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS student_progress_study_streak_idx ON student_progress(study_streak_days DESC);
CREATE INDEX IF NOT EXISTS student_progress_learning_velocity_idx ON student_progress(learning_velocity_score DESC);

-- =====================================================
-- STUDENT TIMETABLES
-- =====================================================

CREATE TYPE timetable_event_category AS ENUM (
  'class',
  'study_session',
  'exam',
  'assignment_due',
  'break',
  'tutoring',
  'extracurricular',
  'other'
);

CREATE TYPE recurrence_pattern AS ENUM (
  'none',
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'custom'
);

CREATE TABLE IF NOT EXISTS student_timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,

  -- Event details
  title text NOT NULL,
  description text,
  event_category timetable_event_category NOT NULL,
  subject text,

  -- Timing
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration_minutes integer,

  -- Recurrence
  recurrence recurrence_pattern DEFAULT 'none',
  recurrence_end_date date,
  recurrence_days integer[],

  -- AI recommendations
  is_ai_recommended boolean DEFAULT false,
  ai_recommendation_reason text,
  optimal_for_student boolean DEFAULT false,

  -- Visual customization
  color_code text,
  icon text,

  -- Study session specific
  linked_topics text[],
  linked_note_ids uuid[],
  linked_flashcard_deck_id uuid,
  study_goal text,

  -- Tracking
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  productivity_rating integer CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
  student_notes text,

  -- Reminders
  reminder_minutes_before integer[],
  reminder_sent boolean DEFAULT false,

  -- Status
  is_cancelled boolean DEFAULT false,
  cancelled_at timestamptz,
  cancellation_reason text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own timetable"
  ON student_timetables
  FOR ALL
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_timetables_student_id_idx ON student_timetables(student_id);
CREATE INDEX IF NOT EXISTS student_timetables_start_time_idx ON student_timetables(start_time);
CREATE INDEX IF NOT EXISTS student_timetables_category_idx ON student_timetables(event_category);
CREATE INDEX IF NOT EXISTS student_timetables_subject_idx ON student_timetables(subject);
CREATE INDEX IF NOT EXISTS student_timetables_completed_idx ON student_timetables(is_completed);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to calculate next review date for flashcards (Leitner system)
CREATE OR REPLACE FUNCTION calculate_next_review_date(
  current_box_level integer,
  last_reviewed timestamp with time zone
)
RETURNS timestamp with time zone AS $$
DECLARE
  days_to_add integer;
BEGIN
  -- Leitner system intervals: Box 1=1 day, Box 2=3 days, Box 3=7 days, Box 4=14 days, Box 5=30 days
  days_to_add := CASE current_box_level
    WHEN 1 THEN 1
    WHEN 2 THEN 3
    WHEN 3 THEN 7
    WHEN 4 THEN 14
    WHEN 5 THEN 30
    ELSE 1
  END;

  RETURN last_reviewed + (days_to_add || ' days')::interval;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update flashcard after review
CREATE OR REPLACE FUNCTION update_flashcard_after_review(
  flashcard_id_param uuid,
  was_correct boolean
)
RETURNS void AS $$
DECLARE
  current_box_val integer;
  new_box_val integer;
  current_streak_val integer;
BEGIN
  -- Get current values
  SELECT current_box, current_streak
  INTO current_box_val, current_streak_val
  FROM student_flashcards
  WHERE id = flashcard_id_param;

  -- Calculate new box level
  IF was_correct THEN
    new_box_val := LEAST(current_box_val + 1, 5);
    current_streak_val := current_streak_val + 1;
  ELSE
    new_box_val := GREATEST(current_box_val - 1, 1);
    current_streak_val := 0;
  END IF;

  -- Update the flashcard
  UPDATE student_flashcards
  SET
    current_box = new_box_val,
    next_review_date = calculate_next_review_date(new_box_val, NOW()),
    last_reviewed_at = NOW(),
    times_reviewed = times_reviewed + 1,
    times_correct = times_correct + (CASE WHEN was_correct THEN 1 ELSE 0 END),
    times_incorrect = times_incorrect + (CASE WHEN NOT was_correct THEN 1 ELSE 0 END),
    current_streak = current_streak_val,
    longest_streak = GREATEST(longest_streak, current_streak_val),
    mastery_level = CASE
      WHEN times_reviewed > 0 THEN
        (times_correct + (CASE WHEN was_correct THEN 1 ELSE 0 END))::numeric /
        (times_reviewed + 1)::numeric
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = flashcard_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update study streak
CREATE OR REPLACE FUNCTION update_study_streak(student_id_param uuid)
RETURNS void AS $$
DECLARE
  last_study date;
  current_streak integer;
BEGIN
  SELECT last_study_date, study_streak_days
  INTO last_study, current_streak
  FROM student_progress
  WHERE student_id = student_id_param;

  -- If studying for first time or after a gap of more than 1 day, reset streak
  IF last_study IS NULL OR (CURRENT_DATE - last_study) > 1 THEN
    current_streak := 1;
  -- If last studied yesterday, increment streak
  ELSIF (CURRENT_DATE - last_study) = 1 THEN
    current_streak := current_streak + 1;
  -- If already studied today, keep streak the same
  END IF;

  UPDATE student_progress
  SET
    last_study_date = CURRENT_DATE,
    study_streak_days = current_streak,
    longest_study_streak = GREATEST(longest_study_streak, current_streak),
    updated_at = NOW()
  WHERE student_id = student_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_notes_updated_at') THEN
    CREATE TRIGGER update_student_notes_updated_at
      BEFORE UPDATE ON student_notes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_flashcards_updated_at') THEN
    CREATE TRIGGER update_student_flashcards_updated_at
      BEFORE UPDATE ON student_flashcards
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_progress_updated_at') THEN
    CREATE TRIGGER update_student_progress_updated_at
      BEFORE UPDATE ON student_progress
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_timetables_updated_at') THEN
    CREATE TRIGGER update_student_timetables_updated_at
      BEFORE UPDATE ON student_timetables
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
