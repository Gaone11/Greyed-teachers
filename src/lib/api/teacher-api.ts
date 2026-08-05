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

type LanguageCode = 'none' | 'arabic' | 'french' | 'hausa' | 'igbo' | 'yoruba';

interface LanguageProfile {
  code: LanguageCode;
  bilingual: boolean;
  englishName: string;
  localLabel: string;
  localHeader: string;
  scriptRegex?: RegExp;
}

function getLanguageProfile(subject: string): LanguageProfile {
  const value = (subject || '').toLowerCase();

  if (value.includes('arabic') || value.includes('عربي') || value.includes('اللغة العربية')) {
    return {
      code: 'arabic',
      bilingual: true,
      englishName: 'Arabic',
      localLabel: 'العربية',
      localHeader: 'Arabic (العربية)',
      scriptRegex: /[\u0600-\u06FF]/,
    };
  }
  if (value.includes('french') || value.includes('francais') || value.includes('français')) {
    return {
      code: 'french',
      bilingual: true,
      englishName: 'French',
      localLabel: 'Français',
      localHeader: 'French (Français)',
    };
  }
  if (value.includes('hausa')) {
    return {
      code: 'hausa',
      bilingual: true,
      englishName: 'Hausa',
      localLabel: 'Harshen Hausa',
      localHeader: 'Hausa (Harshen Hausa)',
    };
  }
  if (value.includes('igbo')) {
    return {
      code: 'igbo',
      bilingual: true,
      englishName: 'Igbo',
      localLabel: 'Asụsụ Igbo',
      localHeader: 'Igbo (Asụsụ Igbo)',
    };
  }
  if (value.includes('yoruba') || value.includes('yorùbá')) {
    return {
      code: 'yoruba',
      bilingual: true,
      englishName: 'Yoruba',
      localLabel: 'Èdè Yorùbá',
      localHeader: 'Yoruba (Èdè Yorùbá)',
    };
  }
  return {
    code: 'none',
    bilingual: false,
    englishName: '',
    localLabel: '',
    localHeader: '',
  };
}

function hasRequiredLanguageSignals(text: string, profile: LanguageProfile): boolean {
  if (!profile.bilingual) return true;
  const content = text || '';
  if (!content.includes('English Translation')) return false;
  if (!content.includes(profile.localLabel) && !content.includes(profile.localHeader)) return false;
  if (profile.scriptRegex && !profile.scriptRegex.test(content)) return false;
  return true;
}

