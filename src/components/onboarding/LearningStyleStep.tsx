import React, { useEffect, useState } from 'react';
import { BookOpen, Video as VideoIcon, Headphones, PenTool, Mouse } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { LearningStyle } from '../../types/onboarding';

interface LearningStyleStepProps {
  onValidityChange: (isValid: boolean) => void;
}

// Define learning style options
const learningStyleOptions: { id: LearningStyle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'Visual',
    label: 'Visual Learner',
    description: 'Learn best through images, diagrams, and videos',
    icon: <VideoIcon className="w-6 h-6" />
  },
  {
    id: 'Auditory',
    label: 'Auditory Learner',
    description: 'Learn best through listening and discussion',
    icon: <Headphones className="w-6 h-6" />
  },
  {
    id: 'Reading/Writing',
    label: 'Reading/Writing Learner',
    description: 'Learn best through text-based materials',
    icon: <PenTool className="w-6 h-6" />
  },
  {
    id: 'Kinesthetic',
    label: 'Kinesthetic Learner',
    description: 'Learn best through physical activities and practice',
    icon: <Mouse className="w-6 h-6" />
  }
];

// Scenario questions to confirm learning style
const scenarios = [
  {
    id: 'scenario1',
    question: "You're struggling with a concept in math. What do you do first?",
    options: [
      { id: 'Visual', text: 'Watch an example video' },
      { id: 'Reading/Writing', text: 'Read the textbook again' },
      { id: 'Auditory', text: 'Ask someone to explain it out loud' },
      { id: 'Kinesthetic', text: 'Try solving examples on your own' }
    ]
  },
  {
    id: 'scenario2',
    question: "When learning a new skill, which approach works best for you?",
    options: [
      { id: 'Reading/Writing', text: 'Reading a detailed guide' },
      { id: 'Visual', text: 'Watching someone demonstrate it' },
      { id: 'Kinesthetic', text: 'Practicing it hands-on' },
      { id: 'Auditory', text: 'Having someone talk you through it' }
    ]
  }
];

