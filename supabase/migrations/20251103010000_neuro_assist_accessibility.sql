/*
  # Neuro-Assist and Accessibility Features

  This migration adds comprehensive neurodiversity support and accessibility features
  to the GreyEd platform, enabling teachers to provide personalized accommodations
  and students to access tailored learning tools.

  ## 1. New Tables

  ### Lesson Plan Enhancements
  - Adds `accommodation_preferences` JSONB field to store selected accommodations
  - Adds `dyslexia_friendly` boolean flag for accessible versions
  - Adds `neurodiversity_accommodations` array for accommodation types

  ### Reading and Memory Support
  - `reading_drill_progress` - Tracks speed reading and comprehension exercises
  - `memory_exercise_progress` - Stores working memory training results

  ### Writing Support
  - `writing_templates` - Reusable templates for different writing types
  - `student_writing_progress` - Tracks student writing development

  ### Accessibility Preferences
  - Extends `profiles` table with user accessibility settings
  - Stores dyslexia mode, font preferences, contrast themes

  ### Assessment Accessibility
  - `assessment_accessibility_settings` - Per-assessment accommodation options
  - `student_assessment_accommodations` - Individual student accommodations

  ## 2. Security
  - Enable RLS on all new tables
  - Add policies for authenticated users to access their own data
  - Add policies for teachers to access their students' data
  - Restrict cross-user data visibility

  ## 3. Seed Data
  - Pre-populate writing templates for common writing types
  - Include grade-appropriate scaffolding and word banks
*/

-- =====================================================
-- 1. LESSON PLAN ENHANCEMENTS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lesson_plans' AND column_name = 'accommodation_preferences'
  ) THEN
    ALTER TABLE lesson_plans
    ADD COLUMN accommodation_preferences JSONB DEFAULT '{"adhd": false, "dyslexia": false, "asd": false, "sensory": false}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lesson_plans' AND column_name = 'dyslexia_friendly'
  ) THEN
    ALTER TABLE lesson_plans
    ADD COLUMN dyslexia_friendly BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lesson_plans' AND column_name = 'neurodiversity_accommodations'
  ) THEN
    ALTER TABLE lesson_plans
    ADD COLUMN neurodiversity_accommodations TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- =====================================================
-- 2. READING DRILL PROGRESS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS reading_drill_progress (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drill_type TEXT NOT NULL CHECK (drill_type IN ('speed_reading', 'comprehension', 'syllable_break')),
  wpm_score INTEGER,
  accuracy_percentage DECIMAL(5,2),
  settings JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reading_drill_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own reading progress"
  ON reading_drill_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own reading progress"
  ON reading_drill_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students reading progress"
  ON reading_drill_progress FOR SELECT
  TO authenticated
  USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM class_students cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.student_id = reading_drill_progress.student_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert reading progress for their students"
  ON reading_drill_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

-- =====================================================
-- 3. MEMORY EXERCISE PROGRESS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS memory_exercise_progress (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('n_back', 'sequence_recall', 'chunk_repeat')),
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 3),
  score INTEGER NOT NULL,
  time_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE memory_exercise_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own memory progress"
  ON memory_exercise_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own memory progress"
  ON memory_exercise_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students memory progress"
  ON memory_exercise_progress FOR SELECT
  TO authenticated
  USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM class_students cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.student_id = memory_exercise_progress.student_id
      AND c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert memory progress for their students"
  ON memory_exercise_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

-- =====================================================
-- 4. WRITING TEMPLATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS writing_templates (
  id BIGSERIAL PRIMARY KEY,
  template_type TEXT NOT NULL CHECK (template_type IN ('narrative', 'persuasive', 'informative', 'descriptive')),
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
  structure JSONB NOT NULL,
  sentence_starters TEXT[] DEFAULT ARRAY[]::TEXT[],
  transition_words TEXT[] DEFAULT ARRAY[]::TEXT[],
  word_bank JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE writing_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view writing templates"
  ON writing_templates FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 5. STUDENT WRITING PROGRESS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS student_writing_progress (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  template_used BIGINT REFERENCES writing_templates(id) ON DELETE SET NULL,
  word_count INTEGER DEFAULT 0,
  completion_time_minutes INTEGER,
  assistance_used TEXT[] DEFAULT ARRAY[]::TEXT[],
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE student_writing_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own writing progress"
  ON student_writing_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own writing progress"
  ON student_writing_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own writing progress"
  ON student_writing_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students writing progress"
  ON student_writing_progress FOR SELECT
  TO authenticated
  USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM class_students cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.student_id = student_writing_progress.student_id
      AND c.teacher_id = auth.uid()
    )
  );

