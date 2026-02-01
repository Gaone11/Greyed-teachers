import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { redirectToCheckout } from '../../lib/stripe';
import { stripeProducts } from '../../stripe-config';
import { ArrowRight, Crown, Loader, AlertCircle } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';

const ActivateAccountPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If no user is logged in, redirect to login page
  if (!user) {
    navigate('/auth/login');
    return null;
  }

  // Handle starting the subscription process
  const handleStartSubscription = async () => {
    setIsRedirecting(true);
    setError(null);

    try {
      // Find the teacher product
      const teacherProduct = stripeProducts.find(p => p.name === 'GreyEd Teachers');
      
      if (!teacherProduct) {
        throw new Error('Product configuration error. Please contact support.');
      }

      // Redirect to Stripe checkout with 14-day trial
      await redirectToCheckout(teacherProduct.priceId, 14);
    } catch {
      setError('Failed to start checkout process. Please try again.');
      setIsRedirecting(false);
    }
  };

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-greyed-navy p-8 text-white text-center">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-headline font-bold mb-3">
                Activate Your GreyEd Teachers Account
              </h1>
              <p className="text-greyed-blue max-w-md mx-auto">
                Complete your account setup to access all features and start your 14-day free trial.
              </p>
            </div>
            
            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-xl font-headline font-semibold text-black mb-4">
                  Welcome to GreyEd Teachers!
                </h2>
                <p className="text-black/80 mb-4">
                  Your account has been created successfully. To complete your setup and unlock all premium features, you'll need to activate your subscription.
                </p>
                <p className="text-black/80 mb-4">
                  Start your 14-day free trial now - no charges during the trial period and you can cancel anytime.
                </p>
                
                <div className="bg-greyed-beige/20 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-black mb-3">What's included:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span>Unlimited AI lesson plans</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span>Auto-graded assessments</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span>Weekly family updates</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-greyed-blue/20 flex items-center justify-center text-greyed-navy mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span>Advanced analytics dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <p className="text-2xl font-bold text-greyed-navy">£8<span className="text-sm font-normal">/month</span></p>
                  <p className="text-sm text-greyed-navy/70">After 14-day free trial</p>
                </div>
                
                <button 
                  onClick={handleStartSubscription}
                  disabled={isRedirecting}
                  className={`px-6 py-3 bg-greyed-navy text-white rounded-lg font-medium transition-colors flex items-center mx-auto ${
                    isRedirecting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
                  }`}
                >
                  {isRedirecting ? (
                    <>
                      <Loader size={18} className="animate-spin mr-2" />
                      Redirecting to checkout...
                    </>
                  ) : (
                    <>
                      Start 14-Day Free Trial
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
                
                <p className="mt-4 text-xs text-greyed-navy/60">
                  Your card won't be charged during the trial period. You can cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </LandingLayout>
  );
};

export default ActivateAccountPage;