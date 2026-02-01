import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { OnboardingProvider } from '../../context/OnboardingContext';
import OnboardingAssessment from './OnboardingAssessment';

const PersonalityAssessmentPage: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Set the document title based on current URL
    document.title = "Personality Assessment | GreyEd – Personalized Learning";
    
    // Update metadata for SEO
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Take our science-backed personality and learning style test to personalize your El AI experience. Built for students, thinkers, and future-shapers.');
    }
  }, [location]);

  return (
    <OnboardingProvider>
      <Routes>
        <Route path="/" element={<OnboardingAssessment />} />
        <Route path="*" element={<Navigate to="/auth/personality-assessment" replace />} />
      </Routes>
    </OnboardingProvider>
  );
};

export default PersonalityAssessmentPage;