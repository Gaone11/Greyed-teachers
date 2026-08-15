export type IndividualPricingRole = 'student' | 'tutor';

export interface IndividualFeature {
  id: string;
  name: string;
  description: string;
  monthlyPriceGBP: number;
  recommended?: boolean;
}

export interface IndividualRoleOption {
  id: IndividualPricingRole;
  label: string;
  eyebrow: string;
  description: string;
  baseMonthlyPriceGBP: number;
  included: string[];
  features: IndividualFeature[];
}

export const individualRoleOptions: IndividualRoleOption[] = [
  {
    id: 'student',
    label: 'Student',
    eyebrow: 'Individual learning hub',
    description: 'Build a student account around the study tools, progress support, and tutor connection features you actually need.',
    baseMonthlyPriceGBP: 4.99,
    included: [
      'Student dashboard and timetable',
      'Core messages and learning resources',
      'Basic AI study chat'
    ],
    features: [
      {
        id: 'student-ai-study',
        name: 'Advanced AI study assistant',
        description: 'Step-by-step explanations, revision prompts, and adaptive help across subjects.',
        monthlyPriceGBP: 4,
        recommended: true
      },
      {
        id: 'student-progress',
        name: 'Progress and goal tracking',
        description: 'Personal goals, achievements, study streaks, and progress summaries.',
        monthlyPriceGBP: 3
      },
      {
        id: 'student-knowledge',
        name: 'Knowledge galaxy and smart notes',
        description: 'Topic maps, flashcards, discovery feeds, and saved study notes.',
        monthlyPriceGBP: 5,
        recommended: true
      },
      {
        id: 'student-tutor-link',
        name: 'Tutor-linked hub',
        description: 'Connect your account to a chosen tutor so assignments, messages, and updates stay aligned.',
        monthlyPriceGBP: 3
      }
    ]
  },
  {
    id: 'tutor',
    label: 'Tutor',
    eyebrow: 'Private tutor workspace',
    description: 'Create a tutor account that can invite students by link or be selected from the GreyEd tutor marketplace.',
    baseMonthlyPriceGBP: 9.99,
    included: [
      'Tutor dashboard and profile',
      'Student roster basics',
      'Core messaging and session notes'
    ],
    features: [
      {
        id: 'tutor-referral-links',
        name: 'Student referral and invite links',
        description: 'Send one link to students so their hubs connect back to your tutor workspace.',
        monthlyPriceGBP: 5,
        recommended: true
      },
      {
        id: 'tutor-marketplace',
        name: 'Tutor marketplace listing',
        description: 'Let students discover and select you as their tutor from inside GreyEd.',
        monthlyPriceGBP: 6
      },
      {
        id: 'tutor-ai-planning',
        name: 'AI lesson and assignment tools',
        description: 'Generate lesson plans, assignments, recaps, and differentiated support.',
        monthlyPriceGBP: 7,
        recommended: true
      },
      {
        id: 'tutor-family-updates',
        name: 'Progress reports and family updates',
        description: 'Share structured student progress with learners and families.',
        monthlyPriceGBP: 4
      },
      {
        id: 'tutor-analytics',
        name: 'Tutor analytics dashboard',
        description: 'Track engagement, progress, missed work, and student support needs.',
        monthlyPriceGBP: 5
      }
    ]
  }
];
