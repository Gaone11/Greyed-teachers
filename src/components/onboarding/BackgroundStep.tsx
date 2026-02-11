import React, { useEffect, useState } from 'react';
import { Home, Languages, Wifi, Laptop } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';

interface BackgroundStepProps {
  onValidityChange: (isValid: boolean) => void;
}

const BackgroundStep: React.FC<BackgroundStepProps> = ({ onValidityChange }) => {
  const { personalityAssessment, updatePersonalityAssessment } = useOnboarding();
  const [formData, setFormData] = useState({
    hasWifi: personalityAssessment.educationBackground.hasWifi,
    shareDevice: personalityAssessment.educationBackground.shareDevice,
    parentSupport: personalityAssessment.educationBackground.parentSupport || null,
    languageCount: personalityAssessment.educationBackground.languages.length || 1,
    homeLanguage: personalityAssessment.educationBackground.homeLanguage || ''
  });
  
  // Update form field
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Validate form and update context
  useEffect(() => {
    // Check if required fields are filled
    const hasParentSupport = formData.parentSupport !== null;
    const hasHomeLanguage = formData.homeLanguage.trim() !== '';
    
    // Only home language is truly required since other fields have defaults
    const isValid = hasHomeLanguage;
    onValidityChange(isValid);
    
    // Update context with education background
    const educationBackground = {
      hasWifi: formData.hasWifi !== null ? formData.hasWifi : true,
      shareDevice: formData.shareDevice !== null ? formData.shareDevice : false,
      parentSupport: formData.parentSupport,
      languages: Array(formData.languageCount).fill('').map((_, i) => `Language ${i + 1}`),
      homeLanguage: formData.homeLanguage
    };
    
    updatePersonalityAssessment({ educationBackground });
  }, [formData, updatePersonalityAssessment, onValidityChange]);

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-headline font-bold text-primary mb-2">
          Family & Background
        </h2>
        
        <p className="text-primary/80">
          Help us understand your learning environment.
        </p>
      </div>
      
      <div className="bg-surface/20 p-4 rounded-lg mb-6">
        <p className="text-primary/80 text-sm">
          This information helps us provide suitable resources and support. Your privacy is important to us - this information is only used to personalize your learning experience.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Internet Access */}
        <div>
          <div className="flex items-center mb-3">
            <Wifi className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-lg font-medium text-primary">Internet Access</h3>
          </div>
          
          <div className="flex space-x-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="internet"
                className="sr-only"
                checked={formData.hasWifi === true}
                onChange={() => handleChange('hasWifi', true)}
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                formData.hasWifi === true
                  ? 'border-accent bg-accent' 
                  : 'border-primary/40'
              }`}>
                {formData.hasWifi === true && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-primary">Yes, I have reliable internet at home</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="radio"
                name="internet"
                className="sr-only"
                checked={formData.hasWifi === false}
                onChange={() => handleChange('hasWifi', false)}
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                formData.hasWifi === false
                  ? 'border-accent bg-accent' 
                  : 'border-primary/40'
              }`}>
                {formData.hasWifi === false && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-primary">My internet access is limited or unreliable</span>
            </label>
          </div>
        </div>
        
        {/* Device Sharing */}
        <div>
          <div className="flex items-center mb-3">
            <Laptop className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-lg font-medium text-primary">Device Access</h3>
          </div>
          
          <div className="flex space-x-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="device"
                className="sr-only"
                checked={formData.shareDevice === true}
                onChange={() => handleChange('shareDevice', true)}
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                formData.shareDevice === true
                  ? 'border-accent bg-accent' 
                  : 'border-primary/40'
              }`}>
                {formData.shareDevice === true && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-primary">I share a device for school/work</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="radio"
                name="device"
                className="sr-only"
                checked={formData.shareDevice === false}
                onChange={() => handleChange('shareDevice', false)}
              />
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                formData.shareDevice === false
                  ? 'border-accent bg-accent' 
                  : 'border-primary/40'
              }`}>
                {formData.shareDevice === false && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-primary">I have my own dedicated device</span>
            </label>
          </div>
        </div>
        
        {/* Parental Support */}
        <div>
          <h3 className="text-lg font-medium text-primary mb-3">
            How much do your parents/guardians support your learning?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['A lot', 'Somewhat', 'Rarely', 'Not at all'].map(level => (
              <label
                key={level}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.parentSupport === level
                    ? 'border-accent bg-accent/10' 
                    : 'border-primary/20 hover:border-primary/30'
                }`}
              >
                <input
                  type="radio"
                  name="parentSupport"
                  className="sr-only"
                  checked={formData.parentSupport === level}
                  onChange={() => handleChange('parentSupport', level)}
                />
                <div className={`w-4 h-4 rounded-full border mr-2 ${
                  formData.parentSupport === level
                    ? 'border-accent bg-accent' 
                    : 'border-primary/40'
                }`}>
                  {formData.parentSupport === level && (
                    <div className="w-2 h-2 rounded-full bg-white m-auto"></div>
                  )}
                </div>
                <span className="text-primary">{level}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Languages */}
        <div>
          <div className="flex items-center mb-3">
            <Languages className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-lg font-medium text-primary">Languages</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Main language */}
            <div>
              <label htmlFor="homeLanguage" className="block text-sm font-medium text-primary mb-1">
                Main language spoken at home
              </label>
              <input
                type="text"
                id="homeLanguage"
                value={formData.homeLanguage}
                onChange={(e) => handleChange('homeLanguage', e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="e.g., English, Setswana, etc."
              />
            </div>
            
            {/* Number of languages */}
            <div>
              <label htmlFor="languageCount" className="block text-sm font-medium text-primary mb-1">
                How many languages do you speak?
              </label>
              <select
                id="languageCount"
                value={formData.languageCount}
                onChange={(e) => handleChange('languageCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-primary/20 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {[1, 2, 3, 4, 5, 'More than 5'].map((num, index) => (
                  <option key={index} value={index + 1}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundStep;