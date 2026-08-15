export type SchoolStage =
  | 'primary'
  | 'elementary'
  | 'junior'
  | 'middle'
  | 'high'
  | 'senior-secondary'
  | 'sixth-form'
  | 'vocational'
  | 'university'
  | 'adult';

export interface AcademicCountryOption {
  value: string;
  label: string;
}

export interface SchoolStageOption {
  value: SchoolStage;
  label: string;
  description: string;
}

export const academicCountryOptions: AcademicCountryOption[] = [
  { value: 'international', label: 'International / Not listed' },
  { value: 'south-africa', label: 'South Africa' },
  { value: 'botswana', label: 'Botswana' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'united-kingdom', label: 'United Kingdom' },
  { value: 'united-states', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'india', label: 'India' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
  { value: 'united-arab-emirates', label: 'United Arab Emirates' }
];

export const schoolStageOptions: SchoolStageOption[] = [
  {
    value: 'primary',
    label: 'Primary School',
    description: 'Early formal schooling, often Grades 1-6 depending on country.'
  },
  {
    value: 'elementary',
    label: 'Elementary School',
    description: 'Elementary years, often used in North American systems.'
  },
  {
    value: 'junior',
    label: 'Junior School',
    description: 'Upper primary or early lower-secondary learning.'
  },
  {
    value: 'middle',
    label: 'Middle School',
    description: 'Bridge years between elementary and high school.'
  },
  {
    value: 'high',
    label: 'High School',
    description: 'Secondary school before final senior or exam years.'
  },
  {
    value: 'senior-secondary',
    label: 'Senior Secondary',
    description: 'Final school years, national exams, IGCSE, GCSE, matric, WAEC, or equivalents.'
  },
  {
    value: 'sixth-form',
    label: 'Sixth Form / A Level / IB DP',
    description: 'Advanced school-level study before university.'
  },
  {
    value: 'vocational',
    label: 'Vocational / TVET',
    description: 'Skills-based college, certificate, diploma, or trade learning.'
  },
  {
    value: 'university',
    label: 'University',
    description: 'Undergraduate or postgraduate study with a selected major.'
  },
  {
    value: 'adult',
    label: 'Adult / Continuing Education',
    description: 'Self-paced, professional, or returning learner pathway.'
  }
];

export const gradeOptionsByStage: Record<SchoolStage, string[]> = {
  primary: [
    'Foundation / Reception',
    'Grade 1 / Year 1',
    'Grade 2 / Year 2',
    'Grade 3 / Year 3',
    'Grade 4 / Year 4',
    'Grade 5 / Year 5',
    'Grade 6 / Year 6'
  ],
  elementary: [
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5'
  ],
  junior: [
    'Grade 4 / Junior 1',
    'Grade 5 / Junior 2',
    'Grade 6 / Junior 3',
    'Grade 7 / Junior 4'
  ],
  middle: [
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9'
  ],
  high: [
    'Grade 8 / Year 8',
    'Grade 9 / Year 9',
    'Grade 10 / Year 10',
    'Grade 11 / Year 11'
  ],
  'senior-secondary': [
    'Grade 10 / Senior 1',
    'Grade 11 / Senior 2',
    'Grade 12 / Senior 3',
    'Matric',
    'WASSCE / WAEC',
    'NECO',
    'KCSE',
    'IGCSE',
    'GCSE'
  ],
  'sixth-form': [
    'AS Level',
    'A Level Year 1',
    'A Level Year 2',
    'IB DP Year 1',
    'IB DP Year 2',
    'Year 12',
    'Year 13'
  ],
  vocational: [
    'Certificate',
    'Diploma Year 1',
    'Diploma Year 2',
    'Diploma Year 3',
    'Apprenticeship',
    'Trade Programme'
  ],
  university: [
    'Foundation Year',
    'Undergraduate Year 1',
    'Undergraduate Year 2',
    'Undergraduate Year 3',
    'Undergraduate Year 4',
    'Honours',
    'Masters',
    'Doctorate'
  ],
  adult: [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Professional Development',
    'Exam Preparation'
  ]
};

export const universityMajorOptions = [
  'Accounting',
  'Architecture',
  'Biological Sciences',
  'Business Administration',
  'Chemistry',
  'Civil Engineering',
  'Computer Science',
  'Data Science',
  'Economics',
  'Education',
  'Electrical Engineering',
  'Environmental Science',
  'Finance',
  'Health Sciences',
  'Information Systems',
  'Law',
  'Mathematics',
  'Mechanical Engineering',
  'Medicine',
  'Nursing',
  'Physics',
  'Political Science',
  'Psychology',
  'Social Work',
  'Statistics',
  'Other / Undecided'
];

export const getStageLabel = (value: string) =>
  schoolStageOptions.find((stage) => stage.value === value)?.label || value;

export const getCountryLabel = (value: string) =>
  academicCountryOptions.find((country) => country.value === value)?.label || value;
