import React, { useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { CheckCircle } from 'lucide-react';

interface SummaryStepProps {
  onValidityChange: (isValid: boolean) => void;
}

// Helper to get a text description for Big Five scores
const getBigFiveDescription = (bigFive: { [key: string]: number }) => {
  const traits = [];
  
  if (bigFive.openness > 3.5) traits.push('High Openness');
  if (bigFive.conscientiousness > 3.5) traits.push('High Conscientiousness');
  if (bigFive.extraversion > 3.5) traits.push('Extraverted');
  if (bigFive.agreeableness > 3.5) traits.push('Agreeable');
  if (bigFive.neuroticism > 3.5) traits.push('Emotionally Sensitive');
  
  // If we have no high traits, mention the highest one
  if (traits.length === 0) {
    const highest = Object.entries(bigFive).reduce((a, b) => a[1] > b[1] ? a : b);
    traits.push(`Moderate ${highest[0].charAt(0).toUpperCase() + highest[0].slice(1)}`);
  }
  
  return traits.join(' · ');
};

const SummaryStep: React.FC<SummaryStepProps> = ({ onValidityChange }) => {
  const { onboardingData, personalityAssessment } = useOnboarding();
  
  // Determine primary learning style
  const primaryStyle = personalityAssessment.primaryLearningStyle || 
                       (personalityAssessment.learningStyles.length > 0 ? personalityAssessment.learningStyles[0] : null);
  
  // This step is always valid
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);
  
  // Function to determine AI persona name based on profile
  const determineAIPersona = () => {
    const { bigFive, creativityProfile, learningStyles } = personalityAssessment;
    
    // Simple assignment logic based on the requirements
    if (creativityProfile === 'Divergent' && learningStyles.includes('Visual')) {
      return 'Nova';
    } else if (creativityProfile === 'Convergent' && learningStyles.includes('Reading/Writing')) {
      return 'Lex';
    } else if (learningStyles.includes('Kinesthetic') && bigFive.extraversion > 3.5) {
      return 'Milo';
    } else if (bigFive.neuroticism > 4 && bigFive.extraversion < 3) {
      return 'Zara';
    } else if (bigFive.openness > 3.5 && bigFive.conscientiousness > 3.5) {
      return 'Kai';
    } else {
      return 'Sage';
    }
  };
  
  const aiPersonaName = determineAIPersona();

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-2">
          Your Learning Profile
        </h2>
        
        <p className="text-greyed-navy/80">
          Review your personalized learning profile below.
        </p>
      </div>
      
      {/* User Info Summary */}
      <div className="bg-greyed-white/50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-greyed-navy mb-3">
          {onboardingData.firstName} {onboardingData.lastName}
        </h3>
        <p className="text-greyed-navy/80">
          {onboardingData.age} years old · {onboardingData.country && onboardingData.country.charAt(0).toUpperCase() + onboardingData.country.slice(1)} · {onboardingData.educationLevel && onboardingData.educationLevel.charAt(0).toUpperCase() + onboardingData.educationLevel.slice(1)} Education
        </p>
      </div>
      
      {/* Learning Profile */}
      <div className="bg-white border border-greyed-navy/10 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-greyed-navy/10">
          <h3 className="text-lg font-medium text-greyed-navy">Learning Profile</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Learning Style */}
          <div>
            <div className="text-sm text-greyed-navy/60 mb-1">Learning Style</div>
            <div className="font-medium text-greyed-navy">
              {primaryStyle || 'Multimodal Learner'}
              {personalityAssessment.learningStyles.length > 1 && (
                <span className="font-normal text-greyed-navy/80">
                  {' · '}Secondary: {
                    personalityAssessment.learningStyles.filter(s => s !== primaryStyle)[0] || 'Varied'
                  }
                </span>
              )}
            </div>
          </div>
          
          {/* Personality Traits */}
          <div>
            <div className="text-sm text-greyed-navy/60 mb-1">Personality Traits</div>
            <div className="font-medium text-greyed-navy">
              {getBigFiveDescription(personalityAssessment.bigFive)}
            </div>
          </div>
          
          {/* Creativity Style */}
          <div>
            <div className="text-sm text-greyed-navy/60 mb-1">Creativity Style</div>
            <div className="font-medium text-greyed-navy">
              {personalityAssessment.creativityProfile || 'Balanced Approach'} Thinker
            </div>
          </div>
          
          {/* Learning Needs */}
          {personalityAssessment.neurodivergence.length > 0 && personalityAssessment.neurodivergence[0] !== 'none' && (
            <div>
              <div className="text-sm text-greyed-navy/60 mb-1">Learning Accommodations</div>
              <div className="font-medium text-greyed-navy">
                {personalityAssessment.neurodivergence.map(need => 
                  need === 'adhd' ? 'Focus Support' : 
                  need === 'dyslexia' ? 'Reading Support' : 
                  need === 'sensory' ? 'Sensory Considerations' : 
                  need === 'quiet' ? 'Quiet Environment' :
                  need.charAt(0).toUpperCase() + need.slice(1)
                ).join(' · ')}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Persona Assignment */}
      <div className="bg-greyed-navy p-6 rounded-lg text-white">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-greyed-blue/30 rounded-full flex items-center justify-center mr-4 text-greyed-white">
            {aiPersonaName === 'Nova' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>
            ) : aiPersonaName === 'Lex' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
            ) : aiPersonaName === 'Milo' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/></svg>
            ) : aiPersonaName === 'Zara' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-medium text-greyed-white flex items-center">
              Meet {aiPersonaName}
              <CheckCircle className="w-4 h-4 ml-2 text-greyed-blue" />
            </h3>
            <p className="text-greyed-white/80 mt-1">
              Your personalized El AI assistant, tailored to your learning profile.
            </p>
            
            <p className="mt-4 text-sm text-greyed-white/90 bg-greyed-white/10 p-3 rounded-lg">
              {aiPersonaName === 'Nova' ? (
                "Hi! I'm Nova — your personal El AI tutor. I love using visuals, stories, and creative angles to help you master your learning journey."
              ) : aiPersonaName === 'Lex' ? (
                "Hello, I'm Lex — your El AI tutor. I'll help you organize information logically and provide structured approaches to master your subjects."
              ) : aiPersonaName === 'Milo' ? (
                "Hey there! I'm Milo, your El AI learning partner. I'll keep our sessions dynamic and engaging with plenty of real-world examples."
              ) : aiPersonaName === 'Zara' ? (
                "Hello, I'm Zara. I'll be your El AI tutor, providing a calm, steady approach to help you learn at your own pace without pressure."
              ) : aiPersonaName === 'Kai' ? (
                "Hi, I'm Kai, your El AI tutor. I'll adapt to your needs, balancing structure with creativity to help you achieve your learning goals."
              ) : (
                "I'm Sage, your El AI tutor. I'll help you explore ideas through thoughtful questions and guide you to discover solutions on your own."
              )}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-greyed-navy/60 text-center">
        <p>
          This profile helps El AI understand how you think, feel, and learn. 
          Your responses shape your AI assistant to create the most effective learning experience for you.
        </p>
        <p className="mt-2">
          Click "Complete" to finalize your profile and start your personalized learning journey.
        </p>
      </div>
    </div>
  );
};

export default SummaryStep;