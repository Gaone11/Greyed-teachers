// This file simulates fetching data from a CMS
// In a production environment, this would be replaced with API calls to a CMS like Sanity

export interface FeatureItem {
  id: string;
  slug: string;
  title: string;
  body_md: string;
}

export interface FeatureHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const featuresAccordionData: FeatureItem[] = [
  {
    id: "feature-1",
    slug: "hyper-personalised-ai-tutoring",
    title: "Hyper-Personalised AI Tutoring",
    body_md: "El AI learns your pace, gaps and vibe, then serves lessons that fit you, not the average class."
  },
  {
    id: "feature-2",
    slug: "emotion-aware-feedback",
    title: "Emotion-Aware Feedback",
    body_md: "Camera optional—El spots frustration or boredom and switches tactics so concepts stick."
  },
  {
    id: "feature-3",
    slug: "smart-notes-flashcards",
    title: "Smart Notes & Flashcards",
    body_md: "Upload slides or a screenshot → get bullet summaries, key terms and spaced-repetition cards."
  },
  {
    id: "feature-4",
    slug: "timetable-smart-scheduler",
    title: "Timetable & Smart Scheduler",
    body_md: "Drag-and-drop study blocks; El nudges you when deadlines creep up."
  },
  {
    id: "feature-5",
    slug: "curriculum-alignment",
    title: "Curriculum Alignment",
    body_md: "Content mapped 1-to-1 with Cambridge GCE, GCSE, IGCSE & A-Level—and IB, Edexcel, AP coming soon."
  },
  {
    id: "feature-6",
    slug: "multilingual-support",
    title: "Multilingual Support",
    body_md: "100+ languages so no learner is left out."
  }
];

export const deepDiveCardsData: FeatureHighlight[] = [
  {
    id: "highlight-1",
    icon: "ShieldCheck",
    title: "Safety by Design",
    description: "Your data is yours. GDPR & DPA compliant, encrypted at rest, never sold."
  },
  {
    id: "highlight-2",
    icon: "WifiOff",
    title: "Low-Data Friendly",
    description: "Works on the bus. Loads fast on 3G; heavy assets lazy-loaded."
  },
  {
    id: "highlight-3",
    icon: "Eye",
    title: "Accessibility First",
    description: "WCAG-AA + reduced-motion. Toggle animations; full keyboard nav."
  }
];