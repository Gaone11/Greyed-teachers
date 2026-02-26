/**
 * CAPS (Curriculum and Assessment Policy Statement) - South Africa
 * Primary School Curriculum: Foundation Phase (R-3), Intermediate Phase (4-6), Senior Phase (7-9)
 *
 * Subjects and topics aligned with the Department of Basic Education (DBE) CAPS documents.
 * Includes Home Languages: Setswana, Siswati, IsiXhosa as requested.
 */

export interface CAPSTopic {
  name: string;
  /** Short key used for metadata matching */
  key: string;
}

export interface CAPSSubject {
  name: string;
  key: string;
  phase: ('foundation' | 'intermediate' | 'senior')[];
  topics: CAPSTopic[];
}

// ─── Home Languages ─────────────────────────────────────────────────────────

const homeLanguageTopics: CAPSTopic[] = [
  { name: 'Listening and Speaking', key: 'listening-speaking' },
  { name: 'Reading and Phonics', key: 'reading-phonics' },
  { name: 'Reading and Viewing', key: 'reading-viewing' },
  { name: 'Writing and Presenting', key: 'writing-presenting' },
  { name: 'Language Structures and Conventions', key: 'language-structures' },
  { name: 'Oral Communication', key: 'oral-communication' },
  { name: 'Handwriting', key: 'handwriting' },
  { name: 'Creative Writing', key: 'creative-writing' },
  { name: 'Poetry', key: 'poetry' },
  { name: 'Comprehension', key: 'comprehension' },
  { name: 'Visual Literacy', key: 'visual-literacy' },
  { name: 'Grammar and Spelling', key: 'grammar-spelling' },
];

// ─── Mathematics ─────────────────────────────────────────────────────────────

const mathematicsTopics: CAPSTopic[] = [
  { name: 'Numbers, Operations and Relationships', key: 'numbers-operations' },
  { name: 'Counting', key: 'counting' },
  { name: 'Addition and Subtraction', key: 'addition-subtraction' },
  { name: 'Multiplication and Division', key: 'multiplication-division' },
  { name: 'Fractions', key: 'fractions' },
  { name: 'Patterns, Functions and Algebra', key: 'patterns-algebra' },
  { name: 'Space and Shape (Geometry)', key: 'space-shape' },
  { name: 'Measurement', key: 'measurement' },
  { name: 'Data Handling', key: 'data-handling' },
  { name: 'Number Patterns', key: 'number-patterns' },
  { name: 'Properties of 2D Shapes', key: '2d-shapes' },
  { name: 'Properties of 3D Objects', key: '3d-objects' },
  { name: 'Symmetry', key: 'symmetry' },
  { name: 'Position and Directions', key: 'position-directions' },
  { name: 'Time', key: 'time' },
  { name: 'Length', key: 'length' },
  { name: 'Mass', key: 'mass' },
  { name: 'Capacity and Volume', key: 'capacity-volume' },
  { name: 'Perimeter, Area and Volume', key: 'perimeter-area-volume' },
  { name: 'Ratio and Rate', key: 'ratio-rate' },
  { name: 'Probability', key: 'probability' },
];

// ─── Life Skills ─────────────────────────────────────────────────────────────

const lifeSkillsTopics: CAPSTopic[] = [
  { name: 'Beginning Knowledge (Social Sciences)', key: 'beginning-knowledge' },
  { name: 'Personal and Social Well-being', key: 'personal-social-wellbeing' },
  { name: 'Creative Arts', key: 'creative-arts' },
  { name: 'Physical Education', key: 'physical-education' },
  { name: 'Health and Environmental Responsibility', key: 'health-environment' },
  { name: 'Social Responsibility', key: 'social-responsibility' },
  { name: 'Rights and Responsibilities', key: 'rights-responsibilities' },
  { name: 'Safety', key: 'safety' },
  { name: 'Performing Arts (Music, Dance, Drama)', key: 'performing-arts' },
  { name: 'Visual Arts', key: 'visual-arts' },
  { name: 'Movement and Games', key: 'movement-games' },
];

// ─── Natural Sciences and Technology ─────────────────────────────────────────

