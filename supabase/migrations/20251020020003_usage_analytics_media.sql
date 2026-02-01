/*
  # Usage Analytics, Quota Management, and Media Storage

  ## Overview
  This migration creates tables for tracking feature usage, managing quota limits,
  storing media files metadata, and providing analytics for platform monitoring.

  ## 1. New Tables

  ### Usage Analytics
  - `student_usage_logs`: Daily and monthly feature consumption tracking
    - Monitors chat messages by type (text, image, video, file)
    - Tracks video call minutes and quality metrics
    - Records AI generation requests and processing times
    - Manages quota limits per subscription tier
    - Enables automatic quota resets and upgrade prompts

  ### Media File Storage
  - `student_media_files`: Metadata for all uploaded media
    - Links to Supabase Storage buckets
    - Stores file information and access tracking
    - Includes AI analysis results and content moderation
    - Supports automatic cleanup and archival

  ### Admin Dashboard Metrics
  - `admin_dashboard_metrics`: Aggregated platform insights
    - Tracks active students and system health
    - Monitors review queue sizes and processing times
    - Stores engagement cohorts and churn indicators
    - Provides capacity planning data

  ### Audit Logging
  - `audit_logs`: Security and compliance tracking
    - Records all sensitive data access
    - Tracks admin actions and review decisions
    - Maintains data export and deletion requests
    - Supports compliance reporting

  ## 2. Security
  - RLS policies ensure students only see own usage data
  - Admin access for platform monitoring
  - Audit logs immutable after creation
  - Automatic data retention enforcement

  ## 3. Features
  - Real-time quota tracking with soft and hard limits
  - Usage-based upgrade recommendations
  - Comprehensive audit trail for compliance
  - Automated cleanup of expired data
*/

-- =====================================================
-- STUDENT USAGE LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS student_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  subscription_tier text NOT NULL,

  -- Chat usage by type
  chat_text_messages_count integer DEFAULT 0,
  chat_image_messages_count integer DEFAULT 0,
  chat_video_messages_count integer DEFAULT 0,
  chat_audio_messages_count integer DEFAULT 0,
  chat_file_messages_count integer DEFAULT 0,
  total_chat_messages integer DEFAULT 0,

  -- Video call usage
  video_call_minutes_used numeric(10, 2) DEFAULT 0,
  video_call_sessions_count integer DEFAULT 0,
  average_call_quality_score numeric(3, 2),

  -- AI generation requests
  ai_notes_generated integer DEFAULT 0,
  ai_flashcards_generated integer DEFAULT 0,
  ai_explanations_generated integer DEFAULT 0,
  ai_summaries_generated integer DEFAULT 0,

  -- Media processing
  images_uploaded integer DEFAULT 0,
  videos_uploaded integer DEFAULT 0,
  files_uploaded integer DEFAULT 0,
  total_storage_used_mb numeric(10, 2) DEFAULT 0,

  -- Quota management
  text_message_quota integer,
  image_message_quota integer,
  video_call_quota_minutes integer,
  ai_generation_quota integer,
  storage_quota_mb integer,

  -- Quota tracking
  text_messages_remaining integer,
  video_minutes_remaining numeric(10, 2),
  storage_remaining_mb numeric(10, 2),

  -- Reset tracking
  quota_reset_date date,
  quota_reset_frequency text DEFAULT 'daily' CHECK (quota_reset_frequency IN ('daily', 'weekly', 'monthly')),

  -- Upgrade prompts
  upgrade_prompts_shown integer DEFAULT 0,
  last_upgrade_prompt_at timestamptz,

  -- Feature usage patterns
  peak_usage_hour integer,
  most_used_feature text,
  usage_patterns jsonb DEFAULT '{}'::jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(student_id, log_date)
);

ALTER TABLE student_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own usage logs"
  ON student_usage_logs
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_usage_logs_student_id_idx ON student_usage_logs(student_id);
CREATE INDEX IF NOT EXISTS student_usage_logs_date_idx ON student_usage_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS student_usage_logs_subscription_idx ON student_usage_logs(subscription_tier);

-- =====================================================
-- STUDENT MEDIA FILES
-- =====================================================

CREATE TYPE file_purpose AS ENUM (
  'chat_attachment',
  'profile_picture',
  'note_image',
  'note_attachment',
  'study_material',
  'assignment_submission',
  'other'
);

CREATE TYPE content_moderation_status AS ENUM (
  'pending',
  'approved',
  'flagged',
  'rejected',
  'reviewing'
);

