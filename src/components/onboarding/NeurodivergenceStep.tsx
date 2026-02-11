import React, { useEffect, useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

interface NeurodivergenceStepProps {
  onValidityChange: (isValid: boolean) => void;
}

// Available neurodivergence options
const neurodivergenceOptions = [
  { id: 'adhd', label: 'I have been diagnosed with ADHD or ADD' },
  { id: 'dyslexia', label: 'I am dyslexic or have reading difficulties' },
  { id: 'sensory', label: 'I experience sensory overload easily' },
  { id: 'focus', label: 'I struggle with sustained focus' },
  { id: 'auditory', label: 'I process things better when spoken aloud' },
  { id: 'quiet', label: 'I prefer quiet environments to concentrate' },
  { id: 'asd', label: 'I have been diagnosed with autism spectrum disorder (ASD)' },
  { id: 'dyscalculia', label: 'I have difficulty with numbers or math' },
  { id: 'none', label: 'None of these apply to me' }
];

const NeurodivergenceStep: React.FC<NeurodivergenceStepProps> = ({ onValidityChange }) => {
  const { personalityAssessment, updatePersonalityAssessment } = useOnboarding();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(personalityAssessment.neurodivergence || []);
  
  // Toggle selection of an option
  const toggleOption = (optionId: string) => {
    if (optionId === 'none') {
      // If "None" is selected, clear all other selections
      setSelectedOptions(['none']);
    } else {
      // If any other option is selected, remove "None" if it's selected
      setSelectedOptions(prev => {
        const newSelection = prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev.filter(id => id !== 'none'), optionId];
        return newSelection;
      });
    }
  };
  
  // This step is always valid since it's optional
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);
  
  // Update context when selections change
  useEffect(() => {
    updatePersonalityAssessment({ neurodivergence: selectedOptions });
  }, [selectedOptions, updatePersonalityAssessment]);

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeartPulse className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-headline font-bold text-primary mb-2">
          Learning Needs & Preferences
        </h2>
        
        <p className="text-primary/80">
          This optional section helps us adapt content to your unique needs.
        </p>
      </div>
      
      <div className="bg-surface/20 p-4 rounded-lg mb-6">
        <p className="text-primary/80 text-sm">
          Your answers help El AI adjust its teaching style to your needs. This information is private and used only to improve your learning experience.
        </p>
      </div>
      
      <div className="space-y-3">
        <p className="font-medium text-primary mb-2">Please tick any that apply to you:</p>
        
        {neurodivergenceOptions.map(option => (
          <label
            key={option.id}
            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedOptions.includes(option.id) 
                ? 'border-accent bg-accent/10' 
                : 'border-primary/20 hover:border-primary/30'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 mr-3"
              checked={selectedOptions.includes(option.id)}
              onChange={() => toggleOption(option.id)}
            />
            <span className="text-primary">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default NeurodivergenceStep;