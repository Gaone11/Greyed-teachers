import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { QuestionResponse } from '../../types/onboarding';

interface BigFiveStepProps {
  onValidityChange: (isValid: boolean) => void;
}

// Big Five questions (short-form)
const bigFiveQuestions = [
  {
    id: 'o1',
    text: 'I enjoy trying out new and different activities.',
    category: 'openness'
  },
  {
    id: 'o2',
    text: 'I am curious about many different things.',
    category: 'openness'
  },
  {
    id: 'c1',
    text: 'I like to plan ahead and follow schedules.',
    category: 'conscientiousness'
  },
  {
    id: 'c2',
    text: 'I finish tasks right away.',
    category: 'conscientiousness'
  },
  {
    id: 'e1',
    text: 'I feel energized when around other people.',
    category: 'extraversion'
  },
  {
    id: 'e2',
    text: 'I enjoy leading group activities.',
    category: 'extraversion'
  },
  {
    id: 'a1',
    text: 'I am helpful and unselfish with others.',
    category: 'agreeableness'
  },
  {
    id: 'a2',
    text: 'I try to see things from other people\'s point of view.',
    category: 'agreeableness'
  },
  {
    id: 'n1',
    text: 'I get stressed out easily.',
    category: 'neuroticism'
  },
  {
    id: 'n2',
    text: 'I often feel anxious or worried.',
    category: 'neuroticism'
  }
];

const BigFiveStep: React.FC<BigFiveStepProps> = ({ onValidityChange }) => {
  const { personalityAssessment, updatePersonalityAssessment } = useOnboarding();
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  
  // Set initial responses from existing data or defaults
  useEffect(() => {
    const initialResponses: QuestionResponse[] = bigFiveQuestions.map(question => {
      const category = question.category as keyof typeof personalityAssessment.bigFive;
      const existingValue = personalityAssessment.bigFive[category];
      
      // If this category has a value, use it for all questions in that category
      const value = existingValue > 0 ? existingValue : 0;
      
      return {
        questionId: question.id,
        value,
        category: question.category
      };
    });
    
    setResponses(initialResponses);
  }, [personalityAssessment.bigFive]);
  
  // Calculate Big Five scores when responses change
  useEffect(() => {
    // Check if all questions have been answered
    const allAnswered = responses.every(response => response.value > 0);
    onValidityChange(allAnswered);
    
    if (!allAnswered) return;
    
    // Calculate average for each category
    const categoryScores: Record<string, {sum: number, count: number}> = {};
    
    responses.forEach(response => {
      if (!response.category) return;
      
      if (!categoryScores[response.category]) {
        categoryScores[response.category] = { sum: 0, count: 0 };
      }
      
      categoryScores[response.category].sum += Number(response.value);
      categoryScores[response.category].count += 1;
    });
    
    // Calculate averages and update context
    const bigFive = {
      openness: categoryScores.openness ? categoryScores.openness.sum / categoryScores.openness.count : 0,
      conscientiousness: categoryScores.conscientiousness ? categoryScores.conscientiousness.sum / categoryScores.conscientiousness.count : 0,
      extraversion: categoryScores.extraversion ? categoryScores.extraversion.sum / categoryScores.extraversion.count : 0,
      agreeableness: categoryScores.agreeableness ? categoryScores.agreeableness.sum / categoryScores.agreeableness.count : 0,
      neuroticism: categoryScores.neuroticism ? categoryScores.neuroticism.sum / categoryScores.neuroticism.count : 0
    };
    
    updatePersonalityAssessment({ bigFive });
  }, [responses, updatePersonalityAssessment, onValidityChange]);
  
  // Handle response change
  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev =>
      prev.map(response =>
        response.questionId === questionId
          ? { ...response, value }
          : response
      )
    );
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-headline font-bold text-primary mb-2">
          Personality Assessment
        </h2>
        
        <p className="text-primary/80">
          Rate how much you agree with each statement below.
        </p>
      </div>
      
      <div className="space-y-6">
        {bigFiveQuestions.map((question) => {
          const response = responses.find(r => r.questionId === question.id);
          const value = response ? Number(response.value) : 0;
          
          return (
            <div key={question.id} className="bg-surface-white/50 p-4 rounded-lg">
              <p className="font-medium text-primary mb-3">{question.text}</p>
              
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-primary/60">Strongly Disagree</span>
                <span className="text-sm text-primary/60">Strongly Agree</span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleResponseChange(question.id, rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none transition-colors ${
                      value === rating
                        ? 'bg-accent text-primary'
                        : 'bg-white border border-primary/30 text-primary hover:bg-primary/5'
                    }`}
                    aria-label={`Rate ${rating} out of 5`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BigFiveStep;