// This file simulates fetching data from a CMS/environment variables
// In a production environment, this would be replaced with API calls or env variables

export interface Plan {
  id: 'free' | 'premium' | 'hybrid' | 'teacher';
  name: string;
  badge: string;
  monthlyPriceGBP: number;
  annualPriceGBP: number;
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
    free: boolean;
    premium: boolean;
    hybrid: boolean;
    teacher: boolean;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'El Free',
    badge: 'Start now',
    monthlyPriceGBP: 0,
    annualPriceGBP: 0,
    ctaLabel: 'Start Free',
    ctaLink: '#',
    features: [
      '10 AI messages/day',
      '5 min video calls/day',
      'Basic timetable'
    ]
  },
  {
    id: 'premium',
    name: 'El Premium Monthly',
    badge: 'Popular',
    monthlyPriceGBP: 9.99,
    annualPriceGBP: 99.5, // 9.99 * 12 * 0.83 (17% discount)
    ctaLabel: 'Upgrade',
    ctaLink: '#',
    features: [
      'Unlimited AI chat & calls',
      'Smart Notes & flashcards',
      'Emotion-aware coaching',
      'Personal avatar'
    ],
    isPrimary: true,
    stripePriceId: 'price_test123'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Tutoring',
    badge: 'Best results',
    monthlyPriceGBP: 44.99,
    annualPriceGBP: 448.6, // 44.99 * 12 * 0.83 (17% discount)
    ctaLabel: 'Sign Up',
    ctaLink: '#',
    features: [
      'Everything in Premium',
      '4 live tutor sessions/mo',
      'Session recaps',
      'Priority support'
    ],
    stripePriceId: 'price_test456'
  },
  {
    id: 'teacher',
    name: 'GreyEd Teachers',
    badge: '14-day free trial',
    monthlyPriceGBP: 8,
    annualPriceGBP: 80, // Approximate yearly price
    ctaLabel: 'Start Free Trial',
    ctaLink: '#',
    features: [
      'Unlimited AI lesson plans',
      'Unlimited assessments with auto-grading',
      'Weekly family updates',
      'Advanced analytics dashboard',
      'Priority support'
    ],
    stripePriceId: 'price_1RUB57KhB7e46jXjQaGUjQU6'
  }
];

export const featureMatrix: Feature[] = [
  {
    id: 'ai-chat',
    name: 'Personalised AI chat',
    availableIn: {
      free: true,
      premium: true,
      hybrid: true,
      teacher: true
    }
  },
  {
    id: 'video-calls',
    name: 'Video calls with El',
    availableIn: {
      free: true,
      premium: true,
      hybrid: true,
      teacher: false
    }
  },
  {
    id: 'smart-notes',
    name: 'Smart Notes & flashcards',
    availableIn: {
      free: false,
      premium: true,
      hybrid: true,
      teacher: false
    }
  },
  {
    id: 'emotion-detection',
    name: 'Emotion detection',
    availableIn: {
      free: false,
      premium: true,
      hybrid: true,
      teacher: false
    }
  },
  {
    id: 'curriculum-tests',
    name: 'Curriculum-aligned tests',
    availableIn: {
      free: false,
      premium: true,
      hybrid: true,
      teacher: false
    }
  },
  {
    id: 'human-tutors',
    name: 'Human tutor sessions',
    availableIn: {
      free: false,
      premium: false,
      hybrid: true,
      teacher: false
    }
  },
  {
    id: 'session-recap',
    name: 'Session recap emails',
    availableIn: {
      free: false,
      premium: false,
      hybrid: true,
      teacher: false
    }
  },
  {
    id: 'priority-support',
    name: 'Priority support',
    availableIn: {
      free: false,
      premium: false,
      hybrid: true,
      teacher: true
    }
  },
  {
    id: 'lesson-plans',
    name: 'AI lesson planning',
    availableIn: {
      free: false,
      premium: false,
      hybrid: false,
      teacher: true
    }
  },
  {
    id: 'assessments',
    name: 'Auto-graded assessments',
    availableIn: {
      free: false,
      premium: false,
      hybrid: false,
      teacher: true
    }
  },
  {
    id: 'family-updates',
    name: 'Family weekly updates',
    availableIn: {
      free: false,
      premium: false,
      hybrid: false,
      teacher: true
    }
  }
];

export const faqItems: FAQ[] = [
  {
    id: 'free-forever',
    question: 'Can I stay on Free forever?',
    answer: 'Yes, no card required. The El Free plan is completely free and will always remain available to you without requiring any payment information.'
  },
  {
    id: 'tutor-sessions',
    question: 'How do tutor sessions work?',
    answer: 'Book via in-app calendar; delivered on Daily.co video. Our certified tutors receive insights from your El AI interactions before the call to make each session as productive as possible.'
  },
  {
    id: 'cancel-anytime',
    question: 'Can I cancel any time?',
    answer: 'Absolutely; pro-rated refunds for annual plans. There are no long-term commitments, and you can downgrade or cancel your subscription at any time with just a few clicks.'
  },
  {
    id: 'data-safety',
    question: 'Is my data safe?',
    answer: '256-bit encryption, GDPR & UK DPA compliant. We never sell your data or use it for advertising. Your privacy and security are our top priorities.'
  },
  {
    id: 'teacher-trial',
    question: 'How does the GreyEd Teachers free trial work?',
    answer: 'Teachers get a 14-day free trial with full access to all features. After the trial period, you\'ll be billed £8/month (P150, $11, or R199 depending on your region) unless you cancel before the trial ends.'
  }
];