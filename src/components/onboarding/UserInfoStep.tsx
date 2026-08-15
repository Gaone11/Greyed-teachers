import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { User, Mail, School } from 'lucide-react';
import { z } from 'zod';
import { OnboardingData } from '../../types/onboarding';
import {
  academicCountryOptions,
  getStageLabel,
  gradeOptionsByStage,
  SchoolStage,
  schoolStageOptions,
  universityMajorOptions
} from '../../data/academicProfile';

interface UserInfoStepProps {
  onValidityChange: (isValid: boolean) => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ onValidityChange }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedSchoolStage = onboardingData.schoolStage as SchoolStage | '';
  const selectedGradeOptions = selectedSchoolStage ? gradeOptionsByStage[selectedSchoolStage] : [];
  const showUniversityMajor = selectedSchoolStage === 'university';

  // Schema for validation
  const userInfoSchema = useMemo(() => z.object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      age: z.string().refine(val => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0 && num < 100;
      }, "Please enter a valid age between 1-99"),
      country: z.string().min(1, "Please select your country"),
      schoolStage: z.string().min(1, "Please select your school level"),
      gradeLevel: z.string().min(1, "Please select your grade or year"),
      universityMajor: z.string().optional()
    }).superRefine((data, ctx) => {
      if (data.schoolStage === 'university' && !data.universityMajor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['universityMajor'],
          message: 'Please select your university major'
        });
      }
    }), []);
  
  // Update fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateOnboardingData({ [name]: value } as Partial<OnboardingData>);
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSchoolStageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stage = event.target.value as SchoolStage | '';

    updateOnboardingData({
      schoolStage: stage,
      educationLevel: stage ? getStageLabel(stage) : '',
      gradeLevel: '',
      universityMajor: ''
    });

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.schoolStage;
      delete newErrors.educationLevel;
      delete newErrors.gradeLevel;
      delete newErrors.universityMajor;
      return newErrors;
    });
  };
  
  // Validate all fields
  const validateForm = useCallback(() => {
    const result = userInfoSchema.safeParse(onboardingData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const formattedErrors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      if (err.path.length > 0) {
        formattedErrors[err.path[0].toString()] = err.message;
      }
    });
    setErrors(formattedErrors);
    return false;
  }, [onboardingData, userInfoSchema]);
  
  // Check validity when data changes
  useEffect(() => {
    const isValid = validateForm();
    onValidityChange(isValid);
  }, [onValidityChange, validateForm]);

  return (
    <div>
      <h2 className="text-2xl font-headline font-bold text-greyed-navy mb-6 text-center">
        Tell Us About Yourself
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-greyed-navy mb-1">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-greyed-navy/40" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={onboardingData.firstName}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
              placeholder="Your first name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-greyed-navy mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={onboardingData.lastName}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
            placeholder="Your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-greyed-navy mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-greyed-navy/40" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={onboardingData.email}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-greyed-navy mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="5"
            max="99"
            value={onboardingData.age}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
            placeholder="Your age"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age}</p>
          )}
        </div>
        
        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-greyed-navy mb-1">
            Country of Residence
          </label>
          <select
            id="country"
            name="country"
            value={onboardingData.country}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
          >
            <option value="">Select your country</option>
            {academicCountryOptions.map(country => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>
      
      {/* School Level */}
      <div className="mb-4">
        <label htmlFor="schoolStage" className="block text-sm font-medium text-greyed-navy mb-1">
          School Level
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <School className="h-5 w-5 text-greyed-navy/40" />
          </div>
          <select
            id="schoolStage"
            name="schoolStage"
            value={onboardingData.schoolStage}
            onChange={handleSchoolStageChange}
            className={`block w-full pl-10 pr-3 py-2 border ${errors.schoolStage ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
          >
            <option value="">Select your school level</option>
            {schoolStageOptions.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        {errors.schoolStage && (
          <p className="mt-1 text-sm text-red-600">{errors.schoolStage}</p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${showUniversityMajor ? 'sm:grid-cols-2' : ''} gap-4 mb-4`}>
        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-greyed-navy mb-1">
            Grade / Year
          </label>
          <select
            id="gradeLevel"
            name="gradeLevel"
            value={onboardingData.gradeLevel}
            onChange={handleInputChange}
            disabled={!selectedSchoolStage}
            className={`block w-full px-3 py-2 border ${errors.gradeLevel ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm disabled:bg-greyed-navy/5 disabled:text-greyed-navy/40`}
          >
            <option value="">{selectedSchoolStage ? 'Select your grade or year' : 'Choose school level first'}</option>
            {selectedGradeOptions.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          {errors.gradeLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.gradeLevel}</p>
          )}
        </div>

        {showUniversityMajor && (
          <div>
            <label htmlFor="universityMajor" className="block text-sm font-medium text-greyed-navy mb-1">
              University Major
            </label>
            <select
              id="universityMajor"
              name="universityMajor"
              value={onboardingData.universityMajor}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${errors.universityMajor ? 'border-red-500' : 'border-greyed-navy/20'} rounded-md shadow-sm focus:ring-greyed-blue focus:border-greyed-blue sm:text-sm`}
            >
              <option value="">Select your major</option>
              {universityMajorOptions.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
            {errors.universityMajor && (
              <p className="mt-1 text-sm text-red-600">{errors.universityMajor}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-greyed-navy/60">
        <p>
          This information helps us personalize your learning experience and is kept private in accordance with our 
          <a href="/privacy" className="text-greyed-blue hover:underline"> Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default UserInfoStep;
