import React, { useEffect } from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import NavBar from '../components/layout/NavBar';
import HeroTutoring from '../components/tutoring/HeroTutoring';
import WhyHybridSection from '../components/tutoring/WhyHybridSection';
import BookingProcess from '../components/tutoring/BookingProcess';
import TutorBenefits from '../components/tutoring/TutorBenefits';
import SessionRecapStrip from '../components/tutoring/SessionRecapStrip';
import FAQAccordion from '../components/tutoring/FAQAccordion';
import CTABookDemo from '../components/tutoring/CTABookDemo';
import UserDashboardRedirect from '../components/ui/UserDashboardRedirect';

interface TutoringPageProps {
  openAdminLoginModal?: () => void;
}

const TutoringPage: React.FC<TutoringPageProps> = ({ openAdminLoginModal }) => {
  // Set document title and meta description for SEO
  useEffect(() => {
    document.title = "Tutoring Programme — GreyEd | GreyEd";

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Human tutors use the GreyEd platform to support learners at GreyEd in Mpumalanga, South Africa.');
    }
  }, []);

  return (
    <UserDashboardRedirect>
      <LandingLayout footerProps={{ openAdminLoginModal }}>
        <NavBar />
        <HeroTutoring />
        <WhyHybridSection />
        <BookingProcess />
        <TutorBenefits />
        <SessionRecapStrip />
        <FAQAccordion />
        <CTABookDemo />
      </LandingLayout>
    </UserDashboardRedirect>
  );
};

export default TutoringPage;