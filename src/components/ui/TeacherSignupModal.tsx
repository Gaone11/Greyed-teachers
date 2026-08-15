import React, { useState, useEffect } from 'react';
import { X, Mail, User, Loader, CheckCircle, AlertCircle, Eye, EyeOff, Globe2, GraduationCap, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRoleSelection } from '../../context/RoleSelectionContext';
import {
  academicCountryOptions,
  getStageLabel,
  gradeOptionsByStage,
  SchoolStage,
  schoolStageOptions,
  universityMajorOptions
} from '../../data/academicProfile';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Password must contain at least one capital letter")
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  country: z.string().optional(),
  schoolStage: z.string().optional(),
  gradeLevel: z.string().optional(),
  universityMajor: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return "Failed to create account. Please try again.";
};

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
  const [academicError, setAcademicError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { selectedRole } = useRoleSelection();
  const isStudentSignup = selectedRole === 'student';

  // Initialize react-hook-form
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      schoolStage: '',
      gradeLevel: '',
      universityMajor: '',
    }
  });

  const selectedSchoolStage = watch('schoolStage') as SchoolStage | undefined;
  const selectedGradeLevel = watch('gradeLevel');
  const selectedUniversityMajor = watch('universityMajor');
  const selectedGradeOptions = selectedSchoolStage ? gradeOptionsByStage[selectedSchoolStage] : [];
  const showUniversityMajor = selectedSchoolStage === 'university';
  
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
        setAcademicError(null);
        setSignupSuccess(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 300);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isStudentSignup) return;

    const stage = selectedSchoolStage;
    const gradeOptions = stage ? gradeOptionsByStage[stage] : [];

    if (stage && !gradeOptions.includes(selectedGradeLevel || '')) {
      setValue('gradeLevel', '');
    }

    if (stage !== 'university' && selectedUniversityMajor) {
      setValue('universityMajor', '');
    }
  }, [isStudentSignup, selectedGradeLevel, selectedSchoolStage, selectedUniversityMajor, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSignupError(null);
    setAcademicError(null);
    
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const roleToUse = selectedRole || 'teacher';

      if (roleToUse === 'student') {
        if (!data.country || !data.schoolStage || !data.gradeLevel) {
          setAcademicError('Please select your country, school level, and grade so GreyEd can align your content.');
          return;
        }

        if (data.schoolStage === 'university' && !data.universityMajor) {
          setAcademicError('Please select your university major.');
          return;
        }
      }

      const academicProfile = roleToUse === 'student' ? {
        country: data.country || '',
        educationLevel: data.schoolStage ? getStageLabel(data.schoolStage) : '',
        schoolStage: data.schoolStage || '',
        gradeLevel: data.gradeLevel || '',
        universityMajor: data.universityMajor || '',
      } : undefined;

      const { error } = await signUp(data.email, data.password, {
        first_name: firstName,
        last_name: lastName,
        name: data.name,
        role: roleToUse,
        plan: 'basic',
        country: academicProfile?.country,
        education_level: academicProfile?.educationLevel,
        school_stage: academicProfile?.schoolStage,
        grade_level: academicProfile?.gradeLevel,
        university_major: academicProfile?.universityMajor,
        academic_profile: academicProfile
      });
      
      if (error) {
        setSignupError(getErrorMessage(error));
        return;
      }
      
      setSignupSuccess(true);
      
      // Navigate to dashboard after a brief delay
      setTimeout(() => {
        onClose();
        if (roleToUse === 'student') navigate('/students/dashboard');
        else if (roleToUse === 'parent') navigate('/parents/dashboard');
        else navigate('/teachers/dashboard');
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

  const title = selectedRole === 'student' ? 'Join as a Student' 
               : selectedRole === 'parent' ? 'Join as a Parent' 
               : 'Join GreyEd Teachers';

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
            className="relative bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
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
                {title}
              </h2>
              <p className="text-greyed-navy/70 text-sm sm:text-base">
                Enter your information to start on the Basic tier
              </p>
            </div>
              
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {signupError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}

              {academicError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{academicError}</span>
                </div>
              )}
              
              {signupSuccess && (
                <div className="bg-slate-800 border border-slate-600 text-cyan-400 px-4 py-3 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Access granted!</p>
                    <p className="mt-1">Taking you to your dashboard...</p>
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
                  10+ characters, 1 capital letter, 1 special character
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

              {isStudentSignup && (
                <div className="rounded-xl border border-greyed-navy/10 bg-greyed-white/50 p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-greyed-navy flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-greyed-blue" />
                      Academic Profile
                    </h3>
                    <p className="mt-1 text-xs text-greyed-navy/65">
                      GreyEd uses this to align your dashboard, assessments, and study help to your level.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm font-medium text-greyed-navy mb-1 flex items-center gap-1.5">
                        <Globe2 className="h-4 w-4 text-greyed-navy/40" />
                        Country
                      </span>
                      <select
                        {...register('country')}
                        className="w-full px-3 py-2 border border-greyed-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue text-sm"
                      >
                        <option value="">Select country</option>
                        {academicCountryOptions.map((country) => (
                          <option key={country.value} value={country.value}>{country.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-greyed-navy mb-1 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-greyed-navy/40" />
                        School level
                      </span>
                      <select
                        {...register('schoolStage')}
                        className="w-full px-3 py-2 border border-greyed-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue text-sm"
                      >
                        <option value="">Select level</option>
                        {schoolStageOptions.map((stage) => (
                          <option key={stage.value} value={stage.value}>{stage.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-greyed-navy mb-1">Grade / year</span>
                      <select
                        {...register('gradeLevel')}
                        disabled={!selectedSchoolStage}
                        className="w-full px-3 py-2 border border-greyed-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue text-sm disabled:bg-greyed-navy/5 disabled:text-greyed-navy/40"
                      >
                        <option value="">{selectedSchoolStage ? 'Select grade or year' : 'Choose school level first'}</option>
                        {selectedGradeOptions.map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </label>

                    {showUniversityMajor && (
                      <label className="block">
                        <span className="text-sm font-medium text-greyed-navy mb-1">Major</span>
                        <select
                          {...register('universityMajor')}
                          className="w-full px-3 py-2 border border-greyed-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-greyed-blue text-sm"
                        >
                          <option value="">Select major</option>
                          {universityMajorOptions.map((major) => (
                            <option key={major} value={major}>{major}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-greyed-beige/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-greyed-navy mb-2">Basic Tier Included</h3>
                {selectedRole === 'student' ? (
                  <ul className="text-xs text-greyed-navy/80 space-y-1">
                    <li>• Access your timetable</li>
                    <li>• View core notes and assignments</li>
                    <li>• Explore Knowledge Galaxy</li>
                    <li>• Upgrade from the sidebar any time</li>
                  </ul>
                ) : selectedRole === 'parent' ? (
                  <ul className="text-xs text-greyed-navy/80 space-y-1">
                    <li>• Track children's performance</li>
                    <li>• View latest scores</li>
                    <li>• Message teachers and students</li>
                    <li>• Upgrade from the sidebar any time</li>
                  </ul>
                ) : (
                  <ul className="text-xs text-greyed-navy/80 space-y-1">
                    <li>• Access your teaching dashboard</li>
                    <li>• Manage classes and core workflows</li>
                    <li>• Use basic AI teaching support</li>
                    <li>• Upgrade from the sidebar any time</li>
                  </ul>
                )}
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
                <p>Secure your account and start using GreyEd today.</p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeacherSignupModal;
