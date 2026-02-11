import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { Loader, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

// Onboarding step components
import ProgressBar from '../../components/onboarding/ProgressBar';
import WelcomeStep from '../../components/onboarding/WelcomeStep';
import UserInfoStep from '../../components/onboarding/UserInfoStep';
import BigFiveStep from '../../components/onboarding/BigFiveStep';
import CreativityStep from '../../components/onboarding/CreativityStep';
import NeurodivergenceStep from '../../components/onboarding/NeurodivergenceStep';
import LearningStyleStep from '../../components/onboarding/LearningStyleStep';
import BackgroundStep from '../../components/onboarding/BackgroundStep';
import SummaryStep from '../../components/onboarding/SummaryStep';
import CompletionStep from '../../components/onboarding/CompletionStep';

const MAX_STEPS = 9;

const OnboardingAssessment: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentStep, 
    setCurrentStep, 
    onboardingData, 
    personalityAssessment, 
    updateOnboardingData, 
    saveToSupabase, 
    isLoading, 
    error 
  } = useOnboarding();
  
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      // Save the current location to redirect back after login
      navigate('/auth/login', { state: { from: location } });
    }
    
    // Set document title
    document.title = "Personalized Onboarding | GreyEd";
  }, [user, authLoading, navigate, location]);

  // Function to move to next step
  const goToNextStep = async () => {
    // If we're on the last step, save to Supabase and complete
    if (currentStep === MAX_STEPS - 1) {
      setIsSubmitting(true);
      try {
        const success = await saveToSupabase();
        if (success) {
          setCurrentStep(MAX_STEPS);
          setCompleted(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Otherwise just go to next step
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to go back to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Different step components
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onValidityChange={setIsStepValid} />;
      case 2:
        return <UserInfoStep onValidityChange={setIsStepValid} />;
      case 3:
        return <BigFiveStep onValidityChange={setIsStepValid} />;
      case 4:
        return <CreativityStep onValidityChange={setIsStepValid} />;
      case 5:
        return <NeurodivergenceStep onValidityChange={setIsStepValid} />;
      case 6:
        return <LearningStyleStep onValidityChange={setIsStepValid} />;
      case 7:
        return <BackgroundStep onValidityChange={setIsStepValid} />;
      case 8:
        return <SummaryStep onValidityChange={setIsStepValid} />;
      case 9:
        return <CompletionStep onboardingData={onboardingData} />;
      default:
        return <WelcomeStep onValidityChange={setIsStepValid} />;
    }
  };

  // If user is not loaded yet, show loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-white p-4">
        <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-primary font-medium">Loading your assessment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-headline font-bold text-primary">GreyEd Onboarding</h1>
            {currentStep < MAX_STEPS && (
              <div className="text-sm text-primary/70">
                Step {currentStep} of {MAX_STEPS - 1}
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {currentStep < MAX_STEPS && (
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={MAX_STEPS - 1} 
              steps={[
                "Welcome",
                "Personal Info",
                "Personality",
                "Creativity",
                "Learning Needs",
                "Learning Style",
                "Background",
                "Summary"
              ]}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex flex-col">
        <div className="max-w-3xl mx-auto w-full bg-white rounded-xl shadow-md p-6 md:p-8">
          {/* Error message if any */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg">
              <p className="font-medium">There was an error</p>
              <p>{error}</p>
            </div>
          )}
          
          {/* Step content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>
          
          {/* Navigation buttons */}
          {currentStep < MAX_STEPS && (
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-primary bg-transparent border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}
              
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!isStepValid || isSubmitting || isLoading}
                className={`flex items-center px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors ${
                  (!isStepValid || isSubmitting || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {currentStep === MAX_STEPS - 1 ? 'Submitting...' : 'Next...'}
                  </>
                ) : (
                  <>
                    {currentStep === MAX_STEPS - 1 ? 'Complete' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* If on completion step, show dashboard button */}
          {currentStep === MAX_STEPS && completed && (
            <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-primary/60">
          <p>© 2025 GreyEd. All rights reserved.</p>
          <p className="mt-1">Your data is securely stored and used only to personalize your learning experience.</p>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingAssessment;