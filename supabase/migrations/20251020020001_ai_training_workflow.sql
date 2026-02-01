/*
  # AI Training Workflow and Profile Analysis System

  ## Overview
  This migration creates the workflow system for analyzing student chat data
  over 7-day cycles, building comprehensive learning profiles, and managing
  the admin review process for AI model training approval.

  ## 1. New Tables

  ### Profile Analysis Jobs
  - `profile_analysis_jobs`: Manages 7-day rolling analysis cycles
    - Tracks job scheduling, status, and completion
    - Stores message counts and analysis summaries
    - Calculates readiness scores for AI training
    - Configurable cycle frequency per student

  ### AI Training Requests
  - `ai_training_requests`: Queue for profiles ready for personalization
    - Links to student profiles and source analysis
    - Tracks two-tier review process (Junior → Optimus)
    - Stores review decisions, notes, and reasoning
    - Manages training job lifecycle and deployment

  ### Personalized AI Models
  - `student_ai_models`: Individual AI instances per student
    - Stores model versions and training parameters
    - Tracks active models and fallback base models
    - Manages 2-month fallback retention period
    - Records performance metrics and retraining triggers

  ### Admin Roles and Permissions
  - `admin_roles`: Permission hierarchy for review workflows
    - Defines Junior Reviewer and Optimus (Senior) roles
    - Tracks specialization areas and capacity limits
    - Stores performance metrics for admins

  - `admin_assignments`: Links users to admin roles
    - Manages role assignments with date tracking
    - Supports multiple roles per admin
    - Enables role-based access control

  ## 2. Security
  - RLS policies restrict access based on admin roles
  - Junior reviewers see only assigned requests
  - Optimus reviewers have full queue access
  - Students cannot access training workflow tables
  - Audit logging for all review decisions

  ## 3. Workflow
  1. Every 7 days, analysis job runs on student chat messages
  2. Profile completeness score calculated
  3. If readiness threshold met, training request created
  4. Junior reviewer performs initial assessment
  5. Optimus reviewer makes final approval decision
  6. Approved requests trigger AI model training
  7. Trained model deployed with base model as fallback
  8. Fallback expires after 2 months
*/

-- =====================================================
-- PROFILE ANALYSIS JOBS
-- =====================================================

CREATE TABLE IF NOT EXISTS profile_analysis_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  cycle_number integer NOT NULL DEFAULT 1,
  analysis_start_date timestamptz NOT NULL,
  analysis_end_date timestamptz NOT NULL,
  job_status text DEFAULT 'scheduled' CHECK (job_status IN ('scheduled', 'collecting', 'analyzing', 'completed', 'failed')),

  -- Message analysis metrics
  messages_analyzed_count integer DEFAULT 0,
  messages_total_to_date integer DEFAULT 0,
  new_data_points integer DEFAULT 0,

  -- Profile metrics
  confidence_delta numeric(3, 2) DEFAULT 0.00,
  readiness_score integer DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  readiness_threshold integer DEFAULT 75,

  -- Cycle configuration
  cycle_frequency_days integer DEFAULT 7,
  next_scheduled_date timestamptz,

  -- AI analysis results
  analysis_summary text,
  key_insights text[],
  behavior_changes_detected jsonb,
  learning_breakthroughs jsonb,

  -- Timestamps
  scheduled_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,

  created_at timestamptz DEFAULT now()
);

ALTER TABLE profile_analysis_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all analysis jobs"
  ON profile_analysis_jobs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE INDEX IF NOT EXISTS profile_analysis_jobs_student_id_idx ON profile_analysis_jobs(student_id);
CREATE INDEX IF NOT EXISTS profile_analysis_jobs_status_idx ON profile_analysis_jobs(job_status);
CREATE INDEX IF NOT EXISTS profile_analysis_jobs_next_scheduled_idx ON profile_analysis_jobs(next_scheduled_date);
CREATE INDEX IF NOT EXISTS profile_analysis_jobs_readiness_idx ON profile_analysis_jobs(readiness_score DESC);

-- =====================================================
-- ADMIN ROLES AND PERMISSIONS
-- =====================================================

CREATE TYPE admin_role_type AS ENUM ('junior_reviewer', 'optimus_senior', 'super_admin');

CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name admin_role_type NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '{
    "view_profiles": false,
    "review_requests": false,
    "approve_training": false,
    "deploy_models": false,
    "manage_users": false,
    "view_analytics": false,
    "manage_system": false
  }'::jsonb,
  priority_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Insert default admin roles
