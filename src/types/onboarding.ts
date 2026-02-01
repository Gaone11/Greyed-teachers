// Basic user information
export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  country: string;
  educationLevel: string;
}

// Big Five personality traits
export interface BigFive {
  openness: number;        // Openness to experience
  conscientiousness: number; // Conscientiousness
  extraversion: number;    // Extraversion
  agreeableness: number;   // Agreeableness
  neuroticism: number;     // Neuroticism
}

// Type for creativity profile
export type CreativityProfile = 'Divergent' | 'Convergent' | 'Hybrid' | null;

// Type for learning styles
export type LearningStyle = 'Visual' | 'Auditory' | 'Kinesthetic' | 'Reading/Writing' | null;

// Education background information
export interface EducationBackground {
  hasWifi: boolean | null;
  shareDevice: boolean | null;
  parentSupport: 'A lot' | 'Somewhat' | 'Rarely' | 'Not at all' | null;
  languages: string[];
  homeLanguage: string;
}

// Comprehensive personality assessment data
export interface PersonalityAssessment {
  bigFive: BigFive;
  creativityProfile: CreativityProfile;
  neurodivergence: string[];
  learningStyles: string[];
  primaryLearningStyle: LearningStyle;
  educationBackground: EducationBackground;
}

// El AI persona definition
export interface ElAIPersona {
  name: string;
  tone: string;
  style: string;
  pace: string;
  intro: string;
}

// Complete user profile including personality data
export interface GreyEdProfile {
  userId: string;
  bigFive: BigFive;
  creativity: CreativityProfile;
  learningStyles: string[];
  neurodivergence: string[];
  educationBackground: EducationBackground;
  elAIPersona: ElAIPersona;
  createdAt: string;
}

// Question type for various assessments
export interface Question {
  id: string;
  text: string;
  type: 'likert' | 'multiple-choice' | 'checkbox' | 'text' | 'radio';
  options?: string[];
  category?: string; // For categorizing questions (e.g., "Openness", "Extraversion")
}

// Answer for a single question
export interface QuestionResponse {
  questionId: string;
  value: number | string | string[];
  category?: string;
}