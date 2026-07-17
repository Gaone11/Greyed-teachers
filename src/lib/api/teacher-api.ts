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

interface GenerateLessonPlanParams {
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
}

interface GenerateAssessmentParams {
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
}

function isArabicLanguageSubject(subject: string): boolean {
  const value = (subject || '').toLowerCase();
  return value.includes('arabic') || value.includes('عربي') || value.includes('اللغة العربية');
}

function isLanguageSubject(subject: string): boolean {
  const value = (subject || '').toLowerCase();
  return value.includes(' language') || value === 'french' || value.includes('french');
}

function containsArabicScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text || '');
}

function buildFallbackLessonPlan(params: GenerateLessonPlanParams & {
  lessonDate: string;
  duration: string;
  syllabus: string;
  grade: string;
  className: string;
  term: string;
  week: string;
}) {
  const durationNum = parseInt(params.duration) || 45;
  const introMinutes = Math.max(5, Math.round(durationNum * 0.15));
  const teachingMinutes = Math.max(15, Math.round(durationNum * 0.4));
  const practiceMinutes = Math.max(10, Math.round(durationNum * 0.3));
  const closureMinutes = Math.max(5, durationNum - introMinutes - teachingMinutes - practiceMinutes);
  const bilingualArabic = isArabicLanguageSubject(params.subject);
  const focusAreas = (params.focusAreas || []).filter(Boolean);
  const assessmentSection = params.includeAssessment
    ? `
## Assessment Activities

- **Observation:** Listen for learners using correct vocabulary and complete sentence structures during pair discussion.
- **Quick check:** Ask three learners to restate the main idea in their own words.
- **Exit ticket:** Learners write or say one sentence showing what they understood from ${params.topic}.
- **Success criteria:** Learners can identify the purpose of the listening/speaking task, respond appropriately, and use subject vocabulary with growing confidence.`
    : '';
  const differentiationSection = params.includeDifferentiation
    ? `
## Differentiation Strategies

- **Support:** Provide sentence starters, key vocabulary on the board, and allow learners to rehearse answers with a partner.
- **Core:** Ask learners to give full responses using evidence from the listening or speaking prompt.
- **Extension:** Invite advanced learners to lead a short peer discussion or create a follow-up question for the class.
- **LSEN accommodations:** Use clear instructions, chunked tasks, visual prompts, and extra processing time where needed.`
    : '';
  const resourcesSection = params.includeResources
    ? `
## Required Resources

- Chalkboard or whiteboard.
- Learner notebooks.
- Short oral text, picture prompt, or teacher-prepared speaking prompt.
- Vocabulary list for ${params.topic}.
- Optional audio device if a listening text is used.`
    : '';

  const plan = `# NERDC Lesson Plan: ${params.subject} - ${params.topic}

## Lesson Information

| Field | Details |
| --- | --- |
| Class | ${params.className || 'Selected class'} |
| Grade | ${params.grade || 'Selected grade'} |
| Subject | ${params.subject} |
| Topic | ${params.topic} |
| Curriculum | ${params.syllabus} |
| Term / Week | Term ${params.term}, Week ${params.week} |
| Date | ${params.lessonDate} |
| Duration | ${durationNum} minutes |

## Learning Objectives

By the end of the lesson, learners should be able to:

1. Demonstrate understanding of the main ideas connected to ${params.topic}.
2. Use appropriate vocabulary and sentence structures when responding orally or in writing.
3. Participate in a structured listening and speaking activity with confidence.
4. Reflect on their own response and improve it using teacher or peer feedback.

## NERDC Alignment

This lesson supports ${params.syllabus} curriculum expectations through active participation, subject vocabulary, practical examples, and learner-centred classroom activities.
${focusAreas.length > 0 ? `\nAdditional focus areas: ${focusAreas.join(', ')}.` : ''}

## Lesson Flow

| Phase | Time | Teacher Actions | Learner Actions |
| --- | ---: | --- | --- |
| Introduction | ${introMinutes} min | Greet learners, introduce ${params.topic}, activate prior knowledge, and explain the success criteria. | Answer warm-up questions and predict what the lesson will focus on. |
| Direct Teaching | ${teachingMinutes} min | Model the listening/speaking skill, write key vocabulary, and demonstrate one strong response. | Listen, repeat key vocabulary, and identify what makes the model answer clear. |
| Guided Practice | ${practiceMinutes} min | Give learners a prompt or short oral text, then guide pair or group responses. Circulate and support. | Discuss in pairs, prepare responses, and share answers with the class. |
| Closure | ${closureMinutes} min | Summarise the key points and ask learners to complete an exit response. | Share one learning point and complete the exit ticket. |

## Teacher Script And Questions

- "Today we are focusing on ${params.topic}. Listen carefully for the main idea and the supporting details."
- "What words helped you understand the speaker's message?"
- "Can you improve that answer by adding a reason or example?"
- "How should a respectful listener respond when someone else is speaking?"

Expected learner responses should include a clear main idea, relevant detail, and appropriate language for the context.

${assessmentSection}

${differentiationSection}

${resourcesSection}

## Homework

Learners prepare a short spoken response of 6-8 sentences on ${params.topic}. They should practise speaking clearly, using at least five vocabulary words from the lesson, and bring their written notes to the next class.

## Teacher Reflection

- Which learners participated confidently?
- Which vocabulary or speaking skill needs reteaching?
- What adjustment is needed for the next lesson?

---

Generated in preview-safe mode because the live AI service was unavailable. Review and adapt before classroom use.`;

  if (!bilingualArabic) return plan;

  return `${plan}

## Arabic Version (العربية)

### معلومات الدرس
- المادة: ${params.subject}
- الموضوع: ${params.topic}
- الصف: ${params.grade}
- المدة: ${durationNum} دقيقة
- المنهج: ${params.syllabus}

### أهداف التعلم
1. أن يحدد المتعلم الفكرة الرئيسة المتعلقة بموضوع "${params.topic}".
2. أن يستخدم مفردات عربية مناسبة في الإجابة الشفهية والكتابية.
3. أن يشارك في نشاط لغوي منظم ويقدم إجابات واضحة.

### سير الحصة
- التمهيد (${introMinutes} د): أسئلة سريعة لتنشيط المعرفة السابقة.
- العرض (${teachingMinutes} د): شرح المفردات والنموذج اللغوي.
- التطبيق الموجَّه (${practiceMinutes} د): نشاط ثنائي/جماعي مع متابعة المعلم.
- الخاتمة (${closureMinutes} د): تلخيص الفكرة الرئيسة وتذكرة خروج قصيرة.

### واجب منزلي
اكتب فقرة قصيرة (6-8 جمل) حول "${params.topic}" مستخدماً خمس مفردات جديدة على الأقل.

## English Translation

The Arabic section above mirrors the same lesson expectations in Arabic for classroom delivery.
Use it alongside the English plan for bilingual instruction.`;
}

