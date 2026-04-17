import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getUserSubscription } from '../../lib/stripe';
import { getProductByPriceId } from '../../stripe-config';
import LandingLayout from '../../components/layout/LandingLayout';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import { CheckCircle, Loader, ArrowRight, AlertCircle } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTeacherSubscription, setIsTeacherSubscription] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
    document.title = "Payment Successful | GreyEd";
    
    if (!sessionId) {
      navigate('/');
      return;
    }

    const fetchSubscriptionDetails = async () => {
      try {
        setLoading(true);
        
        // Wait a moment to allow the webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get the user's subscription
        const subscriptionData = await getUserSubscription();
        
        
        if (subscriptionData) {
          setSubscription(subscriptionData);
          
          // Check if it's a teacher subscription
          const product = getProductByPriceId(subscriptionData.price_id);
          if (product && product.id === 'prod_SEX33cyJtBoQVP') {
            setIsTeacherSubscription(true);
          }

          // Check if a trial is active - look at the current period end relative to now
          // A 14-day trial would set current_period_end roughly 14 days in the future
          const now = Math.floor(Date.now() / 1000); // current time in seconds
          const trialEndsIn = subscriptionData.current_period_end - now;
          
          // If period ends in more than 10 days, it's likely a trial
          // (allowing some time for processing delays)
          if (trialEndsIn > 10 * 24 * 60 * 60) {
            setIsTrialActive(true);
          }
        }
      } catch {
        setError('Failed to load account details. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [sessionId, navigate]);

  const getProductName = () => {
    if (!subscription?.price_id) return 'your account';

    const product = getProductByPriceId(subscription.price_id);
    return product?.name || 'your account';
  };

  // Function to handle the dashboard redirect
  const goToDashboard = () => {
    navigate('/teachers/dashboard');
  };

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            {loading ? (
              <div className="py-12 flex flex-col items-center">
                <Loader className="w-12 h-12 text-greyed-blue animate-spin mb-4" />
                <p className="text-greyed-navy font-medium">Setting up your account...</p>
              </div>
            ) : error ? (
              <div className="py-12">
                <div className="text-red-500 mb-4">
                  <AlertCircle className="h-16 w-16 mx-auto" />
                </div>
                <h1 className="text-2xl font-headline font-bold text-greyed-navy mb-4">Something went wrong</h1>
                <p className="text-greyed-navy/70 mb-6">{error}</p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-greyed-navy text-greyed-white px-6 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            ) : (
              <>
                <div className="text-cyan-400 mb-6">
                  <CheckCircle className="h-16 w-16 mx-auto" />
                </div>
                
                <h1 className="text-2xl font-headline font-bold text-greyed-navy mb-4">
                  {isTrialActive ? 'Your Account Is Now Active!' : 'Payment Successful!'}
                </h1>
                
                <p className="text-greyed-navy/70 mb-6">
                  {isTrialActive ?
                    `Welcome to GreyEd Teachers! You now have full access to all features.` :
                    `Thank you for joining ${getProductName()}. Your account has been successfully activated.`
                  }
                </p>
                
                <div className="bg-greyed-beige/30 rounded-lg p-4 mb-8 text-left">
                  <h2 className="font-semibold text-greyed-navy mb-2">What's next?</h2>
                  <ul className="space-y-2 text-greyed-navy/80">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You now have access to all features in your teacher account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Create unlimited AI-powered lesson plans and assessments</span>
                    </li>
                    {isTrialActive && (
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Explore all the tools available in your account</span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You can manage your account from your settings</span>
                    </li>
                  </ul>
                </div>
                
                <button 
                  onClick={goToDashboard}
                  className="bg-greyed-navy text-greyed-white px-6 py-3 rounded-lg hover:bg-greyed-navy/90 transition-colors flex items-center justify-center mx-auto"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </LandingLayout>
  );
};

export default SuccessPage;