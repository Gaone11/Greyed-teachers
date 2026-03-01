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

interface FamilyUpdate {
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
  familyUpdates: number;
  usedFamilyUpdates: number;
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
}) {
  try {
    // Get the class details to include syllabus information
    const { data: classData } = await supabase
      .from('classes')
      .select('*')
      .eq('id', params.classId)
      .single();
    
    if (!classData) {
      throw new Error("Class not found");
    }
    
    // Generate assessment prompt with the required test information if provided
    let assessmentPrompt = `Create a ${params.assessmentType} for ${classData.grade} ${classData.subject} on the topic of "${params.topic}" with ${params.questionCount} questions at ${params.difficulty} difficulty level.`;

    // Add required test information if provided
    if (params.requiredTest) {
      assessmentPrompt += ` This is for a "${params.requiredTest}" as required by the ${classData.syllabus} syllabus.`;
    }

    // Add knowledgebase context if available
    if (params.kbContext) {
      assessmentPrompt += `\n\nUse the following syllabus reference material to inform the questions:\n${params.kbContext}`;
    }

    // For demonstration, create a basic assessment
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
    
    // In a real implementation, we would generate the actual assessment items here
    // This is a simplified version
    
    return {
      assessment: data[0],
      questions: [] // Questions should be added via the assessment editor UI
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
 * Fetch family updates for a class
 */
export async function fetchFamilyUpdates(userId: string) {
  try {
    const { data, error } = await supabase
      .from('family_updates')
      .select('*')
      .order('week_start', { ascending: false });
    
    if (error) throw error;
    
    return data as FamilyUpdate[];
  } catch (error) {
    throw error;
  }
}

/**
 * Generate a family update
 */
export async function generateFamilyUpdate(params: {
  classId: string;
  weekStart: string;
  topics: string[];
  includeHomework: boolean;
  includeAssessments: boolean;
}) {
  try {
    // For demonstration, create a basic family update
    const htmlContent = generateFamilyUpdateHTML(params);
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
    
    return data[0] as FamilyUpdate;
  } catch (error) {
    throw error;
  }
}

// Helper function to generate family update HTML
function generateFamilyUpdateHTML(params: any) {
  // This would typically generate HTML for the family update
  // Simplified for demonstration
  return `<html><body><h1>Family Update for Week of ${params.weekStart}</h1></body></html>`;
}

/**
 * Send a family update
 */
export async function sendFamilyUpdate(updateId: string) {
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
    
    // In a real implementation, we would send emails to parents
    
    return data[0] as FamilyUpdate;
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
        description: 'Get started by adding a class. Once set up, you can generate lesson plans, assessments, and family updates.',
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
    
    // Get family update statistics
    const { data: familyUpdates } = await supabase
      .from('family_updates')
      .select('id, sent, open_count')
      .eq('class_id', classId);
    
    const familyUpdateStats = {
      total: familyUpdates?.length || 0,
      sent: familyUpdates?.filter(fu => fu.sent).length || 0,
      openRate: familyUpdates && familyUpdates.length > 0
        ? familyUpdates.reduce((sum, fu) => sum + (fu.open_count || 0), 0) / familyUpdates.length
        : 0
    };
    
    // Demo data for now
    return {
      assessments: assessments || [],
      lessonPlanStats,
      familyUpdateStats,
      averageGrade: assessments && assessments.length > 0
        ? Math.round(assessments.reduce((sum: number, a: any) => sum + (a.average_score || 0), 0) / assessments.filter((a: any) => a.average_score != null).length) || 0
        : 0,
      engagementRate: familyUpdateStats.total > 0 ? Math.round(familyUpdateStats.openRate * 10) : 0,
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
    familyUpdates: Infinity,
    usedFamilyUpdates: 0
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

    // Build KB reference section
    const kbSection = params.kbContext
      ? `\n### Syllabus Reference (from Knowledgebase)\n${params.kbContext}\n`
      : '';

    // SA DBE CAPS-compliant lesson plan (13 sections A–M)
    const lessonPlan = `# LESSON PLAN

## A. Identification
| Field | Details |
|-------|---------|
| School | ${className} |
| Teacher | (Teacher name) |
| Subject | ${params.subject} |
| Grade | ${grade} |
| Date | ${lessonDate} |
| Duration | ${duration} minutes |
| Term | ${term} |
| Week | ${week} |
| Curriculum | ${syllabus} |

## B. CAPS Alignment
- **Content Area:** ${params.subject}
- **Topic:** ${params.topic}
- **CAPS Specific Aims:**
  - Aim 1: Knowledge — Learners acquire and apply essential ${params.subject.toLowerCase()} knowledge
  - Aim 2: Skills — Learners develop competence in investigating and problem-solving
  - Aim 3: Application — Learners appreciate the value and application of ${params.subject.toLowerCase()} in daily life
${kbSection}
## C. Learning Objectives
By the end of this lesson, learners will be able to:
- **Knowledge:** Identify and explain key concepts related to ${params.topic}
- **Skills:** Apply knowledge of ${params.topic} to solve problems and complete tasks
- **Values/Attitudes:** Demonstrate an appreciation for the importance of ${params.topic}
- **Success Criteria:** Learners can correctly demonstrate understanding through classwork, oral responses, and written tasks

## D. Prior Knowledge
- **Prerequisites:** Learners should have a basic understanding of ${params.subject.toLowerCase()} concepts covered in previous lessons
- **Baseline Check:** Quick oral Q&A or short activity to assess readiness before introducing new content

## E. Resources / LTSM
- **Teacher Resources:** Teacher guide, CAPS document, lesson notes, digital presentation
- **Learner Resources:** Textbook, DBE Workbook, worksheets, exercise books
- **Other Materials:** Whiteboard, markers, manipulatives/visual aids relevant to ${params.topic}
- **DBE Workbook Reference:** (Insert relevant workbook page references)

## F. Lesson Phases

### Phase 1: Introduction / Mental Maths (~${Math.round(durationNum * 0.10)} min)
- Greet learners and settle the class
- Mental maths or warm-up activity related to ${params.topic}
- Activate prior knowledge through brief Q&A
- Share learning objectives and success criteria with learners

### Phase 2: Explanation / Direct Instruction (~${Math.round(durationNum * 0.25)} min)
- Teacher explains and demonstrates key concepts of ${params.topic}
- Use visual aids, diagrams, or multimedia to support understanding
- Provide worked examples step by step
- Check for understanding through strategic questioning
- Address common misconceptions

### Phase 3: Practice / Learner Activities (~${Math.round(durationNum * 0.35)} min)
- **Guided Practice:** Learners work through examples with teacher support
- **Independent Work:** Learners complete classwork activities individually
- **Group Work:** Collaborative tasks in pairs or small groups where appropriate
- Teacher circulates to provide targeted feedback and support
${focusAreas.length > 0 ? `- **Additional Focus:** ${focusAreas.join(', ')}` : ''}

### Phase 4: Conclusion / Plenary (~${Math.round(durationNum * 0.10)} min)
- Review learning objectives and success criteria
- Summarise key concepts covered
- Address any remaining questions or misconceptions
- Preview next lesson content
- Assign homework

## G. Assessment
- **Informal Assessment:** Observation, oral questioning during lesson, classwork review
- **Formal Assessment:** (As per CAPS assessment programme for the term)
- **Assessment Tools:** Rubric, checklist, or marking memorandum
- **Self-Assessment:** Learners rate their understanding using thumbs up/down or exit tickets

## H. Inclusivity & Differentiation
### Support (Scaffolding)
- Provide word banks, sentence starters, or partially completed examples
- Use visual aids, concrete objects, or simplified language
- Pair struggling learners with stronger peers for support
- Offer additional guided practice time

### Core (Standard Activities)
- All learners complete the standard classwork and homework activities as planned

### Extension (Enrichment)
- Provide higher-order thinking tasks for advanced learners
- Offer application problems that connect ${params.topic} to real-world contexts
- Allow independent investigation or research tasks

## I. Expanded Opportunities
- **Enrichment:** Advanced problems, creative projects, or research for early finishers
- **Remedial:** Additional practice worksheets, small group re-teaching, or peer tutoring for learners who need extra support

## J. Cross-Curricular Links
- Integration with other CAPS subjects where applicable (e.g., ${params.subject} concepts applied in Life Skills, Social Sciences, or Technology)
- Indigenous Knowledge Systems (IKS): Incorporate relevant local or cultural knowledge where appropriate

## K. Homework / Extended Learning
- **Task:** (Describe homework activity related to ${params.topic})
- **Due Date:** (Next lesson date)
- **DBE Workbook Pages:** (Insert relevant pages)

## L. Teacher Reflection (Complete after teaching)
- **Strengths of the lesson:** ___
- **Areas for improvement:** ___
- **Learner engagement:** ___
- **Learners needing additional support:** ___
- **Adjustments for next lesson:** ___

## M. HOD / Principal Sign-off
| Role | Signature | Date |
|------|-----------|------|
| HOD | _______________ | _______ |
| Principal | _______________ | _______ |

---
Generated by GreyEd Teachers | Siyafunda AI`;

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

    // Now save to the lesson_plans table
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