-- =====================================================
-- 6. USER ACCESSIBILITY PREFERENCES
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'dyslexia_mode_enabled'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN dyslexia_mode_enabled BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_font'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN preferred_font TEXT DEFAULT 'Inter' CHECK (preferred_font IN ('Inter', 'OpenDyslexic', 'Comic Sans MS', 'Arial', 'Verdana'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'font_size'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN font_size INTEGER DEFAULT 16 CHECK (font_size BETWEEN 14 AND 24);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'line_spacing'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN line_spacing DECIMAL(3,1) DEFAULT 1.5 CHECK (line_spacing BETWEEN 1.5 AND 2.5);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'contrast_theme'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN contrast_theme TEXT DEFAULT 'standard' CHECK (contrast_theme IN ('standard', 'high_contrast', 'dark_mode', 'blue_yellow', 'cream_brown'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'simplified_language'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN simplified_language BOOLEAN DEFAULT false;
  END IF;
END $$;

-- =====================================================
-- 7. ASSESSMENT ACCESSIBILITY SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS assessment_accessibility_settings (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  extra_time_multiplier DECIMAL(3,2) DEFAULT 1.0 CHECK (extra_time_multiplier IN (1.0, 1.25, 1.5, 2.0)),
  reduced_item_count BOOLEAN DEFAULT false,
  oral_response_enabled BOOLEAN DEFAULT false,
  word_bank_enabled BOOLEAN DEFAULT false,
  text_to_speech_enabled BOOLEAN DEFAULT false,
  lenient_spelling BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assessment_id)
);

ALTER TABLE assessment_accessibility_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage accessibility settings for their assessments"
  ON assessment_accessibility_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = assessment_accessibility_settings.assessment_id
      AND a.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view accessibility settings for their assessments"
  ON assessment_accessibility_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN classes c ON a.class_id = c.id
      JOIN class_students cs ON cs.class_id = c.id
      WHERE a.id = assessment_accessibility_settings.assessment_id
      AND cs.student_id = auth.uid()
    )
  );

-- =====================================================
-- 8. STUDENT ASSESSMENT ACCOMMODATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS student_assessment_accommodations (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  accommodations_applied TEXT[] DEFAULT ARRAY[]::TEXT[],
  extra_time_minutes INTEGER DEFAULT 0,
  audio_responses JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, assessment_id)
);

ALTER TABLE student_assessment_accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own assessment accommodations"
  ON student_assessment_accommodations FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own assessment accommodations"
  ON student_assessment_accommodations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own assessment accommodations"
  ON student_assessment_accommodations FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students assessment accommodations"
  ON student_assessment_accommodations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments a
      WHERE a.id = student_assessment_accommodations.assessment_id
      AND a.teacher_id = auth.uid()
    )
  );

-- =====================================================
-- 9. SEED DATA - WRITING TEMPLATES
-- =====================================================

