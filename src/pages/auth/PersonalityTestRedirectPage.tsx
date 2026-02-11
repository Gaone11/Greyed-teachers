import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';

const PersonalityTestRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Set document title
  useEffect(() => {
    document.title = "Start Your GreyEd Teachers Journey";
    
    // Skip this page and redirect directly to signup
    navigate('/auth/signup');
  }, [navigate]);

  // This page now simply redirects to signup, so we'll show a minimal loading state
  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-surface-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-primary font-medium">Redirecting to GreyEd Teachers signup...</p>
        </div>
      </div>
      
      <Footer />
    </LandingLayout>
  );
};

export default PersonalityTestRedirectPage;