import React from 'react';
import { Check } from 'lucide-react';

interface AccommodationPreferences {
  adhd: boolean;
  dyslexia: boolean;
  asd: boolean;
  sensory: boolean;
}

interface AccommodationsSelectorProps {
  accommodations: AccommodationPreferences;
  onChange: (accommodations: AccommodationPreferences) => void;
}

const ACCOMMODATION_OPTIONS = [
  {
    id: 'adhd',
    label: 'ADHD',
    description: 'Attention and focus support',
    color: 'bg-accent/20 text-primary border-accent/40',
    features: [
      'Shorter activity segments',
      'Built-in movement breaks',
      'Visual timers and schedules',
      'Clear transitions between tasks'
    ]
  },
  {
    id: 'dyslexia',
    label: 'Dyslexia',
    description: 'Reading and text support',
    color: 'bg-green-100 text-green-800 border-green-300',
    features: [
      'Dyslexia-friendly fonts',
      'Increased line spacing',
      'Multi-sensory approaches',
      'Reduced text density'
    ]
  },
  {
    id: 'asd',
    label: 'ASD',
    description: 'Autism spectrum support',
    color: 'bg-primary/10 text-primary border-primary/30',
    features: [
      'Clear, explicit instructions',
      'Predictable routines',
      'Visual supports and cues',
      'Reduced sensory overload'
    ]
  },
  {
    id: 'sensory',
    label: 'Sensory',
    description: 'Sensory processing support',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    features: [
      'Sensory break options',
      'Reduced visual clutter',
      'Quiet workspace alternatives',
      'Fidget tool suggestions'
    ]
  }
];

const AccommodationsSelector: React.FC<AccommodationsSelectorProps> = ({
  accommodations,
  onChange
}) => {
  const toggleAccommodation = (key: keyof AccommodationPreferences) => {
    onChange({
      ...accommodations,
      [key]: !accommodations[key]
    });
  };

  const selectedCount = Object.values(accommodations).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-primary">Neurodiversity Accommodations</h3>
          <p className="text-sm text-primary/70">
            Select support types to include in lesson plan generation
          </p>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-full">
            <Check size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">
              {selectedCount} selected
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACCOMMODATION_OPTIONS.map((option) => {
          const isSelected = accommodations[option.id as keyof AccommodationPreferences];

          return (
            <button
              key={option.id}
              onClick={() => toggleAccommodation(option.id as keyof AccommodationPreferences)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-primary/20 hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${option.color}`}
                  >
                    {option.label}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-primary/80 mb-3">
                {option.description}
              </p>

              {isSelected && (
                <div className="bg-surface/30 rounded-lg p-3 mt-3">
                  <p className="text-xs font-semibold text-primary mb-2">
                    Includes:
                  </p>
                  <ul className="space-y-1">
                    {option.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-primary/70 flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="bg-accent/10 border-l-4 border-accent rounded-lg p-4">
          <p className="text-sm text-primary">
            <span className="font-semibold">Accommodation Preview:</span> Your lesson plan will include{' '}
            {selectedCount === 1 && 'support for '}
            {selectedCount === 2 && 'supports for '}
            {selectedCount > 2 && 'multiple supports including '}
            {Object.entries(accommodations)
              .filter(([_, enabled]) => enabled)
              .map(([key]) => ACCOMMODATION_OPTIONS.find(opt => opt.id === key)?.label)
              .join(', ')}
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default AccommodationsSelector;
