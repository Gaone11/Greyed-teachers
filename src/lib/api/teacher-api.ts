import { supabase } from '../supabase';

// Define the teacher context interface
interface TeacherContext {
  subjectArea?: string;
  gradeLevel?: string;
  examBoard?: string;
  classSize?: number;
  specialConsiderations?: string[];
  className?: string;
}

// Define the conversation history interface
interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// Define interfaces for class and other data structures
interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  student_count: number;
  description: string;
  created_at: string;
  syllabus?: string;
}

interface LessonPlan {
  id: string;
  class_id: string;
  date: string;
  topic: string;
  md_path: string;
  meta: any;
  status: 'draft' | 'ready' | 'taught';
  created_at: string;
}

interface Assessment {
  id: string;
  class_id: string;
  title: string;
  status: 'draft' | 'published' | 'completed';
  generated: boolean;
  assessment_type: string;
  difficulty: string;
  topic: string;
  question_count: number;
  average_score?: number;
  submission_rate?: string;
  created_at: string;
}

interface TutorUpdate {
  id: string;
  class_id: string;
  week_start: string;
  html_path: string;
  sent: boolean;
  sent_date?: string;
  open_count: number;
  created_at: string;
}

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  school?: string;
  title?: string;
  subjects?: string[];
  bio?: string;
  updated_at?: string;
}

interface TeacherLimits {
  lessonPlans: number;
  usedLessonPlans: number;
  assessments: number;
  usedAssessments: number;
  tutorUpdates: number;
  usedTutorUpdates: number;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  classReminders: boolean;
  assessmentDeadlines: boolean;
}

/**
 * Fetch all classes for a teacher
 */
export async function fetchTeacherClasses(userId?: string) {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const teacherId = userId || user.id;
    
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Class[];
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch a single class by ID
 */
export async function fetchClassById(classId: string) {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();
    
    if (error) throw error;
    
    return data as Class;
  } catch (error) {
    throw error;
  }
}

/**
 * Update a class
 */
