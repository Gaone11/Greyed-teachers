import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { User, Mail, School } from 'lucide-react';
import { z } from 'zod';

// Education levels for the dropdown
const educationLevels = [
  { value: 'primary', label: 'Primary School' },
  { value: 'secondary', label: 'Secondary School' },
  { value: 'a-level', label: 'A-Level' },
  { value: 'university', label: 'University' },
  { value: 'vocational', label: 'Vocational Training' },
  { value: 'other', label: 'Other' }
];

// Countries list (shortened for brevity)
const countries = [
  { value: 'botswana', label: 'Botswana' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'south_africa', label: 'South Africa' },
  { value: 'other', label: 'Other' }
];

interface UserInfoStepProps {
  onValidityChange: (isValid: boolean) => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ onValidityChange }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Schema for validation
  const userInfoSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    age: z.string().refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num < 100;
    }, "Please enter a valid age between 1-99"),
    country: z.string().min(1, "Please select your country"),
    educationLevel: z.string().min(1, "Please select your education level")
  });
  
  // Update fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateOnboardingData({ [name]: value } as any);
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate all fields
  const validateForm = () => {
    try {
      userInfoSchema.parse(onboardingData);
      setErrors({});
      return true;
    } catch {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };
  
  // Check validity when data changes
  useEffect(() => {
    const isValid = validateForm();
    onValidityChange(isValid);
  }, [onboardingData, onValidityChange]);

  return (
    <div>
      <h2 className="text-2xl font-headline font-bold text-primary mb-6 text-center">
        Tell Us About Yourself
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-primary/40" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={onboardingData.firstName}
              onChange={handleInputChange}
              className={`block w-full pl-10 pr-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-primary/20'} rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm`}
              placeholder="Your first name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={onboardingData.lastName}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-primary/20'} rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm`}
            placeholder="Your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-primary/40" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={onboardingData.email}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-primary/20'} rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm`}
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
          <label htmlFor="age" className="block text-sm font-medium text-primary mb-1">
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
            className={`block w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-primary/20'} rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm`}
            placeholder="Your age"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age}</p>
          )}
        </div>
        
        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-primary mb-1">
            Country of Residence
          </label>
          <select
            id="country"
            name="country"
            value={onboardingData.country}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-primary/20'} rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm`}
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>
      
      {/* Education Level */}
      <div className="mb-4">
        <label htmlFor="educationLevel" className="block text-sm font-medium text-primary mb-1">
          Education Level
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <School className="h-5 w-5 text-primary/40" />
          </div>
          <select
            id="educationLevel"
            name="educationLevel"
            value={onboardingData.educationLevel}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-2 border ${errors.educationLevel ? 'border-red-500' : 'border-primary/20'} rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm`}
          >
            <option value="">Select your education level</option>
            {educationLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        {errors.educationLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
        )}
      </div>
      
      <div className="mt-4 text-sm text-primary/60">
        <p>
          This information helps us personalize your learning experience and is kept private in accordance with our 
          <a href="/privacy" className="text-accent hover:underline"> Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default UserInfoStep;