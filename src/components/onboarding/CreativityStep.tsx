import React, { useEffect, useState } from 'react';
import { Sparkles, PenTool } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

interface CreativityStepProps {
  onValidityChange: (isValid: boolean) => void;
}

const CreativityStep: React.FC<CreativityStepProps> = ({ onValidityChange }) => {
  const { personalityAssessment, updatePersonalityAssessment } = useOnboarding();
  const [preferredStyle, setPreferredStyle] = useState<string | null>(personalityAssessment.creativityProfile || null);
  const [paperclipUses, setPaperclipUses] = useState<string>('');
  const [selfRatings, setSelfRatings] = useState({
    openEnded: personalityAssessment.bigFive.openness || 3,
    structured: personalityAssessment.bigFive.conscientiousness || 3
  });
  
  // Calculate and update creativity profile whenever inputs change
  useEffect(() => {
    // Check if all required fields are filled
    const forcedChoiceSelected = !!preferredStyle;
    const paperclipUsesProvided = paperclipUses.trim().length > 0;
    const ratingsProvided = selfRatings.openEnded > 0 && selfRatings.structured > 0;
    
    const isValid = forcedChoiceSelected && paperclipUsesProvided && ratingsProvided;
    onValidityChange(isValid);
    
    if (!isValid) return;
    
    // Calculate creativity profile
    let creativityProfile: 'Divergent' | 'Convergent' | 'Hybrid';
    
    // Analyze paperclip uses
    const usesCount = paperclipUses.split(/[.,;]\s*/).filter(item => item.trim().length > 0).length;
    const isCreativeResponse = usesCount >= 3;
    
    // Combine all factors
    if (preferredStyle === 'divergent' || (selfRatings.openEnded > 4 && isCreativeResponse)) {
      creativityProfile = 'Divergent';
    } else if (preferredStyle === 'convergent' || (selfRatings.structured > 4 && !isCreativeResponse)) {
      creativityProfile = 'Convergent';
    } else {
      creativityProfile = 'Hybrid';
    }
    
    updatePersonalityAssessment({ creativityProfile });
  }, [preferredStyle, paperclipUses, selfRatings, updatePersonalityAssessment, onValidityChange]);
  
  // Handle self-rating changes
  const handleRatingChange = (type: 'openEnded' | 'structured', value: number) => {
    setSelfRatings(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-greyed-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-greyed-navy" />
        </div>
        
        <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-2">
          Creativity Style
        </h2>
        
        <p className="text-greyed-navy/80">
          Let's explore how you approach creative problem-solving.
        </p>
      </div>
      
      {/* Part A: Forced Choice */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-greyed-navy mb-3">
          Which sounds more like you?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label 
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              preferredStyle === 'divergent' 
                ? 'border-greyed-blue bg-greyed-blue/10' 
                : 'border-greyed-navy/20 hover:border-greyed-navy/40'
            }`}
          >
            <input
              type="radio"
              name="creativity-style"
              className="sr-only"
              value="divergent"
              checked={preferredStyle === 'divergent'}
              onChange={() => setPreferredStyle('divergent')}
            />
            <div className="text-greyed-navy font-medium mb-1">I generate lots of ideas quickly</div>
            <p className="text-sm text-greyed-navy/70">I prefer brainstorming many possibilities rather than focusing on one solution.</p>
            
            {preferredStyle === 'divergent' && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-greyed-blue rounded-full"></div>
            )}
          </label>
          
          <label 
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              preferredStyle === 'convergent' 
                ? 'border-greyed-blue bg-greyed-blue/10' 
                : 'border-greyed-navy/20 hover:border-greyed-navy/40'
            }`}
          >
            <input
              type="radio"
              name="creativity-style"
              className="sr-only"
              value="convergent"
              checked={preferredStyle === 'convergent'}
              onChange={() => setPreferredStyle('convergent')}
            />
            <div className="text-greyed-navy font-medium mb-1">I prefer to evaluate and refine one good idea</div>
            <p className="text-sm text-greyed-navy/70">I like to focus deeply on a single approach and make it the best it can be.</p>
            
            {preferredStyle === 'convergent' && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-greyed-blue rounded-full"></div>
            )}
          </label>
        </div>
      </div>
      
      {/* Part B: Scenario Based */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <PenTool className="w-5 h-5 text-greyed-blue mr-2" />
          <h3 className="text-lg font-medium text-greyed-navy">Creative Challenge</h3>
        </div>
        
        <div className="bg-greyed-white/50 p-4 rounded-lg">
          <p className="text-greyed-navy mb-3">
            Name as many uses as you can think of for a paperclip:
          </p>
          
          <textarea
            value={paperclipUses}
            onChange={(e) => setPaperclipUses(e.target.value)}
            className="w-full px-3 py-2 border border-greyed-navy/20 rounded-md focus:outline-none focus:border-greyed-blue focus:ring-1 focus:ring-greyed-blue"
            rows={4}
            placeholder="Holding papers together, as a bookmark, to clean under fingernails..."
          />
          
          <p className="text-sm text-greyed-navy/60 mt-2">
            Separate different uses with commas or line breaks.
          </p>
        </div>
      </div>
      
      {/* Part C: Self Ratings */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-greyed-navy mb-3">
          Rate yourself on the following:
        </h3>
        
        {/* Open-ended problems */}
        <div className="bg-greyed-white/50 p-4 rounded-lg">
          <p className="font-medium text-greyed-navy mb-2">"I enjoy solving open-ended problems."</p>
          
          <div className="flex justify-between items-center mt-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange('openEnded', rating)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none transition-colors ${
                  selfRatings.openEnded === rating
                    ? 'bg-greyed-blue text-greyed-navy'
                    : 'bg-white border border-greyed-navy/30 text-greyed-navy hover:bg-greyed-navy/5'
                }`}
                aria-label={`Rate ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center px-2 mt-1">
            <span className="text-xs text-greyed-navy/60">Strongly Disagree</span>
            <span className="text-xs text-greyed-navy/60">Strongly Agree</span>
          </div>
        </div>
        
        {/* Structure and clarity */}
        <div className="bg-greyed-white/50 p-4 rounded-lg">
          <p className="font-medium text-greyed-navy mb-2">"I work best with structure and clarity."</p>
          
          <div className="flex justify-between items-center mt-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange('structured', rating)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none transition-colors ${
                  selfRatings.structured === rating
                    ? 'bg-greyed-blue text-greyed-navy'
                    : 'bg-white border border-greyed-navy/30 text-greyed-navy hover:bg-greyed-navy/5'
                }`}
                aria-label={`Rate ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center px-2 mt-1">
            <span className="text-xs text-greyed-navy/60">Strongly Disagree</span>
            <span className="text-xs text-greyed-navy/60">Strongly Agree</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativityStep;