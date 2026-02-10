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
  requiredTest?: string; // Add required test parameter
}) {
  try {
    // Check if the user has reached their assessment limit (free tier)
    const isSubscribed = await hasActiveSubscription();
    
    if (!isSubscribed) {
      const { data: classData } = await supabase
        .from('classes')
        .select('teacher_id')
        .eq('id', params.classId)
        .single();
      
      const teacherLimits = await getTeacherLimits(classData.teacher_id);
      
      if (teacherLimits.usedAssessments >= teacherLimits.assessments) {
        throw new Error(`You've reached your limit of ${teacherLimits.assessments} free assessments. Please upgrade for unlimited assessments.`);
      }
    }
    
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
      questions: generateMockQuestions(params.questionCount, params.topic, params.requiredTest)
    };
  } catch (error) {
    throw error;
  }
}

// Helper function to generate mock questions for demo purposes
function generateMockQuestions(count: number, topic: string, requiredTest?: string) {
  const questions = [];
  
  // Use the required test info in the questions if provided
  const testContext = requiredTest ? ` for the ${requiredTest}` : '';
  
  for (let i = 0; i < count; i++) {
    const questionType = i % 3 === 0 ? 'short-answer' : i % 3 === 1 ? 'multiple-choice' : 'true-false';
    let question = {
      question: `Question ${i + 1}: ${generateRelevantQuestionText(i, topic, questionType)}${testContext}`,
      type: questionType,
      options: [] as string[],
      answer: '',
      explanation: `This question tests understanding of ${getQuestionConcept(i, topic)} within the topic of ${topic}.`
    };
    
    if (questionType === 'multiple-choice') {
      question.options = generateOptionsForTopic(topic, i);
      question.answer = question.options[1];
    } else if (questionType === 'true-false') {
      question.question = `Question ${i + 1}: True or False - ${generateTrueFalseStatement(topic, i)}${testContext}`;
      question.answer = 'True';
    } else {
      question.answer = generateAnswerForTopic(topic, i);
    }
    
    questions.push(question);
  }
  
  return questions;
}

// Generate a relevant question based on the topic and question index
function generateRelevantQuestionText(index: number, topic: string, type: string): string {
  // Create different question patterns based on index to add variety
  const questionPatterns = [
    `What is the primary principle behind ${topic}?`,
    `How does ${topic} relate to real-world applications?`,
    `Explain the significance of ${topic} in the broader curriculum context.`,
    `What are the key components of ${topic}?`,
    `Describe the process involved in ${topic}.`,
    `What historical developments led to our current understanding of ${topic}?`,
    `Compare and contrast different approaches to ${topic}.`,
    `How would you demonstrate knowledge of ${topic} in a practical scenario?`,
    `What challenges might arise when implementing concepts from ${topic}?`,
    `How can we measure or evaluate success in ${topic}?`
  ];
  
  // Select question pattern based on index
  return questionPatterns[index % questionPatterns.length];
}

// Generate realistic-looking options for multiple choice questions
function generateOptionsForTopic(topic: string, index: number): string[] {
  const baseOptions = [
    `The primary mechanism that enables ${topic} to function`,
    `The fundamental theory behind ${topic} and its applications`,
    `A secondary effect that occurs during ${topic} processes`,
    `An unrelated concept often confused with ${topic}`
  ];
  
  // Add variety by cycling through different option sets
  const alternateOptions = [
    `Historical development of ${topic}`,
    `Modern applications of ${topic}`,
    `Theoretical framework supporting ${topic}`,
    `Common misconceptions about ${topic}`
  ];
  
  return index % 2 === 0 ? baseOptions : alternateOptions;
}

// Generate a true/false statement related to the topic
function generateTrueFalseStatement(topic: string, index: number): string {
  const trueFalseStatements = [
    `${topic} is fundamentally based on empirical observations rather than theoretical models`,
    `${topic} has significant applications across multiple disciplines`,
    `Understanding ${topic} requires prerequisite knowledge of basic principles`,
    `${topic} represents a paradigm shift from conventional approaches`,
    `${topic} continues to evolve with new research and technological developments`
  ];
  
  return trueFalseStatements[index % trueFalseStatements.length];
}

