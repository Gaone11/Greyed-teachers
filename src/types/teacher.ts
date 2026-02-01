// Teacher types
export interface Class {
  id: string;
  teacher_id: string;
  name: string;
  subject: string;
  grade: string;
  student_count?: number;
  created_at: string;
  description?: string;
}

export interface LessonPlan {
  id: string;
  class_id: string;
  date: string;
  topic: string;
  md_path: string;
  meta: {
    objectives?: string[];
    materials?: string[];
    duration?: number;
    difficulty?: string;
  };
  status: 'draft' | 'ready' | 'taught';
  created_at: string;
}

export interface Resource {
  id: string;
  class_id: string;
  path: string;
  tags: string[];
  uploaded_at: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
}

export interface Assessment {
  id: string;
  class_id: string;
  title: string;
  generated: boolean;
  status: 'draft' | 'published' | 'completed';
  created_at: string;
  question_count?: number;
  average_score?: number;
  submission_rate?: string;
  assessment_type?: string;
  difficulty?: string;
  topic?: string;
}

export interface AssessmentItem {
  id: string;
  assessment_id: string;
  question: string;
  correct_answer: string;
  metadata: {
    type: 'multiple-choice' | 'short-answer' | 'essay' | 'true-false';
    options?: string[];
    explanation?: string;
    difficulty?: string;
    points?: number;
  };
}

export interface FamilyUpdate {
  id: string;
  class_id: string;
  week_start: string;
  html_path: string;
  sent: boolean;
  sent_date?: string;
  open_count?: number;
  created_at: string;
}

export interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  school?: string;
  title?: string;
  subjects?: string[];
  bio?: string;
  avatar_url?: string;
}

export interface TeacherPreferences {
  teacher_id: string;
  notification_settings: {
    emailDaily: boolean;
    emailWeekly: boolean;
    pushNotifications: boolean;
    familyUpdateReminders: boolean;
    assessmentSubmissions: boolean;
    questionAlerts: boolean;
  };
}