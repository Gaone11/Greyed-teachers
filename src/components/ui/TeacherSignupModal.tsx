import React, { useState, useEffect, useRef } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    modal.addEventListener('keydown', trap);
    first?.focus();
    return () => modal.removeEventListener('keydown', trap);
  }, [isOpen, onClose]);

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
        role: 'teacher',
      });
      if (error) { setSignupError(error.message || "Failed to create account. Please try again."); return; }
      setSignupSuccess(true);
      setTimeout(() => { onClose(); navigate('/teachers/dashboard'); }, 1500);
    } catch {
      setSignupError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, delay: 0.1 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-sm px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Sign up for GreyEd Teachers"
        >
          <motion.div
            ref={modalRef}
            className="relative bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary mb-2">
                Join GreyEd Teachers
              </h2>
              <p className="text-primary/70 text-sm sm:text-base">
                Enter your information to access the platform
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {signupError && (
                <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-lg flex items-start" role="alert">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}

              {signupSuccess && (
                <div className="bg-green-50 border border-green-200 text-success px-4 py-3 rounded-lg flex items-start" role="status">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Access granted!</p>
                    <p className="mt-1">Taking you to your teacher dashboard...</p>
                  </div>
                </div>
              )}

              {/* Name field */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-primary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-primary/30" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    {...register("name")}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-error' : 'border-premium-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'signup-name-error' : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="signup-name-error" className="mt-1 text-sm text-error" role="alert">{errors.name.message}</p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-primary mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-primary/30" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-error' : 'border-premium-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="your.email@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="signup-email-error" className="mt-1 text-sm text-error" role="alert">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-primary mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full pr-10 pl-4 py-2 border ${errors.password ? 'border-error' : 'border-premium-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Enter a secure password"
                    aria-invalid={!!errors.password}
                    aria-describedby="signup-password-hint"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-primary/30" /> : <Eye className="h-5 w-5 text-primary/30" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error" role="alert">{errors.password.message}</p>
                )}
                <p id="signup-password-hint" className="mt-1 text-xs text-primary/60">
                  6+ characters, 1 special character
                </p>
              </div>

              {/* Confirm Password field */}
              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-primary mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`w-full pr-10 pl-4 py-2 border ${errors.confirmPassword ? 'border-error' : 'border-premium-neutral-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Confirm your password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'signup-confirm-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-primary/30" /> : <Eye className="h-5 w-5 text-primary/30" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="signup-confirm-error" className="mt-1 text-sm text-error" role="alert">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="bg-surface/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-primary mb-2">GreyEd Teachers Features</h3>
                <ul className="text-xs text-primary/80 space-y-1">
                  <li>&#8226; Unlimited AI lesson plans</li>
                  <li>&#8226; Auto-graded assessments</li>
                  <li>&#8226; Weekly family updates</li>
                  <li>&#8226; Analytics dashboard</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || signupSuccess}
                className={`w-full bg-primary text-surface-white font-medium py-3 rounded-lg transition-colors ${
                  isSubmitting || signupSuccess ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
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

              <div className="text-center text-sm text-primary/60 mt-4">
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