-- Narrative Templates (Grades 3-5)
INSERT INTO writing_templates (template_type, grade_level, structure, sentence_starters, transition_words, word_bank)
VALUES (
  'narrative',
  4,
  '{
    "sections": [
      {"name": "Introduction", "color": "#10b981", "prompts": ["Who is the main character?", "Where does the story take place?", "When does it happen?"]},
      {"name": "Problem", "color": "#f59e0b", "prompts": ["What challenge does the character face?", "Why is this a problem?"]},
      {"name": "Events", "color": "#3b82f6", "prompts": ["What happened first?", "What happened next?", "What happened last?"]},
      {"name": "Solution", "color": "#8b5cf6", "prompts": ["How was the problem solved?", "What did the character learn?"]},
      {"name": "Conclusion", "color": "#ef4444", "prompts": ["How did the story end?", "How did the character feel?"]}
    ]
  }'::jsonb,
  ARRAY[
    'Once upon a time...',
    'One sunny day...',
    'It all started when...',
    'Long ago...',
    'In a small town...'
  ],
  ARRAY[
    'First',
    'Next',
    'Then',
    'After that',
    'Finally',
    'In the end',
    'Suddenly',
    'Meanwhile'
  ],
  '{
    "emotions": ["happy", "sad", "excited", "scared", "surprised", "worried"],
    "settings": ["school", "home", "park", "forest", "beach", "city"],
    "actions": ["ran", "jumped", "shouted", "whispered", "discovered", "explored"]
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- Persuasive Templates (Grades 6-8)
INSERT INTO writing_templates (template_type, grade_level, structure, sentence_starters, transition_words, word_bank)
VALUES (
  'persuasive',
  7,
  '{
    "sections": [
      {"name": "Introduction", "color": "#10b981", "prompts": ["What is your position?", "Why is this topic important?"]},
      {"name": "Reason 1", "color": "#3b82f6", "prompts": ["What is your first reason?", "What evidence supports this?"]},
      {"name": "Reason 2", "color": "#8b5cf6", "prompts": ["What is your second reason?", "What example proves this?"]},
      {"name": "Counterargument", "color": "#f59e0b", "prompts": ["What might others say?", "How do you respond?"]},
      {"name": "Conclusion", "color": "#ef4444", "prompts": ["Restate your position", "Call to action"]}
    ]
  }'::jsonb,
  ARRAY[
    'I strongly believe that...',
    'It is clear that...',
    'Many people think that...',
    'Research shows that...',
    'We should consider...',
    'The evidence suggests...'
  ],
  ARRAY[
    'First of all',
    'Furthermore',
    'In addition',
    'Moreover',
    'On the other hand',
    'However',
    'Therefore',
    'In conclusion',
    'As a result'
  ],
  '{
    "power_words": ["essential", "critical", "significant", "crucial", "important", "necessary"],
    "evidence_markers": ["studies show", "research indicates", "experts agree", "statistics prove"],
    "transitions": ["additionally", "consequently", "nevertheless", "ultimately"]
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- Informative Templates (Grades 9-12)
INSERT INTO writing_templates (template_type, grade_level, structure, sentence_starters, transition_words, word_bank)
VALUES (
  'informative',
  10,
  '{
    "sections": [
      {"name": "Introduction", "color": "#10b981", "prompts": ["What is your topic?", "Why is it important?", "What will you explain?"]},
      {"name": "Background", "color": "#6366f1", "prompts": ["What context is needed?", "What are key terms?"]},
      {"name": "Main Point 1", "color": "#3b82f6", "prompts": ["What is the first key idea?", "What details support this?"]},
      {"name": "Main Point 2", "color": "#8b5cf6", "prompts": ["What is the second key idea?", "What examples illustrate this?"]},
      {"name": "Main Point 3", "color": "#f59e0b", "prompts": ["What is the third key idea?", "What data supports this?"]},
      {"name": "Conclusion", "color": "#ef4444", "prompts": ["Summarize main points", "Why does this matter?"]}
    ]
  }'::jsonb,
  ARRAY[
    'This paper examines...',
    'The purpose of this essay is...',
    'To understand this topic...',
    'According to research...',
    'Analysis reveals that...',
    'It is important to note that...'
  ],
  ARRAY[
    'To begin with',
    'Subsequently',
    'Consequently',
    'For instance',
    'Specifically',
    'In particular',
    'As a result',
    'In summary',
    'To conclude'
  ],
  '{
    "academic_words": ["analyze", "demonstrate", "illustrate", "investigate", "examine", "evaluate"],
    "connectors": ["similarly", "likewise", "conversely", "alternatively", "correspondingly"],
    "formal_phrases": ["it is evident that", "research indicates", "studies demonstrate", "data suggests"]
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- Descriptive Templates (Grades 3-6)
INSERT INTO writing_templates (template_type, grade_level, structure, sentence_starters, transition_words, word_bank)
VALUES (
  'descriptive',
  5,
  '{
    "sections": [
      {"name": "Introduction", "color": "#10b981", "prompts": ["What are you describing?", "Why is it special?"]},
      {"name": "How it Looks", "color": "#3b82f6", "prompts": ["What colors do you see?", "What shapes?", "What size?"]},
      {"name": "How it Sounds", "color": "#8b5cf6", "prompts": ["What noises does it make?", "Is it loud or quiet?"]},
      {"name": "How it Feels", "color": "#f59e0b", "prompts": ["What is the texture?", "Is it rough or smooth?"]},
      {"name": "Overall Impression", "color": "#ef4444", "prompts": ["How does it make you feel?", "What is most memorable?"]}
    ]
  }'::jsonb,
  ARRAY[
    'When I look at...',
    'As I observe...',
    'The first thing I notice...',
    'It reminds me of...',
    'If you could see it...'
  ],
  ARRAY[
    'To start',
    'Moving on',
    'In addition',
    'Another feature',
    'Most importantly',
    'Overall',
    'Above all'
  ],
  '{
    "sight": ["colorful", "bright", "shiny", "dull", "sparkling", "vivid"],
    "sound": ["loud", "quiet", "melodic", "harsh", "gentle", "rhythmic"],
    "touch": ["smooth", "rough", "soft", "hard", "silky", "bumpy"],
    "feelings": ["peaceful", "exciting", "mysterious", "wonderful", "amazing"]
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_reading_drill_student ON reading_drill_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_reading_drill_teacher ON reading_drill_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_reading_drill_type ON reading_drill_progress(drill_type);
CREATE INDEX IF NOT EXISTS idx_reading_drill_completed ON reading_drill_progress(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_memory_exercise_student ON memory_exercise_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_memory_exercise_teacher ON memory_exercise_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_memory_exercise_type ON memory_exercise_progress(exercise_type);
CREATE INDEX IF NOT EXISTS idx_memory_exercise_completed ON memory_exercise_progress(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_writing_progress_student ON student_writing_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_writing_progress_teacher ON student_writing_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_writing_progress_template ON student_writing_progress(template_used);

CREATE INDEX IF NOT EXISTS idx_assessment_access_settings ON assessment_accessibility_settings(assessment_id);
CREATE INDEX IF NOT EXISTS idx_student_assessment_accom ON student_assessment_accommodations(student_id, assessment_id);