function localizeAssessmentQuestion(
  profile: LanguageProfile,
  type: string,
  marks: number,
  topic: string,
  subject: string
): string {
  if (profile.code === 'arabic') {
    if (type === 'multiple choice') {
      return `اختيار من متعدد [${marks} درجة]\n\nما الخيار الذي يطابق الفكرة الرئيسة لموضوع ${topic} في مادة ${subject}؟\n\nA. لا يرتبط بالتعلم داخل الصف.\n\nB. يساعد المتعلمين على الفهم والتواصل بوضوح.\n\nC. يجب حفظه فقط دون شرح.\n\nD. يفيد خارج المدرسة فقط.`;
    }
    if (type === 'true or false') {
      return `صح أم خطأ [${marks} درجة]\n\nيتطلب موضوع ${topic} من المتعلمين تقديم أسباب لإجاباتهم، وليس إجابات من كلمة واحدة فقط.`;
    }
    if (type === 'paragraph response') {
      return `إجابة فقرة [${marks} درجات]\n\nاكتب فقرة قصيرة تشرح كيف يمكن استخدام ${topic} في موقف صفي أو حياتي واقعي. ضمّن تفصيلين أو مثالين على الأقل.`;
    }
    if (type === 'structured response') {
      return `إجابة منظمة [${marks} درجات]\n\nاقرأ الموجز الخاص بموضوع ${topic}.\n\n(أ) حدّد فكرة رئيسة واحدة. [1]\n\n(ب) اشرح لماذا هذه الفكرة مهمة. [1]\n\n(ج) أعط مثالاً واحداً يدعم شرحك. [1]`;
    }
    return `إجابة قصيرة [${marks} درجات]\n\nعرّف ${topic} بكلماتك وقدّم مثالاً واحداً مرتبطاً بمادة ${subject}.`;
  }

  if (profile.code === 'french') {
    if (type === 'multiple choice') {
      return `Choix multiple [${marks} points]\n\nQuelle option correspond le mieux a l'idee principale de ${topic} en ${subject}?\n\nA. Ce n'est pas lie a l'apprentissage en classe.\n\nB. Cela aide les apprenants a comprendre et a communiquer clairement.\n\nC. Il faut seulement memoriser sans explication.\n\nD. C'est utile seulement hors de l'ecole.`;
    }
    if (type === 'true or false') return `Vrai ou faux [${marks} point]\n\n${topic} demande aux apprenants de donner des raisons pour leurs reponses, pas seulement des reponses en un mot.`;
    if (type === 'paragraph response') return `Reponse redigee [${marks} points]\n\nEcris un court paragraphe expliquant comment ${topic} peut etre utilise en classe ou dans la vie quotidienne. Donne au moins deux details ou exemples.`;
    if (type === 'structured response') return `Reponse structuree [${marks} points]\n\nLis le texte sur ${topic}.\n\n(a) Identifie une idee principale. [1]\n\n(b) Explique pourquoi cette idee est importante. [1]\n\n(c) Donne un exemple qui soutient ton explication. [1]`;
    return `Reponse courte [${marks} points]\n\nDefinis ${topic} avec tes propres mots et donne un exemple lie a ${subject}.`;
  }

  if (profile.code === 'hausa') {
    if (type === 'multiple choice') return `Zabi na yawa [${marks} maki]\n\nWanne zabi ne ya fi dacewa da babban ra'ayi na ${topic} a ${subject}?\n\nA. Ba ya da alaka da koyo a aji.\n\nB. Yana taimaka wa dalibai su fahimta su kuma yi bayani a sarari.\n\nC. A haddace kawai ba tare da bayani ba.\n\nD. Yana da amfani ne kawai a wajen makaranta.`;
    if (type === 'true or false') return `Gaskiya ko Karya [${marks} maki]\n\n${topic} yana bukatar dalibai su bayar da dalilai ga amsoshinsu, ba kalma daya kawai ba.`;
    if (type === 'paragraph response') return `Amsar sakin layi [${marks} maki]\n\nRubuta gajeren sakin layi kan yadda za a yi amfani da ${topic} a aji ko rayuwa ta yau da kullum. Ka bayar da misalai biyu ko fiye.`;
    if (type === 'structured response') return `Amsa mai tsari [${marks} maki]\n\nKaranta rubutun game da ${topic}.\n\n(a) Fadi babban ra'ayi daya. [1]\n\n(b) Bayyana dalilin da yasa wannan ra'ayin yake da muhimmanci. [1]\n\n(c) Bayar da misali daya da ke goyon bayan bayaninka. [1]`;
    return `Amsa a takaice [${marks} maki]\n\nBayyana ${topic} da kalmominka sannan ka kawo misali daya da ya shafi ${subject}.`;
  }

  if (profile.code === 'igbo') {
    if (type === 'multiple choice') return `Nhoro otutu [${marks} points]\n\nKedu nhọrọ kacha kwekọọ na isi echiche nke ${topic} na ${subject}?\n\nA. O nweghị njikọ na mmụta n'ụlọ akwụkwọ.\n\nB. O na-enyere ụmụakwụkwọ nghọta na nkwurịta okwu doo anya.\n\nC. A ga-ebu ya n'isi naanị, enweghị nkọwa.\n\nD. Ọ bara uru naanị n'èzí ụlọ akwụkwọ.`;
    if (type === 'true or false') return `Eziokwu ma obu Ugha [${marks} point]\n\n${topic} chọrọ ka ụmụakwụkwọ nye ihe kpatara azịza ha, ọ bụghị naanị okwu otu.`;
    if (type === 'paragraph response') return `Aziza paragraf [${marks} points]\n\nDee paragraf mkpirikpi na-akọwa otu esi eji ${topic} n'ụlọ akwụkwọ ma ọ bụ ndụ kwa ụbọchị. Tinye ihe atụ ma ọ bụ nkọwa abụọ ma ọ bụ karịa.`;
    if (type === 'structured response') return `Aziza ahaziri [${marks} points]\n\nGụọ ihe ederede gbasara ${topic}.\n\n(a) Kọwaa otu isi echiche. [1]\n\n(b) Kọwaa ihe mere echiche ahụ ji dị mkpa. [1]\n\n(c) Nye otu ihe atụ na-akwado nkọwa gị. [1]`;
    return `Aziza mkpirikpi [${marks} points]\n\nKọwaa ${topic} n'okwu gị ma nye otu ihe atụ metụtara ${subject}.`;
  }

  if (profile.code === 'yoruba') {
    if (type === 'multiple choice') return `Yiyan opolopo [${marks} ami]\n\nEwo ni yiyan to ba koko oro ${topic} mu julo ninu ${subject}?\n\nA. Ko ni ibatan si eko inu kilasi.\n\nB. O n ran awon akeko lowo lati ni oye ati lati so ni kedere.\n\nC. Ki a kan ko o mo lai se alaye.\n\nD. O wulo nikan ni ita ile-iwe.`;
    if (type === 'true or false') return `Otito tabi Iro [${marks} ami]\n\n${topic} nilo ki awon akeko fun ni idi fun idahun won, kii se oro kan pere.`;
    if (type === 'paragraph response') return `Idahun paragirafi [${marks} ami]\n\nKo paragirafi kukuru kan lati salaye bi a se le lo ${topic} ninu kilasi tabi igbesi aye ojoojumọ. Fi alaye tabi apeere meji kun un.`;
    if (type === 'structured response') return `Idahun eto [${marks} ami]\n\nKa akosile nipa ${topic}.\n\n(a) So ero pataki kan. [1]\n\n(b) Salaye idi ti ero naa fi se pataki. [1]\n\n(c) Fun apeere kan to n se atilẹyin alaye re. [1]`;
    return `Idahun kukuru [${marks} ami]\n\nSalaye ${topic} ni oro tirẹ ki o si fun apeere kan to ni ibatan si ${subject}.`;
  }

  return '';
}

