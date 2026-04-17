import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, AlertCircle, Loader, CheckCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';
import { supabase } from '../../lib/supabase';

// Validation schema
const updatePasswordSchema = z.object({
  password: z.string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

const UpdatePasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  // Set document title
  useEffect(() => {
    document.title = "Update Password | GreyEd";
  }, []);

  // Handle session establishment from the reset link.
  // Supabase sends either:
  //   - PKCE flow: ?code=xxx (query param)
  //   - Implicit flow: #access_token=xxx&type=recovery (hash fragment)
  useEffect(() => {
    const code = searchParams.get('code');
    let timeoutId: ReturnType<typeof setTimeout>;

    // Set up the auth state listener first so we don't miss the event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        setSessionReady(true);
        setSessionLoading(false);
      }
    });

    if (code) {
      // PKCE flow: exchange the code for a session
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error: exchangeError }) => {
          if (exchangeError) {
            console.error('Code exchange failed:', exchangeError);
            setTokenError(true);
            setSessionLoading(false);
          }
          // On success, onAuthStateChange will fire SIGNED_IN and set sessionReady
        })
        .catch((err) => {
          console.error('Session establishment error:', err);
          setTokenError(true);
          setSessionLoading(false);
        });
    } else {
      // Implicit flow: detectSessionInUrl processes the hash fragment automatically.
      // Check if session is already available, otherwise wait up to 5s.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSessionReady(true);
          setSessionLoading(false);
        } else {
          timeoutId = setTimeout(() => {
            setSessionLoading((prev) => {
              if (prev) {
                setTokenError(true);
                return false;
              }
              return prev;
            });
          }, 5000);
        }
      });
    }

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [searchParams]);

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) {
        throw error;
      }
      
      // Sign out so the user logs in with the new password
      await supabase.auth.signOut();
      
      // Success - show success message
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-greyed-navy mb-2">
                Create New Password
              </h1>
              <p className="text-greyed-navy/70 text-sm md:text-base">
                Please enter your new password below
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              {success ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-cyan-400" />
                  </div>

                  <h2 className="text-xl font-headline font-semibold text-greyed-navy mb-3">
                    Password Updated
                  </h2>

                  <p className="text-greyed-navy/80 mb-6">
                    Your password has been successfully updated. You'll be redirected to the login page shortly.
                  </p>

                  <Link to="/auth/login" className="inline-flex items-center bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors">
                    Log In Now
                  </Link>
                </div>
              ) : sessionLoading ? (
                <div className="text-center py-8">
                  <Loader className="animate-spin w-8 h-8 text-greyed-navy mx-auto mb-4" />
                  <p className="text-greyed-navy/70 text-sm">Verifying your reset link...</p>
                </div>
              ) : tokenError ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-xl font-headline font-semibold text-greyed-navy mb-3">
                    Invalid or Expired Link
                  </h2>
                  <p className="text-greyed-navy/70 mb-6 text-sm">
                    This password reset link is no longer valid. Reset links expire after a short time for security.
                  </p>
                  <Link
                    to="/auth/forgot-password"
                    className="inline-flex items-center gap-2 bg-greyed-navy text-white px-4 py-2 rounded-lg hover:bg-greyed-navy/90 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Request a New Link
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-greyed-navy mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-greyed-navy/30" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                        placeholder="••••••••"
                        autoFocus
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                    <p className="mt-1 text-xs text-greyed-navy/60">
                      6+ characters, 1 special character
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-greyed-navy mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-greyed-navy/30" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                        Updating...
                      </span>
                    ) : (
                      'Update Password'
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
        </div>
      </div>
      
      <Footer />
    </LandingLayout>
  );
};

export default UpdatePasswordPage;