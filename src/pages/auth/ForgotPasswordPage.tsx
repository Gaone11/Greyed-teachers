import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, Loader, CheckCircle, ArrowLeft } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import { supabase } from '../../lib/supabase';
import { Container } from '../../components/ui/Container';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/teachers/dashboard');
    }
  }, [user, navigate]);
  
  // Set document title
  useEffect(() => {
    document.title = "Reset Password | GreyEd";
  }, []);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send password reset link via Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) {
        throw error;
      }
      
      // Success - show success message
      setSuccess(true);
    } catch (error: any) {
      
      // Show a generic error message to avoid revealing if the email exists
      setError("If an account exists with this email, a password reset link will be sent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-white">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <Link to="/auth/login" className="inline-flex items-center text-greyed-navy/70 hover:text-greyed-navy transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Login
              </Link>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-greyed-navy mb-2">
                Reset Your Password
              </h1>
              <p className="text-greyed-navy/70 text-sm md:text-base">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              {success ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-cyan-400" />
                  </div>
                  
                  <h2 className="text-xl font-headline font-semibold text-greyed-navy mb-3">
                    Check your email
                  </h2>
                  
                  <p className="text-greyed-navy/80 mb-6">
                    We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                  </p>
                  
                  <Link to="/auth/login" className="inline-flex items-center bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors">
                    Return to Login
                  </Link>
                  
                  <p className="text-sm text-greyed-navy/60 mt-4">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button 
                      onClick={() => {
                        setSuccess(false);
                        setError(null);
                      }}
                      className="text-greyed-blue hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-greyed-navy mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-greyed-navy/30" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                        placeholder="your.email@example.com"
                        autoFocus
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-greyed-navy text-greyed-white font-medium py-3 rounded-lg transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                        Sending Reset Link...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                  
                  <div className="text-center mt-6">
                    <p className="text-greyed-navy/70">
                      Remember your password?{' '}
                      <Link to="/auth/login" className="text-greyed-blue hover:text-greyed-navy font-medium">
                        Log in
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </LandingLayout>
  );
};

export default ForgotPasswordPage;