const naturalSciencesTopics: CAPSTopic[] = [
  { name: 'Life and Living', key: 'life-living' },
  { name: 'Matter and Materials', key: 'matter-materials' },
  { name: 'Energy and Change', key: 'energy-change' },
  { name: 'Planet Earth and Beyond', key: 'planet-earth' },
  { name: 'Biodiversity', key: 'biodiversity' },
  { name: 'Ecosystems', key: 'ecosystems' },
  { name: 'Human Body Systems', key: 'human-body' },
  { name: 'Properties of Materials', key: 'properties-materials' },
  { name: 'Processing Materials', key: 'processing-materials' },
  { name: 'Forces', key: 'forces' },
  { name: 'Electric Circuits', key: 'electric-circuits' },
  { name: 'The Solar System', key: 'solar-system' },
  { name: 'Weather and Seasons', key: 'weather-seasons' },
];

// ─── Social Sciences ─────────────────────────────────────────────────────────

const socialSciencesTopics: CAPSTopic[] = [
  { name: 'History: Local History', key: 'local-history' },
  { name: 'History: National History', key: 'national-history' },
  { name: 'History: African History', key: 'african-history' },
  { name: 'History: World History', key: 'world-history' },
  { name: 'History: Heritage', key: 'heritage' },
  { name: 'Geography: Mapwork and Practical Geography', key: 'mapwork' },
  { name: 'Geography: Physical Geography', key: 'physical-geography' },
  { name: 'Geography: Human Geography', key: 'human-geography' },
  { name: 'Geography: Environmental Geography', key: 'environmental-geography' },
  { name: 'Geography: Settlement', key: 'settlement' },
  { name: 'Geography: Population', key: 'population' },
  { name: 'Geography: Climate and Weather', key: 'climate-weather' },
  { name: 'Geography: Resources and Sustainability', key: 'resources-sustainability' },
];

// ─── Technology ──────────────────────────────────────────────────────────────

const technologyTopics: CAPSTopic[] = [
  { name: 'Structures', key: 'structures' },
  { name: 'Processing', key: 'processing-tech' },
  { name: 'Systems and Control', key: 'systems-control' },
  { name: 'Design Process', key: 'design-process' },
  { name: 'Communication', key: 'communication-tech' },
  { name: 'Impact of Technology', key: 'impact-technology' },
  { name: 'Indigenous Technology', key: 'indigenous-technology' },
  { name: 'Mechanical Systems and Control', key: 'mechanical-systems' },
  { name: 'Electrical Systems and Control', key: 'electrical-systems' },
];

// ─── Economic and Management Sciences ────────────────────────────────────────

const emsTopics: CAPSTopic[] = [
  { name: 'The Economy', key: 'the-economy' },
  { name: 'Financial Literacy', key: 'financial-literacy' },
  { name: 'Entrepreneurship', key: 'entrepreneurship' },
  { name: 'The Business Environment', key: 'business-environment' },
  { name: 'Accounting Concepts', key: 'accounting-concepts' },
  { name: 'The Role of Government in the Economy', key: 'government-economy' },
  { name: 'Markets', key: 'markets' },
  { name: 'Savings and Investments', key: 'savings-investments' },
];

// ─── Life Orientation (Senior Phase) ─────────────────────────────────────────

const lifeOrientationTopics: CAPSTopic[] = [
  { name: 'Development of the Self in Society', key: 'self-in-society' },
  { name: 'Health, Social and Environmental Responsibility', key: 'health-social-environment' },
  { name: 'Constitutional Rights and Responsibilities', key: 'constitutional-rights' },
  { name: 'Physical Education', key: 'lo-physical-education' },
  { name: 'World of Work', key: 'world-of-work' },
  { name: 'Study Skills', key: 'study-skills' },
  { name: 'Career and Career Choices', key: 'career-choices' },
  { name: 'Democracy and Human Rights', key: 'democracy-human-rights' },
  { name: 'Responsible Citizenship', key: 'responsible-citizenship' },
];

// ─── English (First Additional Language) ─────────────────────────────────────

const englishFALTopics: CAPSTopic[] = [
  { name: 'Listening and Speaking', key: 'fal-listening-speaking' },
  { name: 'Reading and Viewing', key: 'fal-reading-viewing' },
  { name: 'Writing and Presenting', key: 'fal-writing-presenting' },
  { name: 'Language Structures and Conventions', key: 'fal-language-structures' },
  { name: 'Comprehension', key: 'fal-comprehension' },
  { name: 'Creative and Transactional Writing', key: 'fal-creative-writing' },
  { name: 'Grammar in Context', key: 'fal-grammar' },
  { name: 'Literature', key: 'fal-literature' },
];

// ─── Creative Arts ───────────────────────────────────────────────────────────