function localizeFallbackLessonSection(
  profile: LanguageProfile,
  params: GenerateLessonPlanParams & {
    duration: string;
    syllabus: string;
    grade: string;
  },
  timings: {
    introMinutes: number;
    teachingMinutes: number;
    practiceMinutes: number;
    closureMinutes: number;
  }
): string {
  const durationNum = parseInt(params.duration) || 45;

  if (profile.code === 'arabic') {
    return `## Arabic Language Subject Version (العربية)

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
- التمهيد (${timings.introMinutes} د): أسئلة سريعة لتنشيط المعرفة السابقة.
- العرض (${timings.teachingMinutes} د): شرح المفردات والنموذج اللغوي.
- التطبيق الموجَّه (${timings.practiceMinutes} د): نشاط ثنائي/جماعي مع متابعة المعلم.
- الخاتمة (${timings.closureMinutes} د): تلخيص الفكرة الرئيسة وتذكرة خروج قصيرة.

### واجب منزلي
اكتب فقرة قصيرة (6-8 جمل) حول "${params.topic}" مستخدماً خمس مفردات جديدة على الأقل.`;
  }

  if (profile.code === 'french') {
    return `## French Language Subject Version (Français)

### Informations Sur La Leçon
- Matière: ${params.subject}
- Sujet: ${params.topic}
- Classe: ${params.grade}
- Durée: ${durationNum} minutes
- Programme: ${params.syllabus}

### Objectifs D'Apprentissage
1. Les apprenants identifient l'idée principale liée à "${params.topic}".
2. Les apprenants utilisent un vocabulaire français approprié à l'oral et à l'écrit.
3. Les apprenants participent à une activité de langue structurée et donnent des réponses claires.

### Déroulement De La Leçon
- Introduction (${timings.introMinutes} min): questions rapides pour activer les connaissances antérieures.
- Enseignement (${timings.teachingMinutes} min): explication du vocabulaire et modélisation d'une réponse forte.
- Pratique guidée (${timings.practiceMinutes} min): activité en binômes ou en groupes avec accompagnement de l'enseignant.
- Conclusion (${timings.closureMinutes} min): résumé de l'idée principale et court billet de sortie.

### Devoir
Écris un paragraphe court de 6 à 8 phrases sur "${params.topic}" en utilisant au moins cinq nouveaux mots de vocabulaire.`;
  }

  if (profile.code === 'hausa') {
    return `## Hausa Language Subject Version (Harshen Hausa)

### Bayanin Darasi
- Darasi: ${params.subject}
- Maudu'i: ${params.topic}
- Aji: ${params.grade}
- Tsawon lokaci: minti ${durationNum}
- Manhaja: ${params.syllabus}

### Manufofin Koyo
1. Dalibai su gano babban ra'ayi da ya shafi "${params.topic}".
2. Dalibai su yi amfani da kalmomin Hausa da suka dace a magana da rubutu.
3. Dalibai su shiga aikin harshe mai tsari kuma su bayar da amsoshi a sarari.

### Gudanar Da Darasi
- Gabatarwa (${timings.introMinutes} min): tambayoyi gajeru don tuna abin da aka sani.
- Koyarwa kai tsaye (${timings.teachingMinutes} min): bayanin sababbin kalmomi da nuna misalin amsa mai kyau.
- Aiki tare da jagora (${timings.practiceMinutes} min): aiki a biyu-biyu ko rukuni tare da taimakon malami.
- Kammalawa (${timings.closureMinutes} min): takaita babban ra'ayi da rubuta gajeren abin da aka koya.

### Aikin Gida
Rubuta gajeren sakin layi na jimloli 6-8 game da "${params.topic}" ta amfani da sababbin kalmomi akalla biyar.`;
  }

  if (profile.code === 'igbo') {
    return `## Igbo Language Subject Version (Asụsụ Igbo)

### Ozi Banyere Ihe Ọmụmụ
- Isiokwu: ${params.subject}
- Ihe a na-amụ: ${params.topic}
- Klas: ${params.grade}
- Oge: nkeji ${durationNum}
- Usoro ọmụmụ: ${params.syllabus}

### Ebumnuche Ọmụmụ
1. Ụmụakwụkwọ ga-amata isi echiche metụtara "${params.topic}".
2. Ụmụakwụkwọ ga-eji okwu Igbo kwesịrị ekwesị kwuo ma dee azịza.
3. Ụmụakwụkwọ ga-esonye n'ọrụ asụsụ ahaziri nke ọma ma nye azịza doro anya.

### Usoro Ihe Ọmụmụ
- Mbido (${timings.introMinutes} min): ajụjụ ngwa ngwa iji kpọlite ihe ụmụakwụkwọ marala.
- Nkuzi kpọmkwem (${timings.teachingMinutes} min): ịkọwa okwu ọhụrụ na igosi ezigbo azịza.
- Omume nduzi (${timings.practiceMinutes} min): ọrụ abụọ abụọ ma ọ bụ otu, onye nkuzi na-enyere ha aka.
- Mmechi (${timings.closureMinutes} min): nchịkọta isi echiche na obere ọrụ mmechi.

### Ọrụ Ụlọ
Dee paragraf mkpirikpi nke ahịrịokwu 6-8 gbasara "${params.topic}" jiri opekata mpe okwu ọhụrụ ise.`;
  }

  if (profile.code === 'yoruba') {
    return `## Yoruba Language Subject Version (Èdè Yorùbá)

### Alaye Ẹkọ
- Koko-ẹkọ: ${params.subject}
- Akori: ${params.topic}
- Kilasi: ${params.grade}
- Akoko: iṣẹju ${durationNum}
- Eto ẹkọ: ${params.syllabus}

### Àfojúsùn Ẹkọ
1. Awọn akẹkọ yoo mọ ero pataki ti o ni ibatan si "${params.topic}".
2. Awọn akẹkọ yoo lo ọrọ Yorùbá to yẹ ninu sisọ ati kikọ.
3. Awọn akẹkọ yoo kopa ninu iṣẹ ede to ni eto ki wọn si fun ni idahun kedere.

### Ilana Ẹkọ
- Ibẹrẹ (${timings.introMinutes} min): awọn ibeere kukuru lati ranti ohun ti wọn ti mọ.
- Ikọni taara (${timings.teachingMinutes} min): ṣalaye awọn ọrọ tuntun ki o fi apẹẹrẹ idahun to dara han.
- Iṣe pẹlu itọsọna (${timings.practiceMinutes} min): iṣẹ tọkọtaya tabi ẹgbẹ pẹlu atilẹyin olukọ.
- Ipari (${timings.closureMinutes} min): ṣoki ero pataki ati tikẹti ijade kukuru.

### Iṣẹ Ile
Kọ paragiraafi kukuru ti gbolohun 6-8 lori "${params.topic}" ki o lo o kere ju ọrọ tuntun marun.`;
  }

  return `## ${profile.englishName} Language Subject Version (${profile.localLabel})

Prepare and teach this language-subject section in ${profile.englishName}, using the same lesson details, objectives, activities, assessment expectations, and homework task from the English plan.`;
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
  const languageProfile = getLanguageProfile(params.subject);
  const focusAreas = (params.focusAreas || []).filter(Boolean);
  const subTopic = focusAreas[0] || `Key ideas and classroom applications of ${params.topic}`;
  const averageAge = params.grade?.toLowerCase().includes('jss') ? '9-13 years' : 'Appropriate to selected grade';
  const assessmentSection = params.includeAssessment
    ? `
## Assessment / Evaluation Notes

- Observe learners as they explain ${params.topic} in their own words.
- Check whether learners can identify the main idea, give relevant examples, and use correct subject vocabulary.
- Mark short written responses for accuracy, clarity, and correct use of lesson terms.`
    : '';
  const differentiationSection = params.includeDifferentiation
    ? `
## Differentiation / Remedial Support

- Support: Give key words, sentence starters, and extra examples to learners who need help.
- Core: Ask learners to answer the evaluation questions independently.
- Extension: Ask fast finishers to create one extra example, diagram, or question based on ${params.topic}.
- LSEN: Use short instructions, visual prompts, peer support, and extra response time where needed.`
    : '';
  const resourcesSection = params.includeResources
    ? `
## Instructional Materials

- Chalkboard or whiteboard.
- Learner notebooks.
- Relevant real objects, pictures, charts, or flashcards connected to ${params.topic}.
- Teacher-drawn diagrams for illustration.
- Recommended textbook or ${params.syllabus} curriculum guide.`
    : '';

  const plan = `# LESSON NOTE

## Lesson Details

| Field | Details |
| --- | --- |
| Class | ${params.className || 'Selected class'} |
| Grade | ${params.grade || 'Selected grade'} |
| Week | ${params.week} |
| Date | ${params.lessonDate} |
| Duration | ${durationNum} minutes |
| Average Age | ${averageAge} |
| Subject | ${params.subject} |
| Topic | ${params.topic} |
| Sub-topic | ${subTopic} |
| Curriculum | ${params.syllabus} |
| Instructional Materials | Chalkboard/whiteboard, learner notebooks, relevant objects or pictures, and teacher-drawn diagrams |
| Reference Book | Recommended ${params.subject} textbook and ${params.syllabus} curriculum guide |

${resourcesSection || `## Instructional Materials

- Chalkboard or whiteboard.
- Learner notebooks.
- Relevant real objects, pictures, charts, or flashcards connected to ${params.topic}.
- Teacher-drawn diagrams for illustration.`}

## Behavioural Objectives

By the end of the lesson, learners should be able to:

1. Define or explain ${params.topic} in their own words.
2. State at least three important facts, features, or effects connected to ${params.topic}.
3. Give practical classroom or everyday examples of ${params.topic}.
4. Answer oral and written questions on ${params.topic} with correct subject vocabulary.

## Previous Knowledge

Learners have basic prior knowledge from earlier lessons and everyday experiences related to ${params.topic}. The teacher will connect the lesson to what learners have already observed, heard, read, or practised.

## Introduction

The teacher introduces the topic by showing a relevant object, picture, short sentence, problem, or classroom situation connected to ${params.topic}. Learners are asked simple guiding questions:

- What do you notice?
- Where have you seen or used this before?
- What words can we use to describe it?

The teacher writes the topic on the board and briefly explains what learners should be able to do by the end of the lesson.

## Presentation

### Step 1: Teacher Explains The Meaning Of ${params.topic}

The teacher gives a clear definition of ${params.topic} and explains the main terms learners must know. The teacher writes the key words on the board and asks learners to repeat and use them in short sentences.

**Teacher's explanation:** ${params.topic} is studied in ${params.subject} because it helps learners understand important ideas, solve problems, communicate clearly, and connect classroom learning to real life.

**Learner activity:** Learners copy the definition and give one example in their own words.

### Step 2: Teacher States The Main Points Or Effects Of ${params.topic}

The teacher explains the major points one after another, using examples and questions after each point.

1. ${params.topic} has key terms that learners must understand and use correctly.
2. ${params.topic} can be observed, explained, practised, or applied in real situations.
3. ${params.topic} helps learners build stronger thinking, communication, and problem-solving skills.
4. ${params.topic} connects with previous lessons and prepares learners for future topics.

**Teacher questions:**

- What is the first important idea in this topic?
- Can you give an example?
- Why is this idea useful?

### Step 3: Teacher Demonstrates With Examples

The teacher gives two worked examples or classroom demonstrations. Learners first watch, then answer similar questions with teacher guidance.

**Example 1:** Explain ${params.topic} using one simple classroom example.

**Solution / Explanation:** The teacher identifies the important idea, links it to the example, and shows learners how to write a complete answer.

**Example 2:** Describe one way ${params.topic} can be used in everyday life or another school subject.

**Solution / Explanation:** Learners mention the situation, state the connection to ${params.topic}, and explain the result or importance.

## Board Diagrams And Illustrations

### Diagram 1: Concept Map

> [${params.topic}]
>   |
>   +-- Meaning / definition
>   +-- Key words
>   +-- Examples
>   +-- Effects or uses
>   +-- Evaluation questions

**How to use it:** Draw this on the board after the introduction. Fill each branch with learners' answers as the lesson develops.

### Diagram 2: Cause-And-Effect / Process Flow

> Idea or example from ${params.topic}
>        |
>        v
> What happens?
>        |
>        v
> Why does it matter?
>        |
>        v
> Learner's conclusion

**How to use it:** Use this diagram during presentation Step 2 or Step 3 to help learners see the relationship between the topic, examples, and conclusions.

## Class Activities

| Activity | Teacher Action | Learner Action | Time |
| --- | --- | --- | ---: |
| Introduction | Introduce ${params.topic} with a prompt, object, picture, or question. | Observe, predict, and answer orally. | ${introMinutes} min |
| Explanation | Define the topic and explain key vocabulary. | Listen, repeat key words, and copy notes. | ${teachingMinutes} min |
| Guided Practice | Lead examples, board diagrams, and class discussion. | Answer questions and complete short examples. | ${practiceMinutes} min |
| Summary | Review the main points and correct misconceptions. | State what they learnt and complete exit responses. | ${closureMinutes} min |

${assessmentSection}

${differentiationSection}

## Evaluation

The teacher evaluates the topic by asking:

1. What is ${params.topic}?
2. State three important points about ${params.topic}.
3. Give two examples connected to ${params.topic}.
4. Explain why ${params.topic} is important in ${params.subject}.

## Conclusion

The teacher summarises the lesson by restating the meaning, main points, examples, and diagrams. Learners are encouraged to ask questions, correct their notes, and explain one thing they learnt.

## Assignment

1. Write a short definition of ${params.topic}.
2. State four important facts, effects, uses, or examples of ${params.topic}.
3. Draw and label a simple diagram that explains ${params.topic}.
4. Answer one application question showing how ${params.topic} can be used in real life.

## Teacher Reflection

- Which learners understood the definition and examples quickly?
- Which learners need more support with vocabulary, diagrams, or written answers?
- What should be revised before the next lesson?
${focusAreas.length > 0 ? `\nAdditional focus areas: ${focusAreas.join(', ')}.` : ''}

---

Generated in preview-safe mode because the live AI service was unavailable. Review and adapt before classroom use.`;

  if (!languageProfile.bilingual) return plan;

  const localizedSection = localizeFallbackLessonSection(languageProfile, params, {
    introMinutes,
    teachingMinutes,
    practiceMinutes,
    closureMinutes,
  });

  return `${plan}

${localizedSection}

## English Translation

The ${languageProfile.englishName} language-subject section above mirrors the same lesson expectations in ${languageProfile.englishName} for classroom delivery.
Use it alongside the English plan for bilingual instruction.`;
}