INSERT INTO admin_roles (role_name, display_name, description, permissions, priority_level)
VALUES
  (
    'junior_reviewer',
    'Junior Reviewer',
    'Can review training requests and make preliminary assessments',
    '{
      "view_profiles": true,
      "review_requests": true,
      "approve_training": false,
      "deploy_models": false,
      "manage_users": false,
      "view_analytics": true,
      "manage_system": false
    }'::jsonb,
    1
  ),
  (
    'optimus_senior',
    'Optimus (Senior Reviewer)',
    'Can make final approval decisions on AI training requests',
    '{
      "view_profiles": true,
      "review_requests": true,
      "approve_training": true,
      "deploy_models": true,
      "manage_users": false,
      "view_analytics": true,
      "manage_system": false
    }'::jsonb,
    2
  ),
  (
    'super_admin',
    'Super Admin',
    'Full system access and management capabilities',
    '{
      "view_profiles": true,
      "review_requests": true,
      "approve_training": true,
      "deploy_models": true,
      "manage_users": true,
      "view_analytics": true,
      "manage_system": true
    }'::jsonb,
    3
  )
ON CONFLICT (role_name) DO NOTHING;

-- Admin role assignments
CREATE TABLE IF NOT EXISTS admin_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_name admin_role_type NOT NULL,
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  revoked_at timestamptz,

  -- Reviewer-specific settings
  review_capacity_daily integer DEFAULT 10,
  specialization_areas text[],

  -- Performance tracking
  reviews_completed integer DEFAULT 0,
  average_review_time_minutes numeric(10, 2),
  approval_rate numeric(3, 2),

  UNIQUE(user_id, role_name)
);

ALTER TABLE admin_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin assignments"
  ON admin_assignments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE INDEX IF NOT EXISTS admin_assignments_user_id_idx ON admin_assignments(user_id);
CREATE INDEX IF NOT EXISTS admin_assignments_role_name_idx ON admin_assignments(role_name);
CREATE INDEX IF NOT EXISTS admin_assignments_revoked_at_idx ON admin_assignments(revoked_at) WHERE revoked_at IS NULL;

-- =====================================================
-- AI TRAINING REQUESTS
-- =====================================================

CREATE TYPE training_request_status AS ENUM (
  'pending_review',
  'under_junior_review',
  'pending_senior_review',
  'approved',
  'rejected',
  'training_in_progress',
  'deployed',
  'failed'
);

CREATE TABLE IF NOT EXISTS ai_training_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  source_analysis_job_id uuid REFERENCES profile_analysis_jobs(id),
  source_profile_id uuid REFERENCES user_learning_profiles(id),

  -- Request metadata
  request_status training_request_status DEFAULT 'pending_review',
  priority_level text DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),

  -- Junior reviewer workflow
  junior_reviewer_id uuid REFERENCES auth.users(id),
  junior_review_started_at timestamptz,
  junior_review_completed_at timestamptz,
  junior_reviewer_decision text CHECK (junior_reviewer_decision IN ('recommend_approve', 'recommend_reject', 'escalate', null)),
  junior_reviewer_notes text,
  junior_quality_score integer CHECK (junior_quality_score >= 0 AND junior_quality_score <= 100),

  -- Optimus (Senior) reviewer workflow
  optimus_reviewer_id uuid REFERENCES auth.users(id),
  optimus_review_started_at timestamptz,
  optimus_review_completed_at timestamptz,
  optimus_decision text CHECK (optimus_decision IN ('approved', 'rejected', 'request_more_data', null)),
  optimus_reasoning text,
  optimus_quality_score integer CHECK (optimus_quality_score >= 0 AND optimus_quality_score <= 100),

  -- Rejection tracking
  rejection_reason text,
  rejection_category text CHECK (rejection_category IN ('insufficient_data', 'inconsistent_patterns', 'privacy_concerns', 'quality_issues', 'other', null)),

  -- Training configuration
  training_requirements jsonb DEFAULT '{
    "model_depth": "standard",
    "context_window_tokens": 8000,
    "temperature": 0.7,
    "personalization_level": "moderate"
  }'::jsonb,
  estimated_training_time_minutes integer,
  actual_training_time_minutes integer,

  -- Training job tracking
  training_job_id text,
  training_started_at timestamptz,
  training_completed_at timestamptz,
  training_failed_at timestamptz,
  training_failure_reason text,

  -- Deployment tracking
  deployed_model_id uuid,
  deployed_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_training_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Junior reviewers can view assigned requests"
  ON ai_training_requests
  FOR SELECT
  TO authenticated
  USING (
    junior_reviewer_id = auth.uid()
    OR optimus_reviewer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_assignments
      WHERE admin_assignments.user_id = auth.uid()
      AND admin_assignments.role_name IN ('optimus_senior', 'super_admin')
      AND admin_assignments.revoked_at IS NULL
    )
  );