const creativeArtsTopics: CAPSTopic[] = [
  { name: 'Visual Arts: Create in 2D', key: 'visual-arts-2d' },
  { name: 'Visual Arts: Create in 3D', key: 'visual-arts-3d' },
  { name: 'Performing Arts: Warm-up and Play', key: 'performing-warmup' },
  { name: 'Performing Arts: Improvise and Create', key: 'performing-create' },
  { name: 'Performing Arts: Read, Interpret and Perform', key: 'performing-perform' },
  { name: 'Performing Arts: Appreciate and Reflect', key: 'performing-reflect' },
  { name: 'Dance', key: 'dance' },
  { name: 'Drama', key: 'drama' },
  { name: 'Music', key: 'music' },
  { name: 'Design', key: 'design' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CAPS Curriculum Master List
// ═══════════════════════════════════════════════════════════════════════════════

export const capsCurriculum: CAPSSubject[] = [
  // ── Home Languages ──
  {
    name: 'Setswana Home Language',
    key: 'setswana-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'Siswati Home Language',
    key: 'siswati-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'IsiXhosa Home Language',
    key: 'isixhosa-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'English Home Language',
    key: 'english-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'Afrikaans Home Language',
    key: 'afrikaans-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'IsiZulu Home Language',
    key: 'isizulu-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'Sepedi Home Language',
    key: 'sepedi-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'Sesotho Home Language',
    key: 'sesotho-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'Xitsonga Home Language',
    key: 'xitsonga-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'Tshivenda Home Language',
    key: 'tshivenda-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },
  {
    name: 'IsiNdebele Home Language',
    key: 'isindebele-hl',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: homeLanguageTopics,
  },

  // ── First Additional Languages (CAPS requires FAL from Grade 1) ──
  {
    name: 'English First Additional Language',
    key: 'english-fal',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: englishFALTopics,
  },
  {
    name: 'Afrikaans First Additional Language',
    key: 'afrikaans-fal',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: englishFALTopics,
  },

  // ── Core Subjects ──
  {
    name: 'Mathematics',
    key: 'mathematics',
    phase: ['foundation', 'intermediate', 'senior'],
    topics: mathematicsTopics,
  },
  {
    name: 'Life Skills',
    key: 'life-skills',
    phase: ['foundation', 'intermediate'],
    topics: lifeSkillsTopics,
  },
  {
    name: 'Natural Sciences and Technology',
    key: 'natural-sciences-technology',
    phase: ['intermediate', 'senior'],
    topics: naturalSciencesTopics,
  },
  {
    name: 'Social Sciences',
    key: 'social-sciences',
    phase: ['intermediate', 'senior'],
    topics: socialSciencesTopics,
  },
  {
    name: 'Technology',
    key: 'technology',
    phase: ['senior'],
    topics: technologyTopics,
  },
  {
    name: 'Economic and Management Sciences',
    key: 'ems',
    phase: ['senior'],
    topics: emsTopics,
  },
  {
    name: 'Creative Arts',
    key: 'creative-arts',
    phase: ['senior'],
    topics: creativeArtsTopics,
  },
  {
    name: 'Life Orientation',
    key: 'life-orientation',
    phase: ['senior'],
    topics: lifeOrientationTopics,
  },
];

/** Flat lookup map: subjectKey -> CAPSSubject */
export const capsSubjectMap = new Map<string, CAPSSubject>(
  capsCurriculum.map(s => [s.key, s])
);

/** Get subjects filtered by phase */
export function getSubjectsByPhase(phase: 'foundation' | 'intermediate' | 'senior'): CAPSSubject[] {
  return capsCurriculum.filter(s => s.phase.includes(phase));
}

/** Get phase from grade number */
export function getPhaseFromGrade(grade: number): 'foundation' | 'intermediate' | 'senior' {
  if (grade <= 3) return 'foundation';
  if (grade <= 6) return 'intermediate';
  return 'senior';
}

/** Grade options for SA primary/senior phase */
export const saGrades = [
  { value: 'Grade R', label: 'Grade R', num: 0 },
  { value: 'Grade 1', label: 'Grade 1', num: 1 },
  { value: 'Grade 2', label: 'Grade 2', num: 2 },
  { value: 'Grade 3', label: 'Grade 3', num: 3 },
  { value: 'Grade 4', label: 'Grade 4', num: 4 },
  { value: 'Grade 5', label: 'Grade 5', num: 5 },
  { value: 'Grade 6', label: 'Grade 6', num: 6 },
  { value: 'Grade 7', label: 'Grade 7', num: 7 },
  { value: 'Grade 8', label: 'Grade 8', num: 8 },
  { value: 'Grade 9', label: 'Grade 9', num: 9 },
];
