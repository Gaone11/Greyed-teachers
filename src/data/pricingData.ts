// This file simulates fetching data from a CMS/environment variables.
// In production, this can be replaced with API or CMS-backed tier data.

export interface Plan {
  id: 'basic' | 'standard' | 'premium' | 'enterprise';
  name: string;
  badge: string;
  monthlyPriceGBP: number;
  annualPriceGBP: number;
  priceLabel?: string;
  ctaLabel: string;
  ctaLink: string;
  features: string[];
  isPrimary?: boolean;
  stripePriceId?: string;
}

export interface Feature {
  id: string;
  name: string;
  availableIn: {
    basic: boolean;
    standard: boolean;
    premium: boolean;
    enterprise: boolean;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

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

export const pricingPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    badge: 'Included on signup',
    monthlyPriceGBP: 0,
    annualPriceGBP: 0,
    ctaLabel: 'Start Basic',
    ctaLink: '#',
    features: [
      'Access to your selected hub',
      'Core dashboard, timetable, and communication tools',
      'Basic AI support and learning resources',
      'Upgrade any time from the sidebar'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    badge: 'Everyday learning',
    monthlyPriceGBP: 9.99,
    annualPriceGBP: 99.5,
    ctaLabel: 'Upgrade to Standard',
    ctaLink: '#',
    features: [
      'Everything in Basic',
      'Expanded AI study and planning tools',
      'Progress tracking and parent/teacher updates',
      'Priority feature access for individual users'
    ],
    isPrimary: true,
    stripePriceId: 'price_standard_placeholder'
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Most capable',
    monthlyPriceGBP: 19.99,
    annualPriceGBP: 199.1,
    ctaLabel: 'Upgrade to Premium',
    ctaLink: '#',
    features: [
      'Everything in Standard',
      'Advanced AI lesson, assessment, and study workflows',
      'Deeper analytics and progress insights',
      'Priority support'
    ],
    stripePriceId: 'price_premium_placeholder'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Schools & organisations',
    monthlyPriceGBP: 0,
    annualPriceGBP: 0,
    priceLabel: 'Custom',
    ctaLabel: 'Contact GreyEd',
    ctaLink: '/contact',
    features: [
      'Everything in Premium',
      'Organisation-wide accounts and onboarding',
      'School analytics and admin oversight',
      'Custom implementation and support'
    ],
    stripePriceId: 'price_enterprise_placeholder'
  }
];

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

export const featureMatrix: Feature[] = [
  {
    id: 'hub-access',
    name: 'Student, teacher, or parent hub access',
    availableIn: {
      basic: true,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'ai-chat',
    name: 'Personalised AI chat',
    availableIn: {
      basic: true,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'progress-tracking',
    name: 'Progress tracking and updates',
    availableIn: {
      basic: true,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'smart-tools',
    name: 'Smart notes, planning, and learning tools',
    availableIn: {
      basic: false,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'advanced-ai',
    name: 'Advanced AI workflows',
    availableIn: {
      basic: false,
      standard: false,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'priority-support',
    name: 'Priority support',
    availableIn: {
      basic: false,
      standard: false,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'analytics',
    name: 'Advanced analytics and reports',
    availableIn: {
      basic: false,
      standard: false,
      premium: false,
      enterprise: true
    }
  },
  {
    id: 'admin-controls',
    name: 'Organisation admin controls',
    availableIn: {
      basic: false,
      standard: false,
      premium: false,
      enterprise: true
    }
  }
];

export const faqItems: FAQ[] = [
  {
    id: 'basic-default',
    question: 'What plan do new accounts start on?',
    answer: 'Every new student, teacher, or parent account starts on Basic. You can upgrade from the dashboard sidebar whenever you need more features.'
  },
  {
    id: 'tier-differences',
    question: 'How do the tiers differ?',
    answer: 'Basic covers core hub access. Standard adds richer learning and planning tools. Premium unlocks advanced AI workflows and priority support. Enterprise is tailored for schools and organisations.'
  },
  {
    id: 'change-tiers',
    question: 'Can I change tiers later?',
    answer: 'Yes. You can move between tiers or adjust individual student and tutor features as your needs change. Schools can contact GreyEd for an Enterprise setup.'
  },
  {
    id: 'individual-customisation',
    question: 'Can individual students and tutors customise their plan?',
    answer: 'Yes. Students and tutors can choose their account type, select optional features, and see the estimated price before starting. Tutor accounts can connect to student hubs through referral links or student-selected tutor connections.'
  },
  {
    id: 'enterprise',
    question: 'Who is Enterprise for?',
    answer: 'Enterprise is for schools, tutoring groups, NGOs, and organisations that need managed accounts, rollout support, reporting, and custom implementation.'
  }
];
