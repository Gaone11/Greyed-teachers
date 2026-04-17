import React, { useState, useEffect } from 'react';
import { X, Mail, User, Loader, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface TeacherSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeacherSignupModal: React.FC<TeacherSignupModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Initialize react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset();
        setSignupError(null);
        setSignupSuccess(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 300);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSignupError(null);
    
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { error } = await signUp(data.email, data.password, {
        first_name: firstName,
        last_name: lastName,
        name: data.name,
        role: 'teacher'
      });
      
      if (error) {
        setSignupError(error.message || "Failed to create account. Please try again.");
        return;
      }
      
      setSignupSuccess(true);
      
      // Navigate to dashboard after a brief delay
      setTimeout(() => {
        onClose();
        navigate('/teachers/dashboard');
      }, 1500);
      
    } catch {
      setSignupError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            className="relative bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-greyed-navy/60 hover:text-greyed-navy transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-greyed-navy mb-2">
                Join GreyEd Teachers
              </h2>
              <p className="text-greyed-navy/70 text-sm sm:text-base">
                Enter your information to access the platform
              </p>
            </div>
              
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {signupError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}
              
              {signupSuccess && (
                <div className="bg-slate-800 border border-slate-600 text-cyan-400 px-4 py-3 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Access granted!</p>
                    <p className="mt-1">Taking you to your teacher dashboard...</p>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="teacher-name" className="block text-sm font-medium text-greyed-navy mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-greyed-navy/30" />
                  </div>
                  <input
                    id="teacher-name"
                    type="text"
                    {...register("name")}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="teacher-email" className="block text-sm font-medium text-greyed-navy mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-greyed-navy/30" />
                  </div>
                  <input
                    id="teacher-email"
                    type="email"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="teacher-password" className="block text-sm font-medium text-greyed-navy mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="teacher-password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full pr-10 pl-4 py-2 border ${errors.password ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                    placeholder="Enter a secure password"
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
                <p className="mt-1 text-xs text-greyed-navy/60">
                  6+ characters, 1 special character
                </p>
              </div>

              <div>
                <label htmlFor="teacher-confirm-password" className="block text-sm font-medium text-greyed-navy mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="teacher-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`w-full pr-10 pl-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-greyed-navy/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-greyed-navy/30" />
                    ) : (
                      <Eye className="h-5 w-5 text-greyed-navy/30" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="bg-greyed-beige/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-greyed-navy mb-2">GreyEd Teachers Features</h3>
                <ul className="text-xs text-greyed-navy/80 space-y-1">
                  <li>• Unlimited AI lesson plans</li>
                  <li>• Auto-graded assessments</li>
                  <li>• Weekly tutor updates</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || signupSuccess}
                className={`w-full bg-greyed-navy text-greyed-white font-medium py-3 rounded-lg transition-colors ${
                  isSubmitting || signupSuccess ? 'opacity-70 cursor-not-allowed' : 'hover:bg-greyed-navy/90'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    Getting started...
                  </span>
                ) : signupSuccess ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Access granted!
                  </span>
                ) : (
                  "Get Started"
                )}
              </button>
              
              <div className="text-center text-sm text-greyed-navy/60 mt-4">
                <p>Secure your account and start teaching with AI today.</p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeacherSignupModal;