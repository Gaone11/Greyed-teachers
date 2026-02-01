import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, AlertCircle } from 'lucide-react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LandingLayout from '../../components/layout/LandingLayout';

// Validation schema
const loginSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Fixed admin email
  const adminEmail = "monti@greyed.org";
  
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: ''
    }
  });
  
  // Redirect if already logged in, but only after auth loading is complete
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate, authLoading]);
  
  // Set document title
  useEffect(() => {
    document.title = "Admin Login | GreyEd";
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const { error } = await signIn(adminEmail, data.password);
      
      if (error) {
        setLoginError("Invalid password. Please try again.");
        return;
      }
      
      navigate('/admin/dashboard');
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state when redirecting after login
  if (!authLoading && user) {
    return null; // Or return a loading spinner if preferred
  }

  return (
    <LandingLayout disableSnapScroll={true}>
      <NavBar />
      
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-greyed-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-greyed-navy mb-2">Admin Login</h1>
              <p className="text-greyed-navy/70 text-sm md:text-base">Sign in to access the admin dashboard</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              {loginError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-greyed-navy mb-1">
                    Email Address
                  </label>
                  <div className="w-full px-4 py-2 border border-greyed-navy/20 rounded-lg bg-greyed-navy/5 text-greyed-navy">
                    {adminEmail}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-greyed-navy mb-1">
                    Password
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
                      placeholder="Enter password"
                      autoFocus
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-greyed-navy text-greyed-white font-medium py-3 rounded-lg transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
                  }`}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-greyed-navy/10">
                <p className="text-sm text-greyed-navy/60 text-center">
                  This area is restricted to authorized personnel only.
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

export default AdminLoginPage;