CREATE POLICY "Reviewers can update assigned requests"
  ON ai_training_requests
  FOR UPDATE
  TO authenticated
  USING (
    junior_reviewer_id = auth.uid()
    OR optimus_reviewer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_assignments
      WHERE admin_assignments.user_id = auth.uid()
      AND admin_assignments.role_name IN ('optimus_senior', 'super_admin')
      AND admin_assignments.revoked_at IS NULL
    )
  )
  WITH CHECK (
    junior_reviewer_id = auth.uid()
    OR optimus_reviewer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_assignments
      WHERE admin_assignments.user_id = auth.uid()
      AND admin_assignments.role_name IN ('optimus_senior', 'super_admin')
      AND admin_assignments.revoked_at IS NULL
    )
  );

CREATE INDEX IF NOT EXISTS ai_training_requests_student_id_idx ON ai_training_requests(student_id);
CREATE INDEX IF NOT EXISTS ai_training_requests_status_idx ON ai_training_requests(request_status);
CREATE INDEX IF NOT EXISTS ai_training_requests_priority_idx ON ai_training_requests(priority_level);
CREATE INDEX IF NOT EXISTS ai_training_requests_junior_reviewer_idx ON ai_training_requests(junior_reviewer_id);
CREATE INDEX IF NOT EXISTS ai_training_requests_optimus_reviewer_idx ON ai_training_requests(optimus_reviewer_id);
CREATE INDEX IF NOT EXISTS ai_training_requests_created_at_idx ON ai_training_requests(created_at DESC);

-- =====================================================
-- PERSONALIZED AI MODELS
-- =====================================================

CREATE TYPE ai_model_status AS ENUM ('training', 'active', 'fallback', 'archived', 'failed');

CREATE TABLE IF NOT EXISTS student_ai_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  training_request_id uuid REFERENCES ai_training_requests(id),
  source_profile_id uuid REFERENCES user_learning_profiles(id),

  -- Model metadata
  model_version text NOT NULL,
  model_status ai_model_status DEFAULT 'training',
  base_model_version text NOT NULL,
  is_base_model boolean DEFAULT false,

  -- Training details
  training_date timestamptz,
  deployment_date timestamptz,

  -- Customization parameters
  custom_system_prompts text[],
  context_window_size integer DEFAULT 8000,
  temperature numeric(3, 2) DEFAULT 0.70,
  personalization_depth text CHECK (personalization_depth IN ('light', 'moderate', 'deep')),

  -- Fallback management
  fallback_for_model_id uuid REFERENCES student_ai_models(id),
  fallback_expiry_date timestamptz,
  fallback_archived_at timestamptz,

  -- Performance metrics
  usage_sessions integer DEFAULT 0,
  total_messages integer DEFAULT 0,
  average_response_quality numeric(3, 2),
  student_satisfaction_score numeric(3, 2),
  engagement_improvement_percent numeric(5, 2),
  learning_velocity_improvement_percent numeric(5, 2),

  -- Retraining triggers
  retraining_recommended boolean DEFAULT false,
  retraining_reason text,
  drift_detection_score numeric(3, 2),
  last_drift_check timestamptz,

  -- A/B testing
  ab_test_group text,
  ab_test_results jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all AI models"
  ON student_ai_models
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE INDEX IF NOT EXISTS student_ai_models_student_id_idx ON student_ai_models(student_id);
CREATE INDEX IF NOT EXISTS student_ai_models_status_idx ON student_ai_models(model_status);
CREATE INDEX IF NOT EXISTS student_ai_models_fallback_expiry_idx ON student_ai_models(fallback_expiry_date) WHERE model_status = 'fallback';
CREATE INDEX IF NOT EXISTS student_ai_models_retraining_idx ON student_ai_models(retraining_recommended) WHERE retraining_recommended = true;

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

-- Apply updated_at trigger to ai_training_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_training_requests_updated_at'
  ) THEN
    CREATE TRIGGER update_ai_training_requests_updated_at
      BEFORE UPDATE ON ai_training_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Apply updated_at trigger to student_ai_models
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_ai_models_updated_at'
  ) THEN
    CREATE TRIGGER update_student_ai_models_updated_at
      BEFORE UPDATE ON student_ai_models
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to archive expired fallback models
CREATE OR REPLACE FUNCTION archive_expired_fallback_models()
RETURNS void AS $$
BEGIN
  UPDATE student_ai_models
  SET
    model_status = 'archived',
    fallback_archived_at = NOW()
  WHERE
    model_status = 'fallback'
    AND fallback_expiry_date < NOW()
    AND fallback_archived_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
