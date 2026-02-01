import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, Loader, X, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoleSelection } from '../../context/RoleSelectionContext';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { openTeacherSignup } = useRoleSelection();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset();
        setLoginError(null);
        setShowPassword(false);
      }, 300);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        setLoginError("Invalid email or password. Please try again.");
        return;
      }


      onClose();
      navigate('/teachers/dashboard');
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/auth/forgot-password');
  };

  const handleSignup = () => {
    onClose();
    openTeacherSignup();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, delay: 0.1 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-greyed-navy/70 backdrop-blur-sm px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-1 rounded-full text-greyed-navy/60 hover:text-greyed-navy hover:bg-greyed-navy/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-2">Welcome Back</h2>
                <p className="text-greyed-navy/70 text-sm">Log in to your teacher account</p>
              </div>

              {loginError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
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

                <div className="mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-greyed-navy mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-greyed-navy/30" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-greyed-navy/30" />
                      ) : (
                        <Eye className="h-5 w-5 text-greyed-navy/30" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="mb-6 text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-greyed-blue hover:text-greyed-navy font-medium"
                  >
                    Forgot Password?
                  </button>
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
                      Logging in...
                    </span>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-greyed-navy/10 text-center">
                <p className="text-greyed-navy/70 text-sm">
                  New to GreyEd?{' '}
                  <button
                    onClick={handleSignup}
                    className="text-greyed-blue hover:text-greyed-navy font-medium"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