export async function updateClass(classId: string, classData: Partial<Class>) {
  try {
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', classId)
      .select();
    
    if (error) throw error;
    
    return data[0] as Class;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new class
 */
export async function createClass(classData: Omit<Class, 'id' | 'created_at'>) {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Ensure the teacher_id is set to the current user
    const classDataWithTeacher = {
      ...classData,
      teacher_id: user.id
    };
    
    const { data, error } = await supabase
      .from('classes')
      .insert([classDataWithTeacher])
      .select();
    
    if (error) throw error;
    
    return data[0] as Class;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a class
 */
export async function deleteClass(classId: string) {
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch lesson plans for a class
 */
export async function fetchLessonPlans(classId: string) {
  try {
    const { data, error } = await supabase
      .from('lesson_plans')
      .select('*')
      .eq('class_id', classId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data as LessonPlan[];
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch assessments for a class
 */
export async function fetchAssessments(userId?: string, classId?: string) {
  try {
    let query = supabase
      .from('assessments')
      .select('*');
    
    // Add class filter if provided
    if (classId) {
      query = query.eq('class_id', classId);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as Assessment[];
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch all assessments for a teacher
 */
export async function fetchAllTeacherAssessments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        classes (name)
      `)
      .in('class_id', supabase.from('classes').select('id').eq('teacher_id', userId))
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format the data to include className
    const formattedData = data.map(assessment => ({
      ...assessment,
      className: assessment.classes?.name || 'Unknown'
    }));
    
    return formattedData;
  } catch (error) {
    throw error;
  }
}

/**
 * Generate an assessment
 */
export async function generateAssessment(params: {
  classId: string;
  title: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  assessmentType: string;
  includeAnswerKey?: boolean;
  requiredTest?: string;
  kbContext?: string;
  subject?: string;
  grade?: string;
  className?: string;
}) {
  try {
    // Get the class details
    const { data: classData } = await supabase
      .from('classes')
      .select('*')
      .eq('id', params.classId)
      .single();

    if (!classData) {
      throw new Error("Class not found");
    }

    const grade = params.grade || classData.grade || '';
    const subject = params.subject || classData.subject || '';
    const className = params.className || classData.name || '';
    const syllabus = classData.syllabus || 'CAPS';

    // Build the AI prompt
    const extras: string[] = [];
    if (params.requiredTest) extras.push(`This is for a "${params.requiredTest}" as required by the ${syllabus} syllabus.`);
    if (params.includeAnswerKey) extras.push('Include a complete answer key with marking memorandum and explanations for each question at the end.');
    if (params.difficulty === 'mixed') extras.push('Include a mix of easy, medium, and hard questions progressing in difficulty. Label the Bloom\'s Taxonomy level for each question.');

    const kbSection = params.kbContext
      ? `\nUse the following syllabus reference material to inform the assessment content:\n${params.kbContext}\n`
      : '';

    const aiMessage = `Create a complete CAPS-aligned ${params.assessmentType} assessment with the following details:
- Subject: ${subject}
- Topic: ${params.topic}
- Grade: ${grade}
- Class: ${className}
- Number of questions: ${params.questionCount}
- Difficulty: ${params.difficulty}
- Assessment type: ${params.assessmentType}
- Curriculum: ${syllabus}
${extras.length > 0 ? '\nAdditional requirements:\n' + extras.map(e => `- ${e}`).join('\n') : ''}
${kbSection}
Generate the full assessment in markdown format with these sections:
1. Assessment header (subject, grade, date, duration, total marks, instructions to learners)
2. All ${params.questionCount} questions with mark allocations — use a variety of question types appropriate for the assessment type (multiple choice, short answer, match columns, true/false, structured questions, essay/paragraph questions as appropriate)
3. Each question must be specific to "${params.topic}" with real content — not generic placeholders
4. Questions must progress from lower-order to higher-order thinking (Bloom's Taxonomy)
5. Include clear mark allocations per question and sub-question (e.g., [2 marks])
6. Total marks must add up correctly
${params.includeAnswerKey ? '7. Include a complete MEMORANDUM / ANSWER KEY section at the end with expected answers and marking guidelines' : ''}

Make all content specific to ${grade} ${subject} level and aligned with CAPS requirements.`;

    // Call the el-ai-teacher edge function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User must be logged in to generate assessments');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/el-ai-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message: aiMessage,
        conversationHistory: [],
        teacherContext: {
          subjectArea: subject,
          gradeLevel: grade,
          examBoard: syllabus,
          classSize: classData.class_size || undefined,
          className: className,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate assessment');
    }

    const aiData = await response.json();
    const assessmentMarkdown = aiData.response;

    // Save to the assessments table
    const { data, error } = await supabase
      .from('assessments')
      .insert([{
        class_id: params.classId,
        title: params.title,
        status: 'draft',
        generated: true,
        assessment_type: params.assessmentType,
        difficulty: params.difficulty,
        topic: params.topic,
        question_count: params.questionCount,
      }])
      .select();

    if (error) throw error;

    return {
      assessment: data[0],
      markdown: assessmentMarkdown,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch assessment items for an assessment
 */
export async function fetchAssessmentItems(assessmentId: number) {
  try {
    const { data, error } = await supabase
      .from('assessment_items')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Save assessment items
 */
export async function saveAssessmentItems(assessmentId: number, items: { question: string; correct_answer: string; metadata?: any }[]) {
  try {
    const rows = items.map(item => ({
      assessment_id: assessmentId,
      question: item.question,
      correct_answer: item.correct_answer,
      metadata: item.metadata || {}
    }));

    const { data, error } = await supabase
      .from('assessment_items')
      .insert(rows)
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch tutor updates for a class
 */
export async function fetchTutorUpdates(userId: string) {
  try {
    const { data, error } = await supabase
      .from('family_updates')
      .select('*')
      .order('week_start', { ascending: false });

    if (error) throw error;

    return data as TutorUpdate[];
  } catch (error) {
    throw error;
  }
}

/**
 * Generate a tutor update
 */
export async function generateTutorUpdate(params: {
  classId: string;
  weekStart: string;
  topics: string[];
  includeHomework: boolean;
  includeAssessments: boolean;
}) {
  try {
    // For demonstration, create a basic tutor update
    const htmlContent = generateTutorUpdateHTML(params);
    const path = `family_updates/${params.classId}/${Date.now()}.html`;

    // Save to storage (placeholder)
    // In a real implementation, we would save the HTML to storage

    // Save to database
    const { data, error } = await supabase
      .from('family_updates')
      .insert([{
        class_id: params.classId,
        week_start: params.weekStart,
        html_path: path,
        sent: false,
      }])
      .select();

    if (error) throw error;

    return data[0] as TutorUpdate;
  } catch (error) {
    throw error;
  }
}

// Helper function to generate tutor update HTML
function generateTutorUpdateHTML(params: any) {
  // This would typically generate HTML for the tutor update
  // Simplified for demonstration
  return `<html><body><h1>Tutor Update for Week of ${params.weekStart}</h1></body></html>`;
}

/**
 * Send a tutor update
 */
export async function sendTutorUpdate(updateId: string) {
  try {
    // Mark as sent
    const { data, error } = await supabase
      .from('family_updates')
      .update({
        sent: true,
        sent_date: new Date().toISOString()
      })
      .eq('id', updateId)
      .select();

    if (error) throw error;

    // In a real implementation, we would send notifications

    return data[0] as TutorUpdate;
  } catch (error) {
    throw error;
  }
}

/**
 * Get teacher dashboard data
 */
export async function getTeacherDashboardData(userId?: string) {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const teacherId = userId || user.id;
    
    // Get classes count
    const { count: classesCount } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId);
    
    // First, fetch the class IDs
    const { data: classIds } = await supabase
      .from('classes')
      .select('id')
      .eq('teacher_id', teacherId);
    
    // Extract the IDs into an array
    const classIdArray = classIds ? classIds.map(c => c.id) : [];
    
    // Get lesson plans count using the array of IDs
    const { count: lessonPlansCount } = await supabase
      .from('lesson_plans')
      .select('*', { count: 'exact', head: true })
      .in('class_id', classIdArray);
    
    // Get assessments count using the array of IDs
    const { count: assessmentsCount } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .in('class_id', classIdArray);
    
    // Get recent classes
    const { data: recentClasses } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Get today's schedule from timetable_entries
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const { data: timetableEntries } = await supabase
      .from('timetable_entries')
      .select('*')
      .eq('user_id', teacherId)
      .gte('start_time', todayStart.toISOString())
      .lte('start_time', todayEnd.toISOString())
      .order('start_time', { ascending: true });

    const todaySchedule = (timetableEntries || []).map((entry: any, index: number) => ({
      id: index + 1,
      classId: entry.id?.toString() || '',
      className: entry.title || 'Untitled',
      startTime: new Date(entry.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      endTime: entry.end_time ? new Date(entry.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '',
      room: entry.type || ''
    }));

    // Generate contextual AI suggestions based on actual data
    const aiSuggestions = [];

    if ((lessonPlansCount || 0) === 0 && (classesCount || 0) > 0) {
      aiSuggestions.push({
        id: 1,
        title: 'Generate Your First Lesson Plan',
        description: 'You have classes but no lesson plans yet. Let AI help you create engaging plans aligned with your curriculum.',
        actionLink: '/teachers/lesson-planner',
        actionText: 'Generate Plan',
        subscriptionRequired: false
      });
    }

    if ((assessmentsCount || 0) === 0 && (classesCount || 0) > 0) {
      aiSuggestions.push({
        id: 2,
        title: 'Create Your First Assessment',
        description: 'Build custom assessments tailored to your classes and curriculum to check student understanding.',
        actionLink: '/teachers/assessments',
        actionText: 'Create Assessment',
        subscriptionRequired: false
      });
    }

    if ((classesCount || 0) === 0) {
      aiSuggestions.push({
        id: 3,
        title: 'Add Your First Class',
        description: 'Get started by adding a class. Once set up, you can generate lesson plans, assessments, and tutor updates.',
        actionLink: '/teachers/classes',
        actionText: 'Add Class',
        subscriptionRequired: false
      });
    }
    
    return {
      classes: recentClasses || [],
      stats: {
        classesCount: classesCount || 0,
        lessonPlansCount: lessonPlansCount || 0,
        assessmentsCount: assessmentsCount || 0
      },
      todaySchedule,
      aiSuggestions
    };
  } catch {
    // Return default dashboard data instead of throwing error
    return {
      classes: [],
      stats: {
        classesCount: 0,
        lessonPlansCount: 0,
        assessmentsCount: 0
      },
      todaySchedule: [],
      aiSuggestions: []
    };
  }
}

/**
 * Get class analytics
 */
export async function getClassAnalytics(classId: string) {
  try {
    // Get assessment performance
    const { data: assessments } = await supabase
      .from('assessments')
      .select('id, title, average_score, submission_rate')
      .eq('class_id', classId)
      .eq('status', 'completed');
    
    // Get lesson plan statistics
    const { data: lessonPlans } = await supabase
      .from('lesson_plans')
      .select('id, status')
      .eq('class_id', classId);
    
    const lessonPlanStats = {
      total: lessonPlans?.length || 0,
      draft: lessonPlans?.filter(lp => lp.status === 'draft').length || 0,
      ready: lessonPlans?.filter(lp => lp.status === 'ready').length || 0,
      taught: lessonPlans?.filter(lp => lp.status === 'taught').length || 0,
    };
    
    // Get tutor update statistics
    const { data: tutorUpdates } = await supabase
      .from('family_updates')
      .select('id, sent, open_count')
      .eq('class_id', classId);

    const tutorUpdateStats = {
      total: tutorUpdates?.length || 0,
      sent: tutorUpdates?.filter(tu => tu.sent).length || 0,
      openRate: tutorUpdates && tutorUpdates.length > 0
        ? tutorUpdates.reduce((sum, tu) => sum + (tu.open_count || 0), 0) / tutorUpdates.length
        : 0
    };

    // Demo data for now
    return {
      assessments: assessments || [],
      lessonPlanStats,
      tutorUpdateStats,
      averageGrade: assessments && assessments.length > 0
        ? Math.round(assessments.reduce((sum: number, a: any) => sum + (a.average_score || 0), 0) / assessments.filter((a: any) => a.average_score != null).length) || 0
        : 0,
      engagementRate: tutorUpdateStats.total > 0 ? Math.round(tutorUpdateStats.openRate * 10) : 0,
      homeworkCompletion: assessments && assessments.length > 0
        ? Math.round(assessments.reduce((sum: number, a: any) => sum + (parseInt(a.submission_rate) || 0), 0) / assessments.length) || 0
        : 0,
      knowledgeGaps: [] as string[]
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a user has an active subscription
 * Platform is now free for all users — always returns true
 */
export async function hasActiveSubscription(userId?: string) {
  return true;
}

/**
 * Get teacher feature limits
 * Platform is now free for all users — unlimited everything
 */
export async function getTeacherLimits(teacherId: string): Promise<TeacherLimits> {
  return {
    lessonPlans: Infinity,
    usedLessonPlans: 0,
    assessments: Infinity,
    usedAssessments: 0,
    tutorUpdates: Infinity,
    usedTutorUpdates: 0
  };
}

/**
 * Get teacher profile
 */
export async function getTeacherProfile(userId?: string): Promise<TeacherProfile | null> {
  try {
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const id = userId || user.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data as TeacherProfile || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Update teacher profile
 */
export async function updateTeacherProfile(userId: string, profile: Partial<TeacherProfile>) {
  try {
    // Always set updated_at on save
    const updateData = {
      ...profile,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error('Profile not found. Please refresh and try again.');
    }

    // Also sync first_name/last_name to auth user metadata so NavBar stays current
    if (profile.first_name || profile.last_name) {
      await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
        }
      });
    }
    
    return data[0] as TeacherProfile;
  } catch (error) {
    throw error;
  }
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(userId: string, settings: NotificationSettings) {
  try {
    const { data, error } = await supabase
      .from('teacher_preferences')
      .update({
        notification_settings: settings
      })
      .eq('teacher_id', userId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Generate a CAPS-compliant lesson plan (SA DBE format)
 */
export async function generateLessonPlan(params: {
  classId: string;
  subject: string;
  topic: string;
  syllabus?: string;
  date?: string;
  duration?: string;
  focusAreas?: string[];
  includeAssessment?: boolean;
  includeDifferentiation?: boolean;
  includeResources?: boolean;
  className?: string;
  grade?: string;
  term?: string;
  week?: string;
  kbContext?: string;
  // Legacy params (kept for backward compat)
  lessonLength?: string;
  teachingStyle?: string;
  includeActivities?: boolean;
  includeAssessments?: boolean;
}) {
  try {
    // Get class details for context
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', params.classId)
      .single();

    if (classError) throw classError;

    const today = new Date();
    const lessonDate = params.date || today.toISOString().split('T')[0];
    const duration = params.duration || params.lessonLength || '45';
    const durationNum = parseInt(duration);
    const syllabus = params.syllabus || classData.syllabus || 'CAPS';
    const grade = params.grade || classData.grade || '';
    const className = params.className || classData.name || '';
    const term = params.term || '1';
    const week = params.week || '1';
    const focusAreas = params.focusAreas || [];

    // Build the AI prompt for lesson plan generation
    const extras: string[] = [];
    if (params.includeAssessment) extras.push('Include detailed assessment activities with rubric or memorandum.');
    if (params.includeDifferentiation) extras.push('Include differentiation strategies for struggling, core, and advanced learners, as well as LSEN accommodations.');
    if (params.includeResources) extras.push('Include specific textbook references, DBE workbook pages, and required teaching materials.');
    if (focusAreas.length > 0) extras.push(`Additional focus areas to incorporate: ${focusAreas.join(', ')}.`);

    const kbSection = params.kbContext
      ? `\nUse the following syllabus reference material to inform the lesson content:\n${params.kbContext}\n`
      : '';

    const aiMessage = `Create a complete, ready-to-teach CAPS-aligned lesson plan with these details:
- Subject: ${params.subject}
- Topic: ${params.topic}
- Grade: ${grade}
- Class: ${className}
- Date: ${lessonDate}
- Duration: ${duration} minutes
- Term: ${term}
- Week: ${week}
- Curriculum: ${syllabus}
${extras.length > 0 ? '\nAdditional requirements:\n' + extras.map(e => `- ${e}`).join('\n') : ''}
${kbSection}
CRITICAL INSTRUCTIONS:
- Write ALL content as if you are the teacher preparing this exact lesson for "${className}". Every activity, question, and resource must be specific to ${params.topic}.
- Do NOT use placeholder text in parentheses like (Teacher name), (Insert page), or (Describe activity). Every section must be immediately usable in the classroom.
- For lesson phases, write out the actual activities step by step: what the teacher says, what questions to ask (with expected answers), what learners do, and what they produce.
- Write real learning objectives specific to ${params.topic} — not generic statements like "acquire knowledge".
- Write a concrete homework task with actual instructions and examples.
- Time allocations across all phases must add up to ${duration} minutes.
- Generate the full lesson plan in markdown format with all CAPS-required sections.`;

    // Call the el-ai-teacher edge function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User must be logged in to generate lesson plans');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/el-ai-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message: aiMessage,
        conversationHistory: [],
        teacherContext: {
          subjectArea: params.subject,
          gradeLevel: grade,
          examBoard: syllabus,
          classSize: classData.class_size || undefined,
          className: className,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate lesson plan');
    }

    const aiData = await response.json();
    const lessonPlan = aiData.response;

    // Create metadata
    const meta = {
      objectives: [
        `Understand the key concepts of ${params.subject} - ${params.topic}`,
        "Apply theoretical knowledge to practical examples",
        "Develop critical thinking skills through analysis"
      ],
      materials: [
        "Textbook",
        "DBE Workbook",
        "Whiteboard and markers",
        "Student worksheets",
        "Digital presentation"
      ],
      duration: durationNum,
      difficulty: "medium",
      subject: params.subject,
      topic: params.topic,
      grade: grade,
      term: term,
      week: week,
      focusAreas: focusAreas,
      syllabus: syllabus,
      hasKbContext: !!params.kbContext
    };

    // Save to the lesson_plans table
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert([
        {
          class_id: params.classId,
          date: today.toISOString().split('T')[0],
          topic: `${params.subject} - ${params.topic}`,
          md_path: lessonPlan,
          meta: meta,
          status: 'draft'
        }
      ])
      .select();

    if (error) throw error;

    return {
      markdown: lessonPlan,
      meta,
      savedPlan: data && data.length > 0 ? data[0] : null
    };
  } catch (error) {
    throw error;
  }
}