function buildFallbackAssessment(params: GenerateAssessmentParams & {
  subject: string;
  grade: string;
  className: string;
  syllabus: string;
}) {
  const languageProfile = getLanguageProfile(params.subject);
  const bilingualLanguage = languageProfile.bilingual;
  const count = Math.max(1, Math.min(params.questionCount || 10, 30));
  const questionTypes = ['multiple choice', 'short answer', 'true or false', 'structured response', 'paragraph response'];
  const questionEntries = Array.from({ length: count }, (_, index) => {
    const questionNumber = index + 1;
    const type = questionTypes[index % questionTypes.length];
    const marks = type === 'multiple choice' || type === 'true or false' ? 1 : type === 'paragraph response' ? 5 : 3;

    if (type === 'multiple choice') {
      if (bilingualLanguage) {
        const localized = localizeAssessmentQuestion(languageProfile, type, marks, params.topic, params.subject);
        const [localizedTitle, ...localizedRest] = localized.split('\n\n');
        return {
          type,
          content: `**${questionNumber}. ${localizedTitle}**\n\n${localizedRest.join('\n\n')}\n\n**English Translation**\n\nWhich option best matches the main idea of ${params.topic} in ${params.subject}?\n\nA. It is unrelated to classroom learning.\n\nB. It helps learners understand and communicate the concept clearly.\n\nC. It should only be memorised without explanation.\n\nD. It is only useful outside school.`,
        };
      }
      return {
        type,
        content: `**${questionNumber}. Multiple choice** [${marks} mark]\n\nWhich option best matches the main idea of ${params.topic} in ${params.subject}?\n\nA. It is unrelated to classroom learning.\n\nB. It helps learners understand and communicate the concept clearly.\n\nC. It should only be memorised without explanation.\n\nD. It is only useful outside school.`,
      };
    }

    if (type === 'true or false') {
      if (bilingualLanguage) {
        const localized = localizeAssessmentQuestion(languageProfile, type, marks, params.topic, params.subject);
        const [localizedTitle, ...localizedRest] = localized.split('\n\n');
        return {
          type,
          content: `**${questionNumber}. ${localizedTitle}**\n\n${localizedRest.join('\n\n')}\n\n**English Translation**\n\n${params.topic} requires learners to give reasons for their answers, not only one-word responses.`,
        };
      }
      return {
        type,
        content: `**${questionNumber}. True or false** [${marks} mark]\n\n${params.topic} requires learners to give reasons for their answers, not only one-word responses.`,
      };
    }

    if (type === 'paragraph response') {
      if (bilingualLanguage) {
        const localized = localizeAssessmentQuestion(languageProfile, type, marks, params.topic, params.subject);
        const [localizedTitle, ...localizedRest] = localized.split('\n\n');
        return {
          type,
          content: `**${questionNumber}. ${localizedTitle}**\n\n${localizedRest.join('\n\n')}\n\n**English Translation**\n\nWrite a short paragraph explaining how ${params.topic} can be used in a real classroom or everyday situation. Include at least two details or examples.`,
        };
      }
      return {
        type,
        content: `**${questionNumber}. Paragraph response** [${marks} marks]\n\nWrite a short paragraph explaining how ${params.topic} can be used in a real classroom or everyday situation. Include at least two details or examples.`,
      };
    }

    if (type === 'structured response') {
      if (bilingualLanguage) {
        const localized = localizeAssessmentQuestion(languageProfile, type, marks, params.topic, params.subject);
        const [localizedTitle, ...localizedRest] = localized.split('\n\n');
        return {
          type,
          content: `**${questionNumber}. ${localizedTitle}**\n\n${localizedRest.join('\n\n')}\n\n**English Translation**\n\nRead the prompt about ${params.topic}.\n\n(a) Identify one key idea. [1]\n\n(b) Explain why that idea matters. [1]\n\n(c) Give one example that supports your explanation. [1]`,
        };
      }
      return {
        type,
        content: `**${questionNumber}. Structured response** [${marks} marks]\n\nRead the prompt about ${params.topic}.\n\n(a) Identify one key idea. [1]\n\n(b) Explain why that idea matters. [1]\n\n(c) Give one example that supports your explanation. [1]`,
      };
    }

    if (bilingualLanguage) {
      const localized = localizeAssessmentQuestion(languageProfile, type, marks, params.topic, params.subject);
      const [localizedTitle, ...localizedRest] = localized.split('\n\n');
      return {
        type,
        content: `**${questionNumber}. ${localizedTitle}**\n\n${localizedRest.join('\n\n')}\n\n**English Translation**\n\nDefine ${params.topic} in your own words and give one example linked to ${params.subject}.`,
      };
    }
    return {
      type,
      content: `**${questionNumber}. Short answer** [${marks} marks]\n\nDefine ${params.topic} in your own words and give one example linked to ${params.subject}.`,
    };
  });
  const questions = questionEntries.map(entry => entry.content);

  const totalMarks = questions.reduce((sum, question) => {
    const match = question.match(/\[(\d+)\s*[^\]]*\]/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const memo = params.includeAnswerKey
    ? `
## Memorandum / Answer Key

Use this memorandum as a marking guide and adjust wording where learners show correct understanding.

${questionEntries.map((entry, index) => {
  const questionNumber = index + 1;
  if (entry.type === 'multiple choice') return `**${questionNumber}.** B. Award 1 mark for the correct option.`;
  if (entry.type === 'true or false') return `**${questionNumber}.** True. Award 1 mark for identifying that reasoned answers are required.`;
  if (entry.type === 'paragraph response') return `**${questionNumber}.** Award up to 5 marks: clear main point [1], two relevant details/examples [2], correct subject vocabulary [1], coherent paragraph structure [1].`;
  if (entry.type === 'structured response') return `**${questionNumber}.** Award 1 mark each for a relevant key idea, a valid explanation, and a suitable example.`;
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

${bilingualLanguage
  ? `1. Because this is a ${languageProfile.englishName} language subject, answer in ${languageProfile.englishName} first, then review the English translation.
2. Read each question carefully before answering.
3. Write neatly and number your answers correctly.
4. Use examples from class where possible.

${languageProfile.localHeader}:
1. Use ${languageProfile.localLabel} as the subject language for your main answer.
2. Follow the same numbering and mark allocation shown in English.`
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
    const languageProfile = getLanguageProfile(subject);

    // Build the AI prompt
    const extras: string[] = [];
    if (params.requiredTest) extras.push(`This is for a "${params.requiredTest}" as required by the ${syllabus} syllabus.`);
    if (params.includeAnswerKey) extras.push('Include a complete answer key with marking memorandum and explanations for each question at the end.');
    if (params.difficulty === 'mixed') extras.push('Include a mix of easy, medium, and hard questions progressing in difficulty. Label the Bloom\'s Taxonomy level for each question.');

    const kbSection = params.kbContext
      ? `\nUse the following syllabus reference material to inform the assessment content:\n${params.kbContext}\n`
      : '';
    const languageSection = languageProfile.bilingual
      ? `
CRITICAL LANGUAGE RULES (Selected Language Subject):
- The selected subject is ${subject}; treat it as a ${languageProfile.englishName} language subject, not as a general UI language preference.
- Write the full assessment in the subject language, ${languageProfile.englishName}, first, using label "${languageProfile.localHeader}".
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
      if (languageProfile.bilingual && !hasRequiredLanguageSignals(candidate, languageProfile)) {
        throw new Error(`${languageProfile.englishName} language-subject output validation failed: AI response did not include the required bilingual subject-language signals.`);
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
    const languageProfile = getLanguageProfile(params.subject);
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
    const languageSection = languageProfile.bilingual
      ? `
CRITICAL LANGUAGE RULES (Selected Language Subject):
- The selected subject is ${params.subject}; treat it as a ${languageProfile.englishName} language subject, not as a general UI language preference.
- Write the full lesson plan in the subject language, ${languageProfile.englishName}, first, using label "${languageProfile.localHeader}".
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
- Generate the full lesson note in markdown format, following this Nigerian classroom lesson-note style:
  1. Title: "LESSON NOTE"
  2. Lesson Details table with Class, Week, Date, Duration, Average Age, Subject, Topic, Sub-topic, Curriculum, Instructional Materials, and Reference Book.
  3. Behavioural Objectives written as "By the end of the lesson, students/learners should be able to..."
  4. Previous Knowledge.
  5. Introduction with a concrete teacher action, demonstration, object, picture, story, question, or quick activity.
  6. Presentation with Step 1, Step 2, Step 3, and more steps where needed. Each step must include teacher explanation, learner activity, and enough subject notes for the teacher to teach directly from the output.
  7. Worked Examples / Calculations / Demonstrations where applicable. Include solved examples for maths, science, business, or any topic where examples help.
  8. Board Diagrams And Illustrations. Include at least two simple markdown-friendly diagrams or illustration guides, such as concept maps, labelled sketches, flow charts, tables, or board drawing instructions. Use text diagrams that can be copied to the board.
  9. Evaluation questions.
  10. Conclusion.
  11. Assignment with practical questions and at least one diagram/illustration task where appropriate.
- Make the lesson note more detailed than a short outline. Include definitions, explanations, examples, teacher prompts, expected learner responses, and board-work guidance.`;

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
      if (languageProfile.bilingual && !hasRequiredLanguageSignals(candidate, languageProfile)) {
        throw new Error(`${languageProfile.englishName} language-subject output validation failed: AI response did not include the required bilingual subject-language signals.`);
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
