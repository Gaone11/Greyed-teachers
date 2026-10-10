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

// true = included, false = not included, string = included with a limit or note
export type FeatureAvailability = boolean | string;

export interface Feature {
  id: string;
  name: string;
  availableIn: {
    basic: FeatureAvailability;
    standard: FeatureAvailability;
    premium: FeatureAvailability;
    enterprise: FeatureAvailability;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
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
      'Student, teacher, or parent hub (parent hub is fully free)',
      'Dashboard, timetable, messaging, and connections',
      'Homework, assessments, and basic grades',
      'El AI: 20 requests a day',
      'Teachers: up to 2 classes'
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
      'El AI: 100 requests a day',
      'Learning Hub, smart notes, and flashcards',
      'Learning goals, achievements, and courses',
      'Unlimited classes and family progress updates'
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
      'El AI: 300 requests a day',
      'AI lesson planner, test maker, and auto-grading',
      'GreyEd TA avatar, exam prep, and personal analytics',
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
      'Organisation admin controls and bulk onboarding',
      'School-wide analytics and reporting',
      'Custom curriculum and dedicated support'
    ],
    stripePriceId: 'price_enterprise_placeholder'
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
    id: 'core-tools',
    name: 'Dashboard, timetable, and notifications',
    availableIn: {
      basic: true,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'messaging',
    name: 'Messaging and connections',
    availableIn: {
      basic: true,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'homework',
    name: 'Homework, assessments, and basic grades',
    availableIn: {
      basic: true,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'ai-chat',
    name: 'El AI requests (Ask El, GreyEd AI, generators)',
    availableIn: {
      basic: '20 / day',
      standard: '100 / day',
      premium: '300 / day',
      enterprise: 'Custom'
    }
  },
  {
    id: 'classes',
    name: 'Teacher classes',
    availableIn: {
      basic: 'Up to 2',
      standard: 'Unlimited',
      premium: 'Unlimited',
      enterprise: 'Unlimited'
    }
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub, smart notes, and flashcards',
    availableIn: {
      basic: false,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'goals',
    name: 'Learning goals and achievements',
    availableIn: {
      basic: false,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'planning',
    name: 'Courses and assessment library',
    availableIn: {
      basic: false,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'family-updates',
    name: 'Tutor and family progress updates',
    availableIn: {
      basic: false,
      standard: true,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'ai-generators',
    name: 'AI lesson planner and test maker',
    availableIn: {
      basic: false,
      standard: false,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'auto-grading',
    name: 'AI auto-grading',
    availableIn: {
      basic: false,
      standard: false,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'ta-exam-prep',
    name: 'GreyEd TA avatar and exam prep',
    availableIn: {
      basic: false,
      standard: false,
      premium: true,
      enterprise: true
    }
  },
  {
    id: 'personal-analytics',
    name: 'Personal analytics and reports',
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
    id: 'admin-controls',
    name: 'Organisation admin controls and bulk onboarding',
    availableIn: {
      basic: false,
      standard: false,
      premium: false,
      enterprise: true
    }
  },
  {
    id: 'school-analytics',
    name: 'School-wide analytics',
    availableIn: {
      basic: false,
      standard: false,
      premium: false,
      enterprise: true
    }
  },
  {
    id: 'custom-setup',
    name: 'Custom curriculum and dedicated support',
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
    answer: 'Basic is free and covers your hub, messaging, connections, homework, and 20 El AI requests a day. Standard adds 100 AI requests a day, the Learning Hub, learning goals, courses, and unlimited classes. Premium adds 300 AI requests a day, the AI lesson planner and test maker, auto-grading, analytics, and priority support. Enterprise adds organisation admin, school-wide analytics, and custom setup.'
  },
  {
    id: 'change-tiers',
    question: 'Can I change tiers later?',
    answer: 'Yes. You can move between individual tiers as your needs change, and schools can contact GreyEd for an Enterprise setup.'
  },
  {
    id: 'enterprise',
    question: 'Who is Enterprise for?',
    answer: 'Enterprise is for schools, tutoring groups, NGOs, and organisations that need managed accounts, rollout support, reporting, and custom implementation.'
  }
];
