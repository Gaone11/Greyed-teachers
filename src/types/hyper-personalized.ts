// Hyper-Personalized AI Education Platform Types
// Comprehensive TypeScript definitions matching the database schema

// =====================================================
// CORE STUDENT TYPES
// =====================================================

export interface Student {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  grade_level?: string;
  curriculum_type?: string;
  school_name?: string;
  timezone: string;
  language_preference: string;
  subjects_of_interest?: string[];
  learning_goals?: string[];
  subscription_tier: 'free' | 'premium';
  parent_guardian_email?: string;
  parent_guardian_name?: string;
  parent_permissions?: {
    view_progress: boolean;
    view_chat: boolean;
    notifications: boolean;
  };
  accessibility_requirements?: string[];
  avatar_config?: {
    color: string;
    voice: string;
    style: string;
  };
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// PERSONALITY ASSESSMENT TYPES
// =====================================================

export interface PersonalityAssessment {
  id: string;
  student_id: string;
  assessment_type: string;
  assessment_version?: string;
  raw_scores: Record<string, number>;
  trait_dimensions: Record<string, number>;
  detailed_interpretation?: Record<string, any>;
  completion_date: string;
  source_url?: string;
  created_at: string;
}

export interface PersonalityEvolution {
  id: string;
  student_id: string;
  observation_date: string;
  personality_indicators: Record<string, any>;
  confidence_scores: Record<string, number>;
  behavioral_patterns?: Record<string, any>;
  emotional_patterns?: Record<string, any>;
  motivation_triggers?: string[];
  social_preferences?: Record<string, any>;
  changes_from_baseline?: Record<string, any>;
  linked_events?: string[];
  created_at: string;
}

// =====================================================
// MULTI-MODAL CHAT TYPES
// =====================================================

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';
export type MessageRole = 'user' | 'assistant' | 'system';
export type SentimentLabel = 'positive' | 'neutral' | 'negative' | 'frustrated' | 'engaged' | 'confused' | 'confident';

export interface StudentChatMessage {
  id: string;
  student_id: string;
  session_id: string;
  role: MessageRole;
  message_type: MessageType;
  content: string;
  metadata?: Record<string, any>;
  subject_area?: string;
  learning_objective?: string;
  sentiment_score?: number;
  sentiment_label?: SentimentLabel;
  complexity_level?: number;
  token_count: number;
  conversation_context?: Record<string, any>;
  ai_model_version?: string;
  processing_time_ms?: number;
  created_at: string;
  deleted_at?: string;
}

export interface ChatMediaAttachment {
  id: string;
  message_id: string;
  file_type: string;
  mime_type: string;
  file_size_bytes: number;
  storage_path: string;
  storage_bucket: string;
  thumbnail_path?: string;
  ai_vision_analysis?: Record<string, any>;
  transcript?: string;
  content_summary?: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  moderation_status: 'pending' | 'approved' | 'flagged' | 'rejected';
  moderation_flags?: string[];
  uploaded_at: string;
  processed_at?: string;
}

// =====================================================
// LEARNING PROFILE TYPES
// =====================================================

export interface LearningStyle {
  preference: number;
  confidence: number;
}

export interface UserLearningProfile {
  id: string;
  student_id: string;
  profile_version: number;
  generation_timestamp: string;
  learning_styles: {
    visual: LearningStyle;
    auditory: LearningStyle;
    kinesthetic: LearningStyle;
    reading_writing: LearningStyle;
  };
  subject_knowledge_levels: Record<string, any>;
  skill_breakdowns: Record<string, any>;
  mastery_areas: any[];
  struggling_topics: any[];
  misconception_patterns: any[];
  engagement_patterns: {
    best_study_hours: number[];
    optimal_session_length_minutes: number;
    break_frequency_minutes: number;
    focus_level_by_time: Record<string, number>;
  };
  motivational_triggers?: string[];
  communication_preferences: {
    formality_level: string;
    emoji_usage: string;
    humor_appreciation: string;
    explanation_depth: string;
  };
  attention_span_minutes?: number;
  preferred_content_difficulty: Record<string, any>;
  question_types_preferred?: string[];
  explanation_styles_preferred?: string[];
  profile_completeness_score: number;
  data_points_analyzed: number;
  confidence_level: number;
  linked_personality_assessment_id?: string;
  ai_generated_insights?: string[];
  recommended_learning_strategies?: string[];
  created_at: string;
  updated_at: string;
}

// =====================================================
// PROFILE ANALYSIS TYPES
// =====================================================

export type AnalysisJobStatus = 'scheduled' | 'collecting' | 'analyzing' | 'completed' | 'failed';

export interface ProfileAnalysisJob {
  id: string;
  student_id: string;
  cycle_number: number;
  analysis_start_date: string;
  analysis_end_date: string;
  job_status: AnalysisJobStatus;
  messages_analyzed_count: number;
  messages_total_to_date: number;
  new_data_points: number;
  confidence_delta: number;
  readiness_score: number;
  readiness_threshold: number;
  cycle_frequency_days: number;
  next_scheduled_date?: string;
  analysis_summary?: string;
  key_insights?: string[];
  behavior_changes_detected?: Record<string, any>;
  learning_breakthroughs?: Record<string, any>;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  failed_at?: string;
  failure_reason?: string;
  created_at: string;
}

// =====================================================
// ADMIN AND TRAINING TYPES
// =====================================================

export type AdminRoleType = 'junior_reviewer' | 'optimus_senior' | 'super_admin';

export interface AdminRole {
  id: string;
  role_name: AdminRoleType;
  display_name: string;
  description?: string;
  permissions: {
    view_profiles: boolean;
    review_requests: boolean;
    approve_training: boolean;
    deploy_models: boolean;
    manage_users: boolean;
    view_analytics: boolean;
    manage_system: boolean;
  };
  priority_level: number;
  created_at: string;
}

export interface AdminAssignment {
  id: string;
  user_id: string;
  role_name: AdminRoleType;
  assigned_by?: string;
  assigned_at: string;
  revoked_at?: string;
  review_capacity_daily: number;
  specialization_areas?: string[];
  reviews_completed: number;
  average_review_time_minutes?: number;
  approval_rate?: number;
}

export type TrainingRequestStatus =
  | 'pending_review'
  | 'under_junior_review'
  | 'pending_senior_review'
  | 'approved'
  | 'rejected'
  | 'training_in_progress'
  | 'deployed'
  | 'failed';

export type ReviewDecision = 'recommend_approve' | 'recommend_reject' | 'escalate';
export type OptimusDecision = 'approved' | 'rejected' | 'request_more_data';

export interface AITrainingRequest {
  id: string;
  student_id: string;
  source_analysis_job_id?: string;
  source_profile_id?: string;
  request_status: TrainingRequestStatus;
  priority_level: 'low' | 'normal' | 'high' | 'urgent';
  junior_reviewer_id?: string;
  junior_review_started_at?: string;
  junior_review_completed_at?: string;
  junior_reviewer_decision?: ReviewDecision;
  junior_reviewer_notes?: string;
  junior_quality_score?: number;
  optimus_reviewer_id?: string;
  optimus_review_started_at?: string;
  optimus_review_completed_at?: string;
  optimus_decision?: OptimusDecision;
  optimus_reasoning?: string;
  optimus_quality_score?: number;
  rejection_reason?: string;
  rejection_category?: 'insufficient_data' | 'inconsistent_patterns' | 'privacy_concerns' | 'quality_issues' | 'other';
  training_requirements?: {
    model_depth: string;
    context_window_tokens: number;
    temperature: number;
    personalization_level: string;
  };
  estimated_training_time_minutes?: number;
  actual_training_time_minutes?: number;
  training_job_id?: string;
  training_started_at?: string;
  training_completed_at?: string;
  training_failed_at?: string;
  training_failure_reason?: string;
  deployed_model_id?: string;
  deployed_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// AI MODEL TYPES
// =====================================================

export type AIModelStatus = 'training' | 'active' | 'fallback' | 'archived' | 'failed';

export interface StudentAIModel {
  id: string;
  student_id: string;
  training_request_id?: string;
  source_profile_id?: string;
  model_version: string;
  model_status: AIModelStatus;
  base_model_version: string;
  is_base_model: boolean;
  training_date?: string;
  deployment_date?: string;
  custom_system_prompts?: string[];
  context_window_size: number;
  temperature: number;
  personalization_depth?: 'light' | 'moderate' | 'deep';
  fallback_for_model_id?: string;
  fallback_expiry_date?: string;
  fallback_archived_at?: string;
  usage_sessions: number;
  total_messages: number;
  average_response_quality?: number;
  student_satisfaction_score?: number;
  engagement_improvement_percent?: number;
  learning_velocity_improvement_percent?: number;
  retraining_recommended: boolean;
  retraining_reason?: string;
  drift_detection_score?: number;
  last_drift_check?: string;
  ab_test_group?: string;
  ab_test_results?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// LEARNING MATERIALS TYPES
// =====================================================

export type NoteGenerationMethod =
  | 'chat_summary'
  | 'topic_explanation'
  | 'lesson_recap'
  | 'concept_breakdown'
  | 'exam_prep'
  | 'manual_request'
  | 'auto_generated';

export interface StudentNote {
  id: string;
  student_id: string;
  title: string;
  markdown_content: string;
  generation_method: NoteGenerationMethod;
  source_chat_session_id?: string;
  ai_model_version?: string;
  personalization_level?: 'generic' | 'adapted' | 'hyper_personalized';
  subject: string;
  topics?: string[];
  curriculum_alignment?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  student_edits?: string;
  student_edited_at?: string;
  view_count: number;
  total_time_spent_seconds: number;
  last_viewed_at?: string;
  comprehension_questions?: any[];
  key_concepts?: string[];
  related_note_ids?: string[];
  external_resources?: any[];
  ai_generated_summary?: string;
  suggested_review_date?: string;
  is_favorite: boolean;
  is_archived: boolean;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

export type FlashcardGenerationSource = 'ai_from_notes' | 'ai_from_chat' | 'curriculum_aligned' | 'student_created';

export interface StudentFlashcard {
  id: string;
  student_id: string;
  linked_note_id?: string;
  source_chat_session_id?: string;
  front_content: string;
  back_content: string;
  generation_source: FlashcardGenerationSource;
  subject: string;
  topic: string;
  difficulty_rating: number;
  current_box: number;
  next_review_date: string;
  last_reviewed_at?: string;
  times_reviewed: number;
  times_correct: number;
  times_incorrect: number;
  current_streak: number;
  longest_streak: number;
  mastery_level: number;
  personalization_adaptations?: any[];
  ai_generated_hints?: string[];
  hint_triggers?: Record<string, any>;
  related_flashcard_ids?: string[];
  concept_cluster?: string;
  is_suspended: boolean;
  suspended_at?: string;
  is_archived: boolean;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// PROGRESS TRACKING TYPES
// =====================================================

export interface StudentProgress {
  id: string;
  student_id: string;
  strengths: any[];
  areas_for_improvement: any[];
  knowledge_gaps: any[];
  recent_topics: any[];
  active_subjects?: string[];
  study_streak_days: number;
  longest_study_streak: number;
  last_study_date?: string;
  total_study_hours: number;
  study_sessions_count: number;
  overall_confidence_score: number;
  learning_velocity_score?: number;
  engagement_score?: number;
  consistency_score?: number;
  subject_mastery_levels: Record<string, any>;
  subject_time_distribution: Record<string, any>;
  subject_confidence_scores: Record<string, any>;
  milestones_achieved: any[];
  total_notes_created: number;
  total_flashcards_mastered: number;
  total_questions_answered: number;
  total_topics_completed: number;
  predicted_exam_readiness: Record<string, any>;
  at_risk_subjects?: string[];
  recommended_focus_areas?: string[];
  progress_correlation_with_chat?: Record<string, any>;
  progress_correlation_with_ai_personalization?: Record<string, any>;
  current_goals: any[];
  completed_goals: any[];
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// TIMETABLE TYPES
// =====================================================

export type TimetableEventCategory =
  | 'class'
  | 'study_session'
  | 'exam'
  | 'assignment_due'
  | 'break'
  | 'tutoring'
  | 'extracurricular'
  | 'other';

export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface StudentTimetable {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  event_category: TimetableEventCategory;
  subject?: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  recurrence: RecurrencePattern;
  recurrence_end_date?: string;
  recurrence_days?: number[];
  is_ai_recommended: boolean;
  ai_recommendation_reason?: string;
  optimal_for_student: boolean;
  color_code?: string;
  icon?: string;
  linked_topics?: string[];
  linked_note_ids?: string[];
  linked_flashcard_deck_id?: string;
  study_goal?: string;
  is_completed: boolean;
  completed_at?: string;
  productivity_rating?: number;
  student_notes?: string;
  reminder_minutes_before?: number[];
  reminder_sent: boolean;
  is_cancelled: boolean;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// USAGE AND ANALYTICS TYPES
// =====================================================

export interface StudentUsageLog {
  id: string;
  student_id: string;
  log_date: string;
  subscription_tier: string;
  chat_text_messages_count: number;
  chat_image_messages_count: number;
  chat_video_messages_count: number;
  chat_audio_messages_count: number;
  chat_file_messages_count: number;
  total_chat_messages: number;
  video_call_minutes_used: number;
  video_call_sessions_count: number;
  average_call_quality_score?: number;
  ai_notes_generated: number;
  ai_flashcards_generated: number;
  ai_explanations_generated: number;
  ai_summaries_generated: number;
  images_uploaded: number;
  videos_uploaded: number;
  files_uploaded: number;
  total_storage_used_mb: number;
  text_message_quota?: number;
  image_message_quota?: number;
  video_call_quota_minutes?: number;
  ai_generation_quota?: number;
  storage_quota_mb?: number;
  text_messages_remaining?: number;
  video_minutes_remaining?: number;
  storage_remaining_mb?: number;
  quota_reset_date?: string;
  quota_reset_frequency: 'daily' | 'weekly' | 'monthly';
  upgrade_prompts_shown: number;
  last_upgrade_prompt_at?: string;
  peak_usage_hour?: number;
  most_used_feature?: string;
  usage_patterns: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// MEDIA FILE TYPES
// =====================================================

export type FilePurpose =
  | 'chat_attachment'
  | 'profile_picture'
  | 'note_image'
  | 'note_attachment'
  | 'study_material'
  | 'assignment_submission'
  | 'other';

export type ContentModerationStatus = 'pending' | 'approved' | 'flagged' | 'rejected' | 'reviewing';

export interface StudentMediaFile {
  id: string;
  student_id: string;
  uploaded_by: string;
  file_name: string;
  original_file_name: string;
  file_type: string;
  mime_type: string;
  file_size_bytes: number;
  file_purpose: FilePurpose;
  storage_bucket: string;
  storage_path: string;
  thumbnail_path?: string;
  public_url?: string;
  ai_vision_analysis?: Record<string, any>;
  ai_content_summary?: string;
  extracted_text?: string;
  transcript?: string;
  detected_language?: string;
  tags?: string[];
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_started_at?: string;
  processing_completed_at?: string;
  processing_error?: string;
  moderation_status: ContentModerationStatus;
  moderation_flags?: string[];
  moderation_reviewed_by?: string;
  moderation_reviewed_at?: string;
  moderation_notes?: string;
  access_count: number;
  last_accessed_at?: string;
  download_count: number;
  linked_chat_message_id?: string;
  linked_note_id?: string;
  expiry_date?: string;
  is_archived: boolean;
  archived_at?: string;
  deleted_at?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// AUDIT AND COMPLIANCE TYPES
// =====================================================

export type AuditActionType =
  | 'profile_viewed'
  | 'profile_edited'
  | 'chat_viewed'
  | 'training_request_created'
  | 'training_request_reviewed'
  | 'training_approved'
  | 'training_rejected'
  | 'model_deployed'
  | 'model_archived'
  | 'data_exported'
  | 'data_deleted'
  | 'user_login'
  | 'user_logout'
  | 'permission_changed'
  | 'settings_updated'
  | 'file_uploaded'
  | 'file_deleted'
  | 'admin_action'
  | 'system_event';

export interface AuditLog {
  id: string;
  action_type: AuditActionType;
  actor_id?: string;
  actor_role?: string;
  actor_ip_address?: string;
  target_student_id?: string;
  target_entity_type?: string;
  target_entity_id?: string;
  action_description: string;
  action_metadata?: Record<string, any>;
  changes_made?: Record<string, any>;
  request_path?: string;
  request_method?: string;
  user_agent?: string;
  session_id?: string;
  data_classification?: 'public' | 'internal' | 'confidential' | 'restricted';
  retention_period_days: number;
  must_retain_until?: string;
  was_successful: boolean;
  error_message?: string;
  created_at: string;
}

export interface StudentDataRetention {
  id: string;
  student_id: string;
  chat_retention_days: number;
  media_retention_days: number;
  progress_retention_days: number;
  audit_retention_days: number;
  analytics_consent: boolean;
  ai_training_consent: boolean;
  research_consent: boolean;
  marketing_consent: boolean;
  consent_history: any[];
  last_consent_update?: string;
  data_export_requested: boolean;
  data_export_requested_at?: string;
  data_export_completed_at?: string;
  data_export_url?: string;
  data_deletion_requested: boolean;
  data_deletion_requested_at?: string;
  data_deletion_scheduled_for?: string;
  data_deletion_completed_at?: string;
  created_at: string;
  updated_at: string;
}