function buildFallbackAssessment(params: GenerateAssessmentParams & {
  subject: string;
  grade: string;
  className: string;
  syllabus: string;
}) {
  const bilingualArabic = isArabicLanguageSubject(params.subject);
  const count = Math.max(1, Math.min(params.questionCount || 10, 30));
  const questionTypes = ['multiple choice', 'short answer', 'true or false', 'structured response', 'paragraph response'];
  const questions = Array.from({ length: count }, (_, index) => {
    const questionNumber = index + 1;
    const type = questionTypes[index % questionTypes.length];
    const marks = type === 'multiple choice' || type === 'true or false' ? 1 : type === 'paragraph response' ? 5 : 3;

    if (type === 'multiple choice') {
      if (bilingualArabic) {
        return `**${questionNumber}. اختيار من متعدد** [${marks} درجة]\n\nما الخيار الذي يطابق الفكرة الرئيسة لموضوع ${params.topic} في مادة ${params.subject}؟\n\nA. لا يرتبط بالتعلم داخل الصف.\n\nB. يساعد المتعلمين على الفهم والتواصل بوضوح.\n\nC. يجب حفظه فقط دون شرح.\n\nD. يفيد خارج المدرسة فقط.\n\n**English Translation**\n\nWhich option best matches the main idea of ${params.topic} in ${params.subject}?\n\nA. It is unrelated to classroom learning.\n\nB. It helps learners understand and communicate the concept clearly.\n\nC. It should only be memorised without explanation.\n\nD. It is only useful outside school.`;
      }
      return `**${questionNumber}. Multiple choice** [${marks} mark]\n\nWhich option best matches the main idea of ${params.topic} in ${params.subject}?\n\nA. It is unrelated to classroom learning.\n\nB. It helps learners understand and communicate the concept clearly.\n\nC. It should only be memorised without explanation.\n\nD. It is only useful outside school.`;
    }

    if (type === 'true or false') {
      if (bilingualArabic) {
        return `**${questionNumber}. صح أم خطأ** [${marks} درجة]\n\nيتطلب موضوع ${params.topic} من المتعلمين تقديم أسباب لإجاباتهم، وليس إجابات من كلمة واحدة فقط.\n\n**English Translation**\n\n${params.topic} requires learners to give reasons for their answers, not only one-word responses.`;
      }
      return `**${questionNumber}. True or false** [${marks} mark]\n\n${params.topic} requires learners to give reasons for their answers, not only one-word responses.`;
    }

    if (type === 'paragraph response') {
      if (bilingualArabic) {
        return `**${questionNumber}. إجابة فقرة** [${marks} درجات]\n\nاكتب فقرة قصيرة تشرح كيف يمكن استخدام ${params.topic} في موقف صفي أو حياتي واقعي. ضمّن تفصيلين أو مثالين على الأقل.\n\n**English Translation**\n\nWrite a short paragraph explaining how ${params.topic} can be used in a real classroom or everyday situation. Include at least two details or examples.`;
      }
      return `**${questionNumber}. Paragraph response** [${marks} marks]\n\nWrite a short paragraph explaining how ${params.topic} can be used in a real classroom or everyday situation. Include at least two details or examples.`;
    }

    if (type === 'structured response') {
      if (bilingualArabic) {
        return `**${questionNumber}. إجابة منظمة** [${marks} درجات]\n\nاقرأ الموجز الخاص بموضوع ${params.topic}.\n\n(أ) حدّد فكرة رئيسة واحدة. [1]\n\n(ب) اشرح لماذا هذه الفكرة مهمة. [1]\n\n(ج) أعط مثالاً واحداً يدعم شرحك. [1]\n\n**English Translation**\n\nRead the prompt about ${params.topic}.\n\n(a) Identify one key idea. [1]\n\n(b) Explain why that idea matters. [1]\n\n(c) Give one example that supports your explanation. [1]`;
      }
      return `**${questionNumber}. Structured response** [${marks} marks]\n\nRead the prompt about ${params.topic}.\n\n(a) Identify one key idea. [1]\n\n(b) Explain why that idea matters. [1]\n\n(c) Give one example that supports your explanation. [1]`;
    }

    if (bilingualArabic) {
      return `**${questionNumber}. إجابة قصيرة** [${marks} درجات]\n\nعرّف ${params.topic} بكلماتك وقدّم مثالاً واحداً مرتبطاً بمادة ${params.subject}.\n\n**English Translation**\n\nDefine ${params.topic} in your own words and give one example linked to ${params.subject}.`;
    }
    return `**${questionNumber}. Short answer** [${marks} marks]\n\nDefine ${params.topic} in your own words and give one example linked to ${params.subject}.`;
  });

  const totalMarks = questions.reduce((sum, question) => {
    const match = question.match(/\[(\d+) marks?\]/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const memo = params.includeAnswerKey
    ? `
## Memorandum / Answer Key

Use this memorandum as a marking guide and adjust wording where learners show correct understanding.

${questions.map((question, index) => {
  const questionNumber = index + 1;
  if (question.includes('Multiple choice')) return `**${questionNumber}.** B. Award 1 mark for the correct option.`;
  if (question.includes('True or false')) return `**${questionNumber}.** True. Award 1 mark for identifying that reasoned answers are required.`;
  if (question.includes('Paragraph response')) return `**${questionNumber}.** Award up to 5 marks: clear main point [1], two relevant details/examples [2], correct subject vocabulary [1], coherent paragraph structure [1].`;
  if (question.includes('Structured response')) return `**${questionNumber}.** Award 1 mark each for a relevant key idea, a valid explanation, and a suitable example.`;
  return `**${questionNumber}.** Award marks for an accurate definition and a relevant example linked to ${params.subject}.`;
}).join('\n\n')}

## Marking Notes

- Accept equivalent wording where the learner demonstrates correct understanding.
- Give partial credit for accurate ideas even if grammar or spelling is imperfect, unless language accuracy is the assessed outcome.
- For extended answers, reward clarity, relevance, and evidence.`
    : '';

  const assessment = `# ${params.title}

## Assessment Header

| Field | Details |
| --- | --- |
| Class | ${params.className || 'Selected class'} |
| Grade | ${params.grade || 'Selected grade'} |
| Subject | ${params.subject} |
| Topic | ${params.topic} |
| Assessment Type | ${params.assessmentType} |
| Difficulty | ${params.difficulty} |
| Curriculum | ${params.syllabus} |
| Total Marks | ${totalMarks} |
${params.requiredTest ? `| Required Test | ${params.requiredTest} |\n` : ''}
## Instructions To Learners

${bilingualArabic
  ? `1. أجب أولاً باللغة العربية ثم راجع الترجمة الإنجليزية.
2. اقرأ كل سؤال بعناية قبل الإجابة.
3. اكتب إجاباتك بوضوح ورقّمها بشكل صحيح.
4. استخدم أمثلة من الدرس حيثما أمكن.

English Translation:
1. Answer in Arabic first, then use the English translation for support.
2. Read each question carefully before answering.
3. Write neatly and number your answers correctly.
4. Use examples from class where possible.`
  : `1. Read each question carefully before answering.
2. Write neatly and number your answers correctly.
3. Use examples from class where possible.
4. Answer in full sentences for short and paragraph questions.`}

## Questions

${questions.join('\n\n')}

${memo}

---

Generated in preview-safe mode because the live AI service was unavailable. Review and adapt before classroom use.`;
  return assessment;
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
export async function generateAssessment(params: GenerateAssessmentParams) {
  try {
    // Get the class details
    let classData: any = {};
    try {
      const { data, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', params.classId)
        .single();

      if (classError) throw classError;
      classData = data || {};
    } catch (error) {
      console.warn('Using assessment form data because class lookup failed.', error);
    }

    const grade = params.grade || classData.grade || '';
    const subject = params.subject || classData.subject || '';
    const className = params.className || classData.name || '';
    const syllabus = classData.syllabus || 'NERDC';
    const bilingualArabic = isArabicLanguageSubject(subject);

    // Build the AI prompt
    const extras: string[] = [];
    if (params.requiredTest) extras.push(`This is for a "${params.requiredTest}" as required by the ${syllabus} syllabus.`);
    if (params.includeAnswerKey) extras.push('Include a complete answer key with marking memorandum and explanations for each question at the end.');
    if (params.difficulty === 'mixed') extras.push('Include a mix of easy, medium, and hard questions progressing in difficulty. Label the Bloom\'s Taxonomy level for each question.');

    const kbSection = params.kbContext
      ? `\nUse the following syllabus reference material to inform the assessment content:\n${params.kbContext}\n`
      : '';
    const languageSection = bilingualArabic
      ? `
CRITICAL LANGUAGE RULES (Arabic Language Subject):
- Write the assessment in Arabic first.
- Immediately provide an English translation for every section and question.
- Use clear labels: "Arabic (العربية)" and "English Translation".
- Keep mark allocations and numbering identical across both language versions.`
      : isLanguageSubject(subject)
      ? `
CRITICAL LANGUAGE RULES (Language Subject):
- Write the full assessment in the selected subject language first.
- Immediately provide an English translation for every section and question.
- Keep mark allocations and numbering identical across both language versions.`
      : '';

    const aiMessage = `Create a complete ${syllabus}-aligned ${params.assessmentType} assessment with the following details:
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
${languageSection}
CRITICAL CURRICULUM RULES:
- Align strictly to ${syllabus}. Do not switch to CAPS or any other curriculum unless explicitly requested.
- Use terminology and outcomes appropriate for ${syllabus}, ${grade}, and ${subject}.
- If a required detail is missing, make a labeled assumption that remains consistent with ${syllabus}.

Generate the full assessment in markdown format with these sections:
1. Assessment header (subject, grade, date, duration, total marks, instructions to learners)
2. All ${params.questionCount} questions with mark allocations — use a variety of question types appropriate for the assessment type (multiple choice, short answer, match columns, true/false, structured questions, essay/paragraph questions as appropriate)
3. Each question must be specific to "${params.topic}" with real content — not generic placeholders
4. Questions must progress from lower-order to higher-order thinking (Bloom's Taxonomy)
5. Include clear mark allocations per question and sub-question (e.g., [2 marks])
6. Total marks must add up correctly
${params.includeAnswerKey ? '7. Include a complete MEMORANDUM / ANSWER KEY section at the end with expected answers and marking guidelines' : ''}

Make all content specific to ${grade} ${subject} level and aligned with ${syllabus} curriculum expectations.`;

    const fallbackAssessment = () => buildFallbackAssessment({
      ...params,
      subject,
      grade,
      className,
      syllabus,
    });

    let assessmentMarkdown = '';
    let generatedBy: 'ai' | 'fallback' = 'ai';

    try {
      // Call the el-ai-teacher edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User must be logged in to use the live AI assessment service');
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate assessment');
      }

      const aiData = await response.json();
      const candidate = aiData.response || fallbackAssessment();
      if (bilingualArabic && !containsArabicScript(candidate)) {
        throw new Error('Arabic output validation failed: AI response did not include Arabic script.');
      }
      assessmentMarkdown = candidate;
    } catch (error) {
      console.warn('Live AI assessment generation failed. Using fallback assessment.', error);
      assessmentMarkdown = fallbackAssessment();
      generatedBy = 'fallback';
    }

    // Save to the assessments table
    let assessment = null;
    try {
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
          meta: {
            subject,
            grade,
            className,
            syllabus,
            generatedBy,
            hasKbContext: !!params.kbContext,
            requiredTest: params.requiredTest || null,
          },
        }])
        .select();

      if (error) throw error;
      assessment = data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.warn('Assessment generated but could not be saved to Supabase.', error);
    }

    return {
      assessment,
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
 * Generate a NERDC-compliant lesson plan
 */
export async function generateLessonPlan(params: GenerateLessonPlanParams) {
  try {
    // Get class details for context
    let classData: any = {};
    try {
      const { data, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', params.classId)
        .single();

      if (classError) throw classError;
      classData = data || {};
    } catch (error) {
      console.warn('Using lesson plan form data because class lookup failed.', error);
    }

    const today = new Date();
    const lessonDate = params.date || today.toISOString().split('T')[0];
    const duration = params.duration || params.lessonLength || '45';
    const durationNum = parseInt(duration);
    const syllabus = params.syllabus || classData.syllabus || 'NERDC';
    const grade = params.grade || classData.grade || '';
    const className = params.className || classData.name || '';
    const bilingualArabic = isArabicLanguageSubject(params.subject);
    const term = params.term || '1';
    const week = params.week || '1';
    const focusAreas = params.focusAreas || [];

    // Build the AI prompt for lesson plan generation
    const extras: string[] = [];
    if (params.includeAssessment) extras.push('Include detailed assessment activities with rubric or memorandum.');
    if (params.includeDifferentiation) extras.push('Include differentiation strategies for struggling, core, and advanced learners, as well as LSEN accommodations.');
    if (params.includeResources) extras.push('Include specific textbook references, NERDC curriculum references where available, and required teaching materials.');
    if (focusAreas.length > 0) extras.push(`Additional focus areas to incorporate: ${focusAreas.join(', ')}.`);

    const kbSection = params.kbContext
      ? `\nUse the following syllabus reference material to inform the lesson content:\n${params.kbContext}\n`
      : '';
    const languageSection = bilingualArabic
      ? `
CRITICAL LANGUAGE RULES (Arabic Language Subject):
- Write the lesson plan in Arabic first.
- Immediately provide an English translation for every main section.
- Use clear labels: "Arabic (العربية)" and "English Translation".
- Keep learning objectives, activities, and assessment expectations equivalent in both languages.`
      : isLanguageSubject(params.subject)
      ? `
CRITICAL LANGUAGE RULES (Language Subject):
- Write the full lesson plan in the selected subject language first.
- Immediately provide an English translation for every main section.
- Keep objectives, activities, and assessment expectations equivalent in both language versions.`
      : '';

    const fallbackPlan = () => buildFallbackLessonPlan({
      ...params,
      lessonDate,
      duration,
      syllabus,
      grade,
      className,
      term,
      week,
    });

    const aiMessage = `Create a complete, ready-to-teach ${syllabus}-aligned lesson plan with these details:
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
${languageSection}
CRITICAL INSTRUCTIONS:
- Align strictly to ${syllabus}. Do not switch to CAPS or any other curriculum unless explicitly requested.
- Write ALL content as if you are the teacher preparing this exact lesson for "${className}". Every activity, question, and resource must be specific to ${params.topic}.
- Do NOT use placeholder text in parentheses like (Teacher name), (Insert page), or (Describe activity). Every section must be immediately usable in the classroom.
- For lesson phases, write out the actual activities step by step: what the teacher says, what questions to ask (with expected answers), what learners do, and what they produce.
- Write real learning objectives specific to ${params.topic} — not generic statements like "acquire knowledge".
- Write a concrete homework task with actual instructions and examples.
- Time allocations across all phases must add up to ${duration} minutes.
- Generate the full lesson plan in markdown format with all NERDC-relevant lesson planning sections.`;

    let lessonPlan = '';
    let generatedBy: 'ai' | 'fallback' = 'ai';

    try {
      // Call the el-ai-teacher edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User must be logged in to use the live AI lesson-plan service');
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }

      const aiData = await response.json();
      const candidate = aiData.response || fallbackPlan();
      if (bilingualArabic && !containsArabicScript(candidate)) {
        throw new Error('Arabic output validation failed: AI response did not include Arabic script.');
      }
      lessonPlan = candidate;
    } catch (error) {
      console.warn('Live AI lesson-plan generation failed. Using fallback plan.', error);
      lessonPlan = fallbackPlan();
      generatedBy = 'fallback';
    }

    // Create metadata
    const meta = {
      objectives: [
        `Understand the key concepts of ${params.subject} - ${params.topic}`,
        "Apply theoretical knowledge to practical examples",
        "Develop critical thinking skills through analysis"
      ],
      materials: [
        "Textbook",
        "NERDC curriculum guide",
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
      hasKbContext: !!params.kbContext,
      generatedBy
    };

    // Save to the lesson_plans table
    let savedPlan = null;
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert([
          {
            class_id: params.classId,
            date: lessonDate,
            topic: `${params.subject} - ${params.topic}`,
            md_path: lessonPlan,
            meta: meta,
            status: 'draft'
          }
        ])
        .select();

      if (error) throw error;
      savedPlan = data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.warn('Lesson plan generated but could not be saved to Supabase.', error);
    }

    return {
      markdown: lessonPlan,
      meta,
      savedPlan
    };
  } catch (error) {
    throw error;
  }
}
