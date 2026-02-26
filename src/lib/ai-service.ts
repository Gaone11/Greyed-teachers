import { supabase } from './supabase';

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

/**
 * Send a message to El AI Teacher Assistant and get a response
 */
export async function sendTeacherMessage(
  message: string, 
  conversationHistory: ConversationEntry[] = [],
  teacherContext?: TeacherContext
): Promise<string> {
  try {
    // Get the Supabase URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    // Get the current user's session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be logged in to send messages');
    }
    
    // Call the Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/el-ai-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        message,
        conversationHistory,
        teacherContext
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from AI assistant');
    }
    
    const data = await response.json();
    
    if (!data.response) {
      throw new Error('No response content returned from assistant');
    }
    
    return data.response;
  } catch (error) {
    // Return a user-friendly error message
    if (error instanceof Error) {
      return `I'm sorry, I encountered an error while processing your request: ${error.message}. Please try again in a moment.`;
    } else {
      return "I'm sorry, I encountered an unexpected error while processing your request. Please try again in a moment.";
    }
  }
}

/**
 * Generate a lesson plan using El AI Teacher
 */
export async function generateLessonPlan(params: {
  topic: string;
  gradeLevel: string;
  subjectArea: string;
  examBoard?: string;
  duration: number;
  teachingStyle?: string;
  focusAreas?: string[];
}) {
  try {
    const teacherContext = {
      subjectArea: params.subjectArea,
      gradeLevel: params.gradeLevel,
      examBoard: params.examBoard
    };
    
    // Format a structured prompt for lesson plan generation
    const prompt = `
      Please create a detailed lesson plan for teaching "${params.topic}" to ${params.gradeLevel} ${params.subjectArea} students.
      
      Details:
      - Duration: ${params.duration} minutes
      - Teaching style: ${params.teachingStyle || 'balanced'}
      ${params.examBoard ? `- Exam board: ${params.examBoard}` : ''}
      ${params.focusAreas && params.focusAreas.length > 0 ? `- Focus areas: ${params.focusAreas.join(', ')}` : ''}
      
      Please format the lesson plan using the GreyEd template with sections: 
      - Standards & Alignment
      - Essential Question
      - Learning Outcomes
      - Materials
      - Lesson Flow (with timing)
      - Differentiation
      - Assessment
    `;
    
    const lessonPlan = await sendTeacherMessage(prompt, [], teacherContext);
    return lessonPlan;
  } catch (error) {
    throw error;
  }
}

/**
 * Generate an assessment using El AI Teacher
 */
export async function generateAssessment(params: {
  topic: string;
  gradeLevel: string;
  subjectArea: string;
  questionCount: number;
  difficulty: string;
  assessmentType: string;
}) {
  try {
    const teacherContext = {
      subjectArea: params.subjectArea,
      gradeLevel: params.gradeLevel
    };
    
    // Format a structured prompt for assessment generation
    const prompt = `
      Please create a ${params.assessmentType} assessment for ${params.gradeLevel} ${params.subjectArea} students on the topic of "${params.topic}".
      
      Details:
      - Number of questions: ${params.questionCount}
      - Difficulty level: ${params.difficulty}
      
      Please include a mix of question types (multiple choice, short answer, etc.) and provide an answer key.
    `;
    
    const assessment = await sendTeacherMessage(prompt, [], teacherContext);
    return assessment;
  } catch (error) {
    throw error;
  }
}