const LearningStyleStep: React.FC<LearningStyleStepProps> = ({ onValidityChange }) => {
  const { personalityAssessment, updatePersonalityAssessment } = useOnboarding();
  const [primaryStyle, setPrimaryStyle] = useState<LearningStyle>(personalityAssessment.primaryLearningStyle || null);
  const [scenarioResponses, setScenarioResponses] = useState<Record<string, string>>({});
  const [stylesRanking, setStylesRanking] = useState<LearningStyle[]>(
    personalityAssessment.learningStyles?.filter(style => 
      style === 'Visual' || style === 'Auditory' || style === 'Kinesthetic' || style === 'Reading/Writing'
    ) as LearningStyle[] || []
  );
  
  // Drag-and-drop state
  const [draggedItem, setDraggedItem] = useState<LearningStyle | null>(null);
  
  // Handle primary style selection
  const handlePrimaryStyleChange = (styleId: LearningStyle) => {
    setPrimaryStyle(styleId);
    
    // If this style isn't in the ranking yet, add it at the top
    if (!stylesRanking.includes(styleId)) {
      setStylesRanking(prev => [styleId, ...prev]);
    }
  };
  
  // Handle scenario response
  const handleScenarioResponse = (scenarioId: string, styleId: string) => {
    setScenarioResponses(prev => ({
      ...prev,
      [scenarioId]: styleId
    }));
  };
  
  // Handle drag start
  const handleDragStart = (style: LearningStyle) => {
    setDraggedItem(style);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    const currentIndex = stylesRanking.indexOf(draggedItem);
    if (currentIndex === -1 || currentIndex === targetIndex) return;
    
    // Reorder the list
    const newRanking = [...stylesRanking];
    newRanking.splice(currentIndex, 1);
    newRanking.splice(targetIndex, 0, draggedItem);
    setStylesRanking(newRanking);
  };
  
  // Calculate and update learning style data
  useEffect(() => {
    const primarySelected = !!primaryStyle;
    const allScenariosAnswered = Object.keys(scenarioResponses).length === scenarios.length;
    const hasRanking = stylesRanking.length > 0;
    
    const isValid = primarySelected && hasRanking;
    onValidityChange(isValid);
    
    if (!isValid) return;
    
    // Determine primary and secondary styles
    let primaryLearningStyle = primaryStyle;
    
    // If we don't have a primary selection but have scenario responses,
    // use the most frequent response as primary
    if (!primaryLearningStyle && allScenariosAnswered) {
      const styleCounts: Record<string, number> = {};
      Object.values(scenarioResponses).forEach(style => {
        styleCounts[style] = (styleCounts[style] || 0) + 1;
      });
      
      let maxCount = 0;
      let mostFrequentStyle: LearningStyle | null = null;
      
      Object.entries(styleCounts).forEach(([style, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostFrequentStyle = style as LearningStyle;
        }
      });
      
      if (mostFrequentStyle) {
        primaryLearningStyle = mostFrequentStyle;
      }
    }
    
    updatePersonalityAssessment({ 
      primaryLearningStyle,
      learningStyles: stylesRanking
    });
  }, [primaryStyle, scenarioResponses, stylesRanking, updatePersonalityAssessment, onValidityChange]);

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-headline font-bold text-primary mb-2">
          Learning Style Assessment
        </h2>
        
        <p className="text-primary/80">
          Let's discover how you learn most effectively.
        </p>
      </div>
      
      {/* Part A: Primary Learning Style */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-3">
          I learn best when...
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningStyleOptions.map(style => (
            <label 
              key={style.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                primaryStyle === style.id
                  ? 'border-accent bg-accent/10' 
                  : 'border-primary/20 hover:border-primary/40'
              }`}
            >
              <input
                type="radio"
                name="learning-style"
                className="sr-only"
                value={style.id}
                checked={primaryStyle === style.id}
                onChange={() => handlePrimaryStyleChange(style.id)}
              />
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mr-3 text-primary">
                  {style.icon}
                </div>
                <div>
                  <div className="font-medium text-primary">{style.label}</div>
                  <p className="text-sm text-primary/70 mt-1">{style.description}</p>
                </div>
              </div>
              
              {primaryStyle === style.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-accent rounded-full"></div>
              )}
            </label>
          ))}
        </div>
      </div>
      
      {/* Part B: Ranked Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-primary mb-3">
          Rank your learning preferences (drag to reorder)
        </h3>
        
        <div className="bg-surface-white/50 p-4 rounded-lg">
          {/* Available styles to rank */}
          <div className="flex flex-wrap gap-2 mb-4">
            {learningStyleOptions
              .filter(style => !stylesRanking.includes(style.id))
              .map(style => (
                <div
                  key={style.id}
                  draggable
                  onDragStart={() => handleDragStart(style.id)}
                  className="bg-white px-3 py-2 rounded-lg border border-primary/20 cursor-grab flex items-center"
                >
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-2 text-primary">
                    {style.icon}
                  </div>
                  <span className="text-sm font-medium text-primary">{style.label}</span>
                </div>
              ))}
          </div>
          
          {/* Ranked list */}
          <div className="space-y-2">
            {stylesRanking.length > 0 ? (
              stylesRanking.map((styleId, index) => {
                const style = learningStyleOptions.find(s => s.id === styleId);
                if (!style) return null;
                
                return (
                  <div
                    key={styleId}
                    draggable
                    onDragStart={() => handleDragStart(styleId)}
                    onDragOver={e => handleDragOver(e, index)}
                    className="bg-white px-3 py-3 rounded-lg border border-primary/20 cursor-grab flex items-center"
                  >
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mr-3 text-primary">
                      {index + 1}
                    </div>
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mr-2 text-primary">
                      {style.icon}
                    </div>
                    <span className="font-medium text-primary">{style.label}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-primary/60 text-center py-4">
                Drag learning styles here to rank them in your order of preference
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Part C: Scenario-based questions */}
      <div>
        <h3 className="text-lg font-medium text-primary mb-3">
          Learning Scenarios
        </h3>
        
        <div className="space-y-6">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="bg-surface-white/50 p-4 rounded-lg">
              <p className="font-medium text-primary mb-3">{scenario.question}</p>
              
              <div className="space-y-2">
                {scenario.options.map(option => (
                  <label 
                    key={option.id}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      scenarioResponses[scenario.id] === option.id
                        ? 'border-accent bg-accent/10' 
                        : 'border-primary/20 hover:border-primary/30 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name={scenario.id}
                      className="mt-1 mr-3"
                      checked={scenarioResponses[scenario.id] === option.id}
                      onChange={() => handleScenarioResponse(scenario.id, option.id)}
                    />
                    <span className="text-primary">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningStyleStep;