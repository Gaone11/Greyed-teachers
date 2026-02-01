import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OnboardingData, PersonalityAssessment } from '../types/onboarding';
import { supabase } from '../lib/supabase';

interface OnboardingContextType {
  currentStep: number;
  onboardingData: OnboardingData;
  personalityAssessment: PersonalityAssessment;
  setCurrentStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  updatePersonalityAssessment: (data: Partial<PersonalityAssessment>) => void;
  saveToSupabase: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const defaultOnboardingData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  country: '',
  educationLevel: '',
};

const defaultPersonalityAssessment: PersonalityAssessment = {
  bigFive: {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  },
  creativityProfile: null,
  neurodivergence: [],
  learningStyles: [],
  primaryLearningStyle: null,
  educationBackground: {
    hasWifi: null,
    shareDevice: null,
    parentSupport: null,
    languages: [],
    homeLanguage: ''
  }
};

export const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: 1,
  onboardingData: defaultOnboardingData,
  personalityAssessment: defaultPersonalityAssessment,
  setCurrentStep: () => {},
  updateOnboardingData: () => {},
  updatePersonalityAssessment: () => {},
  saveToSupabase: async () => false,
  isLoading: false,
  error: null
});

export const useOnboarding = () => useContext(OnboardingContext);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [personalityAssessment, setPersonalityAssessment] = useState<PersonalityAssessment>(defaultPersonalityAssessment);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const updatePersonalityAssessment = (data: Partial<PersonalityAssessment>) => {
    setPersonalityAssessment(prevData => ({
      ...prevData,
      ...data
    }));
  };

  // Assign El AI persona based on user's profile
  const assignElAIPersona = () => {
    const { bigFive, creativityProfile, learningStyles } = personalityAssessment;
    
    // Simple assignment logic based on the requirements
    if (creativityProfile === 'Divergent' && learningStyles.includes('Visual')) {
      return {
        name: 'Nova',
        tone: 'creative',
        style: 'metaphoric',
        pace: 'moderate',
        intro: "Hi, I'm Nova — your personal El AI tutor. I love using visuals, stories, and creative angles to help you master your learning journey."
      };
    } else if (creativityProfile === 'Convergent' && learningStyles.includes('Reading/Writing')) {
      return {
        name: 'Lex',
        tone: 'structured',
        style: 'precise',
        pace: 'measured',
        intro: "Hello, I'm Lex — your El AI tutor. I'll help you organize information logically and provide structured approaches to master your subjects."
      };
    } else if (learningStyles.includes('Kinesthetic') && bigFive.extraversion > 3.5) {
      return {
        name: 'Milo',
        tone: 'energetic',
        style: 'interactive',
        pace: 'quick',
        intro: "Hey there! I'm Milo, your El AI learning partner. I'll keep our sessions dynamic and engaging with plenty of real-world examples."
      };
    } else if (bigFive.neuroticism > 4 && bigFive.extraversion < 3) {
      return {
        name: 'Zara',
        tone: 'calm',
        style: 'supportive',
        pace: 'slow',
        intro: "Hello, I'm Zara. I'll be your El AI tutor, providing a calm, steady approach to help you learn at your own pace without pressure."
      };
    } else if (bigFive.openness > 3.5 && bigFive.conscientiousness > 3.5) {
      return {
        name: 'Kai',
        tone: 'balanced',
        style: 'adaptive',
        pace: 'flexible',
        intro: "Hi, I'm Kai, your El AI tutor. I'll adapt to your needs, balancing structure with creativity to help you achieve your learning goals."
      };
    } else {
      return {
        name: 'Sage',
        tone: 'thoughtful',
        style: 'socratic',
        pace: 'deliberate',
        intro: "I'm Sage, your El AI tutor. I'll help you explore ideas through thoughtful questions and guide you to discover solutions on your own."
      };
    }
  };

  const saveToSupabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Calculate El AI persona
      const elAIPersona = assignElAIPersona();
      
      // Prepare data for Supabase
      const profileData = {
        id: user.id,
        first_name: onboardingData.firstName,
        last_name: onboardingData.lastName,
        email: onboardingData.email,
        personality_profile: {
          bigFive: personalityAssessment.bigFive,
          creativityProfile: personalityAssessment.creativityProfile,
          learningStyles: personalityAssessment.learningStyles,
          primaryLearningStyle: personalityAssessment.primaryLearningStyle,
          neurodivergence: personalityAssessment.neurodivergence,
          educationBackground: personalityAssessment.educationBackground,
          elAIPersona
        },
        updated_at: new Date().toISOString()
      };
      
      // Save to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);
        
      if (profileError) throw profileError;
      
      // Trigger Edge Function for email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-onboarding-completion', {
          body: {
            name: onboardingData.firstName,
            email: onboardingData.email,
            elAIPersona: elAIPersona.name
          }
        });
        
        if (emailError) {
          // Continue even if email sends fails
        }
      } catch (emailErr) {
        // Continue even if email sending fails
      }
      
      
      return true;
    } catch {
      setError(error instanceof Error ? error.message : 'Failed to save your profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        onboardingData,
        personalityAssessment,
        setCurrentStep,
        updateOnboardingData,
        updatePersonalityAssessment,
        saveToSupabase,
        isLoading,
        error
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};