// Generate a realistic-looking answer for short-answer questions
function generateAnswerForTopic(topic: string, index: number): string {
  const answerTemplates = [
    `${topic} is fundamentally characterized by its systematic approach to problem-solving through applied methodology. Key aspects include theoretical framework, practical application, and evaluative criteria.`,
    `The core principles of ${topic} revolve around structured analysis and evidence-based reasoning. A comprehensive understanding requires familiarity with both historical context and current applications.`,
    `${topic} encompasses multiple interconnected concepts that work together to form a cohesive framework. Successful application requires attention to detail and systematic implementation of key principles.`,
    `When analyzing ${topic}, it's essential to consider both theoretical underpinnings and practical implications. The most effective approaches integrate multiple perspectives and methodologies.`
  ];
  
  return answerTemplates[index % answerTemplates.length];
}

// Get a specific concept related to the topic for explanations
function getQuestionConcept(index: number, topic: string): string {
  const concepts = [
    "foundational principles",
    "applied methodology",
    "theoretical frameworks",
    "analytical approaches",
    "practical implementation",
    "historical context",
    "modern developments",
    "structural components",
    "functional elements",
    "systemic relationships"
  ];
  
  return concepts[index % concepts.length];
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
    // Check if the user is not subscribed and has reached the family update limit (free tier)
    const isSubscribed = await hasActiveSubscription();
    
    if (!isSubscribed) {
      const { data: classData } = await supabase
        .from('classes')
        .select('teacher_id')
        .eq('id', params.classId)
        .single();
      
      const teacherLimits = await getTeacherLimits(classData.teacher_id);
      
      if (teacherLimits.usedFamilyUpdates >= teacherLimits.familyUpdates) {
        throw new Error(`You've reached your limit of ${teacherLimits.familyUpdates} free family updates. Please upgrade for unlimited updates.`);
      }
    }
    
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
    
    // For demo purposes, add some example schedule and AI suggestions
    const todaySchedule = [
      {
        id: 1,
        classId: recentClasses?.[0]?.id || 'class-1',
        className: recentClasses?.[0]?.name || 'Mathematics',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101'
      },
      {
        id: 2,
        classId: recentClasses?.[1]?.id || 'class-2',
        className: recentClasses?.[1]?.name || 'Physics',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Room 203'
      }
    ];
    
    const aiSuggestions = [
      {
        id: 1,
        title: 'Generate Weekly Lesson Plans',
        description: 'Create a week of lesson plans for your Mathematics class aligned with your curriculum.',
        actionLink: '/teachers/lesson-planner',
        actionText: 'Generate Plans',
        subscriptionRequired: false
      },
      {
        id: 2,
        title: 'Personalized Assessment',
        description: 'Create custom assessments based on recent lessons to check student understanding.',
        actionLink: '/teachers/assessments',
        actionText: 'Create Assessment',
        subscriptionRequired: false
      },
      {
        id: 3,
        title: 'Advanced Analytics',
        description: 'Get AI insights on student performance patterns and personalized teaching suggestions.',
        actionLink: '/teachers/analytics',
        actionText: 'View Insights',
        subscriptionRequired: true
      }
    ];
    
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
      averageGrade: 78,
      engagementRate: 85,
      homeworkCompletion: 92,
      knowledgeGaps: ['algebraic expressions', 'fractions', 'geometric transformations']
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(userId?: string) {
  return true;
}

/**
 * Get teacher feature limits
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
 * Generate a lesson plan
 */
export async function generateLessonPlan(params: {
  classId: string;
  subject: string;
  topic: string;
  lessonLength: string;
  teachingStyle: string;
  focusAreas: string[];
  includeActivities: boolean;
  includeAssessments: boolean;
  syllabus?: string; // New syllabus parameter
}) {
  try {
    // Get class details for context
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', params.classId)
      .single();
    
    if (classError) throw classError;
    
    // Check if the user has reached their lesson plan limit (free tier)
    const isSubscribed = await hasActiveSubscription();
    
    if (!isSubscribed) {
      const teacherLimits = await getTeacherLimits(classData.teacher_id);
      
      if (teacherLimits.usedLessonPlans >= teacherLimits.lessonPlans) {
        throw new Error(`You've reached your limit of ${teacherLimits.lessonPlans} free lesson plans. Please upgrade for unlimited plans.`);
      }
    }
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // For demonstration, generate a detailed lesson plan without asterisks
    const lessonPlan = `# Lesson Plan: ${params.subject} - ${params.topic}
      
## Class Information
- **Class:** ${classData.name}
- **Grade Level:** ${classData.grade}
- **Subject Area:** ${params.subject}
- **Topic:** ${params.topic}
- **Curriculum:** ${params.syllabus || classData.syllabus || 'General'}
- **Duration:** ${params.lessonLength} minutes
- **Teaching Approach:** ${params.teachingStyle === 'theoretical' ? 'Theory-focused' : params.teachingStyle === 'practical' ? 'Activity-based' : 'Balanced approach'}

## Learning Objectives
By the end of this lesson, students will be able to:
1. **Knowledge:** Explain key concepts and terminology related to ${params.topic}
2. **Comprehension:** Describe the relationship between different elements of ${params.topic}
3. **Application:** Apply principles of ${params.topic} to solve relevant problems
4. **Analysis:** Analyze examples to identify patterns and relationships
5. **Evaluation:** Evaluate the effectiveness of different approaches to ${params.topic}

## Prior Knowledge Required
- Basic understanding of ${params.subject} fundamentals
- Familiarity with relevant vocabulary and concepts from previous lessons
- Experience with basic ${params.subject.toLowerCase()} skills

## Resources and Materials Needed
- Student textbooks or reference materials
- Digital presentation/slides
- Whiteboard and markers
- Student worksheets and activity handouts
- Manipulatives or visual aids relevant to ${params.topic}
- Assessment materials (exit tickets, quiz sheets, etc.)

## Detailed Lesson Structure

### 1. Introduction/Warm-up (${Math.round(parseInt(params.lessonLength) * 0.1)} minutes)
- **Engagement Hook:** Begin with an intriguing question, demonstration, or real-world scenario related to ${params.topic}
- **Activate Prior Knowledge:** Quick review of prerequisite concepts through brief Q&A
- **Share Learning Objectives:** Clearly communicate what students will know and be able to do by the end of the lesson
- **Success Criteria:** Share how students will know they've achieved the learning objectives

${params.includeActivities ? `### Group Activities (${Math.round(parseInt(params.lessonLength) * 0.25)} minutes)
- **Collaborative Investigation:** Students work in small groups to explore aspects of ${params.topic}
- **Think-Pair-Share:** Partners discuss key questions before sharing with the class
- **Problem-Solving Challenge:** Groups apply concepts to solve real-world problems
- **Gallery Walk:** Student groups create visual representations of key concepts and rotate to view others' work
- **Peer Teaching:** Students take turns explaining concepts to their group members` : ''}

### 2. Direct Instruction (${Math.round(parseInt(params.lessonLength) * 0.25)} minutes)
- **Key Concept Presentation:** Clear explanation of the main principles of ${params.topic}
- **Visual Support:** Use of diagrams, charts, or multimedia to illustrate concepts
- **Guided Examples:** Teacher demonstrates problem-solving techniques or applications
- **Check for Understanding:** Strategic questioning to gauge student comprehension
- **Clarification:** Address common misconceptions about ${params.topic}

### 3. Student Practice (${Math.round(parseInt(params.lessonLength) * 0.25)} minutes)
- **Guided Practice:** Students work through examples with teacher support
- **Independent Work:** Individual application of learned concepts 
- **Differentiated Tasks:** Tiered activities to support diverse learning needs
- **Teacher Circulation:** Provide targeted feedback and support as students work

${params.includeAssessments ? `### 4. Assessment (${Math.round(parseInt(params.lessonLength) * 0.15)} minutes)
- **Formative Assessment:** Strategic questioning to check understanding
- **Exit Tickets:** Brief written responses to key questions
- **Quick Quiz:** Short assessment of key concepts covered
- **Self-Assessment:** Students reflect on their understanding using success criteria
- **Peer Review:** Students provide structured feedback on each other's work` : ''}

### 5. Plenary/Conclusion (${Math.round(parseInt(params.lessonLength) * 0.1)} minutes)
- **Review Learning Objectives:** Refer back to objectives and success criteria
- **Summarize Key Points:** Consolidate main concepts through teacher or student summary
- **Address Misconceptions:** Clarify any confusion identified during the lesson
- **Preview Next Lesson:** Brief introduction to upcoming content
- **Reflection Question:** Pose a thought-provoking question related to the topic

## Differentiation
### Support Strategies
- **Scaffolding:** Provide sentence starters, word banks, or partially completed examples
- **Visual Aids:** Additional diagrams, charts, or visual representations
- **Guided Notes:** Fill-in-the-blank notes for students who struggle with note-taking
- **Small Group Instruction:** Targeted support for students needing additional help
- **Modified Tasks:** Simplified versions of activities with essential content preserved

### Extension Challenges
- **Higher-Order Questions:** Analysis, evaluation, and creation tasks
- **Application Projects:** Opportunities to apply learning in new contexts
- **Independent Research:** Guided exploration of related topics
- **Peer Teaching:** Opportunities to explain concepts to classmates
- **Complex Problem-Solving:** More advanced applications of the concepts learned

## Assessment Opportunities
- **Diagnostic:** Initial questions to assess prior knowledge
- **Formative:** Observations, questioning, student work during the lesson
- **Summative:** Exit tickets, mini-quizzes, completed tasks
- **Self/Peer Assessment:** Opportunities for students to evaluate their own or peers' work
- **Key Questions:** Prepare specific questions targeting different levels of understanding

## ${params.syllabus || classData.syllabus ? `${params.syllabus || classData.syllabus} Curriculum Alignment` : 'Curriculum Alignment'}
${params.syllabus === 'IGCSE' || classData.syllabus === 'Cambridge IGCSE' ? '- Aligns with Cambridge IGCSE syllabus sections 3.1, 3.2' :
  params.syllabus === 'GCSE' || classData.syllabus === 'Cambridge GCSE' ? '- Aligns with AQA/Edexcel GCSE requirements for this topic' :
  params.syllabus === 'A Level' || classData.syllabus === 'Cambridge A Level' ? '- Covers core A Level concepts in this subject area' :
  params.syllabus === 'BGCSE' || classData.syllabus === 'Botswana BGCSE' ? '- Follows Botswana GCSE curriculum guidelines' :
  params.syllabus === 'JCE' || classData.syllabus === 'Botswana JSE' ? '- Meets Junior Certificate Examination standards' :
  '- Generic curriculum alignment'}
- Supports development of key skills required for examinations
- Provides foundation for advanced topics

## Notes
Teaching style prioritizes ${params.teachingStyle === 'balanced' ? 'a balanced approach between theory and practical application' : params.teachingStyle === 'theoretical' ? 'theoretical understanding with examples' : 'hands-on learning through activities'}.

${params.focusAreas && params.focusAreas.length > 0 ? `Focus areas included: ${params.focusAreas.join(', ')}` : ''} 

---
## Reflection Notes
-(Complete after teaching the lesson)
- What could be improved?
- Which students need additional support?
- How will this inform the next lesson?
Generated by GreyEd Teachers | El AI-Teacher`;

    // Create metadata
    const meta = {
      objectives: [
        `Understand the key concepts of ${params.subject} - ${params.topic}`,
        "Apply theoretical knowledge to practical examples",
        "Develop critical thinking skills through analysis"
      ],
      materials: [
        "Textbook, Chapter 4",
        "Whiteboard and markers",
        "Student worksheets",
        "Digital presentation"
      ],
      duration: parseInt(params.lessonLength),
      difficulty: "medium",
      style: params.teachingStyle,
      subject: params.subject,
      focusAreas: params.focusAreas || [],
      syllabus: params.syllabus || classData.syllabus || null
    };

    // Now save to the lesson_plans table
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert([
        {
          class_id: params.classId,
          date: today.toISOString().split('T')[0], // Format as YYYY-MM-DD
          topic: `${params.subject} - ${params.topic}`,
          md_path: lessonPlan, // Store the markdown directly in this field
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