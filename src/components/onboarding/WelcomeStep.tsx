import React, { useEffect } from 'react';
import { Brain } from 'lucide-react';

interface WelcomeStepProps {
  onValidityChange: (isValid: boolean) => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onValidityChange }) => {
  // This step is always valid
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Brain className="w-10 h-10 text-greyed-navy" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-headline font-bold text-greyed-navy mb-4">
        Welcome to Your GreyEd Journey
      </h2>
      
      <p className="text-lg text-greyed-navy/80 mb-6 max-w-xl mx-auto">
        Let's set up your personalized learning experience with El AI.
      </p>
      
      <div className="bg-greyed-beige/20 rounded-lg p-6 text-left max-w-xl mx-auto">
        <h3 className="font-headline font-semibold text-greyed-navy mb-3">
          What to expect:
        </h3>
        
        <ul className="space-y-2 text-greyed-navy/80">
          <li className="flex items-start">
            <span className="text-greyed-blue mr-2 font-bold">•</span>
            <span>A short personality and learning style assessment (10-15 min)</span>
          </li>
          <li className="flex items-start">
            <span className="text-greyed-blue mr-2 font-bold">•</span>
            <span>Questions about how you think, learn, and solve problems</span>
          </li>
          <li className="flex items-start">
            <span className="text-greyed-blue mr-2 font-bold">•</span>
            <span>Information about your education background and goals</span>
          </li>
          <li className="flex items-start">
            <span className="text-greyed-blue mr-2 font-bold">•</span>
            <span>Creation of your own personalized El AI assistant</span>
          </li>
        </ul>
      </div>
      
      <p className="text-sm text-greyed-navy/60 mt-6">
        Your answers help El AI adapt to your unique learning style and preferences.
        <br />
        All your information is kept private and secure.
      </p>
    </div>
  );
};

export default WelcomeStep;