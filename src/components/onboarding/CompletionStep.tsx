import React from 'react';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OnboardingData } from '../../types/onboarding';

interface CompletionStepProps {
  onboardingData: OnboardingData;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onboardingData }) => {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-cyan-400" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-headline font-bold text-greyed-navy mb-4">
        Your profile is complete!
      </h2>
      
      <p className="text-lg text-greyed-navy/80 mb-8 max-w-lg mx-auto">
        Thank you for completing your assessment, {onboardingData.firstName}! 
        Your El AI assistant has been personalized to match your unique learning style and preferences.
      </p>
      
      {/* Email notification */}
      <div className="bg-greyed-white/50 rounded-lg p-6 mb-8 max-w-lg mx-auto text-left">
        <div className="flex items-start">
          <div className="bg-greyed-blue/20 rounded-full p-2 mr-3 text-greyed-navy">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
          </div>
          <div>
            <h3 className="font-medium text-greyed-navy">
              Confirmation Email Sent
            </h3>
            <p className="text-sm text-greyed-navy/70 mt-1">
              We've sent a welcome email to <strong>{onboardingData.email}</strong> with a summary of your profile and next steps.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-greyed-navy p-6 rounded-lg text-white max-w-lg mx-auto mb-8">
        <h3 className="font-medium text-xl mb-3 flex items-center justify-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Next Steps
        </h3>
        
        <ul className="space-y-4 text-left">
          <li className="flex items-start">
            <div className="bg-greyed-blue/30 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mt-0.5 mr-3 flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-greyed-white">Explore your personalized dashboard</p>
              <p className="text-sm text-greyed-white/70">See recommendations tailored to your learning style</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="bg-greyed-blue/30 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mt-0.5 mr-3 flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-greyed-white">Chat with your El AI assistant</p>
              <p className="text-sm text-greyed-white/70">Ask questions and get personalized help with your studies</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <div className="bg-greyed-blue/30 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mt-0.5 mr-3 flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-greyed-white">Complete your profile</p>
              <p className="text-sm text-greyed-white/70">Set your subjects and specific learning goals</p>
            </div>
          </li>
        </ul>
      </div>
      
      <Link 
        to="/dashboard" 
        className="inline-flex items-center bg-greyed-navy hover:bg-greyed-navy/90 text-white py-3 px-6 rounded-full transition-colors"
      >
        Go to Dashboard
        <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  );
};

export default CompletionStep;