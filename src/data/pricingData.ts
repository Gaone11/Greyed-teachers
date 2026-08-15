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
    answer: 'Yes. You can move between individual tiers as your needs change, and schools can contact GreyEd for an Enterprise setup.'
  },
  {
    id: 'enterprise',
    question: 'Who is Enterprise for?',
    answer: 'Enterprise is for schools, tutoring groups, NGOs, and organisations that need managed accounts, rollout support, reporting, and custom implementation.'
  }
];
