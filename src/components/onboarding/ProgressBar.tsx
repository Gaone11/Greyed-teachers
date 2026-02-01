import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  // Calculate progress percentage
  const progress = Math.floor((currentStep / totalSteps) * 100);
  
  return (
    <div className="mt-4">
      {/* Progress percentage and step indicator */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-greyed-navy/70">Progress: {progress}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-greyed-navy/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-greyed-blue to-greyed-navy rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      {steps && (
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            
            return (
              <div 
                key={index} 
                className={`hidden md:block flex-1 text-center ${isActive ? 'text-greyed-blue font-medium' : isCompleted ? 'text-greyed-navy/70' : 'text-greyed-navy/40'}`}
              >
                <div 
                  className={`w-3 h-3 mx-auto rounded-full mb-1 ${
                    isActive 
                      ? 'bg-greyed-blue ring-4 ring-greyed-blue/20' 
                      : isCompleted 
                        ? 'bg-greyed-navy/60' 
                        : 'bg-greyed-navy/20'
                  }`}
                ></div>
                <span className="text-[0.65rem] hidden lg:block">{step}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;