CREATE TABLE IF NOT EXISTS student_media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) NOT NULL,

  -- File information
  file_name text NOT NULL,
  original_file_name text NOT NULL,
  file_type text NOT NULL,
  mime_type text NOT NULL,
  file_size_bytes bigint NOT NULL,
  file_purpose file_purpose NOT NULL,

  -- Storage information
  storage_bucket text DEFAULT 'student-files',
  storage_path text NOT NULL UNIQUE,
  thumbnail_path text,
  public_url text,

  -- AI analysis
  ai_vision_analysis jsonb,
  ai_content_summary text,
  extracted_text text,
  transcript text,
  detected_language text,
  tags text[],

  -- Processing status
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_started_at timestamptz,
  processing_completed_at timestamptz,
  processing_error text,

  -- Content moderation
  moderation_status content_moderation_status DEFAULT 'pending',
  moderation_flags text[],
  moderation_reviewed_by uuid REFERENCES auth.users(id),
  moderation_reviewed_at timestamptz,
  moderation_notes text,

  -- Access tracking
  access_count integer DEFAULT 0,
  last_accessed_at timestamptz,
  download_count integer DEFAULT 0,

  -- Linked entities
  linked_chat_message_id uuid REFERENCES student_chat_messages(id) ON DELETE SET NULL,
  linked_note_id uuid REFERENCES student_notes(id) ON DELETE SET NULL,

  -- Lifecycle management
  expiry_date timestamptz,
  is_archived boolean DEFAULT false,
  archived_at timestamptz,
  deleted_at timestamptz,

  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage own media files"
  ON student_media_files
  FOR ALL
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS student_media_files_student_id_idx ON student_media_files(student_id);
CREATE INDEX IF NOT EXISTS student_media_files_storage_path_idx ON student_media_files(storage_path);
CREATE INDEX IF NOT EXISTS student_media_files_purpose_idx ON student_media_files(file_purpose);
CREATE INDEX IF NOT EXISTS student_media_files_processing_status_idx ON student_media_files(processing_status);
CREATE INDEX IF NOT EXISTS student_media_files_moderation_status_idx ON student_media_files(moderation_status);
CREATE INDEX IF NOT EXISTS student_media_files_uploaded_at_idx ON student_media_files(uploaded_at DESC);

-- =====================================================
-- ADMIN DASHBOARD METRICS
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  metric_hour integer CHECK (metric_hour >= 0 AND metric_hour < 24),

  -- Student metrics
  total_active_students integer DEFAULT 0,
  new_students_today integer DEFAULT 0,
  students_by_tier jsonb DEFAULT '{}'::jsonb,
  student_engagement_score numeric(3, 2),

  -- Profile analysis metrics
  profiles_in_analysis integer DEFAULT 0,
  profiles_ready_for_training integer DEFAULT 0,
  average_profile_completeness numeric(5, 2),

  -- Review queue metrics
  pending_junior_reviews integer DEFAULT 0,
  pending_senior_reviews integer DEFAULT 0,
  average_junior_review_time_hours numeric(10, 2),
  average_senior_review_time_hours numeric(10, 2),
  approval_rate_percent numeric(5, 2),

  -- Training metrics
  training_jobs_in_progress integer DEFAULT 0,
  training_jobs_completed_today integer DEFAULT 0,
  training_success_rate_percent numeric(5, 2),
  average_training_time_minutes numeric(10, 2),

  -- Model metrics
  active_personalized_models integer DEFAULT 0,
  models_scheduled_for_retraining integer DEFAULT 0,
  average_model_satisfaction_score numeric(3, 2),

  -- System health
  ai_response_time_ms_avg numeric(10, 2),
  system_error_rate_percent numeric(5, 2),
  api_requests_total integer DEFAULT 0,
  storage_used_gb numeric(10, 2),

  -- Engagement analytics
  daily_active_students integer DEFAULT 0,
  weekly_active_students integer DEFAULT 0,
  monthly_active_students integer DEFAULT 0,
  churn_risk_students integer DEFAULT 0,
  high_engagement_students integer DEFAULT 0,

  -- Usage patterns
  peak_usage_hour integer,
  total_chat_messages integer DEFAULT 0,
  total_notes_generated integer DEFAULT 0,
  total_flashcards_reviewed integer DEFAULT 0,

  -- Quality metrics
  student_satisfaction_avg numeric(3, 2),
  content_quality_score_avg numeric(3, 2),
  common_rejection_reasons jsonb DEFAULT '[]'::jsonb,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(metric_date, metric_hour)
);

ALTER TABLE admin_dashboard_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view dashboard metrics"
  ON admin_dashboard_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE INDEX IF NOT EXISTS admin_dashboard_metrics_date_idx ON admin_dashboard_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS admin_dashboard_metrics_hour_idx ON admin_dashboard_metrics(metric_hour);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TYPE audit_action_type AS ENUM (
  'profile_viewed',
  'profile_edited',
  'chat_viewed',
  'training_request_created',
  'training_request_reviewed',
  'training_approved',
  'training_rejected',
  'model_deployed',
  'model_archived',
  'data_exported',
  'data_deleted',
  'user_login',
  'user_logout',
  'permission_changed',
  'settings_updated',
  'file_uploaded',
  'file_deleted',
  'admin_action',
  'system_event'
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type audit_action_type NOT NULL,
  actor_id uuid REFERENCES auth.users(id),
  actor_role text,
  actor_ip_address inet,

  -- Target information
  target_student_id uuid REFERENCES students(id) ON DELETE SET NULL,
  target_entity_type text,
  target_entity_id uuid,

  -- Action details
  action_description text NOT NULL,
  action_metadata jsonb DEFAULT '{}'::jsonb,
  changes_made jsonb,

  -- Request context
  request_path text,
  request_method text,
  user_agent text,
  session_id text,

  -- Compliance
  data_classification text CHECK (data_classification IN ('public', 'internal', 'confidential', 'restricted')),
  retention_period_days integer DEFAULT 2555,
  must_retain_until date,

  -- Status
  was_successful boolean DEFAULT true,
  error_message text,

  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_type_idx ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS audit_logs_target_student_idx ON audit_logs(target_student_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_data_classification_idx ON audit_logs(data_classification);

-- =====================================================
-- DATA RETENTION AND CONSENT
-- =====================================================

CREATE TABLE IF NOT EXISTS student_data_retention (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Retention policies
  chat_retention_days integer DEFAULT 365,
  media_retention_days integer DEFAULT 180,
  progress_retention_days integer DEFAULT 730,
  audit_retention_days integer DEFAULT 2555,

  -- Consent tracking
  analytics_consent boolean DEFAULT true,
  ai_training_consent boolean DEFAULT true,
  research_consent boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,

  -- Consent history
  consent_history jsonb DEFAULT '[]'::jsonb,
  last_consent_update timestamptz,

  -- Export and deletion requests
  data_export_requested boolean DEFAULT false,
  data_export_requested_at timestamptz,
  data_export_completed_at timestamptz,
  data_export_url text,

  data_deletion_requested boolean DEFAULT false,
  data_deletion_requested_at timestamptz,
  data_deletion_scheduled_for timestamptz,
  data_deletion_completed_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_data_retention ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own data retention settings"
  ON student_data_retention
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own data retention settings"
  ON student_data_retention
  FOR UPDATE
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

CREATE INDEX IF NOT EXISTS student_data_retention_student_id_idx ON student_data_retention(student_id);
CREATE INDEX IF NOT EXISTS student_data_retention_deletion_scheduled_idx ON student_data_retention(data_deletion_scheduled_for) WHERE data_deletion_requested = true;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action_type audit_action_type,
  p_actor_id uuid,
  p_target_student_id uuid,
  p_action_description text,
  p_action_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO audit_logs (
    action_type,
    actor_id,
    target_student_id,
    action_description,
    action_metadata
  ) VALUES (
    p_action_type,
    p_actor_id,
    p_target_student_id,
    p_action_description,
    p_action_metadata
  ) RETURNING id INTO audit_id;

  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and update daily usage quota
CREATE OR REPLACE FUNCTION check_usage_quota(
  p_student_id uuid,
  p_feature_type text
)
RETURNS boolean AS $$
DECLARE
  current_log record;
  quota_remaining integer;
  has_quota boolean;
BEGIN
  -- Get today's usage log
  SELECT * INTO current_log
  FROM student_usage_logs
  WHERE student_id = p_student_id
    AND log_date = CURRENT_DATE;

  -- If no log exists for today, create one
  IF NOT FOUND THEN
    INSERT INTO student_usage_logs (
      student_id,
      log_date,
      subscription_tier
    )
    SELECT
      p_student_id,
      CURRENT_DATE,
      subscription_tier
    FROM students
    WHERE id = p_student_id
    RETURNING * INTO current_log;
  END IF;

  -- Check quota based on feature type
  has_quota := CASE p_feature_type
    WHEN 'text_message' THEN
      current_log.text_messages_remaining > 0 OR current_log.text_message_quota IS NULL
    WHEN 'video_call' THEN
      current_log.video_minutes_remaining > 0 OR current_log.video_call_quota_minutes IS NULL
    WHEN 'storage' THEN
      current_log.storage_remaining_mb > 0 OR current_log.storage_quota_mb IS NULL
    ELSE true
  END;

  RETURN has_quota;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired media files
CREATE OR REPLACE FUNCTION cleanup_expired_media_files()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  UPDATE student_media_files
  SET
    deleted_at = NOW(),
    is_archived = true,
    archived_at = NOW()
  WHERE
    expiry_date < NOW()
    AND deleted_at IS NULL
    AND is_archived = false;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_usage_logs_updated_at') THEN
    CREATE TRIGGER update_student_usage_logs_updated_at
      BEFORE UPDATE ON student_usage_logs
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_media_files_updated_at') THEN
    CREATE TRIGGER update_student_media_files_updated_at
      BEFORE UPDATE ON student_media_files
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admin_dashboard_metrics_updated_at') THEN
    CREATE TRIGGER update_admin_dashboard_metrics_updated_at
      BEFORE UPDATE ON admin_dashboard_metrics
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_data_retention_updated_at') THEN
    CREATE TRIGGER update_student_data_retention_updated_at
      BEFORE UPDATE ON student_data_retention
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
