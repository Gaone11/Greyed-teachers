import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingLayout from '../../components/layout/LandingLayout';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import { XCircle } from 'lucide-react';

const CanceledPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Payment Canceled | GreyEd";
  }, []);

  // Determine if user was likely coming from teacher settings
  const isFromTeacherSettings = document.referrer.includes('/teachers/settings');

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-surface-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-primary/70 mb-6">
              <XCircle className="h-16 w-16 mx-auto" />
            </div>
            
            <h1 className="text-2xl font-headline font-bold text-primary mb-4">
              Payment Canceled
            </h1>
            
            <p className="text-primary/70 mb-8">
              Your payment was canceled and you have not been charged.
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(isFromTeacherSettings ? '/teachers/settings#subscription' : '/pricing')}
                className="bg-primary text-surface-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <img src="/favicon.svg" alt="GreyEd" className="w-5 h-5 mr-2" loading="eager" />
                {isFromTeacherSettings ? 'Return to Settings' : 'Return to Pricing'}
              </button>
              
              <button 
                onClick={() => navigate('/contact')}
                className="bg-surface-white text-primary border border-primary/20 px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </LandingLayout>
  );
};

export default CanceledPage;